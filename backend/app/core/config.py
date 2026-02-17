from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Career Platform"
    API_V1_STR: str = "/api/v1"
    
    # Database
    # This must be the PostgreSQL Connection String (starts with postgresql://)
    # Get this from Supabase Dashboard > Settings > Database > Connection String
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # API Access (for Auth/Storage if needed)
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    OPENAI_API_KEY: str
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
