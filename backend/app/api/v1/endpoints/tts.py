from fastapi import APIRouter
from pydantic import BaseModel
import base64
import io
from gtts import gTTS
import re

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    language: str = "gu"

@router.post("")
async def generate_tts(request: TTSRequest):
    try:
        # Clean text specifically for better TTS
        clean_text = request.text
        # Remove emojis and markdown
        clean_text = re.sub(r'[*#_~`\[\]]', ' ', clean_text)
        clean_text = re.sub(r'[🙏🚜🍎🐄💧🐟🌱📝🔍💡•→✓✅❌📊📋🌾🥕🌻🍞🧵🌿🥦🌶️₹]', ' ', clean_text)
        
        # Remove english parentheticals if Gujarati
        if request.language == 'gu':
            clean_text = re.sub(r'\([A-Za-z0-9\s.,\/-]+\)', ' ', clean_text)
            
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        
        if not clean_text:
            return {"audio_base64": None}
            
        lang_code = 'gu' if request.language == 'gu' else 'hi' if request.language == 'hi' else 'en'
        
        # Generate speech
        tts = gTTS(text=clean_text, lang=lang_code, slow=False)
        
        # Save to memory
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        
        # Convert to base64
        audio_base64 = base64.b64encode(fp.read()).decode('utf-8')
        
        return {
            "audio_base64": audio_base64,
            "mime_type": "audio/mpeg",
            "spoken_text": clean_text
        }
    except Exception as e:
        print(f"TTS Error: {e}")
        return {
            "audio_base64": None,
            "error": str(e)
        }
