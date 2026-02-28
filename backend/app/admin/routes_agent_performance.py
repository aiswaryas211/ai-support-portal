from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.database.session import get_db
from app.tickets.model import Ticket

router = APIRouter(prefix="/admin", tags=["Admin Analytics"])


@router.get("/agent-performance/{agent_id}")
def agent_performance(agent_id: int, db: Session = Depends(get_db)):
    tickets = db.query(Ticket).filter(Ticket.assigned_to == agent_id).all()

    assigned = len(tickets)

    resolved = len([t for t in tickets if t.status == "resolved"])
    open_tickets = len([t for t in tickets if t.status == "open"])
    pending = len([t for t in tickets if t.status == "pending"])

    resolution_times = []

    for t in tickets:
        if t.status == "resolved" and t.resolved_at and t.created_at:
            diff = (t.resolved_at - t.created_at).total_seconds() / 3600
            resolution_times.append(diff)

    avg_resolution_time = (
        round(sum(resolution_times) / len(resolution_times), 2)
        if resolution_times
        else 0
    )

    efficiency = round((resolved / assigned) * 100, 2) if assigned else 0

    return {
        "assigned": assigned,
        "resolved": resolved,
        "open": open_tickets,
        "pending": pending,
        "avg_resolution_time": avg_resolution_time,
        "efficiency": efficiency,
    }