from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from typing import Optional

from app.db.models import (
    User, UserPreferredGenre,
    UserSavedMovie, UserWatchedMovie
)
from app.schemas.user_collections import (
    SavedListResponse, SavedItem, SavedStateResponse,
    WatchedListResponse, WatchedItem, WatchedStateResponse,
    ProfileSummaryResponse, PreferredGenresResponse
)


VALID_GENRE_IDS = {28, 12, 16, 35, 80, 99, 18, 10751, 14, 27, 10402, 9648, 10749, 878, 53, 10752, 37}


def get_saved_movies(user_id: int, db: Session, page: int = 1, page_size: int = 50) -> SavedListResponse:
    total = db.query(UserSavedMovie).filter(UserSavedMovie.user_id == user_id).count()
    rows = (
        db.query(UserSavedMovie)
        .filter(UserSavedMovie.user_id == user_id)
        .order_by(UserSavedMovie.saved_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    items = [SavedItem(movie_id=r.movie_id, saved_at=r.saved_at) for r in rows]
    return SavedListResponse(items=items, page=page, page_size=page_size, total=total)


def add_saved_movie(user_id: int, movie_id: int, db: Session) -> SavedStateResponse:
    existing = (
        db.query(UserSavedMovie)
        .filter(UserSavedMovie.user_id == user_id, UserSavedMovie.movie_id == movie_id)
        .first()
    )
    if existing:
        return SavedStateResponse(movie_id=movie_id, saved=True, saved_at=existing.saved_at)

    row = UserSavedMovie(user_id=user_id, movie_id=movie_id)
    db.add(row)
    db.commit()
    db.refresh(row)
    return SavedStateResponse(movie_id=movie_id, saved=True, saved_at=row.saved_at)


def remove_saved_movie(user_id: int, movie_id: int, db: Session) -> SavedStateResponse:
    row = (
        db.query(UserSavedMovie)
        .filter(UserSavedMovie.user_id == user_id, UserSavedMovie.movie_id == movie_id)
        .first()
    )
    if row:
        db.delete(row)
        db.commit()
    return SavedStateResponse(movie_id=movie_id, saved=False)


def get_watched_movies(user_id: int, db: Session, page: int = 1, page_size: int = 50) -> WatchedListResponse:
    total = db.query(UserWatchedMovie).filter(UserWatchedMovie.user_id == user_id).count()
    rows = (
        db.query(UserWatchedMovie)
        .filter(UserWatchedMovie.user_id == user_id)
        .order_by(UserWatchedMovie.watched_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    items = [WatchedItem(movie_id=r.movie_id, watched_at=r.watched_at) for r in rows]
    return WatchedListResponse(items=items, page=page, page_size=page_size, total=total)


def add_watched_movie(
    user_id: int,
    movie_id: int,
    db: Session,
    watched_at: Optional[datetime] = None,
) -> WatchedStateResponse:
    existing = (
        db.query(UserWatchedMovie)
        .filter(UserWatchedMovie.user_id == user_id, UserWatchedMovie.movie_id == movie_id)
        .first()
    )
    if existing:
        return WatchedStateResponse(movie_id=movie_id, watched=True, watched_at=existing.watched_at)

    row = UserWatchedMovie(
        user_id=user_id,
        movie_id=movie_id,
        watched_at=watched_at or datetime.now(timezone.utc),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return WatchedStateResponse(movie_id=movie_id, watched=True, watched_at=row.watched_at)


def remove_watched_movie(user_id: int, movie_id: int, db: Session) -> WatchedStateResponse:
    row = (
        db.query(UserWatchedMovie)
        .filter(UserWatchedMovie.user_id == user_id, UserWatchedMovie.movie_id == movie_id)
        .first()
    )
    if row:
        db.delete(row)
        db.commit()
    return WatchedStateResponse(movie_id=movie_id, watched=False)


def get_user_summary(user_id: int, db: Session) -> ProfileSummaryResponse:
    from app.db.models import UserMovieNote

    saved_count = db.query(UserSavedMovie).filter(UserSavedMovie.user_id == user_id).count()
    watched_count = db.query(UserWatchedMovie).filter(UserWatchedMovie.user_id == user_id).count()
    notes_count = db.query(UserMovieNote).filter(UserMovieNote.user_id == user_id).count()

    last_row = (
        db.query(UserWatchedMovie)
        .filter(UserWatchedMovie.user_id == user_id)
        .order_by(UserWatchedMovie.watched_at.desc())
        .first()
    )
    last_watched_at = last_row.watched_at if last_row else None

    return ProfileSummaryResponse(
        saved_count=saved_count,
        watched_count=watched_count,
        notes_count=notes_count,
        last_watched_at=last_watched_at,
    )


def update_preferred_genres(user_id: int, genre_ids: list[int], db: Session) -> PreferredGenresResponse:
    invalid = [g for g in genre_ids if g not in VALID_GENRE_IDS]
    if invalid:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail=f"Invalid genre IDs: {invalid}")

    unique_ids = list(set(genre_ids))
    db.query(UserPreferredGenre).filter(UserPreferredGenre.user_id == user_id).delete()
    for genre_id in unique_ids:
        db.add(UserPreferredGenre(user_id=user_id, genre_id=genre_id))
    db.commit()

    return PreferredGenresResponse(preferred_genre_ids=unique_ids)
