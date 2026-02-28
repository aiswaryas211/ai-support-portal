from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.faqs.model import FAQ
from app.faqs.schemas import FAQCreate, FAQUpdate, FAQResponse
from app.core.deps import require_admin

router = APIRouter(prefix="/faqs", tags=["FAQs"])


# CUSTOMER: VIEW FAQs
@router.get("", response_model=list[FAQResponse])
def list_faqs(db: Session = Depends(get_db)):
    return (
        db.query(FAQ)
        .filter(FAQ.category.isnot(None))
        .order_by(FAQ.created_at.desc())
        .all()
    )


# ADMIN: CREATE FAQ
@router.post("", response_model=FAQResponse, dependencies=[Depends(require_admin)])
def create_faq(payload: FAQCreate, db: Session = Depends(get_db)):
    faq = FAQ(**payload.dict())
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq


# ADMIN: UPDATE FAQ
@router.put("/{faq_id}", response_model=FAQResponse, dependencies=[Depends(require_admin)])
def update_faq(faq_id: int, payload: FAQUpdate, db: Session = Depends(get_db)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(faq, key, value)

    db.commit()
    db.refresh(faq)
    return faq


# ADMIN: DELETE FAQ
@router.delete("/{faq_id}", dependencies=[Depends(require_admin)])
def delete_faq(faq_id: int, db: Session = Depends(get_db)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    db.delete(faq)
    db.commit()
    return {"message": "FAQ deleted"}