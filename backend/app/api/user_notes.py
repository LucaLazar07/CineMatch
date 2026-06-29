from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import User
from app.schemas.user_collections import NoteUpsertRequest, NoteResponse
from app.services.auth_service import get_current_user
from app.services import user_notes_service as notes_svc

router = APIRouter(prefix="/me", tags=["user_notes"])


@router.get("/watched/{movie_id}/note", response_model=NoteResponse)
def get_note(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return notes_svc.get_note(current_user.id, movie_id, db)


@router.put("/watched/{movie_id}/note", response_model=NoteResponse)
def upsert_note(
    movie_id: int,
    payload: NoteUpsertRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return notes_svc.upsert_note(current_user.id, movie_id, payload.note, db)


@router.delete("/watched/{movie_id}/note", response_model=NoteResponse)
def delete_note(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return notes_svc.delete_note(current_user.id, movie_id, db)
