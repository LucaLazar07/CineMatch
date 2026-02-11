from app.core.config import settings
import httpx

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
            timeout=10.0
        )
        
    async def search_movies(self, query: str, page: int = 1):
        endpoint_url ="/search/movie"
        params = {
            "language": "en-US",
            "query": query,
            "page": page
        }
        response = await self.client.get(url=endpoint_url, params=params)
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

service = TMDBService()
