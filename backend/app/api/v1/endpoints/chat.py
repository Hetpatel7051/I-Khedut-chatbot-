from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import re
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
    query = request.message.casefold()
    unavailable_text = None
    unavailable_intent = None

    if re.search(r"\bstatus\b|સ્ટેટસ|ક્યાં પહોંચ્યું|અરજી નંબર|\bikh-", query):
        unavailable_intent = "status_unavailable"
        unavailable_text = {
            "gu": "અરજીનું લાઇવ સ્ટેટસ અહીંથી મેળવી શકાય તેમ નથી. અરજી નંબર પરથી સ્થિતિ અનુમાનવામાં આવી નથી. કૃપા કરીને iKhedut પોર્ટલના અધિકૃત ટ્રેકિંગમાં તપાસો.",
            "hi": "आवेदन की लाइव स्थिति अभी उपलब्ध नहीं है। आवेदन संख्या से स्थिति का अनुमान नहीं लगाया गया है। कृपया iKhedut पोर्टल पर आधिकारिक ट्रैकिंग देखें।",
            "en": "Live application status is unavailable. No status was inferred from the application number. Please use the official tracking page on the iKhedut portal.",
        }.get(
            request.language,
            "Live application status is unavailable. Please use the official iKhedut tracking page.",
        )
    elif re.search(r"weather|forecast|હવામાન|વરસાદ|मौसम|बारिश", query):
        unavailable_intent = "weather_unavailable"
        unavailable_text = {
            "gu": "હવામાનની લાઇવ માહિતી આ સમયે ઉપલબ્ધ નથી. કૃપા કરીને સ્થાનિક હવામાન વિભાગ અથવા IMDની આગાહી તપાસો.",
            "hi": "लाइव मौसम जानकारी अभी उपलब्ध नहीं है। कृपया स्थानीय मौसम विभाग या IMD का पूर्वानुमान देखें।",
            "en": "Live weather information is unavailable. Please check the local weather department or IMD forecast.",
        }.get(
            request.language,
            "Live weather information is unavailable. Please check the official forecast.",
        )
    elif re.search(r"mandi|market|price|rate|bhav|ભાવ|યાર્ડ|मंडी|भाव", query):
        unavailable_intent = "market_prices_unavailable"
        unavailable_text = {
            "gu": "APMCના લાઇવ બજાર ભાવ આ સમયે ઉપલબ્ધ નથી. કૃપા કરીને સંબંધિત APMC અથવા અધિકૃત બજાર બુલેટિન તપાસો.",
            "hi": "APMC के लाइव मंडी भाव अभी उपलब्ध नहीं हैं। कृपया संबंधित APMC या आधिकारिक बाजार बुलेटिन देखें।",
            "en": "Live APMC market prices are unavailable. Please check the relevant APMC or official market bulletin.",
        }.get(
            request.language,
            "Live APMC market prices are unavailable; check the relevant official market bulletin.",
        )
    elif re.search(r"\bapply\b|\bapplication\b|\bform\b|અરજી|ફોર્મ|ભરવું", query):
        unavailable_intent = "application_creation_unavailable"
        unavailable_text = {
            "gu": "અધિકૃત અરજી અહીંથી બનાવાતી કે સબમિટ થતી નથી. કૃપા કરીને iKhedut પોર્ટલ પર તમારી સાચી વિગતો દાખલ કરીને અરજી કરો.",
            "hi": "यहाँ आधिकारिक आवेदन बनाया या जमा नहीं होता। कृपया iKhedut पोर्टल पर अपनी सही जानकारी भरें।",
            "en": "An official application cannot be created or submitted here. Enter your actual details on the iKhedut portal.",
        }.get(
            request.language,
            "An official application cannot be created here. Please use the iKhedut portal.",
        )

    if unavailable_text:
        return {
            "response_text": unavailable_text,
            "language": request.language,
            "intent": unavailable_intent,
            "matched_schemes": [],
            "citations": [],
        }

    response_text = await process_chat(
        request.message,
        profile,
        request.language,
        request.audio_base64,
        request.audio_mime_type,
        request.image_base64,
        request.image_mime_type,
    )

    return {
        "response_text": response_text,
        "language": request.language,
        "intent": "general",
        "matched_schemes": [],
        "citations": [],
    }
