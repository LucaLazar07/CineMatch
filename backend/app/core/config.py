from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    tmdb_api_key: str # Required
    tmdb_base_url: str = "https://api.themoviedb.org/3" # Optional
    
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    
    cors_origins: List[str] = ["http://localhost:19006", "http://localhost:8081"]
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "ignore"
    }

settings = Settings() # Singleton instance
