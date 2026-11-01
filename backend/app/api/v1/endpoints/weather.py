from fastapi import APIRouter, HTTPException
from typing import Optional

router = APIRouter()


@router.get("")
async def get_weather(district: Optional[str] = None):
    location = district or "Gujarat"
    raise HTTPException(
        status_code=503,
        detail=f"Live weather data is unavailable for {location}; no forecast provider is configured.",
    )
