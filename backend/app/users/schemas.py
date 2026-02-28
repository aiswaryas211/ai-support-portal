from pydantic import BaseModel
from typing import Dict


class AgentCreate(BaseModel):
    name: str
    email: str


class UserStatsResponse(BaseModel):
    total_users: int
    by_role: Dict[str, int]