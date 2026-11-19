from fastapi import APIRouter
from backend.app.core.config import settings
from backend.app.rag.vector_store import vector_store

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint for container probes."""
    indexed_schemes = len(vector_store.schemes)
    return {
        "status": "healthy" if indexed_schemes else "degraded",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "answer_engine": "local_bm25_rag",
        "indexed_schemes": indexed_schemes,
        "speech_services": {
            "stt": (
                "Bhashini"
                if settings.BHASHINI_API_KEY
                and settings.BHASHINI_USER_ID
                and settings.BHASHINI_ASR_SERVICE_ID
                else "unconfigured"
            ),
            "tts": "gTTS (internet required)",
        },
    }
