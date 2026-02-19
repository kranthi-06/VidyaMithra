from datetime import timedelta, datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import random
from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from app.services.email_service import send_email_otp

router = APIRouter()

@router.post("/signup")
def signup(
    user_in: schemas.user.UserCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Create new user.
    """
    # Check if user already exists and is verified
    user = crud.get_user_by_email(db, email=user_in.email)
    if user:
        if user.is_verified:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )
        # If user exists but not verified, we could either delete the old one or just overwrite via OTP flow.
        # Since we are moving to deferred creation, if the user exists in 'users' table, it means 
        # it's a legacy unverified user or from before this change. 
        # For data consistency, let's treat them as if they need to register again (create OTP).
    
    # Generate OTP
    now = datetime.now(timezone.utc)
    otp_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    expires_at = now + timedelta(minutes=5)
    
    # Prepare user data for deferred creation
    # We store the hashed password to avoid storing plaintext
    hashed_password = security.get_password_hash(user_in.password)
    
    user_data = {
        "email": user_in.email,
        "hashed_password": hashed_password,
        "full_name": user_in.full_name,
        "is_active": True,
        "is_verified": True # Will be set to True when created
    }
    
    # Store OTP with user data
    crud.create_otp(db, email=user_in.email, otp_code=otp_code, expires_at=expires_at, user_data=user_data)
    
    # Send Email
    email_sent = send_email_otp(user_in.email, otp_code)
    
    if not email_sent:
         raise HTTPException(
            status_code=500,
            detail="Failed to send verification email.",
        )

    return {"message": "Verification code sent to email."}

@router.post("/send-otp")
def send_otp(
    otp_in: schemas.otp.OTPRequest,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Send OTP to email.
    """
    user = crud.get_user_by_email(db, email=otp_in.email)
    
    # If user not found, check if there is a pending registration (OTP with user_data)
    pending_user_data = None
    if not user:
        latest_otp = crud.get_latest_otp(db, email=otp_in.email)
        if latest_otp and latest_otp.user_data:
            pending_user_data = latest_otp.user_data
        else:
             raise HTTPException(
                status_code=404,
                detail="User not found with this email.",
            )
            
    if user and user.is_verified:
         return {"message": "User is already verified."}
            
    if user and user.is_verified:
         return {"message": "User is already verified."}

    # Check cooldown
    latest_otp = crud.get_latest_otp(db, email=otp_in.email)
    
    # Ensure current time is timezone aware for comparison
    now = datetime.now(timezone.utc)
    
    if latest_otp:
        # DB datetime should be aware, but let's be safe
        otp_created_at = latest_otp.created_at
        if otp_created_at.tzinfo is None:
            otp_created_at = otp_created_at.replace(tzinfo=timezone.utc)
            
        if (now - otp_created_at).total_seconds() < 60:
            raise HTTPException(
                status_code=429,
                detail="Please wait 60 seconds before requesting a new OTP.",
            )

    # Generate OTP
    otp_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    expires_at = now + timedelta(minutes=5)
    
    print(f"DEBUG: OTP for {otp_in.email} is {otp_code}")

    # Store OTP
    # If we have pending_user_data, pass it along so the new OTP can also create the user
    crud.create_otp(db, email=otp_in.email, otp_code=otp_code, expires_at=expires_at, user_data=pending_user_data)
    
    # Send Email
    email_sent = send_email_otp(otp_in.email, otp_code)
    
    if email_sent:
        return {"message": "OTP sent successfully."}
    else:
        # In production, we should rollback OTP creation or raise error.
        # But if the user hasn't configured SMTP, we might want to let them know the OTP via logs?
        # We already printed it above.
        print(f"WARNING: Failed to send email to {otp_in.email}. Check SMTP settings.")
        # We will still return 500 to indicate failure, but the OTP is in logs.
        raise HTTPException(
            status_code=500,
            detail="Failed to send email. Check server logs for OTP if in development.",
        )

@router.post("/verify-otp")
def verify_otp(
    otp_in: schemas.otp.OTPVerify,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Verify OTP and activate user account.
    """
    user = crud.get_user_by_email(db, email=otp_in.email)
    # logic changed: user might be None if deferred registration
    # if not user:
    #    raise HTTPException(status_code=404, detail="User not found")
        
    latest_otp = crud.get_latest_otp(db, email=otp_in.email)
    if not latest_otp:
        raise HTTPException(status_code=400, detail="No OTP request found")
        
    # Check expiry
    # DB stores datetime with timezone (UTC). We must compare with aware datetime.
    now = datetime.now(timezone.utc)
    
    # Ensure database datetime is treated as aware if it comes back naive (unlikely with this error but safe)
    otp_expires_at = latest_otp.expires_at
    if otp_expires_at.tzinfo is None:
        otp_expires_at = otp_expires_at.replace(tzinfo=timezone.utc)
        
    if now > otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")
        
    # Check attempts
    if latest_otp.attempts >= 5:
         raise HTTPException(status_code=400, detail="Too many attempts. Request a new OTP.")
         
    # Check if used
    if latest_otp.is_used:
         raise HTTPException(status_code=400, detail="OTP already used")

    # Verify Hash
    if not security.verify_password(otp_in.otp, latest_otp.hashed_otp):
        crud.increment_attempts(db, latest_otp)
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    # Check if we need to create the user (Deferred Registration)
    if user:
        # User already exists (old flow or password reset or unverified user)
        user.is_verified = True
        user.is_active = True
        db.add(user)
    elif latest_otp.user_data:
        # Create new user from stored data
        user_data = latest_otp.user_data
        # Ensure we don't pass fields that might not be in User model or handle mismatched
        # Assuming user_data was constructed to match User model columns
        user = models.User(**user_data)
        db.add(user)
        # We need to commit here to get the user ID for token generation
        db.commit()
        db.refresh(user)
        
        # Determine if we need to create a profile? 
        # The User model has 'profile' relationship. 
        # Typically profile is created on demand or signal. 
        
    else:
        # User not found and no user_data? Should not happen in new flow
        raise HTTPException(status_code=400, detail="Registration data not found. Please sign up again.")
    
    # Mark OTP as used
    crud.mark_otp_as_used(db, latest_otp)
    
    db.commit()
    
    # Generate access token so user is automatically logged in
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    return {
        "message": "Email verified successfully",
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login/access-token", response_model=schemas.user.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified. Please verify your email first.")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
