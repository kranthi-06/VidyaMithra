import os
import sys
import psycopg2

sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))
from app.core.config import settings

def apply_migration():
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
        
        migration_file = os.path.join("migrations", "002_admin_system.sql")
        print(f"Reading SQL script from {migration_file}...")
        with open(migration_file, "r", encoding="utf-8") as f:
            sql = f.read()
            
        print("Executing migration 002_admin_system.sql ...")
        cur.execute(sql)
        
        print("Success! Admin system migration applied successfully.")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error applying migration: {e}")

if __name__ == "__main__":
    apply_migration()
