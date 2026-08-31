from fastapi import APIRouter
from backend.app.core.config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint for container probes."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "rag_engine": "chromadb + text-embedding-004",
        "llm_engine": settings.GEMINI_MODEL
    }
