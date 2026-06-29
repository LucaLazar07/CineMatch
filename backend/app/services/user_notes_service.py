from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.db.models import UserMovieNote
from app.schemas.user_collections import NoteResponse


def get_note(user_id: int, movie_id: int, db: Session) -> NoteResponse:
    row = (
        db.query(UserMovieNote)
        .filter(UserMovieNote.user_id == user_id, UserMovieNote.movie_id == movie_id)
        .first()
    )
    if not row:
        return NoteResponse(movie_id=movie_id, note="")
    return NoteResponse(movie_id=movie_id, note=row.note_text, updated_at=row.updated_at)


def upsert_note(user_id: int, movie_id: int, note_text: str, db: Session) -> NoteResponse:
    note_text = note_text.strip()
    row = (
        db.query(UserMovieNote)
        .filter(UserMovieNote.user_id == user_id, UserMovieNote.movie_id == movie_id)
        .first()
    )
    if row:
        row.note_text = note_text
        row.updated_at = datetime.now(timezone.utc)
    else:
        row = UserMovieNote(
            user_id=user_id,
            movie_id=movie_id,
            note_text=note_text,
            updated_at=datetime.now(timezone.utc),
        )
        db.add(row)
    db.commit()
    db.refresh(row)
    return NoteResponse(movie_id=movie_id, note=row.note_text, updated_at=row.updated_at)


def delete_note(user_id: int, movie_id: int, db: Session) -> NoteResponse:
    row = (
        db.query(UserMovieNote)
        .filter(UserMovieNote.user_id == user_id, UserMovieNote.movie_id == movie_id)
        .first()
    )
    if row:
        db.delete(row)
        db.commit()
    return NoteResponse(movie_id=movie_id, note="")
