from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from datetime import datetime


VALID_GENRE_IDS = {28, 12, 16, 35, 80, 99, 18, 10751, 14, 27, 10402, 9648, 10749, 878, 53, 10752, 37}


class RegisterRequest(BaseModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8)
    preferred_genre_ids: List[int] = Field(..., min_length=1)
    display_name: Optional[str] = None

    @field_validator("preferred_genre_ids")
    @classmethod
    def validate_genres(cls, ids: List[int]) -> List[int]:
        unique = list(set(ids))
        invalid = [g for g in unique if g not in VALID_GENRE_IDS]
        if invalid:
            raise ValueError(f"Invalid genre IDs: {invalid}")
        return unique

    @field_validator("email", mode="before")
    @classmethod
    def lower_email(cls, v: str) -> str:
        return v.strip().lower()


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def lower_email(cls, v: str) -> str:
        return v.strip().lower()


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: Optional[str] = None


class AuthUserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    display_name: Optional[str]
    preferred_genre_ids: List[int]
    created_at: datetime

    model_config = {"from_attributes": True}


class AuthSuccessResponse(BaseModel):
    user: AuthUserResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class AccessTokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


class VerifyEmailRequest(BaseModel):
    token: str


class RegistrationResponse(BaseModel):
    success: bool = True
    message: str
    email: EmailStr
    verification_required: bool = True
