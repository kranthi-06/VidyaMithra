"""
Quiz Gating Service — generates quizzes per skill, enforces pass thresholds,
stores attempts, and gates roadmap progression.
"""
import json
import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from app.services.ai_service import ai_hub
from app.models.career import QuizAttempt, Roadmap
from app.services.roadmap_service import PASS_THRESHOLDS, update_skill_status

logger = logging.getLogger(__name__)


async def generate_skill_quiz(
    skill_name: str,
    level: str,
    count: int = 10
) -> List[dict]:
    """
    Generate a quiz for a specific roadmap skill at a specific difficulty level.
    Questions are tailored to the skill and difficulty.
    """
    system_prompt = (
        f"You are an expert technical assessor. "
        f"Generate quiz questions for the skill '{skill_name}' at {level} difficulty. "
        f"Questions must be fair, accurate, and test real understanding — not trivia."
    )

    prompt = f"""
    Generate exactly {count} multiple-choice quiz questions for the skill "{skill_name}" 
    at {level} difficulty level.

    Each question MUST have:
    - Exactly 4 options
    - Exactly 1 correct answer
    - Be relevant to real-world application of {skill_name}

    Difficulty guidelines:
    - Beginner: foundational concepts, definitions, basic usage
    - Intermediate: practical application, common patterns, debugging scenarios
    - Advanced: architecture decisions, edge cases, performance optimization

    Return ONLY valid JSON array:
    [
        {{
            "id": 1,
            "question": "Question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct": 0,
            "explanation": "Brief explanation of the correct answer"
        }}
    ]

    IMPORTANT: Return ONLY valid JSON. No markdown, no conversational text.
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

        questions = json.loads(clean)

        # Validate
        valid = []
        if isinstance(questions, list):
            for q in questions:
                if all(k in q for k in ["question", "options", "correct"]):
                    if isinstance(q["options"], list) and len(q["options"]) >= 4:
                        valid.append(q)

        for idx, q in enumerate(valid):
            q["id"] = idx + 1

        return valid

    except json.JSONDecodeError:
        logger.error(f"Failed to parse quiz JSON for {skill_name}")
        return []
    except Exception as e:
        logger.error(f"Quiz generation error: {e}")
        return []


def submit_quiz_attempt(
    user_id: str,
    roadmap_id: Optional[str],
    skill_id: str,
    skill_name: str,
    level: str,
    answers: List[dict],  # [{question_id, selected, correct, question_text}]
    db: Session
) -> dict:
    """
    Submit and grade a quiz attempt.
    If passed, marks the skill as completed in the roadmap.
    """
    total = len(answers)
    correct = sum(1 for a in answers if a.get("selected") == a.get("correct"))
    score = (correct / total * 100) if total > 0 else 0
    threshold = PASS_THRESHOLDS.get(level, 70)
    passed = score >= threshold

    # Save attempt
    attempt = QuizAttempt(
        user_id=user_id,
        roadmap_id=roadmap_id,
        skill_id=skill_id,
        skill_name=skill_name,
        level=level,
        score=score,
        passed=passed,
        total_questions=total,
        correct_answers=correct,
        questions_data=answers
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    result = {
        "attempt_id": str(attempt.id),
        "score": score,
        "passed": passed,
        "threshold": threshold,
        "correct": correct,
        "total": total,
        "skill_unlocked": False
    }

    # If passed and linked to a roadmap, update skill status
    if passed and roadmap_id:
        try:
            update_skill_status(user_id, roadmap_id, skill_id, "completed", db)
            result["skill_unlocked"] = True
        except Exception as e:
            logger.error(f"Failed to update skill status: {e}")

    return result


def get_quiz_history(user_id: str, db: Session, skill_id: Optional[str] = None) -> List[dict]:
    """Get quiz attempt history for a user, optionally filtered by skill."""
    query = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id)
    if skill_id:
        query = query.filter(QuizAttempt.skill_id == skill_id)
    
    attempts = query.order_by(QuizAttempt.attempted_at.desc()).all()
    
    return [
        {
            "id": str(a.id),
            "skill_id": a.skill_id,
            "skill_name": a.skill_name,
            "level": a.level,
            "score": a.score,
            "passed": a.passed,
            "total_questions": a.total_questions,
            "correct_answers": a.correct_answers,
            "attempted_at": str(a.attempted_at),
            "questions_data": a.questions_data
        }
        for a in attempts
    ]


def has_passed_skill_quiz(user_id: str, skill_id: str, db: Session) -> bool:
    """Check if a user has passed the quiz for a specific skill."""
    attempt = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user_id,
        QuizAttempt.skill_id == skill_id,
        QuizAttempt.passed == True
    ).first()
    return attempt is not None
