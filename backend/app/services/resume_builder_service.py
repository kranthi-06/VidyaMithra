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


async def optimize_full_resume(resume_data: dict, target_role: str = "", template_style: str = "modern") -> dict:
    """Optimize the entire resume content for a specific template style."""
    
    style_instructions = {
        "modern": "Write in a clean, professional, and concise style. Use modern action verbs. Keep bullets tight and impactful. Focus on measurable outcomes.",
        "classic": "Write in a formal, traditional business tone. Use complete sentences where appropriate. Maintain conservative professionalism. Suitable for banking, law, and corporate environments.",
        "creative": "Write in an engaging, expressive style. Use vivid language while remaining professional. Highlight creative problem-solving and innovation. Suitable for design, marketing, and creative roles.",
        "developer": "Write in a technical, precise style. Emphasize technologies, architectures, and engineering achievements. Use developer-friendly terminology. Include specific technical details.",
    }
    
    instruction = style_instructions.get(template_style, style_instructions["modern"])
    resume_text = json.dumps(resume_data, indent=2)
    
    prompt = f"""
    Optimize the following complete resume data for maximum professional impact.
    Target Role: {target_role or 'General'}
    Writing Style: {instruction}
    
    Resume Data:
    {resume_text[:6000]}
    
    CRITICAL RULES:
    - Do NOT invent any fake experience, skills, or achievements.
    - Do NOT add information that doesn't exist in the input.
    - Improve and rewrite professional_summary to be powerful and role-specific.
    - Rewrite experience descriptions/bullets with strong action verbs and clear impact.
    - Improve project descriptions to highlight problem-solving and technologies.
    - Keep all dates, company names, institutions, and factual details UNCHANGED.
    - Optimize for ATS keyword alignment with the target role.
    
    Return the optimized resume in this EXACT JSON format:
    {{
        "personal": {{
            "full_name": "unchanged",
            "email": "unchanged",
            "phone": "unchanged",
            "location": "unchanged",
            "professional_summary": "improved summary"
        }},
        "experience": [
            {{
                "title": "unchanged",
                "organization": "unchanged",
                "duration": "unchanged",
                "description": "improved description",
                "bullets": ["improved bullet 1", "improved bullet 2", "improved bullet 3"]
            }}
        ],
        "projects": [
            {{
                "name": "unchanged",
                "technologies": "unchanged",
                "description": "improved description"
            }}
        ]
    }}
    
    Return ONLY valid JSON. No markdown, no explanations.
    """
    response = await ai_hub.chat_completion([{"role": "user", "content": prompt}], SYSTEM_PROMPT)
    return _parse_ai_json(response)

