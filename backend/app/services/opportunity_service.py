"""
Opportunity Intelligence Service — aggregates courses, internships, and jobs
from allowed public sources. NO scraping of protected platforms.
Matches opportunities to user roadmaps and skill levels via AI.
"""
import json
import logging
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.services.ai_service import ai_hub
from app.models.career import Opportunity

logger = logging.getLogger(__name__)


async def generate_opportunities(
    target_role: str,
    skills: List[str],
    level: str,
    db: Session
) -> List[dict]:
    """
    Use AI to generate/curate opportunity suggestions.
    These are real platform links (not scraped content).
    """
    system_prompt = (
        "You are a career advisor who knows major online learning and job platforms. "
        "You suggest REAL opportunities from platforms like Coursera, edX, Udemy, "
        "LinkedIn Learning, GitHub Jobs, AngelList, Internshala, and official company career pages. "
        "Do NOT invent fake companies or listings. "
        "Provide search/category links to real platforms where users can find relevant opportunities."
    )

    prompt = f"""
    Suggest 10 opportunities (mix of courses, internships, and jobs) for someone targeting \
the role "{target_role}" with skills: {json.dumps(skills)} at {level} level.

    For each opportunity, provide:
    - "title": opportunity title
    - "company": platform or company name (must be real)
    - "opportunity_type": "course" | "internship" | "job"
    - "description": one-sentence description
    - "url": direct link to the platform's search/category page (NOT a specific listing URL \
that may expire)
    - "source": platform name
    - "skill_tags": list of relevant skills
    - "level": "Beginner" | "Intermediate" | "Advanced"
    - "location": "Remote" or specific city/country
    - "salary_range": estimated range or "Free" for courses

    Rules:
    - Use only legitimate, publicly accessible platforms
    - URLs should be search result pages or category pages, NOT specific listing URLs
    - Include a mix of: 3-4 courses, 3-4 internships, 3-4 jobs
    - Match the skill level appropriately

    Return ONLY valid JSON array:
    [
        {{
            "title": "...",
            "company": "Coursera",
            "opportunity_type": "course",
            "description": "...",
            "url": "https://www.coursera.org/search?query=...",
            "source": "coursera",
            "skill_tags": ["Python", "ML"],
            "level": "Beginner",
            "location": "Remote",
            "salary_range": "Free"
        }}
    ]

    IMPORTANT: Return ONLY valid JSON. No markdown.
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

        opportunities = json.loads(clean)

        if not isinstance(opportunities, list):
            return []

        # Save to database (deduplicate by title + source)
        saved = []
        for opp in opportunities:
            if not all(k in opp for k in ["title", "url", "opportunity_type"]):
                continue

            # Check for duplicate
            existing = db.query(Opportunity).filter(
                Opportunity.title == opp["title"],
                Opportunity.source == opp.get("source", "")
            ).first()

            if existing:
                saved.append({
                    "id": str(existing.id),
                    **{k: getattr(existing, k) for k in [
                        "title", "company", "opportunity_type",
                        "description", "url", "source", "skill_tags",
                        "level", "location", "salary_range"
                    ]}
                })
                continue

            new_opp = Opportunity(
                title=opp["title"],
                company=opp.get("company"),
                opportunity_type=opp["opportunity_type"],
                description=opp.get("description"),
                url=opp["url"],
                source=opp.get("source"),
                skill_tags=opp.get("skill_tags", []),
                level=opp.get("level"),
                location=opp.get("location"),
                salary_range=opp.get("salary_range")
            )
            db.add(new_opp)
            try:
                db.commit()
                db.refresh(new_opp)
                saved.append({
                    "id": str(new_opp.id),
                    "title": new_opp.title,
                    "company": new_opp.company,
                    "opportunity_type": new_opp.opportunity_type,
                    "description": new_opp.description,
                    "url": new_opp.url,
                    "source": new_opp.source,
                    "skill_tags": new_opp.skill_tags,
                    "level": new_opp.level,
                    "location": new_opp.location,
                    "salary_range": new_opp.salary_range
                })
            except Exception as e:
                db.rollback()
                logger.error(f"Failed to save opportunity: {e}")

        return saved

    except json.JSONDecodeError:
        logger.error("Failed to parse opportunities JSON")
        return []
    except Exception as e:
        logger.error(f"Opportunity generation error: {e}")
        return []


def get_matched_opportunities(
    user_skills: List[str],
    level: Optional[str],
    opportunity_type: Optional[str],
    db: Session,
    limit: int = 20
) -> List[dict]:
    """
    Get opportunities matched to user skills from the database.
    Filters out expired ones.
    """
    query = db.query(Opportunity).filter(Opportunity.is_expired == False)

    if opportunity_type:
        query = query.filter(Opportunity.opportunity_type == opportunity_type)
    if level:
        query = query.filter(Opportunity.level == level)

    all_opps = query.order_by(Opportunity.created_at.desc()).limit(limit * 3).all()

    # Score by skill match
    scored = []
    user_skills_lower = {s.lower() for s in user_skills}
    for opp in all_opps:
        tags = [t.lower() for t in (opp.skill_tags or [])]
        match_count = len(user_skills_lower.intersection(tags))
        scored.append((match_count, opp))

    scored.sort(key=lambda x: x[0], reverse=True)

    return [
        {
            "id": str(opp.id),
            "title": opp.title,
            "company": opp.company,
            "opportunity_type": opp.opportunity_type,
            "description": opp.description,
            "url": opp.url,
            "source": opp.source,
            "skill_tags": opp.skill_tags,
            "level": opp.level,
            "location": opp.location,
            "salary_range": opp.salary_range,
            "match_score": score
        }
        for score, opp in scored[:limit]
    ]


def cleanup_expired_opportunities(db: Session) -> int:
    """Mark opportunities with past deadlines as expired."""
    now = datetime.now(timezone.utc)
    count = db.query(Opportunity).filter(
        Opportunity.deadline != None,
        Opportunity.deadline < now,
        Opportunity.is_expired == False
    ).update({"is_expired": True})
    db.commit()
    return count
