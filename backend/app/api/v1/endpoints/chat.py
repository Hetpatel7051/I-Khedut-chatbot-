from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from backend.app.llm.gemini_client import process_chat

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
    
    # Process with Gemini
    response_text = await process_chat(request.message, profile, request.language, request.audio_base64, request.audio_mime_type)
    
    return {
        "response_text": response_text,
        "language": request.language,
        "intent": "general",
        "matched_schemes": [],
        "citations": ["GSAMB / APMC Data"]
    }
