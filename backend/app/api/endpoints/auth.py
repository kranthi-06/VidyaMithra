from datetime import timedelta, datetime
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

@router.post("/signup", response_model=schemas.user.User)
def signup(
    user_in: schemas.user.UserCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Create new user.
    """
    user = crud.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.create_user(db, user_in=user_in)
    return user

@router.post("/send-otp")
def send_otp(
    otp_in: schemas.otp.OTPRequest,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Send OTP to email.
    """
    user = crud.get_user_by_email(db, email=otp_in.email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found with this email.",
        )
    if user.is_verified:
         return {"message": "User is already verified."}

    # Check cooldown
    latest_otp = crud.get_latest_otp(db, email=otp_in.email)
    if latest_otp and (datetime.utcnow() - latest_otp.created_at).total_seconds() < 60:
        raise HTTPException(
            status_code=429,
            detail="Please wait 60 seconds before requesting a new OTP.",
        )

    # Generate OTP
    otp_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    print(f"DEBUG: OTP for {otp_in.email} is {otp_code}")

    # Store OTP
    crud.create_otp(db, email=otp_in.email, otp_code=otp_code, expires_at=expires_at)
    
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
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    latest_otp = crud.get_latest_otp(db, email=otp_in.email)
    if not latest_otp:
        raise HTTPException(status_code=400, detail="No OTP request found")
        
    # Check expiry
    if datetime.utcnow() > latest_otp.expires_at:
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
        
    # Mark user as verified
    user.is_verified = True
    db.add(user)
    
    # Mark OTP as used
    crud.mark_otp_as_used(db, latest_otp)
    
    db.commit()
    
    return {"message": "Email verified successfully"}

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
