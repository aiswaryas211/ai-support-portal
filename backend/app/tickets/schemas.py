from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# -----------------------------
# CREATE
# -----------------------------
class TicketCreate(BaseModel):
    subject: str
    description: str


# -----------------------------
# MESSAGE
# -----------------------------
class TicketMessageOut(BaseModel):
    id: int
    sender_id: int
    sender_role: str
    message: str
    created_at: datetime

    class Config:
        orm_mode = True


# -----------------------------
# BASE
# -----------------------------
class TicketBase(BaseModel):
    ticket_number: str
    subject: str
    status: str
    priority: str
    queue: str
    customer_id: int
    agent_id: Optional[int]
    created_at: datetime
    closed_at: Optional[datetime]

    class Config:
        orm_mode = True


# -----------------------------
# RESPONSE
# -----------------------------
class TicketResponse(TicketBase):
    id: int


class AttachmentOut(BaseModel):
    id: int
    file_path: str
    file_type: str

    class Config:
        orm_mode = True
# -----------------------------
# DETAIL (Agent / Admin)
# -----------------------------
class TicketDetail(TicketBase):
    id: int
    messages: List[TicketMessageOut]
    ai_summary: Optional[str]
    attachments: List[AttachmentOut] = []
    last_updated: Optional[datetime]
    customer_name: Optional[str] = None





    class Config:
        orm_mode = True

# -----------------------------
# UPDATE
# -----------------------------
class TicketUpdate(BaseModel):
    status: Optional[str]
    priority: Optional[str]
    queue: Optional[str]


# -----------------------------
# AGENT REPLY
# -----------------------------
class AgentReply(BaseModel):
    message: str


# -----------------------------
# ADMIN ASSIGN
# -----------------------------
class AssignTicket(BaseModel):
    agent_id: int

# -----------------------------
# KB FALLBACK
# -----------------------------
class KBTicketCreate(BaseModel):
    question: str

