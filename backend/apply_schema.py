import os
import sys
import psycopg2
from urllib.parse import urlparse

# Add parent dir to path to import config
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

try:
    from app.core.config import settings
    # Override with direct connection string if needed or ensure loading from env
    # For now, we trust settings.DATABASE_URL or .env
    pass
except ImportError:
    # Fallback if app module not found
    print("Could not import settings, falling back to manual env override")

def apply_schema():
    db_url = settings.DATABASE_URL
    if not db_url or "sqlite" in db_url:
        print("Error: DATABASE_URL is not set to Postgres. Please configure Supabase URL.")
        print(f"Current URL: {db_url}")
        return

    print(f"Connecting to database...")
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        print("Reading SQL script...")
        with open("init_supabase.sql", "r") as f:
            sql = f.read()
            
        print("Executing schema reset and trigger creation...")
        cur.execute(sql)
        
        print("Success! Database schema has been reset and triggers configured.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error applying schema: {e}")

if __name__ == "__main__":
    apply_schema()
