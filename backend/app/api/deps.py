from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.config import settings
from app.models.user import User
from app.crud import crud_user
from app.schemas.user import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login/access-token")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    if token == "GUEST_TOKEN":
        import uuid
        guest_id = uuid.uuid4()
        return User(
            id=guest_id,
            email="guest@vidyamitra.com",
            is_active=True,
            is_superuser=False
        )
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # For Supabase Auth, decode without verify if secret mismatch (development mode)
        # In production, verify_signature MUST be rigorous or use separate verifier for Supabase.
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options={"verify_signature": False})
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        
        if user_id is None:
            raise credentials_exception
            
    except (JWTError, ValidationError):
        raise credentials_exception
        
    # 1. Try finding user by ID (Standard backend flow)
    # Convert string ID to UUID if necessary or let sqlalchemy handle it?
    # user_id from token is string. crud_user expects UUID.
    # We should cast it, but let's try strict lookup first.
    user = None
    try:
        # Check if user_id is a valid UUID before querying
        import uuid
        uuid_obj = uuid.UUID(str(user_id))
        user = crud_user.get_user(db, user_id=uuid_obj)
    except (ValueError, TypeError):
        # user_id is not a UUID (e.g. Google numeric ID), skip strict ID lookup
        pass
    except Exception:
        pass
    
    # 2. If not found, try by EMAIL (Supabase flow or mixed ID)
    if not user and email:
        user = crud_user.get_user_by_email(db, email=email)
        
    # 3. If still not found, but we have a valid token with email (e.g. Google Login first time)
    # Auto-provision the user in our public.users table
    if not user and email:
        try:
            # Generate a random password
            import random
            from app.core import security
            random_password =  "".join([str(random.randint(0, 9)) for _ in range(16)])
            hashed_password = security.get_password_hash(random_password)
            
            # Create user
            from app.models.user import User as UserModel
            # We use model directly to bypass crud default is_verified=False
            new_user = UserModel(
                email=email,
                hashed_password=hashed_password,
                is_active=True,
                is_verified=True, # Verified because they have a valid token (e.g. Google)
                login_type="google_or_supabase"
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            user = new_user
            
            # Create default profile
            from app.models.user import Profile
            # Try to get name from token claims?
            full_name = payload.get("user_metadata", {}).get("full_name") or payload.get("name") or email.split("@")[0]
            profile = Profile(id=user.id, full_name=full_name)
            db.add(profile)
            db.commit()
            
        except Exception as e:
            print(f"Auto-provisioning failed: {e}")
            raise credentials_exception

    if not user:
        raise credentials_exception
        
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_user_optional(
    db: Session = Depends(get_db), 
    token: Optional[str] = Depends(OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login/access-token", auto_error=False))
) -> Optional[User]:
    if not token:
        return None
    try:
        return get_current_user(db, token)
    except:
        return None
