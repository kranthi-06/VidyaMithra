"""
AI Learning Content Service — suggests YouTube videos and study resources
per roadmap skill. Caches results to avoid repeated AI calls.
"""
import json
import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from app.services.ai_service import ai_hub
from app.models.career import LearningCache

logger = logging.getLogger(__name__)


async def get_learning_resources(
    skill_name: str,
    level: str,
    db: Session
) -> List[dict]:
    """
    Get learning resources for a skill. Checks cache first,
    generates via AI if not cached.
    """
    # 1. Check cache
    cached = db.query(LearningCache).filter(
        LearningCache.skill_name == skill_name,
        LearningCache.level == level
    ).first()

    if cached and cached.resources:
        logger.info(f"Cache hit for {skill_name}/{level}")
        return cached.resources

    # 2. Generate via AI
    logger.info(f"Cache miss for {skill_name}/{level}, generating via AI...")
    resources = await _generate_resources_ai(skill_name, level)

    # 3. Cache the result
    if resources:
        try:
            cache_entry = LearningCache(
                skill_name=skill_name,
                level=level,
                resources=resources
            )
            db.merge(cache_entry)  # Use merge for upsert behavior
            db.commit()
        except Exception as e:
            logger.error(f"Failed to cache resources: {e}")
            db.rollback()

    return resources


async def _generate_resources_ai(skill_name: str, level: str) -> List[dict]:
    """Use AI to generate curated learning resource suggestions."""
    system_prompt = (
        "You are an expert tech educator. "
        "You recommend the best free YouTube videos and online resources for learning. "
        "Only recommend real, well-known channels and educational content. "
        "Do NOT invent fake URLs or channels."
    )

    prompt = f"""
    Suggest 6 YouTube learning videos for the skill "{skill_name}" at {level} level.

    For each video, provide:
    - "title": Descriptive title of the video/playlist
    - "channel": YouTube channel name (must be a real, well-known channel)
    - "url": A YouTube search URL in format "https://www.youtube.com/results?search_query=<encoded_query>"
    - "type": "video" or "playlist"
    - "duration": estimated duration (e.g., "15 min", "2 hours", "Full Course")
    - "order": study order (1 = watch first)
    - "why": one sentence on why this is recommended

    Ordering guidelines:
    - Start with overview/introduction content
    - Then practical tutorials
    - End with advanced/project-based content

    Return ONLY a valid JSON array:
    [
        {{
            "title": "...",
            "channel": "...",
            "url": "https://www.youtube.com/results?search_query=...",
            "type": "video",
            "duration": "15 min",
            "order": 1,
            "why": "..."
        }}
    ]

    IMPORTANT: Return ONLY valid JSON. No markdown, no comments.
    """

    try:
        response = await ai_hub.chat_completion(
            [{"role": "user", "content": prompt}],
            system_prompt
        )

        clean = response.strip()
        if "```json" in clean:
            clean = clean.split("```json")[1].split("```")[0].strip()
        elif "```" in clean:
            clean = clean.split("```")[1].split("```")[0].strip()

        resources = json.loads(clean)

        if isinstance(resources, list):
            # Validate each resource
            valid = []
            for r in resources:
                if all(k in r for k in ["title", "url", "order"]):
                    valid.append(r)
            return sorted(valid, key=lambda x: x.get("order", 99))

        return []

    except json.JSONDecodeError:
        logger.error(f"Failed to parse learning resources JSON for {skill_name}")
        return []
    except Exception as e:
        logger.error(f"Learning resource generation error: {e}")
        return []


def clear_skill_cache(skill_name: str, db: Session):
    """Clear cached resources for a skill (for manual refresh)."""
    db.query(LearningCache).filter(
        LearningCache.skill_name == skill_name
    ).delete()
    db.commit()
