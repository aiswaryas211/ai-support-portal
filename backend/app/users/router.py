from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.users.schemas import AgentCreate
from app.users.model import User
from app.auth.service import hash_password
from app.core.deps import require_admin

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# ---------------- CREATE AGENT ----------------
@router.post("/create-agent", status_code=status.HTTP_201_CREATED)
def create_agent(
    data: AgentCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already exists.")

    agent_count = db.query(User).filter(User.role == "agent").count() + 1
    auto_password = f"agent{agent_count:03d}"

    agent = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(auto_password),
        role="agent",
        is_active=True,
        temp_password=auto_password
    )

    db.add(agent)
    db.commit()


    return {
        "message": "Agent created successfully",
        "generated_password": auto_password
    }

# ---------------- GET AGENTS ----------------
@router.get("/agents")
def get_agents(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    agents = db.query(User).filter(User.role == "agent").all()

    return [
        {
            "id": a.id,
            "name": a.name,
            "email": a.email,
            "is_active": a.is_active,
            "password": a.temp_password,
        }
        for a in agents
    ]

@router.put("/agents/{agent_id}")
def update_agent(
    agent_id: int,
    data: AgentCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    agent = db.query(User).filter(User.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent.name = data.name
    agent.email = data.email
    db.commit()

    return {"message": "Agent updated"}


@router.delete("/agents/{agent_id}")
def delete_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    agent = db.query(User).filter(User.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    db.delete(agent)
    db.commit()

    return {"message": "Agent deleted"}


# ---------------- USER STATS ----------------
@router.get("/stats")
def user_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    total = db.query(User).count()

    by_role = (
        db.query(User.role, func.count(User.id))
        .group_by(User.role)
        .all()
    )

    return {
        "total_users": total,
        "by_role": {role: count for role, count in by_role}
    }