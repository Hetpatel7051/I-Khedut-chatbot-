from sqlalchemy import Column, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
import uuid
from backend.app.core.database import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farmer_id = Column(String(36), ForeignKey("farmers.id"), nullable=True)
    language = Column(String(10), default="gu")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("chat_sessions.id"), nullable=False, index=True)
    sender = Column(String(20), nullable=False) # 'user' | 'assistant'
    content = Column(Text, nullable=False)
    language = Column(String(10), default="gu")
    matched_scheme_ids = Column(JSON, default=list)
    intent = Column(String(50), nullable=True)
    citations = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
