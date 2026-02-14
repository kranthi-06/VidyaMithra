
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import traceback

# Setup logging to file
logging.basicConfig(filename='backend_errors.log', level=logging.ERROR)

class ErrorLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as e:
            logging.error(f"Unhandled exception: {e}")
            logging.error(traceback.format_exc())
            raise e
