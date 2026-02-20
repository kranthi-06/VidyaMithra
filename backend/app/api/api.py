from fastapi import APIRouter
from app.api.endpoints import auth, users, resume, career, learning, interview, quiz, resume_builder

api_router = APIRouter()
api_router.include_router(auth.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
api_router.include_router(resume_builder.router, prefix="/resume-builder", tags=["resume-builder"])
api_router.include_router(career.router, prefix="/career", tags=["career"])
api_router.include_router(learning.router, prefix="/learning", tags=["learning"])
api_router.include_router(interview.router, prefix="/interview", tags=["interview"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["quiz"])

