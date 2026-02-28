from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from sqlalchemy import func, extract
from app.tickets.service import save_attachment
from app.database.session import get_db
from app.tickets.model import Ticket, TicketMessage
from app.tickets.schemas import (
    TicketCreate,
    TicketResponse,
    TicketUpdate,
    AgentReply,
    TicketDetail
)
from app.users.model import User
from app.core.deps import (
    get_current_user,
    require_agent,
    require_admin
)

# NEW (AI SUMMARY SERVICE)
from app.ai.services.summary_service import summarize_document

router = APIRouter(prefix="/tickets", tags=["Tickets"])

from app.ai.services.classifier_service import classify_ticket

# # -------------------------------------------------
# # CLASSIFICATION (queue + priority)
# # -------------------------------------------------
# def classify_ticket(subject: str, description: str):
#     text = f"{subject} {description}".lower()

#     if any(k in text for k in ["wifi", "laptop", "network", "system"]):
#         queue = "IT"

#     elif any(k in text for k in ["salary", "leave", "hr"]):
#         queue = "HR"

#     elif any(k in text for k in ["invoice", "payment", "finance", "reimbursement", "bill"]):
#         queue = "Finance"

#     else:
#         queue = "Facilities"

#     if any(k in text for k in ["urgent", "down", "not working", "crash"]):
#         priority = "high"
#     elif any(k in text for k in ["slow", "issue", "problem"]):
#         priority = "medium"
#     else:
#         priority = "low"

#     return queue, priority
# -------------------------------------------------
# CREATE TICKET (CUSTOMER)
# -------------------------------------------------
@router.post("", response_model=TicketResponse)
def create_ticket(
    data: TicketCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "customer":
        raise HTTPException(403, "Only customers can create tickets")

    ticket_number = f"SUP-{datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}"
    queue, priority = classify_ticket(data.subject, data.description)
    # -------- ROUND ROBIN AGENT ASSIGNMENT (STABLE) --------
    agents = (
        db.query(User)
        .filter(User.role == "agent")
        .order_by(User.id)
        .all()
    )

    agent = None
    if agents:
        ticket_count = db.query(Ticket).count()
        agent = agents[ticket_count % len(agents)]
    # --------------------------------------------------------

    ticket = Ticket(
        ticket_number=ticket_number,
        subject=data.subject,
        description=data.description,
        customer_id=user.id,
        agent_id=agent.id if agent else None,
        status="open",
        priority=priority,
        queue=queue,
    )

    db.add(ticket)
    db.flush()

    db.add(
        TicketMessage(
            ticket_id=ticket.id,
            sender_id=user.id,
            sender_role="customer",
            message=data.description,
        )
    )

    db.commit()
    db.refresh(ticket)

    return ticket

# -------------------------------------------------
# CUSTOMER: VIEW MY TICKETS
# -------------------------------------------------
@router.get("/my", response_model=list[TicketResponse])
def my_tickets(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return (
        db.query(Ticket)
        .filter(Ticket.customer_id == user.id)
        .order_by(Ticket.created_at.desc())
        .all()
    )


# -------------------------------------------------
# AGENT: VIEW ASSIGNED TICKETS
# -------------------------------------------------
@router.get("/assigned", response_model=list[TicketResponse])
def assigned_tickets(
    db: Session = Depends(get_db),
    agent: User = Depends(require_agent),
):
    # Show ALL tickets to every agent (shared support queue)
    return (
        db.query(Ticket)
        .order_by(Ticket.created_at.desc())
        .all()
    )


# -------------------------------------------------
# VIEW TICKET DETAIL
# -------------------------------------------------
@router.get("/{ticket_id}", response_model=TicketDetail)
def ticket_detail(
    ticket_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    # ACCESS RULES
    # Admin → all tickets
    # Agent → all tickets (shared queue)
    # Customer → only their tickets
    if user.role == "customer" and ticket.customer_id != user.id:
        raise HTTPException(403, "Not allowed to view this ticket")

    # 🔹 Fetch customer name
    customer = db.query(User).filter(User.id == ticket.customer_id).first()
    ticket.customer_name = customer.name if customer else "Customer"

    return ticket

# -------------------------------------------------
# AGENT REPLY
# -------------------------------------------------
@router.post("/{ticket_id}/reply")
def reply_ticket(
    ticket_id: int,
    data: AgentReply,
    db: Session = Depends(get_db),
    agent: User = Depends(require_agent),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    db.add(
        TicketMessage(
            ticket_id=ticket.id,
            sender_id=agent.id,
            sender_role="agent",
            message=data.message,
        )
    )

    db.commit()
    return {"message": "Reply sent"}

# -------------------------------------------------
# CUSTOMER REPLY
# -------------------------------------------------
@router.post("/{ticket_id}/customer-reply")
def customer_reply(
    ticket_id: int,
    data: AgentReply,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    if ticket.customer_id != user.id:
        raise HTTPException(403, "Not your ticket")

    db.add(
        TicketMessage(
            ticket_id=ticket.id,
            sender_id=user.id,
            sender_role="customer",
            message=data.message,
        )
    )

    db.commit()
    return {"message": "Reply sent"}


# -------------------------------------------------
# AGENT UPDATE TICKET
# -------------------------------------------------
@router.patch("/{ticket_id}")
def update_ticket(
    ticket_id: int,
    data: TicketUpdate,
    db: Session = Depends(get_db),
    agent: User = Depends(require_agent),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    if data.status:
        ticket.status = data.status

        if data.status == "resolved":
            ticket.closed_at = datetime.utcnow()
            ticket.resolved_by = agent.id  # ← IMPORTANT FIX

    if data.priority:
        ticket.priority = data.priority

    if data.queue:
        ticket.queue = data.queue

    db.commit()
    return {"message": "Ticket updated"}


# -------------------------------------------------
# AGENT AHT
# -------------------------------------------------
@router.get("/agent/aht")
def agent_aht(
    db: Session = Depends(get_db),
    agent: User = Depends(require_agent),
):
    tickets = (
        db.query(Ticket)
        .filter(
            Ticket.resolved_by == agent.id,
            Ticket.closed_at.isnot(None)
        )
        .all()
    )

    if not tickets:
        return {"aht_minutes": 0}

    total = sum(
        (t.closed_at - t.created_at).total_seconds()
        for t in tickets
    )

    avg_minutes = (total / len(tickets)) / 60
    return {"aht_minutes": round(avg_minutes, 2)}


# -------------------------------------------------
# ADMIN MONITORING
# -------------------------------------------------
@router.get("/all")
def all_tickets(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return db.query(Ticket).order_by(Ticket.created_at.desc()).all()


# -------------------------------------------------
# ADMIN AGENT PERFORMANCE
# -------------------------------------------------
@router.get("/admin/agent-performance")
def agent_performance(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    agents = db.query(User).filter(User.role == "agent").all()

    result = []

    for agent in agents:
        resolved = db.query(Ticket).filter(
            Ticket.resolved_by == agent.id
        ).all()

        open_count = db.query(TicketMessage).filter(
            TicketMessage.sender_id == agent.id,
            TicketMessage.sender_role == "agent"
        ).count()

        pending = db.query(Ticket).filter(
            Ticket.status == "in_progress",
            Ticket.resolved_by == agent.id
        ).count()

        avg_time = 0
        if resolved:
            total = sum(
                (t.closed_at - t.created_at).total_seconds()
                for t in resolved if t.closed_at
            )
            avg_time = round((total / len(resolved)) / 60, 2)

        result.append({
            "agent_id": agent.id,
            "agent": agent.name,
            "handled": open_count + len(resolved),
            "resolved": len(resolved),
            "open": open_count,
            "pending": pending,
            "avg_resolution_minutes": avg_time,
        })

    return result


# -------------------------------------------------
# CUSTOMER FILE UPLOAD (AI SUMMARY TRIGGER)
# -------------------------------------------------
@router.post("/{ticket_id}/upload")
def upload_attachment(
    ticket_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    if ticket.customer_id != user.id:
        raise HTTPException(403, "Not your ticket")

    attachment = save_attachment(
        db=db,
        ticket_id=ticket_id,
        file=file,
        uploaded_by=user.id,
    )

    # IMPORTANT FIX
    ticket.attachment = attachment.file_path
    db.commit()
    db.refresh(ticket)

    return {"message": "File uploaded", "path": attachment.file_path}


@router.put("/{ticket_id}")
def customer_edit_ticket(
    ticket_id: int,
    data: TicketCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    if ticket.customer_id != user.id:
        raise HTTPException(403, "Not your ticket")

    if ticket.status != "open":
        raise HTTPException(400, "Only open tickets can be edited")

    ticket.subject = data.subject
    ticket.description = data.description

    db.commit()
    return {"message": "Ticket updated"}

@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    if ticket.customer_id != user.id:
        raise HTTPException(403, "Not your ticket")

    if ticket.status != "open":
        raise HTTPException(400, "Only open tickets can be deleted")

    db.delete(ticket)
    db.commit()

    return {"message": "Ticket deleted"}


@router.get("/status-summary")
def ticket_status_summary(db: Session = Depends(get_db)):
    open_count = db.query(Ticket).filter(Ticket.status == "open").count()
    in_progress_count = db.query(Ticket).filter(Ticket.status == "in_progress").count()
    resolved_count = db.query(Ticket).filter(Ticket.status == "resolved").count()

    return {
        "open": open_count,
        "in_progress": in_progress_count,
        "resolved": resolved_count,
    }

# -------------------------------------------------
# AGENT MONTHLY TICKET STATS (DASHBOARD CHART)
# -------------------------------------------------
@router.get("/stats/monthly")
def monthly_ticket_stats(
    db: Session = Depends(get_db),
    agent: User = Depends(require_agent),
):
    rows = (
        db.query(
            extract("month", Ticket.created_at).label("month"),
            func.count(Ticket.id)
        )
        .filter(Ticket.resolved_by == agent.id)
        .group_by("month")
        .all()
    )

    # 3-letter month names
    month_names = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ]

    counts = {int(r[0]): r[1] for r in rows}

    result = [
        {"month": month_names[i-1], "tickets": counts.get(i, 0)}
        for i in range(1, 13)
    ]

    return result


# -------------------------------------------------
# ADMIN: SINGLE AGENT PERFORMANCE
# -------------------------------------------------
@router.get("/admin/agent-performance/{agent_id}")
def single_agent_performance(
    agent_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    # ---------- RESOLVED ----------
    resolved_tickets = db.query(Ticket).filter(
        Ticket.resolved_by == agent_id
    ).all()
    resolved = len(resolved_tickets)

    # ---------- OPEN (agent activity in queue) ----------
    open_count = db.query(TicketMessage).filter(
        TicketMessage.sender_id == agent_id,
        TicketMessage.sender_role == "agent"
    ).count()

    # ---------- AVG RESOLUTION TIME ----------
    avg_time = 0
    if resolved_tickets:
        total_seconds = sum(
            (t.closed_at - t.created_at).total_seconds()
            for t in resolved_tickets if t.closed_at
        )
        avg_time = round((total_seconds / len(resolved_tickets)) / 3600, 2)

    # ---------- EFFICIENCY ----------
    total = resolved + open_count
    efficiency = round((resolved / total) * 100, 2) if total else 0

    return {
        "resolved": resolved,
        "open": open_count,
        "avg_resolution_time": avg_time,
        "efficiency": efficiency,
    }