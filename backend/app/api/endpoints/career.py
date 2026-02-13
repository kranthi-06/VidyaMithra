from typing import Any, List
from fastapi import APIRouter, Depends, Body
from app.api import deps
from app.services import career_service
from pydantic import BaseModel

class CareerRequest(BaseModel):
    skills: List[str]
    current_role: str

router = APIRouter()

@router.post("/path")
async def get_career_path(
    request: CareerRequest,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate a personalized career path based on skills and role.
    """
    path = await career_service.generate_career_path(request.skills, request.current_role)
    return path
