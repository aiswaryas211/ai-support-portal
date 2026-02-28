from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user
from app.users.model import User

def require_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin only"
        )
    return user


def require_customer(user: User = Depends(get_current_user)):
    if user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer only"
        )
    return user


def require_agent(user: User = Depends(get_current_user)):
    if user.role != "agent":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent only"
        )
    return user
