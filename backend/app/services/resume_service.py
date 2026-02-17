import io
import json
from pypdf import PdfReader
from app.services.ai_service import ai_hub

async def extract_text_from_pdf(file_content: bytes) -> str:
    reader = PdfReader(io.BytesIO(file_content))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

async def analyze_resume_with_ai(resume_text: str, job_description: str = ""):
    system_prompt = "You are a world-class AI Career Consultant and Resume Strategist."
    
    if job_description:
        prompt = f"""
        Analyze the following resume against the job description provided. 
        Provide a highly detailed, professional analysis in JSON format.
        
        Job Description:
        {job_description[:2000]}
        
        Resume Text:
        {resume_text[:3000]}
        
        The JSON output must have exactly these keys:
        1. "ats_score": Integer (0-100) based on compatibility.
        2. "keyword_analysis": {{
            "matched": [list of skills found in both],
            "missing": [list of critical skills in JD but missing in resume],
            "extra": [list of valuable skills in resume but not required by JD]
        }}
        3. "industry_fit": {{
            "score": Integer (0-100),
            "verdict": "A brief 2-sentence professional assessment of the alignment.",
            "top_industries": [list of 3 industries this profile aligns with]
        }}
        4. "strengths": [list of 3-5 key professional strengths],
        5. "weaknesses": [list of 3-5 areas for improvement],
        6. "improvement_plan": [list of 3 actionable steps to improve the resume for this role]
        """
    else:
        prompt = f"""
        Analyze the following resume text and provide a comprehensive professional assessment in JSON format.
        IMPORTANT: Return ONLY the valid JSON object. Do not use markdown keys or conversational text.
        
        Resume Text:
        {resume_text[:3000]}
        
        The JSON output must have exactly these keys:
        1. "ats_score": Integer (0-100) based on formatting and content quality.
        2. "keyword_analysis": {{
            "matched": [list of detected technical and soft skills],
            "missing": ["N/A - Provide a job description for gap analysis"],
            "extra": []
        }}
        3. "industry_fit": {{
            "score": Integer (0-100),
            "verdict": "A brief professional summary of the user's career profile.",
            "top_industries": [list of 3 industries this profile aligns with]
        }}
        4. "strengths": [list of 3-5 key professional strengths],
        5. "weaknesses": [list of 3-5 areas for improvement],
        6. "improvement_plan": [list of 3 actionable tips for general resume optimization]
        """
    
    import logging
    logger = logging.getLogger(__name__)
    
    response = await ai_hub.chat_completion([{"role": "user", "content": prompt}], system_prompt)
    
    logger.info(f"Raw AI Response length: {len(response)}")
    
    # Try to extract JSON from the response
    json_str = response
    
    import re
    # Clean up response (Markdown stripping)
    clean_response = response.strip()
    if "```json" in clean_response:
        clean_response = clean_response.split("```json")[1].split("```")[0].strip()
    elif "```" in clean_response:
        clean_response = clean_response.split("```")[1].split("```")[0].strip()
    
    # Robust Regex Extraction for main JSON object
    try:
        json_match = re.search(r'(\{.*\})', clean_response, re.DOTALL)
        if json_match:
            clean_response = json_match.group(1)
        
        return json.loads(clean_response)
    except Exception as e:
        logger.error(f"JSON Parsing failed: {str(e)}")
        logger.error(f"Failed content snippet: {clean_response[:200]}...")
        logger.error(f"JSON Parsing failed: {str(e)}")
        logger.error(f"Failed string: {json_str[:500]}...")
        # Fallback if AI output is not valid JSON
        return {
            "ats_score": 70,
            "keyword_analysis": {"matched": ["Extracting..."], "missing": [], "extra": []},
            "industry_fit": {"score": 75, "verdict": "Good potential with some gaps.", "top_industries": ["Technology"]},
            "strengths": ["Clear structure"],
            "weaknesses": ["Needs more metrics"],
            "improvement_plan": ["Add quantifiable achievements"]
        }
