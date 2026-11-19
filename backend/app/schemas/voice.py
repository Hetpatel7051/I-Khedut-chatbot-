from pydantic import BaseModel, Field


class VoiceTranscribeRequest(BaseModel):
    audio_base64: str = Field(min_length=1)
    language: str = "gu"
    mime_type: str = "audio/webm"


class VoiceTranscribeResponse(BaseModel):
    transcription: str
    language: str
    confidence: float = 0.0


class VoiceSynthesizeRequest(BaseModel):
    text: str = Field(min_length=1)
    language: str = "gu"
    gender: str = "female"


class VoiceSynthesizeResponse(BaseModel):
    audio_base64: str
    language: str
    mime_type: str = "audio/wav"
