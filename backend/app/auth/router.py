from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.schemas import RegisterSchema, LoginSchema
from app.users.model import User
from app.auth.service import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# -------------------------------------------------
# CUSTOMER REGISTRATION
# -------------------------------------------------
@router.post(
    "/register",
    summary="Customer Registration",
    description=(
        "Public endpoint.\n\n"
        "Creates a CUSTOMER account.\n\n"
        "- Role is always set to `customer`\n"
        "- Client cannot choose role\n"
        "- Email must be unique\n\n"
        "To create an AGENT, an ADMIN must use `/users/create-agent`."
    ),
    status_code=status.HTTP_201_CREATED
)
def register_customer(
    data: RegisterSchema,
    db: Session = Depends(get_db)
):
    # 🔒 Prevent duplicate emails
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    user = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        role="customer"   # 🔐 enforced by backend
    )

    db.add(user)
    db.commit()

    return {"message": "Customer registered successfully"}


# -------------------------------------------------
# LOGIN (ADMIN / AGENT / CUSTOMER)
# -------------------------------------------------
@router.post("/login")
def login(
    data: LoginSchema,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }
