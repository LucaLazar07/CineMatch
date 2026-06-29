from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.core.config import settings
from app.core.rate_limit import AuthRateLimitMiddleware
from app.api import router
from app.services import service
import uvicorn

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(_app: FastAPI):
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
    logger.info("Starting CineMatch API")
    logger.info("Database migrations must be applied before startup")

    import nltk
    nltk.download('stopwords', quiet=True)
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
    logger.info("NLTK resources ready")

    yield

    logger.info("Shutting down CineMatch API")
    await service.close()

app = FastAPI(
    title="CineMatch API",
    description="Movie recommendation API using content based filtering",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(AuthRateLimitMiddleware)

_wildcard_cors = settings.cors_origins == ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=not _wildcard_cors,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(
    router=router,
    prefix="/api",
    tags=["movies"]
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to CineMatch API",
        "docs":"/docs",
        "health":"/api/health"
    }

if __name__ == "__main__":
    import os
    uvicorn.run(
        app="main:app",
        host=settings.backend_host,
        port=settings.backend_port,
        reload=os.getenv("DEV_RELOAD", "false").lower() == "true",
    )
