import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.sql import text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("No DATABASE_URL found.")
    exit(1)

# Ensure postgresql:// driver is supported by SQLAlchemy (might need psycopg2 or asyncpg, but create_engine usually uses psycopg2 by default)
# if not "://" in DATABASE_URL:
#     print("Invalid DATABASE_URL")

engine = create_engine(DATABASE_URL)

with open("migrations/003_resume_storage.sql", "r") as f:
    sql_script = f.read()

try:
    with engine.connect() as conn:
        conn.execute(text(sql_script))
        conn.commit()
    print("Migration applied successfully.")
except Exception as e:
    print(f"Error applying migration: {e}")
