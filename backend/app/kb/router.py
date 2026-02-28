from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
import os, shutil

from app.database.session import get_db
from app.kb.model import KBDocument
from app.kb.service import ingest_document, answer_question
from app.core.deps import require_admin

router = APIRouter(prefix="/kb", tags=["Knowledge Base"])

# ---------------------------
# ADMIN: Upload document
# ---------------------------

@router.post("/documents", dependencies=[Depends(require_admin)])
def upload_document(
    title: str = Form(...),
    category: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    print("UPLOAD STARTED")

    os.makedirs("uploads", exist_ok=True)
    path = f"uploads/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print("FILE SAVED:", path)

    doc = KBDocument(
        title=title,
        category=category,
        file_path=path,
        file_type=file.filename.split(".")[-1],
        status="Processing"
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    print("DB RECORD CREATED:", doc.id)

    try:
        print("CALLING INGEST...")
        ingest_document(db, doc)
        print("INGEST COMPLETED")
    except Exception as e:
        print("INGEST ERROR:", e)
        doc.status = "Failed"
        db.commit()

    return {"message": "Document uploaded and indexed"}


# ---------------------------
# ADMIN: List documents
# ---------------------------
@router.get("/documents", dependencies=[Depends(require_admin)])
def list_documents(db: Session = Depends(get_db)):
    return db.query(KBDocument).all()


@router.delete("/documents/{doc_id}", dependencies=[Depends(require_admin)])
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(KBDocument).filter(KBDocument.id == doc_id).first()

    if not doc:
        return {"error": "Document not found"}

    if doc.file_path and os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    db.delete(doc)
    db.commit()

    return {"message": "Document deleted"}


@router.put("/documents/{doc_id}", dependencies=[Depends(require_admin)])
def update_document(doc_id: int, payload: dict, db: Session = Depends(get_db)):
    doc = db.query(KBDocument).filter(KBDocument.id == doc_id).first()

    if not doc:
        return {"error": "Document not found"}

    doc.title = payload.get("title", doc.title)
    doc.category = payload.get("category", doc.category)

    db.commit()
    db.refresh(doc)

    return doc


# ---------------------------
# PUBLIC: Ask KB (CHATBOT)
# ---------------------------
@router.post("/ask")
def ask_kb(payload: dict, db: Session = Depends(get_db)):
    raw_question = payload.get("question", "").strip()

    if not raw_question:
        return {
            "answer": "Please enter a question.",
            "intent": "empty",
            "suggest_ticket": False
        }

    normalized = raw_question.lower()

    # ---------------------------
    # GREETINGS (IMPROVED)
    # ---------------------------
    GREETINGS = {
        "hi", "hii", "hiii",
        "hello", "helo", "hlo",
        "hey", "heyy",
        "hy", "hai",
        "gm", "gn",
        "good morning",
        "good afternoon",
        "good evening"
    }

    if normalized in GREETINGS or normalized.startswith(("hi", "he", "ha")):
        return {
            "answer": "Hi 👋 How can I help you today?",
            "intent": "greeting",
            "confidence": 1.0,
            "suggest_ticket": False
        }

    # ---------------------------
    # SMALL TALK
    # ---------------------------
    SMALL_TALK = {
        "ok": "Alright 👍 Let me know if you need anything else.",
        "okay": "Alright 👍 Let me know if you need anything else.",
        "thanks": "You're welcome 🙂",
        "thank you": "You're welcome 🙂",
        "thankyou": "You're welcome 🙂",
        "bye": "Goodbye 👋",
        "no": "Alright 👍 Let me know if you need help later."
    }

    if normalized in SMALL_TALK:
        return {
            "answer": SMALL_TALK[normalized],
            "intent": "small_talk",
            "confidence": 1.0,
            "suggest_ticket": False
        }

    # ---------------------------
    # LLM + RAG ANSWER
    # ---------------------------
    return answer_question(db, raw_question)


# ---------------------------
# PUBLIC: List KB articles
# ---------------------------
@router.get("/public")
def public_kb_articles(db: Session = Depends(get_db)):
    docs = db.query(KBDocument).all()

    result = []

    for d in docs:
        preview = ""

        try:
            if d.file_path and os.path.exists(d.file_path):
                with open(d.file_path, "r", encoding="utf-8", errors="ignore") as f:
                    preview = f.read(800)  # preview only
        except Exception:
            preview = ""

        result.append({
            "id": d.id,
            "title": d.title,
            "category": d.category,
            "content": preview
        })

    return result