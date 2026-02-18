from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from uuid import UUID

def get_user(db: Session, user_id: UUID):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate):
    # Note: user_in does not have a password anymore.
    # Logic should rely on Supabase managing auth.users and trigger creating public.users
    # However, if we must create manually (e.g. admin seeding), we do so without password.
    db_user = User(
        email=user_in.email,
        login_type=user_in.login_type,
        is_active=user_in.is_active,
        is_superuser=user_in.is_superuser,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
