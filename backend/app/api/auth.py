import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import EmailStr
from app.core.email import send_email

logger = logging.getLogger(__name__)
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import User
from app.schemas.auth import (
    RegisterRequest, LoginRequest, RefreshRequest, LogoutRequest,
    AuthSuccessResponse, AccessTokenResponse, AuthUserResponse,
    ForgotPasswordRequest, ResetPasswordRequest, RegistrationResponse
)
from app.services.auth_service import (
    register_user, login_user, refresh_access_token, logout_user, get_current_user
)
from app.security.jwt import create_password_reset_token, decode_token
from app.security.jwt import create_email_verification_token
from app.schemas.auth import VerifyEmailRequest
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegistrationResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = register_user(payload, db)

    try:
        token = create_email_verification_token(user.id, expire_minutes=60 * 24)
        base = settings.public_backend_url or f"{settings.backend_host}:{settings.backend_port}"
        verify_link = f"{base}/api/v1/auth/verify-email?token={token}"
        send_email(user.email, "Verify your CineMatch account", f"Click the link to verify your account:\n\n{verify_link}\n\nIf you did not create this account, ignore this email.")
    except Exception:
        logger.warning("Failed to send verification email for %s", user.email)

    return RegistrationResponse(
        message="Account created. Check your email to verify your account before logging in.",
        email=user.email,
        verification_required=True,
    )


@router.post("/login", response_model=AuthSuccessResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return login_user(payload, db)


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    return refresh_access_token(payload.refresh_token, db)


@router.post("/logout")
def logout(
    payload: LogoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logout_user(current_user, payload.refresh_token, db)
    return {"success": True}


@router.get("/me", response_model=AuthUserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    genre_ids = [g.genre_id for g in current_user.preferred_genres]
    return AuthUserResponse(
        id=current_user.id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        display_name=current_user.display_name,
        preferred_genre_ids=genre_ids,
        created_at=current_user.created_at,
    )



@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    # Always return success to avoid leaking which emails are registered
    if not user:
        return JSONResponse({"success": True})

    try:
        token = create_password_reset_token(user.id, expire_minutes=60)
        base = settings.public_backend_url or f"{settings.backend_host}:{settings.backend_port}"
        reset_link = f"{base}/api/v1/auth/reset-password?token={token}"
        send_email(user.email, "Password reset", f"Click the link to reset your password: {reset_link}")
    except Exception:
        logger.warning("Failed to send password reset email for %s", user.email)

    return JSONResponse({"success": True})


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload_decoded = decode_token(payload.token)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if payload_decoded.get("type") != "password_reset":
        raise HTTPException(status_code=400, detail="Invalid token type")

    user_id = int(payload_decoded.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    # Update password
    from app.security.password import hash_password
    user.password_hash = hash_password(payload.new_password)
    db.add(user)
    db.commit()

    return JSONResponse({"success": True})


@router.post("/verify-email")
def verify_email(payload: VerifyEmailRequest, db: Session = Depends(get_db)):
    try:
        payload_decoded = decode_token(payload.token)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if payload_decoded.get("type") != "email_verification":
        raise HTTPException(status_code=400, detail="Invalid token type")

    user_id = int(payload_decoded.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    user.is_verified = True
    db.add(user)
    db.commit()

    return JSONResponse({"success": True})


@router.get("/verify-email")
def verify_email_get(token: str, db: Session = Depends(get_db)):
    return verify_email(VerifyEmailRequest(token=token), db)
