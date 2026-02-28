from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from pathlib import Path


# -------------------------------------------------
# LOAD ENV FROM PROJECT ROOT
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH, override=True)

print("Loaded GROQ KEY:", os.getenv("GROQ_API_KEY"))
from app.database.session import engine, SessionLocal
from app.database.base import Base

# 🔐 IMPORT MODELS (CRITICAL FOR TABLE CREATION)
from app.users.model import User
from app.tickets.model import Ticket, TicketMessage, TicketAttachment

# 🔐 Services
from app.auth.service import hash_password

# 🌐 Routers
from app.auth.router import router as auth_router
from app.users.router import router as users_router
from app.tickets.router import router as tickets_router
from app.faqs.router import router as faqs_router
from app.kb.router import router as kb_router
from app.admin.routes_dashboard import router as dashboard_router
from app.admin.routes_agent_performance import router as perf_router
from app.admin.routes_analytics import router as analytics_router
from app.admin.routes_agent_performance import router as agent_perf_router
from app.tickets.analytics_router import router as analytics_router

app = FastAPI(
    title="AI-Powered Support Portal",
    version="1.0.0"
)

# -------------------------------------------------
# SERVE UPLOADED FILES
# -------------------------------------------------
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# -------------------------------------------------
# CORS
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# CREATE TABLES
# -------------------------------------------------
Base.metadata.create_all(bind=engine)

# -------------------------------------------------
# ADMIN BOOTSTRAP
# -------------------------------------------------
@app.on_event("startup")
def bootstrap_admin():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@support.com").first()

        if admin:
            db.delete(admin)
            db.commit()
            print("⚠️ Old admin removed due to invalid hash")

        admin = User(
            email="admin@support.com",
            hashed_password=hash_password("Admin@123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        db.commit()

        print("✅ Admin reset successfully")

        # DEBUG CHECK (remove later)
        print("Loaded GROQ KEY:", os.getenv("GROQ_API_KEY"))

    finally:
        db.close()

# -------------------------------------------------
# ROUTERS
# -------------------------------------------------
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(tickets_router)
app.include_router(faqs_router)
app.include_router(kb_router)
app.include_router(dashboard_router)
app.include_router(perf_router)
app.include_router(analytics_router)
app.include_router(agent_perf_router)