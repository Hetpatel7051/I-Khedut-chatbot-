from sqlalchemy import Column, String, Float, Boolean, JSON, DateTime, Integer
from sqlalchemy.sql import func
import uuid
from backend.app.core.database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True, index=True)
    district = Column(String(50), nullable=False, index=True)
    taluka = Column(String(50), nullable=True)
    village = Column(String(50), nullable=True)
    land_size_acres = Column(Float, nullable=False, default=0.0)
    land_unit = Column(String(20), default="acres")
    caste_category = Column(String(20), nullable=False, default="General") # General, OBC, SC, ST
    farmer_type = Column(String(30), nullable=False, default="small") # small, marginal, large, women
    primary_crops = Column(JSON, default=list) # e.g. ["Cotton", "Groundnut"]
    has_water_source = Column(Boolean, default=True)
    has_tractor = Column(Boolean, default=False)
    has_desi_cow = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
