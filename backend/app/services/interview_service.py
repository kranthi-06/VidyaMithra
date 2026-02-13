from app.services.ai_service import ai_hub

async def generate_interview_question(position: str, round_type: str, history: list):
    """
    Generates the next interview question using AI.
    """
    system_prompt = f"""
    You are an expert interviewer for a {position} position.
    You are currently conducting the {round_type} round.
    Generate a challenging and relevant interview question.
    If there is history, make sure the next question follows naturally or explores a new area within the round.
    Keep the question professional and concise.
    """
    
    messages = []
    for entry in history:
        messages.append({"role": "assistant", "content": entry["question"]})
        messages.append({"role": "user", "content": entry["answer"]})
        
    return await ai_hub.chat_completion(messages, system_prompt)

async def analyze_interview_performance(position: str, responses: dict):
    """
    Analyzes the entire interview performance across all rounds.
    """
    system_prompt = "You are a senior hiring manager providing feedback."
    prompt = f"""
    Analyze the following interview performance for a {position} role.
    Provide a detailed evaluation in JSON format with:
    1. "technical_score": Assessment of technical depth (percentage).
    2. "soft_skills_score": Assessment of communication and behavioral answers (percentage).
    3. "verdict": "Strong Fit", "Good Fit", "Needs Improvement", or "Not a Fit".
    4. "strengths": List of key strengths identified.
    5. "weaknesses": List of areas for improvement.
    6. "feedback": A summary of the performance.
    
    Interview Data:
    {responses}
    """
    
    return await ai_hub.chat_completion([{"role": "user", "content": prompt}], system_prompt)
