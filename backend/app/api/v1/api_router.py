from fastapi import APIRouter
from backend.app.api.v1.endpoints import chat, mandi, tts, schemes, weather

api_router = APIRouter()

api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(mandi.router, prefix="/mandi", tags=["Mandi"])
api_router.include_router(tts.router, prefix="/tts", tags=["TTS"])
api_router.include_router(schemes.router, prefix="/schemes", tags=["Schemes"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather"])
