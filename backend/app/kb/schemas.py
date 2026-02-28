from pydantic import BaseModel
from typing import Optional, List


class KBDocumentCreate(BaseModel):
    title: str
    category: Optional[str]
    description: Optional[str]


class KBDocumentResponse(BaseModel):
    id: int
    title: str
    category: Optional[str]
    description: Optional[str]
    is_active: bool

    class Config:
        orm_mode = True


class KBQueryRequest(BaseModel):
    question: str


class KBSource(BaseModel):
    document_title: str
    content: str


class KBQueryResponse(BaseModel):
    answer: str
    confidence: str
    sources: List[KBSource]
