"""
Background jobs scheduler for VidyaMithra.
Handles:
- Daily opportunity expiry checks
- Periodic discovery of new opportunities for common target roles
- Data maintenance
"""
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.services import opportunity_service
from app.api import deps

logger = logging.getLogger(__name__)

async def check_expired_opportunities_job():
    """Daily check to mark opportunities as expired."""
    logger.info("Running job: check_expired_opportunities_job")
    db: Session = SessionLocal()
    try:
        count = opportunity_service.cleanup_expired_opportunities(db)
        logger.info(f"Marked {count} opportunities as expired.")
    except Exception as e:
        logger.error(f"Error in check_expired_opportunities_job: {e}")
    finally:
        db.close()

async def refresh_trending_opportunities_job():
    """Periodic job to discovery new opportunities for trending roles."""
    logger.info("Running job: refresh_trending_opportunities_job")
    db: Session = SessionLocal()
    
    # Common roles to keep the DB fresh for new users
    trending_roles = [
        "Software Engineer",
        "Data Scientist",
        "Product Manager",
        "UX Designer",
        "DevOps Engineer"
    ]
    
    try:
        for role in trending_roles:
            logger.info(f"Discovering opportunities for: {role}")
            # Use basic skills for general discovery
            await opportunity_service.generate_opportunities(
                target_role=role,
                skills=[],
                level="Beginner",
                db=db
            )
        logger.info("Trending opportunities refresh completed.")
    except Exception as e:
        logger.error(f"Error in refresh_trending_opportunities_job: {e}")
    finally:
        db.close()

def setup_background_jobs():
    """Initialize and start the background scheduler."""
    scheduler = AsyncIOScheduler()
    
    # 1. Daily at midnight: Check for expired opportunities
    scheduler.add_job(
        check_expired_opportunities_job,
        CronTrigger(hour=0, minute=0),
        id="check_expired_opps",
        name="Check expired opportunities daily",
        replace_existing=True
    )
    
    # 2. Every 12 hours: Refresh trending opportunities
    scheduler.add_job(
        refresh_trending_opportunities_job,
        CronTrigger(hour="*/12"),
        id="refresh_trending_opps",
        name="Refresh trending opportunities every 12 hours",
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("Background scheduler started.")
    return scheduler
