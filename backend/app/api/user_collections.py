from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
import random

from app.db.session import get_db
from app.db.models import User, UserPreferredGenre, UserWatchedMovie
from app.schemas.user_collections import (
    SavedListResponse, SavedStateResponse,
    WatchedListResponse, WatchedStateResponse,
    ProfileSummaryResponse, PreferredGenresUpdateRequest, PreferredGenresResponse,
    HomeSuggestionResponse
)
from app.services.auth_service import get_current_user
from app.services import user_collections_service as svc
from app.services.user_collections_service import VALID_GENRE_IDS
from app.services import service as tmdb

router = APIRouter(prefix="/me", tags=["user_collections"])


@router.get("/saved", response_model=SavedListResponse)
def get_saved(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return svc.get_saved_movies(current_user.id, db, page, page_size)


@router.put("/saved/{movie_id}", response_model=SavedStateResponse)
def save_movie(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if movie_id <= 0:
        raise HTTPException(status_code=422, detail="Invalid movie_id")
    return svc.add_saved_movie(current_user.id, movie_id, db)


@router.delete("/saved/{movie_id}", response_model=SavedStateResponse)
def unsave_movie(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return svc.remove_saved_movie(current_user.id, movie_id, db)


@router.get("/watched", response_model=WatchedListResponse)
def get_watched(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return svc.get_watched_movies(current_user.id, db, page, page_size)


@router.post("/watched/{movie_id}", response_model=WatchedStateResponse)
def mark_watched(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if movie_id <= 0:
        raise HTTPException(status_code=422, detail="Invalid movie_id")
    return svc.add_watched_movie(current_user.id, movie_id, db)


@router.delete("/watched/{movie_id}", response_model=WatchedStateResponse)
def unwatch_movie(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return svc.remove_watched_movie(current_user.id, movie_id, db)


@router.get("/summary", response_model=ProfileSummaryResponse)
def get_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return svc.get_user_summary(current_user.id, db)


@router.put("/preferences/genres", response_model=PreferredGenresResponse)
def update_genres(
    payload: PreferredGenresUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invalid = [g for g in payload.preferred_genre_ids if g not in VALID_GENRE_IDS]
    if invalid:
        raise HTTPException(status_code=422, detail=f"Invalid genre IDs: {invalid}")
    return svc.update_preferred_genres(current_user.id, payload.preferred_genre_ids, db)


async def _pick_popular_daily(seed_str: str, exclude_ids: set[int] | None = None) -> int:
    """Return a deterministic daily-rotating popular movie ID from TMDB."""
    from datetime import date as _date

    try:
        response = await tmdb.discover_by_genres(
            page=1,
            sort_by="popularity.desc",
            min_vote_count=5000,
        )
        candidates = [
            m for m in response.get("results", [])
            if m.get("vote_average", 0) >= 7.0
            and (exclude_ids is None or m["id"] not in exclude_ids)
        ]
        if candidates:
            rng = random.Random(seed_str)
            return rng.choice(candidates[:20])["id"]
    except Exception:
        pass
    # Hard fallback: a diverse set of acclaimed films so it's never always the same one.
    _EDITORIAL_POOL = [550, 238, 278, 424, 13, 680, 120, 122, 497, 372058]
    rng = random.Random(seed_str)
    return rng.choice(_EDITORIAL_POOL)


@router.get("/home-suggestion", response_model=HomeSuggestionResponse)
async def home_suggestion(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from datetime import date

    seed_str = f"{current_user.id}-{date.today().isoformat()}"

    genre_ids = [g.genre_id for g in current_user.preferred_genres]

    if not genre_ids:
        movie_id = await _pick_popular_daily(seed_str)
        return HomeSuggestionResponse(movie_id=movie_id, reason="editorial pick")

    watched_ids = {
        r.movie_id
        for r in db.query(UserWatchedMovie.movie_id)
        .filter(UserWatchedMovie.user_id == current_user.id)
        .all()
    }

    try:
        # Use OR logic ("|" separator) so movies matching ANY preferred genre are returned.
        # TMDB "," means AND — requiring all genres in one film — which yields nothing for multi-genre users.
        response = await tmdb.discover_by_genres(
            page=1,
            sort_by="vote_average.desc",
            min_vote_count=2000,
            **{"with_genres": "|".join(str(g) for g in genre_ids)},
        )
        candidates = [
            m for m in response.get("results", [])
            if m.get("vote_average", 0) >= 7.0 and m["id"] not in watched_ids
        ]

        if not candidates:
            movie_id = await _pick_popular_daily(seed_str, exclude_ids=watched_ids)
            return HomeSuggestionResponse(movie_id=movie_id, reason="editorial pick")

        rng = random.Random(seed_str)
        pick = rng.choice(candidates[:20])
        return HomeSuggestionResponse(movie_id=pick["id"], reason="based on your preferred genres (daily pick)")

    except Exception:
        movie_id = await _pick_popular_daily(seed_str, exclude_ids=watched_ids)
        return HomeSuggestionResponse(movie_id=movie_id, reason="editorial pick")
