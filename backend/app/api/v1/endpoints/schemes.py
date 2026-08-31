from fastapi import APIRouter
from typing import Optional

router = APIRouter()

@router.get("")
async def get_schemes(category: Optional[str] = None, search: Optional[str] = None):
    # This is a stub so the UI doesn't 404 when it fetches.
    # The actual data is bundled in the frontend in src/data/schemes.ts anyway
    return []
