import sys
import os
sys.path.append(os.getcwd())

from sqlalchemy import text
from app.db.session import engine

def add_user_data_column():
    print("Attempting to add user_data column to otps table...")
    with engine.connect() as connection:
        try:
            connection.execute(text("ALTER TABLE otps ADD COLUMN user_data JSONB"))
            connection.commit()
            print("Successfully added user_data column.")
        except Exception as e:
            print(f"Error (column might already exist): {e}")

if __name__ == "__main__":
    add_user_data_column()
