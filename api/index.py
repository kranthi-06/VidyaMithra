import sys
import os

# Add the backend directory to the search path
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.append(backend_path)

# Import the FastAPI app instance from your backend/app/main.py
try:
    from app.main import app
except ImportError:
    # Fallback to help debug path issues
    sys.path.append(os.path.join(backend_path, "app"))
    try:
        from main import app
    except ImportError as e:
        from fastapi import FastAPI, Response, Request
        app = FastAPI()
        @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
        async def fallback(request: Request, path: str):
            import traceback
            return Response(content=f"Import Error: {e}\nTraceback: {traceback.format_exc()}\nHeaders: {request.headers}\nMethod: {request.method}\nPath: {path}\nSys Path: {sys.path}", status_code=500)

# This 'app' variable is what Vercel's Python builder looks for.
