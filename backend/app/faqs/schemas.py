from pydantic import BaseModel
from typing import Optional

# ======================
# BASE
# ======================
class FAQBase(BaseModel):
    category: str
    question: str
    answer: str


# ======================
# CREATE
# ======================
class FAQCreate(FAQBase):
    pass


# ======================
# UPDATE (PARTIAL UPDATE SAFE)
# ======================
class FAQUpdate(BaseModel):
    category: Optional[str] = None
    question: Optional[str] = None
    answer: Optional[str] = None


# ======================
# RESPONSE
# ======================

from datetime import datetime

class FAQResponse(BaseModel):
    id: int
    category: Optional[str] = None
    question: str
    answer: str
    created_at: datetime

    class Config:
        orm_mode = True