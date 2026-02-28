from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.users.model import User
from app.faqs.model import FAQ
from app.kb.model import KBDocument

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


@router.get("/dashboard-stats")
def dashboard_stats(db: Session = Depends(get_db)):
    agents = db.query(User).filter(User.role == "agent").count()
    faqs = db.query(FAQ).count()
    kb_docs = db.query(KBDocument).count()

    return {
        "agents": agents,
        "faqs": faqs,
        "kb": kb_docs,
        "tickets": 0
    }