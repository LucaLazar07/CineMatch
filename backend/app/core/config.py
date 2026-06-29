from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    tmdb_api_key: str # Required
    tmdb_base_url: str = "https://api.themoviedb.org/3" # Optional

    database_url: str = "sqlite:///./cinematch.db"

    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    auth_rate_limit_max_requests: int = 10
    auth_rate_limit_window_seconds: int = 60

    jwt_secret_key: str
    jwt_algorithm: str
    access_token_exp_minutes: int
    refresh_token_exp_days: int

    cors_origins: List[str] = ["*"]
    # Optional SMTP settings for password reset emails
    smtp_host: str | None = None
    smtp_port: int | None = None
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from: str | None = None
    smtp_use_ssl: bool = False
    smtp_starttls: bool = True
    smtp_timeout_seconds: int = 10

    public_backend_url: str | None = None
    email_verification_token_exp_hours: int = 24
    # Optional Redis URL for distributed features (rate limiting, caches)
    redis_url: str | None = None
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "ignore"
    }

settings = Settings() # Singleton instance
