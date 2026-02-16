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
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF allowed.")
        
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")
            
        logger.info(f"Processing resume: {file.filename} ({len(content)} bytes)")
        
        try:
            text = await resume_service.extract_text_from_pdf(content)
        except Exception as e:
            logger.error(f"Text extraction failed: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF content: {str(e)}")
        
        if not text.strip():
            logger.warning(f"No text extracted from PDF: {file.filename}")
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. It might be a scanned image or empty.")
            
        logger.info(f"Analysis started for {file.filename}")
        analysis = await resume_service.analyze_resume_with_ai(text, job_description)
        logger.info(f"Analysis completed for {file.filename}")
        
        return {
            "filename": file.filename,
            "analysis": analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during resume analysis: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/analyze-text")
async def analyze_resume_text(
    text: str = Form(...),
    filename: str = Form("resume.txt"),
    job_description: str = Form(""),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Analyze resume text directly (e.g., after client-side OCR).
    """
    import logging
    logger = logging.getLogger(__name__)

    try:
        if not text.strip():
            raise HTTPException(status_code=400, detail="Resume text is empty.")

        logger.info(f"Analysis started for text from {filename}")
        analysis = await resume_service.analyze_resume_with_ai(text, job_description)
        logger.info(f"Analysis completed for text from {filename}")

        return {
            "filename": filename,
            "analysis": analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during resume text analysis: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
