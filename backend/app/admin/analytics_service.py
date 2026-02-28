from sqlalchemy.orm import Session
from sqlalchemy import func
from app.tickets.model import Ticket


def get_ticket_counts(db: Session):
    total = db.query(func.count(Ticket.id)).scalar()

    open_count = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.status == "open")
        .scalar()
    )

    closed_count = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.status == "closed")
        .scalar()
    )

    return {
        "total": total,
        "open": open_count,
        "closed": closed_count
    }


def get_priority_stats(db: Session):
    results = (
        db.query(Ticket.priority, func.count(Ticket.id))
        .group_by(Ticket.priority)
        .all()
    )

    return {priority: count for priority, count in results}


def get_queue_stats(db: Session):
    results = (
        db.query(Ticket.queue, func.count(Ticket.id))
        .group_by(Ticket.queue)
        .all()
    )

    return {queue or "Unassigned": count for queue, count in results}


def get_monthly_stats(db: Session):
    results = (
        db.query(
            func.strftime("%Y-%m", Ticket.created_at),
            func.count(Ticket.id)
        )
        .group_by(func.strftime("%Y-%m", Ticket.created_at))
        .all()
    )

    return {month: count for month, count in results}