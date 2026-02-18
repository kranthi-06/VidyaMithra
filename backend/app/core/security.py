from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Truncate to 50 chars to match hashing limit and avoid bcrypt errors
    return pwd_context.verify(plain_password[:50], hashed_password)

def get_password_hash(password: str) -> str:
    # bcrypt has a strict 72 byte limit. 
    # Since utf-8 chars can be up to 4 bytes, 72 chars can exceed 72 bytes.
    # Conservatively truncate to 50 chars to be safe.
    return pwd_context.hash(password[:50])
