"""
AI Mock Interview Service (Advanced) — resume-aware, role-aware interviews
with structured AI feedback. Unlocked only after level completion.
"""
import json
import logging
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.services.ai_service import ai_hub
from app.models.career import InterviewSession, Roadmap
from app.services.roadmap_service import check_level_completion

logger = logging.getLogger(__name__)


def check_interview_unlock(
    user_id: str,
    roadmap_id: str,
    level_name: str,
    db: Session
) -> dict:
    """
    Check if a mock interview is unlocked for a specific roadmap level.
    Requires all skills in the level to be completed (quiz passed).
    """
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == user_id
    ).first()

    if not roadmap:
        return {"unlocked": False, "reason": "Roadmap not found"}

    level_complete = check_level_completion(roadmap.roadmap_data, level_name)

    if level_complete:
        return {"unlocked": True, "level": level_name}
    else:
        # Find incomplete skills
        incomplete = []
        for level in roadmap.roadmap_data.get("levels", []):
            if level["name"] == level_name:
                for skill in level.get("skills", []):
                    if skill["status"] != "completed":
                        incomplete.append(skill["name"])

        return {
            "unlocked": False,
            "reason": f"Complete all skills in {level_name} level first",
            "incomplete_skills": incomplete
        }


async def generate_interview_question_advanced(
    position: str,
    round_type: str,
    history: List[Dict[str, Any]],
    resume_summary: Optional[str] = None,
    target_skills: Optional[List[str]] = None
) -> str:
    """
    Generate a resume-aware, role-aware interview question.
    """
    context = ""
    if resume_summary:
        context += f"\nCandidate's resume summary: {resume_summary}"
    if target_skills:
        context += f"\nSkills to assess: {', '.join(target_skills)}"

    system_prompt = f"""
    You are a senior interviewer conducting a {round_type} interview for a {position} role.
    {context}

    Generate a challenging, relevant interview question.
    The question should:
    - Be specific to the {position} role
    - Match the {round_type} round expectations
    - If resume info is provided, relate to the candidate's stated experience
    - If skills to assess are specified, focus on those areas
    - Follow naturally from the conversation history

    IMPORTANT: Return ONLY the question text. No introductory phrases, numbering, or formatting.
    """

    messages = []
    for entry in history:
        messages.append({"role": "assistant", "content": entry["question"]})
        messages.append({"role": "user", "content": entry["answer"]})

    return await ai_hub.chat_completion(messages, system_prompt)


async def analyze_interview_advanced(
    position: str,
    responses: List[Dict[str, Any]],
    resume_summary: Optional[str] = None
) -> dict:
    """
    Analyze interview performance with structured feedback:
    technical accuracy, communication clarity, confidence indicators.
    """
    context = ""
    if resume_summary:
        context = f"The candidate's resume summary: {resume_summary}\n"

    system_prompt = "You are a senior hiring committee providing structured interview feedback."
    prompt = f"""
    Analyze the following interview performance for a {position} role.
    {context}

    Interview Q&A:
    {json.dumps(responses, indent=2)}

    Provide a detailed evaluation in STRICT JSON format:
    {{
        "technical_score": <number 0-100>,
        "communication_score": <number 0-100>,
        "confidence_score": <number 0-100>,
        "overall_score": <number 0-100>,
        "verdict": "Strong Fit" | "Good Fit" | "Needs Improvement" | "Not a Fit",
        "strengths": ["...", "..."],
        "weaknesses": ["...", "..."],
        "detailed_feedback": [
            {{
                "question_summary": "...",
                "assessment": "...",
                "score": <number 0-100>
            }}
        ],
        "improvement_tips": ["...", "..."],
        "summary": "Overall summary paragraph"
    }}

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

        return json.loads(clean)

    except json.JSONDecodeError:
        logger.error("Failed to parse interview analysis JSON")
        return {
            "technical_score": 0,
            "communication_score": 0,
            "confidence_score": 0,
            "overall_score": 0,
            "verdict": "Error",
            "strengths": [],
            "weaknesses": ["Analysis failed"],
            "detailed_feedback": [],
            "improvement_tips": [],
            "summary": "Failed to analyze interview performance."
        }
    except Exception as e:
        logger.error(f"Interview analysis error: {e}")
        raise


def save_interview_session(
    user_id: str,
    roadmap_id: Optional[str],
    level: Optional[str],
    position: str,
    round_type: str,
    responses: List[dict],
    analysis: dict,
    db: Session
) -> dict:
    """Save a completed interview session to the database."""
    session = InterviewSession(
        user_id=user_id,
        roadmap_id=roadmap_id,
        level=level,
        position=position,
        round_type=round_type,
        responses=responses,
        analysis=analysis,
        technical_score=analysis.get("technical_score"),
        communication_score=analysis.get("communication_score"),
        confidence_score=analysis.get("confidence_score"),
        verdict=analysis.get("verdict")
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "id": str(session.id),
        "position": position,
        "analysis": analysis,
        "completed_at": str(session.completed_at)
    }


def get_interview_history(user_id: str, db: Session) -> List[dict]:
    """Get all interview sessions for a user."""
    sessions = db.query(InterviewSession).filter(
        InterviewSession.user_id == user_id
    ).order_by(InterviewSession.completed_at.desc()).all()

    return [
        {
            "id": str(s.id),
            "position": s.position,
            "round_type": s.round_type,
            "level": s.level,
            "technical_score": s.technical_score,
            "communication_score": s.communication_score,
            "confidence_score": s.confidence_score,
            "verdict": s.verdict,
            "completed_at": str(s.completed_at)
        }
        for s in sessions
    ]
