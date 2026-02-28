from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.users.model import User
from app.admin.schemas import AdminCreateUser, UpdateUserRole, FAQCreate
from app.core.security import require_admin, hash_password
from app.admin.model import FAQ

from app.admin.analytics_service import (
    get_ticket_counts,
    get_priority_stats,
    get_queue_stats,
    get_monthly_stats
)

router = APIRouter(prefix="/admin", tags=["Admin"])

# ===============================
# CREATE AGENT / ADMIN
# ===============================
@router.post("/users", dependencies=[Depends(require_admin)])
def create_user_by_admin(
    payload: AdminCreateUser,
    db: Session = Depends(get_db)
):
    if payload.role not in ["admin", "agent"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role
    )

    db.add(user)
    db.commit()

    return {"message": f"{payload.role} created successfully"}


# ===============================
# UPDATE USER ROLE
# ===============================
@router.put("/users/{user_id}/role", dependencies=[Depends(require_admin)])
def update_user_role(
    user_id: int,
    payload: UpdateUserRole,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = payload.role
    db.commit()

    return {"message": "User role updated", "role": user.role}


# ===============================
# FAQ CRUD
# ===============================
@router.get("/faqs", dependencies=[Depends(require_admin)])
def list_faqs(db: Session = Depends(get_db)):
    return db.query(FAQ).all()


@router.post("/faqs", dependencies=[Depends(require_admin)])
def create_faq(payload: FAQCreate, db: Session = Depends(get_db)):
    faq = FAQ(**payload.dict())
    db.add(faq)
    db.commit()
    return {"message": "FAQ created"}


@router.delete("/faqs/{faq_id}", dependencies=[Depends(require_admin)])
def delete_faq(faq_id: int, db: Session = Depends(get_db)):
    faq = db.query(FAQ).get(faq_id)

    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    db.delete(faq)
    db.commit()

    return {"message": "FAQ deleted"}


@router.get("/analytics", dependencies=[Depends(require_admin)])
def admin_analytics(db: Session = Depends(get_db)):
    return {
        "counts": get_ticket_counts(db),
        "priority": get_priority_stats(db),
        "queue": get_queue_stats(db),
        "monthly": get_monthly_stats(db),
    }

@router.post("/create-agent", dependencies=[Depends(require_admin)])
def create_agent_auto(
    payload: AdminCreateUser,
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    new_agent = User(
        name=payload.name,
        email=payload.email,
        role="agent",
        is_active=True,

    )

    db.add(new_agent)
    db.flush()  # get ID

    generated_password = f"agent{new_agent.id:03}"
    new_agent.hashed_password = hash_password(generated_password)

    db.commit()
    db.refresh(new_agent)

    return {
        "message": "Agent created",
        "generated_password": generated_password,
    }
