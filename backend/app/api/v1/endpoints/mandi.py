from fastapi import APIRouter, Query
from typing import Optional, List
from backend.app.services.mandi_service import fetch_mandi_prices

router = APIRouter()

@router.get("/prices")
async def get_mandi_prices(
    district: Optional[str] = None,
    market: Optional[str] = None,
    commodity: Optional[str] = None
):
    prices = await fetch_mandi_prices(market=market, commodity=commodity)
    return prices

@router.get("/markets")
async def get_markets():
    return [
        {"name": "Gondal", "district": "Rajkot"},
        {"name": "Rajkot", "district": "Rajkot"},
        {"name": "Unjha", "district": "Mehsana"},
        {"name": "Surat", "district": "Surat"},
        {"name": "Amreli", "district": "Amreli"}
    ]
