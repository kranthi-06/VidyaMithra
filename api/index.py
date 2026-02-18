import sys
import os

# Add the backend directory to the search path
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.append(backend_path)

# Import the FastAPI app instance from your backend/app/main.py
# Robust import with broad exception handling
try:
    from app.main import app
except Exception as e:
    # Fallback to help debug path issues or startup crashes
    sys.path.append(os.path.join(backend_path, "app"))
    try:
        from main import app
    except Exception as e2:
        from fastapi import FastAPI, Response, Request
        app = FastAPI()
        
        @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
        async def fallback(request: Request, path: str):
            import traceback
            import subprocess
            
            # Gather debug info
            cwd = os.getcwd()
            files_cwd = os.listdir(cwd) if os.path.exists(cwd) else "N/A"
            
            parent = os.path.dirname(cwd)
            files_parent = os.listdir(parent) if os.path.exists(parent) else "N/A"
            
            error_details = f"""
            CRITICAL STARTUP ERROR
            ======================
            Primary Import Error: {e}
            Secondary Import Error: {e2}
            
            Traceback:
            {traceback.format_exc()}
            
            Environment:
            CWD: {cwd}
            Files in CWD: {files_cwd}
            Files in Parent: {files_parent}
            Sys Path: {sys.path}
            
            Request Details:
            Method: {request.method}
            Path: {path}
            """
            
            return Response(content=error_details, status_code=500, media_type="text/plain")

# This 'app' variable is what Vercel's Python builder looks for.
