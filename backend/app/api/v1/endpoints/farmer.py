from fastapi import APIRouter, HTTPException
import uuid
from backend.app.schemas.farmer import FarmerCreate, FarmerResponse

router = APIRouter()

# In-memory storage with fallback for fast container execution
FARMERS_DB = {}

@router.post("/profile", response_model=FarmerResponse)
async def create_or_update_farmer_profile(profile: FarmerCreate):
    """Save or update farmer landholding, category, and district parameters."""
    farmer_id = profile.id or str(uuid.uuid4())
    data = profile.dict()
    data["id"] = farmer_id
    FARMERS_DB[farmer_id] = data
    return FarmerResponse(**data)

@router.get("/profile/{farmer_id}", response_model=FarmerResponse)
async def get_farmer_profile(farmer_id: str):
    """Retrieve saved farmer context."""
    if farmer_id in FARMERS_DB:
        return FarmerResponse(**FARMERS_DB[farmer_id])
    # Default initial profile
    return FarmerResponse(
        id=farmer_id,
        name="ખેડૂત મિત્ર (Farmer)",
        district="Rajkot",
        land_size_acres=3.5,
        land_unit="acres",
        caste_category="General",
        farmer_type="small",
        primary_crops=["Cotton", "Groundnut"],
        has_water_source=True,
        has_tractor=False,
        has_desi_cow=False
    )
