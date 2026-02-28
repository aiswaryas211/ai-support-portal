from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.tickets.model import Ticket

router = APIRouter(prefix="/analytics", tags=["Ticket Analytics"])


@router.get("/ticket-status")
def ticket_status_distribution(db: Session = Depends(get_db)):
    open_count = db.query(Ticket).filter(Ticket.status == "open").count()
    in_progress_count = db.query(Ticket).filter(Ticket.status == "in_progress").count()
    resolved_count = db.query(Ticket).filter(Ticket.status == "resolved").count()

    return {
        "open": open_count,
        "in_progress": in_progress_count,
        "resolved": resolved_count,
    }