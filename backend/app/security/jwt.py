from app.core.config import settings
import jwt
from datetime import datetime, timedelta, timezone
import uuid


def create_access_token(user_id: int) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_exp_minutes)
    payload = {
        "sub": str(user_id),
        "exp": exp,
        "type": "access",
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(user_id: int) -> tuple[str, str]:
    jti = str(uuid.uuid4())
    exp = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_exp_days)
    payload = {
        "sub": str(user_id),
        "exp": exp,
        "jti": jti,
        "type": "refresh",
    }
    token = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return token, jti


def create_password_reset_token(user_id: int, expire_minutes: int = 60) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
    jti = str(uuid.uuid4())
    payload = {
        "sub": str(user_id),
        "exp": exp,
        "jti": jti,
        "type": "password_reset",
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_email_verification_token(user_id: int, expire_minutes: int = 60 * 24) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
    jti = str(uuid.uuid4())
    payload = {
        "sub": str(user_id),
        "exp": exp,
        "jti": jti,
        "type": "email_verification",
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
