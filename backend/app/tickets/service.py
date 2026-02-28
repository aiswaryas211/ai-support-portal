import os
import shutil
import uuid
from sqlalchemy.orm import Session

from app.tickets.model import TicketAttachment, Ticket
from app.ai.services.summary_service import summarize_document

UPLOAD_DIR = "uploads"


def save_attachment(
    db: Session,
    ticket_id: int,
    file,
    uploaded_by: int,
):
    """
    Save uploaded file, create attachment record,
    generate AI summary, and store summary in ticket.
    """

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # unique filename to avoid overwrite
    unique_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # create attachment record
    attachment = TicketAttachment(
        ticket_id=ticket_id,
        file_path=file_path.replace("\\", "/"),
        file_type=file.content_type,
        uploaded_by=uploaded_by,
    )

    db.add(attachment)
    db.commit()
    db.refresh(attachment)

    # ---------- AI SUMMARY ----------
    try:
        summary = summarize_document(file_path)
        print("AI SUMMARY RESULT:", summary)

        if summary:
            ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
            if ticket:
                ticket.ai_summary = summary
                db.commit()
                db.refresh(ticket)

    except Exception as e:
        print("AI summary generation failed:", e)

    return attachment