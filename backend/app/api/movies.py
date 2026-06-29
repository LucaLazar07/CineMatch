from fastapi import APIRouter, Query
from typing import List
import os
import psycopg

from app.services import service as tmdb
from app.recommender import recommender

from app.schemas import MovieSummary, SearchResponse

router = APIRouter(prefix="/movie", tags=["movies"])


@router.get("/discover")
async def discover(
    with_genres: str | None = Query(None),
    page: int = Query(1, ge=1),
    min_vote_average: float | None = Query(None),
    with_runtime_lte: int | None = Query(None, alias="with_runtime.lte"),
):
    genre_ids = None
    if with_genres:
        genre_ids = [int(x) for x in with_genres.split(",") if x.strip()]

    extra = {}
    if with_runtime_lte is not None:
        extra["with_runtime.lte"] = with_runtime_lte
    if min_vote_average is not None:
        extra["vote_average.gte"] = min_vote_average

    response = await tmdb.discover_by_genres(genre_ids=genre_ids, page=page, **extra)
    return response


@router.get("/mood")
async def mood_search(
    mood: str = Query(..., min_length=1),
    with_genres: str | None = Query(None),
    max_runtime: int | None = Query(None),
    pages: int = Query(2, ge=1, le=5),
    top_k: int = Query(12, ge=1, le=50),
):
    # Gather candidate movies from TMDB discover over a few pages
    genre_ids = None
    if with_genres:
        genre_ids = [int(x) for x in with_genres.split(",") if x.strip()]

    extra: dict = {}
    if max_runtime is not None:
        extra["with_runtime.lte"] = max_runtime

    candidates = []
    for p in range(1, pages + 1):
        try:
            resp = await tmdb.discover_by_genres(genre_ids=genre_ids, page=p, sort_by="popularity.desc", min_vote_count=50, **extra)
            candidates.extend(resp.get("results", []))
        except Exception:
            continue

    if not candidates:
        return SearchResponse(results=[], page=1, total_pages=0, total_results=0)

    # Enrich a reasonable number of top candidates with full details for better ranking
    # take up to 50 candidates by popularity
    unique_candidates = {c["id"]: c for c in candidates}.values()
    candidates_list = list(unique_candidates)[:50]

    import asyncio
    enriched = []
    tasks = [tmdb.get_movie_details(c.get("id")) for c in candidates_list]
    responses = await asyncio.gather(*tasks, return_exceptions=True)
    for r in responses:
        if not isinstance(r, Exception):
            # Re-apply runtime guard on full details since TMDB discover filter is approximate.
            if max_runtime is not None and (r.get("runtime") or 999) > max_runtime:
                continue
            enriched.append(r)

    if not enriched:
        # fallback to using the lightweight discover results
        ranked = recommender.recommend_by_mood(mood_text=mood, candidates=candidates, top_k=min(top_k, len(candidates)))
        movies = [MovieSummary(**movie_dict) for movie_dict, _ in ranked]
        return SearchResponse(results=movies, page=1, total_pages=1, total_results=len(movies))

    ranked = recommender.recommend_by_mood(mood_text=mood, candidates=enriched, top_k=min(top_k, len(enriched)))
    movies = [MovieSummary(**movie_dict) for movie_dict, _ in ranked]
    return SearchResponse(results=movies, page=1, total_pages=1, total_results=len(movies))


@router.get("/mood_knn")
async def mood_search_knn(
    mood: str = Query(..., min_length=1),
    top_k: int = Query(12, ge=1, le=100),
):
    """Use pgvector KNN search against precomputed `movie_embeddings`.
    Requires `movie_embeddings` populated and `DATABASE_URL` configured.
    """
    if not mood:
        return SearchResponse(results=[], page=1, total_pages=0, total_results=0)

    # compute embedding for mood text
    mood_embedding = recommender.embedding_model.encode(
        mood, convert_to_numpy=True, normalize_embeddings=True
    )
    emb_str = "[" + ",".join(str(float(x)) for x in mood_embedding.tolist()) + "]"

    dsn = os.getenv("DATABASE_URL") or "postgresql://cineuser:cinepass@localhost:5432/cinematch"
    rows = []
    try:
        with psycopg.connect(dsn) as conn:
            with conn.cursor() as cur:
                sql = (
                    "SELECT movie_id, title, overview, keywords "
                    "FROM movie_embeddings "
                    "ORDER BY embedding <-> %s::vector "
                    "LIMIT %s;"
                )
                cur.execute(sql, (emb_str, top_k))
                rows = cur.fetchall()
    except Exception:
        # fallback to empty
        rows = []

    movies = []
    for r in rows:
        movie_id, title, overview, keywords = r
        movies.append(MovieSummary(id=movie_id, title=title or "", overview=overview or None))

    return SearchResponse(results=movies, page=1, total_pages=1, total_results=len(movies))
