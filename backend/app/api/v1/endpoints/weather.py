from fastapi import APIRouter
from typing import Optional

router = APIRouter()

@router.get("")
async def get_weather(district: Optional[str] = None):
    return {
        "location": f"{district or 'Gujarat'} Region",
        "temperature_c": 32,
        "humidity_percent": 45,
        "wind_speed_kmh": 14,
        "rain_probability_percent": 0,
        "forecast_summary": "Clear skies and dry weather expected for the next 48 hours.",
        "forecast_summary_gu": "સ્વચ્છ આકાશ, આજે અને આવતીકાલે વરસાદની કોઈ શક્યતા નથી."
    }
