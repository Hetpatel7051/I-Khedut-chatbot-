import re
from typing import Any, Optional


def unavailable_reply(
    message: str,
    language: str,
    *,
    has_image: bool = False,
    has_audio: bool = False,
) -> Optional[dict[str, Any]]:
    query = message.casefold().strip()
    intent: Optional[str] = None
    text: Optional[str] = None

    if has_image:
        intent = "document_verification_unavailable"
        text = {
            "gu": "દસ્તાવેજની દૃશ્ય ચકાસણી આ સહાયકમાં ઉપલબ્ધ નથી. કોઈ વિગતો, સ્પષ્ટતા કે સરકારી માન્યતા ચકાસવામાં આવી નથી. કૃપા કરીને અધિકૃત કચેરીથી ચકાસો.",
            "hi": "इस सहायक में दस्तावेज़ की दृश्य जाँच उपलब्ध नहीं है। कोई विवरण या सरकारी वैधता सत्यापित नहीं हुई है। कृपया आधिकारिक कार्यालय से जाँचें।",
            "en": "Document image analysis is unavailable in this assistant. No details or government validity were verified. Please check with the relevant official office.",
        }.get(language)
    elif not query and has_audio:
        intent = "transcription_unavailable"
        text = {
            "gu": "તમારો અવાજ લખાણમાં ફેરવી શકાયો નથી. કૃપા કરીને ફરી બોલો અથવા તમારો પ્રશ્ન લખો.",
            "hi": "आपकी आवाज़ को पाठ में नहीं बदला जा सका। कृपया फिर बोलें या अपना प्रश्न लिखें।",
            "en": "Your speech could not be transcribed. Please try speaking again or type your question.",
        }.get(language)
    elif re.search(r"\bstatus\b|સ્ટેટસ|ક્યાં પહોંચ્યું|અરજી નંબર|\bikh-", query):
        intent = "status_unavailable"
        text = {
            "gu": "અરજીનું લાઇવ સ્ટેટસ અહીંથી મેળવી શકાય તેમ નથી. અરજી નંબર પરથી સ્થિતિ અનુમાનવામાં આવી નથી. કૃપા કરીને iKhedut પોર્ટલના અધિકૃત ટ્રેકિંગમાં તપાસો.",
            "hi": "आवेदन की लाइव स्थिति अभी उपलब्ध नहीं है। आवेदन संख्या से स्थिति का अनुमान नहीं लगाया गया है। कृपया iKhedut पोर्टल पर आधिकारिक ट्रैकिंग देखें।",
            "en": "Live application status is unavailable. No status was inferred from the application number. Please use the official tracking page on the iKhedut portal.",
        }.get(language)
    elif re.search(r"weather|forecast|હવામાન|વરસાદ|मौसम|बारिश", query):
        intent = "weather_unavailable"
        text = {
            "gu": "હવામાનની લાઇવ માહિતી આ સમયે ઉપલબ્ધ નથી. કૃપા કરીને સ્થાનિક હવામાન વિભાગ અથવા IMDની આગાહી તપાસો.",
            "hi": "लाइव मौसम जानकारी अभी उपलब्ध नहीं है। कृपया स्थानीय मौसम विभाग या IMD का पूर्वानुमान देखें।",
            "en": "Live weather information is unavailable. Please check the local weather department or IMD forecast.",
        }.get(language)
    elif re.search(r"mandi|market|price|rate|bhav|ભાવ|યાર્ડ|मंडी|भाव", query):
        intent = "market_prices_unavailable"
        text = {
            "gu": "APMCના લાઇવ બજાર ભાવ આ સમયે ઉપલબ્ધ નથી. કૃપા કરીને સંબંધિત APMC અથવા અધિકૃત બજાર બુલેટિન તપાસો.",
            "hi": "APMC के लाइव मंडी भाव अभी उपलब्ध नहीं हैं। कृपया संबंधित APMC या आधिकारिक बाजार बुलेटिन देखें।",
            "en": "Live APMC market prices are unavailable. Please check the relevant APMC or official market bulletin.",
        }.get(language)
    elif re.search(r"\bapply\b|\bapplication\b|\bform\b|અરજી|ફોર્મ|ભરવું", query):
        intent = "application_creation_unavailable"
        text = {
            "gu": "અધિકૃત અરજી અહીંથી બનાવાતી કે સબમિટ થતી નથી. કૃપા કરીને iKhedut પોર્ટલ પર તમારી સાચી વિગતો દાખલ કરીને અરજી કરો.",
            "hi": "यहाँ आधिकारिक आवेदन बनाया या जमा नहीं होता। कृपया iKhedut पोर्टल पर अपनी सही जानकारी भरें।",
            "en": "An official application cannot be created or submitted here. Enter your actual details on the iKhedut portal.",
        }.get(language)

    if not intent:
        return None

    return {
        "response_text": text
        or "This request is not available in the current assistant.",
        "language": language,
        "intent": intent,
        "matched_schemes": [],
        "citations": [],
    }
