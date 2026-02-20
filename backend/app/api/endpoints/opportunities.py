"""
API Endpoints for Opportunity Intelligence System.
Integrates behind the existing Jobs page.
"""
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.api import deps
from app.services import opportunity_service

router = APIRouter()


class OpportunitySearchRequest(BaseModel):
    target_role: str
    skills: List[str] = []
    level: str = "Beginner"


class OpportunityFilterRequest(BaseModel):
    skills: List[str] = []
    level: Optional[str] = None
    opportunity_type: Optional[str] = None  # "job", "internship", "course"
    limit: int = 20


@router.post("/discover")
async def discover_opportunities(
    request: OpportunitySearchRequest,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
) -> Any:
    """
    Discover new opportunities using AI.
    Generates and saves opportunities matched to user's roadmap/skills.
    """
    try:
        opportunities = await opportunity_service.generate_opportunities(
            target_role=request.target_role,
            skills=request.skills,
            level=request.level,
            db=db
        )
        return {"opportunities": opportunities, "count": len(opportunities)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/matched")
async def get_matched_opportunities(
    request: OpportunityFilterRequest,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
) -> Any:
    """
    Get opportunities from the database matched to user skills.
    Sorted by match score.
    """
    opportunities = opportunity_service.get_matched_opportunities(
        user_skills=request.skills,
        level=request.level,
        opportunity_type=request.opportunity_type,
        db=db,
        limit=request.limit
    )
    return {"opportunities": opportunities, "count": len(opportunities)}


@router.post("/cleanup")
async def cleanup_expired(
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user),
) -> Any:
    """Mark expired opportunities. Can be called by admin or scheduler."""
    count = opportunity_service.cleanup_expired_opportunities(db)
    return {"expired_count": count}
