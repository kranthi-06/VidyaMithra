from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.services import interview_service
from pydantic import BaseModel

router = APIRouter()

class QuestionRequest(BaseModel):
    position: str
    round_type: str
    history: List[Dict[str, str]]

class FinishRequest(BaseModel):
    position: str
    responses: Dict[str, List[Dict[str, str]]]

@router.post("/next-question")
async def get_next_question(
    request: QuestionRequest,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate the next interview question.
    """
    question = await interview_service.generate_interview_question(
        request.position, request.round_type, request.history
    )
    return {"question": question}

@router.post("/analyze")
async def analyze_interview(
    request: FinishRequest,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Analyze the full interview performance.
    """
    analysis = await interview_service.analyze_interview_performance(
        request.position, request.responses
    )
    return {"analysis": analysis}
