import base64
import binascii
import logging
import os
from typing import Any, Dict, Optional

from google import genai
from google.genai import types


def _unavailable_message(language: str) -> str:
    if language == "gu":
        return "માફ કરશો, આ સમયે સહાયક સેવા ઉપલબ્ધ નથી. લાઇવ ભાવ, હવામાન, અરજીનું સ્ટેટસ અથવા દસ્તાવેજની સત્તાવાર માન્યતા અહીંથી ચકાસાઈ નથી. કૃપા કરીને ફરી પ્રયાસ કરો અથવા સંબંધિત અધિકૃત પોર્ટલ તપાસો."
    if language == "hi":
        return "क्षमा करें, यह सहायक सेवा अभी उपलब्ध नहीं है। लाइव भाव, मौसम, आवेदन की स्थिति या दस्तावेज़ की सरकारी वैधता यहाँ सत्यापित नहीं हुई है। कृपया फिर प्रयास करें या संबंधित आधिकारिक पोर्टल देखें।"
    return "Sorry, the assistant service is unavailable right now. Live prices, weather, application status, and official document validity have not been verified. Please try again or check the relevant official portal."


async def process_chat(
    message: str,
    profile: Dict[str, Any],
    language: str = "gu",
    audio_base64: Optional[str] = None,
    audio_mime_type: Optional[str] = None,
    image_base64: Optional[str] = None,
    image_mime_type: Optional[str] = None,
) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return _unavailable_message(language)

    client = genai.Client(api_key=api_key)
    from backend.app.core.config import settings
    from backend.app.llm.prompts import get_system_prompt

    try:
        chat = client.chats.create(
            model=settings.GEMINI_MODEL,
            config=types.GenerateContentConfig(
                system_instruction=get_system_prompt(profile, language),
                temperature=0.3,
            ),
        )

        contents = []
        for encoded_data, mime_type in (
            (image_base64, image_mime_type or "image/jpeg"),
            (audio_base64, audio_mime_type or "audio/webm"),
        ):
            if encoded_data:
                try:
                    decoded_data = base64.b64decode(encoded_data, validate=True)
                except (binascii.Error, ValueError):
                    return _unavailable_message(language)
                contents.append(
                    types.Part.from_bytes(data=decoded_data, mime_type=mime_type)
                )

        if message.strip():
            contents.append(message)
        if not contents:
            return _unavailable_message(language)

        response = chat.send_message(contents)
        return response.text or _unavailable_message(language)
    except Exception:
        logging.exception("Error calling Gemini")
        return _unavailable_message(language)
