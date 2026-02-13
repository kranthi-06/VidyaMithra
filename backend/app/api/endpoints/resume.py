from typing import Any
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from app.api import deps
from app.services import resume_service

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(""),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a resume (PDF) and get AI analysis.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF allowed.")
    
    content = await file.read()
    text = await resume_service.extract_text_from_pdf(content)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")
        
    analysis = await resume_service.analyze_resume_with_ai(text, job_description)
    
    return {
        "filename": file.filename,
        "analysis": analysis
    }
