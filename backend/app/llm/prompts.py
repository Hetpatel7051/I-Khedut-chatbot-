from pathlib import Path
from typing import Any, Dict
import json


def get_system_prompt(profile: Dict[str, Any], language: str = "gu") -> str:
    farmer_name = profile.get("name") or "ખેડૂત મિત્ર"
    farmer_district = profile.get("district")
    farmer_land = profile.get("land_size_acres", profile.get("land_size"))
    farmer_caste = profile.get("caste_category", profile.get("category"))
    profile_details = []
    if farmer_district:
        profile_details.append(f"District: {farmer_district}")
    if farmer_land is not None:
        profile_details.append(f"Landholding: {farmer_land} acres")
    if farmer_caste:
        profile_details.append(f"Category: {farmer_caste}")
    profile_summary = "; ".join(profile_details) or "No farmer details provided"

    # Load schemes data to inject into prompt
    schemes_text = ""
    try:
        schemes_path = (
            Path(__file__).resolve().parents[3]
            / "data_pipeline"
            / "sample_data"
            / "ikhedut_schemes.json"
        )
        if schemes_path.exists():
            with open(schemes_path, "r", encoding="utf-8") as f:
                schemes_data = json.load(f)
                for s in schemes_data:
                    schemes_text += f"- {s.get('name_en')} ({s.get('name_gu')}): {s.get('subsidy_percentage')}, max {s.get('max_subsidy_amount')}. Criteria: {', '.join(s.get('eligibility_criteria_en', []))}\n"
    except Exception as e:
        print("Could not load schemes for prompt:", e)
        pass

    prompt = f"""You are an agricultural information assistant for Gujarat farmers using the iKhedut portal.
Respond in the user's requested language: {language}. Address the farmer respectfully as {farmer_name}.
Known profile details: {profile_summary}.

The following is a bundled local reference catalog, not a live or independently verified government feed:
{schemes_text}

Accuracy rules:
- You may summarize catalog entries as catalog information, but say that rates, criteria, documents, and application periods must be confirmed on the current iKhedut portal or with the responsible department.
- Never say that the farmer is eligible, approved, verified, or guaranteed to receive a subsidy based only on profile details or this catalog.
- No live APMC price feed, weather provider, or application-status service is connected. For these requests, say current data cannot be retrieved. Do not estimate, reuse sample values, infer a status from an ID, or claim to have called an official source.
- No official source documents are supplied to you. Do not invent citations, official bulletins, or source attributions.
- If an image is supplied, describe only what is visibly readable. Do not certify authenticity, government validity, or application eligibility. If uncertain, say so plainly.
- If information is missing or contradictory, ask a clarifying question instead of filling gaps with assumptions.
- Keep responses concise, respectful, and clear.
"""
    return prompt
