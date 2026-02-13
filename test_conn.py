import psycopg2
import sys

try:
    conn = psycopg2.connect("postgresql://postgres:Kranthi%402006@db.prrbjfnmuzxbtesrtvmc.supabase.co:5432/postgres")
    print("Connection successful!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)
