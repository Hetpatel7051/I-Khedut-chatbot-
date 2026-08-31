import re
from fastapi import Request, HTTPException, status
import html

def sanitize_user_input(text: str) -> str:
    """Sanitize user queries to prevent prompt injection and XSS."""
    if not text:
        return ""
    # Strip dangerous HTML tags and escape characters
    cleaned = html.escape(text.strip())
    # Remove null bytes or excessive control characters
    cleaned = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', cleaned)
    return cleaned

def validate_audio_content_type(content_type: str) -> bool:
    """Validate incoming audio mime type for STT upload."""
    allowed = ["audio/webm", "audio/wav", "audio/wave", "audio/x-wav", "audio/ogg", "audio/mp3", "audio/mpeg"]
    return any(content_type.startswith(t) for t in allowed)
