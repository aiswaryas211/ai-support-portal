from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base

class KBDocument(Base):
    __tablename__ = "kb_documents"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)

    # NEW FIELDS
    chunk_count = Column(Integer, default=0)
    status = Column(String(20), default="Processing", nullable=False)
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship(
        "KBChunk",
        back_populates="document",
        cascade="all, delete-orphan"
    )

class KBChunk(Base):
    __tablename__ = "kb_chunks"
    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("kb_documents.id"))
    content = Column(Text, nullable=False)
    document = relationship("KBDocument", back_populates="chunks")
