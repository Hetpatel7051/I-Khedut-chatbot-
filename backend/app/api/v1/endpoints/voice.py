from fastapi import APIRouter, HTTPException
from backend.app.schemas.voice import (
    VoiceTranscribeRequest, VoiceTranscribeResponse,
    VoiceSynthesizeRequest, VoiceSynthesizeResponse
)
from backend.app.services.bhashini_service import bhashini_service

router = APIRouter()

@router.post("/transcribe", response_model=VoiceTranscribeResponse)
async def transcribe_voice(request: VoiceTranscribeRequest):
    """Transcribe farmer speech audio to Gujarati / Hindi / English text."""
    if not request.audio_base64:
        raise HTTPException(status_code=400, detail="Missing audio payload")

    result = await bhashini_service.speech_to_text(
        audio_base64=request.audio_base64,
        source_lang=request.language
    )
    return VoiceTranscribeResponse(
        transcription=result.get("text", ""),
        language=result.get("source_language", request.language),
        confidence=result.get("confidence", 0.95)
    )

@router.post("/synthesize", response_model=VoiceSynthesizeResponse)
async def synthesize_speech(request: VoiceSynthesizeRequest):
    """Convert Gujarati text into audio stream for farmer voice playback."""
    if not request.text:
        raise HTTPException(status_code=400, detail="Missing text to synthesize")

    result = await bhashini_service.text_to_speech(
        text=request.text,
        target_lang=request.language,
        gender=request.gender
    )
    return VoiceSynthesizeResponse(
        audio_base64=result.get("audio_base64", ""),
        language=request.language,
        mime_type="audio/wav"
    )
