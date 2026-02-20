from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import router
from app.services import service
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting CineMatch API...")

    import nltk
    nltk.download('stopwords', quiet=True)
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)
    print("NLTK imports done")

    yield

    print("Shutting down CineMatch API...")
    await service.close()

app = FastAPI(
    title="CineMatch API",
    description="Movie recommendation API using content based filtering",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
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
    uvicorn.run(
        app="main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
