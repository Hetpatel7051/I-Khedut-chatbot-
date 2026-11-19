import re
from typing import Any, Dict

from backend.app.rag.retriever import retrieve_schemes


def _format_amount(amount: int) -> str:
    return f"₹{amount:,.0f}"


def _catalog_disclaimer(language: str) -> str:
    if language == "gu":
        return "આ માહિતી સ્થાનિક સંદર્ભ કેટલોગમાંથી છે; તે હાલના સરકારી દર, તમારી પાત્રતા અથવા મંજૂરીની પુષ્ટિ નથી. અરજી પહેલાં iKhedut પોર્ટલ અથવા સંબંધિત વિભાગમાં હાલના નિયમો ચકાસો."
    if language == "hi":
        return "यह जानकारी स्थानीय संदर्भ सूची से है; यह वर्तमान सरकारी दर, आपकी पात्रता या स्वीकृति की पुष्टि नहीं है। आवेदन से पहले iKhedut पोर्टल या संबंधित विभाग से मौजूदा नियम जाँचें।"
    return "This information comes from the local reference catalog; it does not confirm current government rates, your eligibility, or approval. Check current rules with iKhedut or the responsible department before applying."


def _unmatched_response(language: str) -> Dict[str, Any]:
    text = {
        "gu": "મને સ્થાનિક યોજના કેટલોગમાં મેળ ખાતી માહિતી મળી નથી. યોજનાનું નામ અથવા કૃષિ સાધન/વિભાગનું નામ વધુ ચોક્કસ રીતે લખો.",
        "hi": "स्थानीय योजना सूची में मेल खाती जानकारी नहीं मिली। कृपया योजना, कृषि उपकरण या विभाग का अधिक सटीक नाम लिखें।",
        "en": "I could not find a matching entry in the local scheme catalog. Please specify the scheme, farm equipment, or department more precisely.",
    }.get(
        language,
        "No matching entry was found in the local scheme catalog. Please be more specific.",
    )
    return {
        "response_text": text,
        "language": language,
        "intent": "scheme_not_found",
        "matched_schemes": [],
        "citations": [],
    }


def answer_from_rag(
    message: str,
    profile: Dict[str, Any] | None = None,
    language: str = "gu",
) -> Dict[str, Any]:
    query = message.strip()
    profile = profile or {}

    if re.search(r"(^|\s)(hello|hi|નમસ્તે|હાય)(\s|$|[!?.,])", query, re.IGNORECASE):
        greeting = {
            "gu": "નમસ્તે! હું સ્થાનિક iKhedut સંદર્ભ કેટલોગમાં યોજના શોધી શકું છું. કઈ યોજના વિશે જાણવું છે?",
            "hi": "नमस्ते! मैं स्थानीय iKhedut संदर्भ सूची में योजनाएँ खोज सकता हूँ। आप किस योजना के बारे में जानना चाहते हैं?",
            "en": "Hello! I can search the local iKhedut scheme catalog. Which scheme would you like to ask about?",
        }.get(language, "Hello! Which scheme would you like to ask about?")
        return {
            "response_text": greeting,
            "language": language,
            "intent": "category_greeting",
            "matched_schemes": [],
            "citations": [],
            "show_category_chips": True,
        }

    if re.search(
        r"\b(profile|who am i|my details)\b|પ્રોફાઈલ|પ્રોફાઇલ|મારું નામ",
        query,
        re.IGNORECASE,
    ):
        details = []
        if profile.get("name"):
            details.append(f"Name: {profile['name']}")
        if profile.get("district"):
            details.append(f"District: {profile['district']}")
        if profile.get("land_size_acres") is not None:
            details.append(f"Landholding: {profile['land_size_acres']} acres")
        if profile.get("caste_category"):
            details.append(f"Category: {profile['caste_category']}")
        if not details:
            return _unmatched_response(language)
        return {
            "response_text": "\n".join(details),
            "language": language,
            "intent": "profile_summary",
            "matched_schemes": [],
            "citations": [],
        }

    schemes = retrieve_schemes(query, limit=1)
    if not schemes:
        return _unmatched_response(language)

    scheme = schemes[0]
    name = (
        scheme.get("name_gu")
        if language == "gu"
        else (scheme.get("name_hi") if language == "hi" else scheme.get("name_en"))
    )
    documents = (
        scheme.get("required_documents_gu", [])
        if language == "gu"
        else scheme.get("required_documents_en", [])
    )
    criteria = (
        scheme.get("eligibility_criteria_gu", [])
        if language == "gu"
        else scheme.get("eligibility_criteria_en", [])
    )
    disclaimer = _catalog_disclaimer(language)
    subsidy = scheme.get("subsidy_percentage")
    maximum = scheme.get("max_subsidy_amount")

    if language == "gu":
        parts = [f"**{name}**", disclaimer]
        if subsidy or maximum is not None:
            rate = f"કેટલોગમાં દર્શાવેલો સંભવિત દર: {subsidy or 'ઉલ્લેખિત નથી'}"
            if maximum is not None:
                rate += f"; મહત્તમ મર્યાદા: {_format_amount(maximum)}"
            parts.append(rate)
        if criteria:
            parts.append(
                "કેટલોગમાં દર્શાવેલી પાત્રતા:\n"
                + "\n".join(f"• {item}" for item in criteria)
            )
        if documents:
            parts.append(
                "કેટલોગમાં દર્શાવેલા જરૂરી કાગળો:\n"
                + "\n".join(f"• {item}" for item in documents)
            )
        parts.append(
            f"અધિકૃત અરજી અને હાલની વિગતો: {scheme.get('application_url', 'iKhedut પોર્ટલ')}"
        )
    elif language == "hi":
        parts = [f"**{name}**", disclaimer]
        if subsidy or maximum is not None:
            rate = f"सूची में संभावित सहायता दर: {subsidy or 'उल्लेख नहीं'}"
            if maximum is not None:
                rate += f"; अधिकतम सीमा: {_format_amount(maximum)}"
            parts.append(rate)
        if criteria:
            parts.append(
                "सूची में दी गई पात्रता:\n" + "\n".join(f"• {item}" for item in criteria)
            )
        if documents:
            parts.append(
                "सूची में दिए गए दस्तावेज़:\n" + "\n".join(f"• {item}" for item in documents)
            )
        parts.append(
            f"आधिकारिक आवेदन और वर्तमान जानकारी: {scheme.get('application_url', 'iKhedut पोर्टल')}"
        )
    else:
        parts = [f"**{name}**", disclaimer]
        if subsidy or maximum is not None:
            rate = f"Possible rate listed in catalog: {subsidy or 'not listed'}"
            if maximum is not None:
                rate += f"; maximum cap: {_format_amount(maximum)}"
            parts.append(rate)
        if criteria:
            parts.append(
                "Eligibility listed in catalog:\n"
                + "\n".join(f"• {item}" for item in criteria)
            )
        if documents:
            parts.append(
                "Documents listed in catalog:\n"
                + "\n".join(f"• {item}" for item in documents)
            )
        parts.append(
            f"Official application and current details: {scheme.get('application_url', 'iKhedut portal')}"
        )

    return {
        "response_text": "\n\n".join(parts),
        "language": language,
        "intent": "scheme_inquiry",
        "matched_schemes": [scheme],
        "citations": [],
    }
