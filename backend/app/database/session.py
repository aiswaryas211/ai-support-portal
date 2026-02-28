from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os


# -------------------------------------------------
# ABSOLUTE DATABASE PATH (CRITICAL)
# -------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DB_PATH = os.path.join(BASE_DIR, "support.db")

DATABASE_URL = f"sqlite:///{DB_PATH}"

print(f"📂 USING DATABASE: {DB_PATH}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# -------------------------------------------------
# REQUIRED BY FASTAPI DEPENDENCIES
# -------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



