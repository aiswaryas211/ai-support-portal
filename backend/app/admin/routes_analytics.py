from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.users.model import User
from app.tickets.model import Ticket

router = APIRouter(prefix="/admin", tags=["Admin Analytics"])


@router.get("/agent-performance-summary")
def agent_performance_summary(db: Session = Depends(get_db)):
    agents = db.query(User).filter(User.role == "agent").all()

    result = []

    for agent in agents:
        assigned = (
            db.query(func.count(Ticket.id))
            .filter(Ticket.agent_id == agent.id)
            .scalar()
        )

        resolved = (
            db.query(func.count(Ticket.id))
            .filter(
                Ticket.agent_id == agent.id,
                Ticket.status == "resolved"
            )
            .scalar()
        )

        efficiency = (resolved / assigned * 100) if assigned else 0

        result.append({
            "id": agent.id,
            "name": agent.name or agent.email,
            "assigned": assigned,
            "resolved": resolved,
            "efficiency": round(efficiency, 1),
        })

    return result