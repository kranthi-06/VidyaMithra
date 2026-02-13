from typing import Any
from fastapi import APIRouter, Depends
from app.api import deps
from app.services import learning_service

router = APIRouter()

@router.get("/resources")
async def get_learning_resources(
    query: str,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get learning resources (videos) for a specific topic.
    """
    videos = await learning_service.search_youtube_videos(query)
    return videos
