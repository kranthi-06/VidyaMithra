from sqlalchemy import Boolean, Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    login_type = Column(String, default='custom')
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    hashed_password = Column(String, nullable=True) # Allow null for OAuth users if any
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    full_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    links = Column(JSONB, default={})
    activity_log = Column(JSONB, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")
