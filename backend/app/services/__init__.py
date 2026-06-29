from app.core.config import settings
import httpx
from typing import List

class TMDBService:
    def __init__(self):
        self.base_url = settings.tmdb_base_url
        headers = {
            "Authorization": "Bearer " + settings.tmdb_api_key,
            "Content-Type": "application/json"
        }
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            headers=headers,
            timeout=10.0,
            http2=True
        )

    async def search_movies(self, query: str, page: int = 1):
        url ="/search/movie"
        params = {
            "language": "en-US",
            "query": query,
            "page": page
        }
        response = await self.client.get(url=url, params=params)
        response.raise_for_status()
        return response.json()

    async def get_movie_details(self, movie_id: int):
        url = f"/movie/{movie_id}"
        params = {
            "append_to_response": "credits, keywords",
            "language": "en-US"
        }
        response = await self.client.get(url=url, params=params)
        response.raise_for_status()
        return response.json()

    async def get_similar_movies(self, movie_id: int, page: int = 1):
        url=f"/movie/{movie_id}/similar"
        params = {
            "language": "en-US",
            "page": page
        }
        response = await self.client.get(url=url, params=params)
        response.raise_for_status()
        return response.json()

    async def discover_by_genres(self, genre_ids: List[int] | None = None, page: int = 1, sort_by: str = "vote_average.desc", min_vote_count: int = 1000, **extra_params):
        url = "/discover/movie"
        params = {
            "sort_by": sort_by,
            "vote_count.gte": min_vote_count,
            "page": page,
            "language": "en-US",
        }
        if genre_ids:
            params["with_genres"] = ",".join(str(g) for g in genre_ids)
        # Allow passing through extra TMDB discover params (e.g. with_runtime.lte)
        params.update(extra_params)
        response = await self.client.get(url=url, params=params)
        response.raise_for_status()
        return response.json()

    async def close(self):
        await self.client.aclose()

service = TMDBService()
