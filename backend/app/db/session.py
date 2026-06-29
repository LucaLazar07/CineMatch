from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from urllib.parse import urlparse

from app.core.config import settings

DATABASE_URL = settings.database_url

is_sqlite = urlparse(DATABASE_URL).scheme.startswith("sqlite")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if is_sqlite else {},
    pool_pre_ping=not is_sqlite,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
