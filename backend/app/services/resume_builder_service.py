import json
import re
import logging
from typing import Optional
from app.services.ai_service import ai_hub

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert AI Resume Architect, ATS specialist, career coach, and professional resume writer.

GLOBAL RULES:
- Do NOT invent fake experience, skills, or achievements.
- Only rewrite, improve, structure, and optimize what the user provides.
- Use professional resume language with strong action verbs.
- Keep content concise and impact-focused.
- Optimize for ATS (Applicant Tracking Systems).
- Output ONLY valid JSON. No markdown fences, no conversational text.
- Respect the selected target job role.
"""


def _parse_ai_json(response: str) -> dict:
    """Robustly extract JSON from AI response."""
    clean = response.strip()
    if "```json" in clean:
        clean = clean.split("```json")[1].split("```")[0].strip()
    elif "```" in clean:
        clean = clean.split("```")[1].split("```")[0].strip()
    
    try:
        json_match = re.search(r'(\{.*\})', clean, re.DOTALL)
        if json_match:
            clean = json_match.group(1)
        return json.loads(clean)
    except Exception as e:
        logger.error(f"JSON parse failed: {e}")
        return {"error": str(e), "raw": clean[:500]}


async def enhance_personal_info(data: dict, target_role: str = "") -> dict:
    prompt = f"""
    Improve the following personal information for a professional resume.
    Target Role: {target_role or 'General'}
    
    Input Data:
    - Full Name: {data.get('full_name', '')}
    - Email: {data.get('email', '')}
    - Phone: {data.get('phone', '')}
    - Location: {data.get('location', '')}
    - Professional Summary (raw): {data.get('professional_summary', '')}
    
    Task:
    - Validate formatting (email, phone).
    - If professional summary is weak or empty, generate a concise 2-3 sentence professional summary based on the role.
    - If provided, improve the professional summary with strong action verbs and ATS keywords.
    - Do NOT invent experience.
    
    Return ONLY this JSON:
    {{
        "section": "personal_info",
        "full_name": "",
        "email": "",
        "phone": "",
        "location": "",
        "professional_summary": ""
    }}
    """
    response = await ai_hub.chat_completion([{"role": "user", "content": prompt}], SYSTEM_PROMPT)
    return _parse_ai_json(response)


async def enhance_education(data: dict, target_role: str = "") -> dict:
    items_text = json.dumps(data.get('items', []))
    prompt = f"""
    Rewrite the following education entries professionally for an ATS-optimized resume.
    Target Role: {target_role or 'General'}
    
    Input Education Items: {items_text}
    
    Task:
    - Rewrite education details professionally.
    - Add relevant coursework ONLY if mentioned by the user.
    - Keep format ATS-friendly.
    - Do NOT fabricate degrees or institutions.
    
    Return ONLY this JSON:
    {{
        "section": "education",
        "items": [
            {{
                "degree": "",
                "institution": "",
                "duration": "",
                "description": ""
            }}
        ]
    }}
    """
    response = await ai_hub.chat_completion([{"role": "user", "content": prompt}], SYSTEM_PROMPT)
    return _parse_ai_json(response)


async def enhance_experience(data: dict, target_role: str = "") -> dict:
    items_text = json.dumps(data.get('items', []))
    prompt = f"""
    Rewrite the following work experience entries into professional, ATS-optimized resume bullet points.
    Target Role: {target_role or 'General'}
    
    Input Experience Items: {items_text}
    
    Task:
    - Rewrite each description into 3-5 powerful bullet points.
    - Use strong action verbs (Developed, Implemented, Spearheaded, Orchestrated, etc.).
    - Highlight responsibilities and impact.
    - Keep each bullet short, concise, and strong.
    - Do NOT exaggerate or add false metrics.
    - Do NOT invent responsibilities.
    
    Return ONLY this JSON:
    {{
        "section": "experience",
        "items": [
            {{
                "title": "",
                "organization": "",
                "duration": "",
                "bullets": ["bullet 1", "bullet 2", "bullet 3"]
            }}
        ]
    }}
    """
    response = await ai_hub.chat_completion([{"role": "user", "content": prompt}], SYSTEM_PROMPT)
    return _parse_ai_json(response)


async def enhance_projects(data: dict, target_role: str = "") -> dict:
    items_text = json.dumps(data.get('items', []))
    prompt = f"""
    Rewrite the following project entries as resume-ready project descriptions.
    Target Role: {target_role or 'General'}
    
    Input Project Items: {items_text}
    
    Task:
    - Rewrite into professional project descriptions.
    - Focus on problem, solution, and technologies used.
    - Keep it relevant to the target role.
    - Do NOT invent features or technologies.
    
    Return ONLY this JSON:
    {{
        "section": "projects",
        "items": [
            {{
                "name": "",
                "technologies": [],
                "description": ""
            }}
        ]
    }}
    """
    response = await ai_hub.chat_completion([{"role": "user", "content": prompt}], SYSTEM_PROMPT)
    return _parse_ai_json(response)


async def enhance_skills(data: dict, target_role: str = "") -> dict:
    raw_skills = data.get('raw_skills', '')
    prompt = f"""
    Clean and optimize the following skills for an ATS-optimized resume.
    Target Role: {target_role or 'General'}
    
    Raw Skills Input: {raw_skills}
    
    Task:
    - Clean and normalize skill names.
    - Group into categories: Technical Skills, Tools, Soft Skills.
    - Suggest 3-5 additional skills that are commonly expected for the target role as recommendations.
    - Do NOT auto-add suggested skills to the main lists.
    
    Return ONLY this JSON:
    {{
        "section": "skills",
        "technical_skills": [],
        "tools": [],
        "soft_skills": [],
        "suggested_skills": []
    }}
    """
    response = await ai_hub.chat_completion([{"role": "user", "content": prompt}], SYSTEM_PROMPT)
    return _parse_ai_json(response)


async def run_ats_check(resume_data: dict, target_role: str = "") -> dict:
    resume_text = json.dumps(resume_data)
    prompt = f"""
    Evaluate the following resume data for ATS (Applicant Tracking System) compatibility.
    Target Role: {target_role or 'General'}
    
    Resume Data: {resume_text[:4000]}
    
    Task:
    - Score ATS compatibility from 0-100.
    - Check keyword alignment with the target role.
    - Identify strengths and areas for improvement.
    - Suggest concrete improvements without altering facts.
    
    Return ONLY this JSON:
    {{
        "section": "ats_check",
        "score": 0,
        "strengths": ["strength 1", "strength 2"],
        "improvements": ["improvement 1", "improvement 2"]
    }}
    """
    response = await ai_hub.chat_completion([{"role": "user", "content": prompt}], SYSTEM_PROMPT)
    return _parse_ai_json(response)


async def regenerate_section(section_data: dict, mode: str, target_role: str = "") -> dict:
    """Regenerate a specific section with a different writing style."""
    mode_instructions = {
        "shorter": "Rewrite to be significantly more concise. Cut unnecessary words. Keep impact.",
        "stronger": "Rewrite with stronger, more powerful action verbs and impactful language.",
        "technical": "Rewrite with more technical depth. Include specific technologies, methodologies, and technical terms.",
        "simpler": "Simplify the language. Make it clear and accessible while keeping professionalism.",
        "role_optimized": f"Optimize specifically for the role: {target_role}. Align keywords and focus areas."
    }
    
    instruction = mode_instructions.get(mode, mode_instructions["stronger"])
    section_text = json.dumps(section_data)
    
    prompt = f"""
    Regenerate the following resume section with this instruction: {instruction}
    Target Role: {target_role or 'General'}
    
    Current Section Data: {section_text}
    
    Return the improved section in the SAME JSON structure as the input.
    Return ONLY valid JSON.
    """
    response = await ai_hub.chat_completion([{"role": "user", "content": prompt}], SYSTEM_PROMPT)
    return _parse_ai_json(response)
