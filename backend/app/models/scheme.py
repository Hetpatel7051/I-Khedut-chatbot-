from sqlalchemy import Column, String, Integer, JSON, Text, DateTime
from sqlalchemy.sql import func
from backend.app.core.database import Base

class SchemeModel(Base):
    __tablename__ = "schemes"

    id = Column(String(50), primary_key=True)
    name_en = Column(String(255), nullable=False)
    name_gu = Column(String(255), nullable=False)
    name_hi = Column(String(255), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    category_gu = Column(String(100), nullable=False)
    subsidy_percentage = Column(String(50), nullable=False)
    max_subsidy_amount = Column(Integer, nullable=False, default=0)
    subsidy_breakdown = Column(JSON, default=dict)
    eligibility_criteria_en = Column(JSON, default=list)
    eligibility_criteria_gu = Column(JSON, default=list)
    required_documents_en = Column(JSON, default=list)
    required_documents_gu = Column(JSON, default=list)
    application_url = Column(String(500), nullable=False)
    application_period = Column(String(200), nullable=True)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
