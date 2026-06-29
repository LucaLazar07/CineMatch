"""Precompute embeddings for a set of movies and store them in Postgres (pgvector).

Usage:
  python scripts/precompute_embeddings.py --pages 2

This will fetch popular movies from TMDB via the existing `service` wrapper, fetch details,
compute embeddings (all-MiniLM-L6-v2), and upsert into `movie_embeddings` table.
"""
import asyncio
import os
import argparse
from datetime import datetime

from sentence_transformers import SentenceTransformer
import psycopg

from app.services import service as tmdb


MODEL_NAME = os.environ.get("EMBEDDING_MODEL", "all-MiniLM-L6-v2")


async def fetch_movie_ids(pages=2):
    ids = []
    for p in range(1, pages + 1):
        try:
            resp = await tmdb.discover_by_genres(genre_ids=None, page=p, sort_by="popularity.desc", min_vote_count=0)
            for r in resp.get("results", []):
                ids.append(r.get("id"))
        except Exception as e:
            print("Discover error:", e)
    return list(dict.fromkeys(ids))


async def fetch_details(ids):
    tasks = [tmdb.get_movie_details(movie_id=i) for i in ids]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    movies = []
    for r in results:
        if not isinstance(r, Exception):
            movies.append(r)
    return movies


def upsert_embeddings(conn, rows):
    with conn.cursor() as cur:
        for movie in rows:
            movie_id = movie.get("id")
            title = movie.get("title")
            overview = movie.get("overview") or ""
            keywords = [k["name"].lower() for k in movie.get("keywords", [])]
            emb = movie.get("_embedding")
            if emb is None:
                continue
            emb_str = "[" + ",".join(str(float(x)) for x in emb.tolist()) + "]"
            sql = """
INSERT INTO movie_embeddings (movie_id, title, overview, keywords, embedding, updated_at)
VALUES (%s, %s, %s, %s, %s::vector, %s)
ON CONFLICT (movie_id) DO UPDATE
SET title = EXCLUDED.title,
    overview = EXCLUDED.overview,
    keywords = EXCLUDED.keywords,
    embedding = EXCLUDED.embedding,
    updated_at = EXCLUDED.updated_at;
"""
            cur.execute(sql, (movie_id, title, overview, keywords, emb_str, datetime.utcnow()))
    conn.commit()


async def main(pages):
    print("Loading model", MODEL_NAME)
    model = SentenceTransformer(MODEL_NAME)

    print("Fetching popular movie ids...")
    ids = await fetch_movie_ids(pages=pages)
    print("Found", len(ids), "ids")

    print("Fetching movie details...")
    movies = await fetch_details(ids)
    print("Got details for", len(movies), "movies")

    print("Computing embeddings...")
    for m in movies:
        overview = m.get("overview") or ""
        if overview:
            emb = model.encode(overview, convert_to_numpy=True, normalize_embeddings=True)
        else:
            emb = None
        m["_embedding"] = emb

    # Connect to Postgres
    dsn = os.environ.get("DATABASE_URL") or "postgresql://cineuser:cinepass@localhost:5432/cinematch"
    print("Connecting to DB:", dsn)
    with psycopg.connect(dsn) as conn:
        upsert_embeddings(conn, movies)

    print("Done.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--pages", type=int, default=2, help="Number of discover pages to fetch")
    args = parser.parse_args()
    asyncio.run(main(args.pages))
