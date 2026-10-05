from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json
import os
from backend.app.llm.gemini_client import process_chat

router = APIRouter()

SCHEMES_CACHE = []
try:
    schemes_file = os.path.join(os.getcwd(), "data_pipeline", "sample_data", "ikhedut_schemes.json")
    if os.path.exists(schemes_file):
        with open(schemes_file, "r", encoding="utf-8") as f:
            SCHEMES_CACHE = json.load(f)
except Exception as e:
    print("Could not pre-load schemes in chat endpoint:", e)

def find_backend_schemes(query: str) -> List[Dict[str, Any]]:
    q = query.lower()
    matches = []

    keyword_map = {
        "ikhedut-sch-002": ["drip", "sprinkler", "irrigation", "ટપક", "સિંચાઈ", "ફુવારા", "પિયત", "ડ્રિપ"],
        "ikhedut-sch-001": ["tractor", "machinery", "ટ્રેક્ટર", "સાધન", "યાંત્રિકીકરણ", "રોટાવેટર"],
        "ikhedut-sch-003": ["fencing", "fence", "barbed", "wire", "વાડ", "તાર", "કાંટાળી", "ફેન્સિંગ"],
        "ikhedut-sch-004": ["cow", "desi cow", "cattle", "ગાય", "દેશી ગાય", "ગૌ સહાય", "જીવામૃત", "પશુપાલન"],
        "ikhedut-sch-005": ["drone", "spraying", "ડ્રોન", "છંટકાવ"],
        "ikhedut-sch-006": ["smartphone", "mobile", "phone", "સ્માર્ટફોન", "મોબાઈલ"],
        "ikhedut-sch-007": ["solar", "kusum", "pump", "સોલાર", "કુસુમ"],
        "ikhedut-sch-008": ["godown", "storage", "warehouse", "ગોડાઉન", "સંગ્રહ"]
    }

    for sch in SCHEMES_CACHE:
        sch_id = sch.get("id")
        kws = keyword_map.get(sch_id, [])
        if any(kw in q for kw in kws) or any(t.lower() in q for t in sch.get("tags", [])):
            matches.append(sch)

    return matches

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
    
    matched = find_backend_schemes(request.message)

    return {
        "response_text": response_text,
        "language": request.language,
        "intent": "scheme_inquiry" if matched else "general",
        "matched_schemes": matched,
        "citations": [m.get("name_gu", "આઈ-ખેડૂત સત્તાવાર પોર્ટલ") for m in matched] if matched else ["iKhedut Portal / GSAMB Data"]
    }

