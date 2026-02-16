from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

from app.db.session import engine
from app.db.base_class import Base
from app.models.user import User # Import to ensure registered

# Create tables on startup
Base.metadata.create_all(bind=engine)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handler for Detailed Logs
from fastapi import Request
from fastapi.responses import JSONResponse
import logging
import traceback
import sys

# Configure logging
logging.basicConfig(
    stream=sys.stdout, 
    level=logging.ERROR,
    format='%(asctime)s %(levelname)s %(message)s'
)

@app.exception_handler(Exception)
async def validation_exception_handler(request: Request, exc: Exception):
    error_msg = f"Unhandled Error: {exc}\n{traceback.format_exc()}"
    logging.error(error_msg)
    print(error_msg, file=sys.stderr) # Ensure it prints to console too
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error. Check logs."},
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Career Platform API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
