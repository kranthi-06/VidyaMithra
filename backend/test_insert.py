from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def test_insert():
    db = SessionLocal()
    try:
        user = User(
            full_name="Direct Insert Test",
            email="direct_test@example.com",
            hashed_password=get_password_hash("testpassword")
        )
        db.add(user)
        print("Attempting to commit...")
        db.commit()
        print("Commit successful!")
        db.refresh(user)
        print(f"User created with ID: {user.id} and Email: {user.email}")
    except Exception as e:
        print(f"Error during insert: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_insert()
