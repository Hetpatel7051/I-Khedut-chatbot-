from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from backend.app.rag.answer import answer_from_rag
from backend.app.rag.guardrails import unavailable_reply

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    language: str = "gu"
    farmer_profile: Optional[Dict[str, Any]] = None
    audio_base64: Optional[str] = None
    audio_mime_type: Optional[str] = None
    image_base64: Optional[str] = None
    image_mime_type: Optional[str] = None


@router.post("/message")
async def chat_endpoint(request: ChatRequest):
    profile = request.farmer_profile or {}
    unavailable = unavailable_reply(
        request.message,
        request.language,
        has_image=bool(request.image_base64),
        has_audio=bool(request.audio_base64),
    )
    if unavailable:
        return unavailable

    return answer_from_rag(request.message, profile, request.language)
