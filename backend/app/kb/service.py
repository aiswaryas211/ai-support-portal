# app/kb/service.py

from sqlalchemy.orm import Session
from groq import Groq
import os
import requests

from app.kb.ingestion import extract_text, chunk_text
from app.kb.vector_store import add_chunks, query_chunks
from app.kb.model import KBChunk

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

print("🔑 GROQ_API_KEY from env:", os.getenv("GROQ_API_KEY"))

# ---------------------------
# SIMPLE SESSION MEMORY
# ---------------------------
LAST_TECH_ISSUE = None
LAST_OS = "windows"

# ---------------------------
# YOUTUBE HELPER
# ---------------------------
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def get_youtube_videos(query: str, limit=2):
    try:
        url = "https://www.googleapis.com/youtube/v3/search"

        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": limit,
            "key": YOUTUBE_API_KEY,
        }

        res = requests.get(url, params=params).json()

        videos = []
        for item in res.get("items", []):
            video_id = item["id"]["videoId"]
            videos.append(f"https://www.youtube.com/watch?v={video_id}")

        return videos

    except Exception as e:
        print("YouTube API error:", e)
        return []


# ---------------------------
# OS DETECTION
# ---------------------------
def detect_os(text: str):
    text = text.lower()

    if "mac" in text or "macbook" in text or "macos" in text:
        return "mac"
    if "linux" in text or "ubuntu" in text:
        return "linux"

    return "windows"


# ---------------------------
# VIDEO INTENT DETECTION
# ---------------------------
def is_video_request(text: str):
    text = text.lower()
    video_words = ["video", "youtube", "tutorial", "watch", "show video"]
    return any(w in text for w in video_words)


# ---------------------------
# EXTRACT VIDEO TOPIC
# ---------------------------
def extract_video_topic(text):
    text = text.lower()
    for w in ["video", "youtube", "tutorial", "show", "give", "watch"]:
        text = text.replace(w, "")
    return text.strip()


# ---------------------------
# INGEST DOCUMENT
# ---------------------------
def ingest_document(db: Session, doc):
    try:
        text = extract_text(doc.file_path, doc.file_type)

        if not text or len(text.strip()) == 0:
            doc.status = "Failed (no text)"
            db.commit()
            return

        chunks = chunk_text(text)

        for chunk in chunks:
            db.add(KBChunk(document_id=doc.id, content=chunk))

        db.commit()

        metadata = [
            {
                "title": doc.title,
                "category": doc.category,
                "document_id": doc.id,
            }
            for _ in chunks
        ]

        add_chunks(chunks, metadata)

        doc.chunk_count = len(chunks)
        doc.status = "Indexed"
        db.commit()

        print(f"✅ KB indexed: {doc.title} ({len(chunks)} chunks)")

    except Exception as e:
        print("INGEST ERROR:", e)
        doc.status = "Failed"
        db.commit()


# ---------------------------
# ANSWER QUESTION
# ---------------------------
def answer_question(db: Session, question: str):
    global LAST_TECH_ISSUE, LAST_OS

    # ---------------------------
    # VIDEO REQUEST HANDLING
    # ---------------------------
    if is_video_request(question):
        topic = extract_video_topic(question)

        if not topic and LAST_TECH_ISSUE:
            topic = LAST_TECH_ISSUE
            os_type = LAST_OS
        else:
            os_type = detect_os(topic)

        if topic:
            videos = get_youtube_videos(topic + f" {os_type} fix tutorial")

            return {
                "answer": "Here’s a tutorial that may help:",
                "videos": videos,
                "intent": "video",
                "source": "youtube",
                "confidence": 1.0,
                "suggest_ticket": False
            }

    # ---------------------------
    # VECTOR SEARCH
    # ---------------------------
    result = query_chunks(question)

    retrieved_docs = result.get("documents", [[]])[0]
    distances = result.get("distances", [[]])[0]

    documents = []
    SIMILARITY_THRESHOLD = 0.6

    for doc_text, dist in zip(retrieved_docs, distances):
        if dist < SIMILARITY_THRESHOLD:
            documents.append(doc_text)

    context = "\n\n".join(documents) if documents else ""

    # ---------------------------
    # FALLBACK (NO KB MATCH)
    # ---------------------------
    if not context:
        LAST_TECH_ISSUE = question
        LAST_OS = detect_os(question)

        try:
            fallback_prompt = f"""
You are a helpful IT support assistant.

User OS: {LAST_OS}

Provide concise troubleshooting steps.

User question:
{question}
"""

            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": fallback_prompt}],
                temperature=0.4
            )

            llm_answer = response.choices[0].message.content.strip()

        except Exception as e:
            print("Fallback LLM error:", e)
            llm_answer = "I can help troubleshoot that issue."

        return {
            "answer": llm_answer,
            "intent": "llm_fallback",
            "source": "llm",
            "confidence": 0.5,
            "suggest_ticket": False
        }

    # ---------------------------
    # KB + LLM ANSWER
    # ---------------------------
    LAST_TECH_ISSUE = question
    LAST_OS = detect_os(question)

    prompt = f"""
You are an IT helpdesk support assistant.

User OS: {LAST_OS}

Rules:
- Answer like a real support engineer
- Be concise
- Use numbered steps when needed
- Use ONLY the context
- Do NOT invent information
- Provide steps specific to the OS

Context:
{context}

User question:
{question}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )

        answer_text = response.choices[0].message.content.strip()

    except Exception as e:
        print("GROQ ERROR:", e)
        answer_text = "Something went wrong. Please try again."

    return {
        "answer": answer_text,
        "intent": "kb_answer",
        "source": "kb",
        "confidence": 0.85,
        "suggest_ticket": False
    }