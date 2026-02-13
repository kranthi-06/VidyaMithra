from app.services.ai_service import ai_hub

async def generate_career_path(skills: list[str], current_role: str):
    system_prompt = "You are an expert career strategist."
    prompt = f"""
    Based on the following skills: {', '.join(skills)} and current role: {current_role}, suggest a career path.
    Provide a JSON response with:
    1. "current_level": Assessment of current level (Junior/Mid/Senior).
    2. "next_steps": List of immediate next roles.
    3. "long_term_goals": List of potential future titles.
    4. "skill_gaps": List of skills to acquire for the next level.
    5. "salary_insight": Estimated salary range (global average in USD).
    6. "market_demand": High/Medium/Low based on 2024 trends.
    """
    
    return await ai_hub.chat_completion([{"role": "user", "content": prompt}], system_prompt)
