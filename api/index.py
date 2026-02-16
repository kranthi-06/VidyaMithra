import sys
import os

# Add the backend directory to the search path
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.append(backend_path)

# Import the FastAPI app instance from your backend/app/main.py
try:
    from app.main import app
except ImportError:
    # If the above fails, try adding backend/app to path as well
    sys.path.append(os.path.join(backend_path, "app"))
    from main import app

# This 'app' variable is what Vercel's Python builder looks for.
