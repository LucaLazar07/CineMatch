from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import jwt

from app.db.models import User, UserPreferredGenre, RefreshToken
from app.db.session import get_db
from app.security.password import hash_password, check_password
from app.security.jwt import create_access_token, create_refresh_token, decode_token
from app.schemas.auth import RegisterRequest, LoginRequest, AuthUserResponse, AuthSuccessResponse
from app.core.config import settings

security = HTTPBearer()


def _build_auth_response(user: User, db: Session) -> AuthSuccessResponse:
    access_token = create_access_token(user.id)
    refresh_token_str, jti = create_refresh_token(user.id)

    exp_dt = datetime.now(timezone.utc)
    try:
        payload = decode_token(refresh_token_str)
        exp_dt = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    except Exception:
        pass

    db_token = RefreshToken(user_id=user.id, jti=jti, expires_at=exp_dt)
    db.add(db_token)
    db.commit()

    genre_ids = [g.genre_id for g in user.preferred_genres]

    user_resp = AuthUserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        display_name=user.display_name,
        preferred_genre_ids=genre_ids,
        created_at=user.created_at,
    )
    return AuthSuccessResponse(
        user=user_resp,
        access_token=access_token,
        refresh_token=refresh_token_str,
        expires_in=settings.access_token_exp_minutes * 60,
    )


def register_user(payload: RegisterRequest, db: Session) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    display = payload.display_name or f"{payload.first_name} {payload.last_name}"
    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
        display_name=display,
    )
    db.add(user)
    db.flush()

    for genre_id in payload.preferred_genre_ids:
        db.add(UserPreferredGenre(user_id=user.id, genre_id=genre_id))

    db.commit()
    db.refresh(user)

    return user


def login_user(payload: LoginRequest, db: Session) -> AuthSuccessResponse:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not check_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email before logging in")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account inactive")

    return _build_auth_response(user, db)


def refresh_access_token(refresh_token_str: str, db: Session) -> dict:
    try:
        payload = decode_token(refresh_token_str)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    jti = payload.get("jti")
    user_id = int(payload["sub"])

    db_token = db.query(RefreshToken).filter(RefreshToken.jti == jti).first()
    if not db_token or db_token.revoked_at is not None:
        raise HTTPException(status_code=401, detail="Refresh token revoked")

    db_token.revoked_at = datetime.now(timezone.utc)

    new_refresh_str, new_jti = create_refresh_token(user_id)
    try:
        new_payload = decode_token(new_refresh_str)
        new_exp = datetime.fromtimestamp(new_payload["exp"], tz=timezone.utc)
    except Exception:
        new_exp = datetime.now(timezone.utc)

    new_db_token = RefreshToken(user_id=user_id, jti=new_jti, expires_at=new_exp)
    db.add(new_db_token)
    db.commit()

    return {
        "access_token": create_access_token(user_id),
        "refresh_token": new_refresh_str,
        "token_type": "bearer",
        "expires_in": settings.access_token_exp_minutes * 60,
    }


def logout_user(user: User, refresh_token_str: str | None, db: Session) -> None:
    if not refresh_token_str:
        return
    try:
        payload = decode_token(refresh_token_str)
        jti = payload.get("jti")
        if jti:
            db_token = db.query(RefreshToken).filter(RefreshToken.jti == jti).first()
            if db_token and db_token.revoked_at is None:
                db_token.revoked_at = datetime.now(timezone.utc)
                db.commit()
    except Exception:
        pass


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email before using this account")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account inactive")
    return user
