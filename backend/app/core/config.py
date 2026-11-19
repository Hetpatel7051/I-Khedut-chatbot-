import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "iKhedut Farmer Support Assistant"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    ENVIRONMENT: str = "production"

    # Bhashini Speech & Language Services (Ministry of Electronics and IT, India)
    BHASHINI_API_KEY: str = os.getenv("BHASHINI_API_KEY", "")
    BHASHINI_USER_ID: str = os.getenv("BHASHINI_USER_ID", "")
    BHASHINI_PIPELINE_ENDPOINT: str = (
        "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    )
    BHASHINI_ASR_SERVICE_ID: str = os.getenv("BHASHINI_ASR_SERVICE_ID", "")
    BHASHINI_TTS_SERVICE_ID: str = os.getenv("BHASHINI_TTS_SERVICE_ID", "")

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres@localhost:5432/ikhedut_ai",
    )

    # Security & CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "*",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
