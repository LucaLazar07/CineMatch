from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from httpx import HTTPStatusError
import asyncio

from app.schemas import (
    MovieSummary,
    MovieDetail,
    SearchResponse,
    RecommendationItem,
    RecommendationResponse
)

from app.services import service
from app.recommender import recommender
from app.core.config import settings

router = APIRouter(prefix="/api/v1")

@router.get("/search", response_model=SearchResponse)
async def search_movies(
    query: str = Query(..., min_length=1, description="Search Query"),
    page: int = Query(1, ge=1, description="Current page number")
):
    try:
        response = await service.search_movies(query=query, page=page)
    except HTTPStatusError as e:
        match e.response.status_code:
            case 404:
                raise HTTPException(status_code=404, detail="No results found")
            case 429:
                raise HTTPException(status_code=429, detail="Too many requests, please try again later")
            case _:
                raise HTTPException(status_code=500, detail="Could not search movies")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")
        
    movies = [MovieSummary(**movie_dict) for movie_dict in response["results"]]

    return SearchResponse(
        results=movies,
        page=response["page"],
        total_pages=response["total_pages"],
        total_results=response["total_results"]
    )

@router.get("/movie/{movie_id}", response_model=MovieDetail)
async def movie_details(movie_id: int):
    try:
        response = await service.get_movie_details(movie_id=movie_id)
    except HTTPStatusError as e:
        match e.response.status_code:
            case 404:
                raise HTTPException(status_code=404, detail="Movie not found")
            case 429:
                raise HTTPException(status_code=429, detail="Too many requests, please try again later")
            case _:
                raise HTTPException(status_code=500, detail="Could not find movies")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
    response["cast"] = response.get("credits", {}).get("cast", [])[:10]
    
    crew_list = response.get("credits", {}).get("crew", [])
    response["crew"] = [member for member in crew_list if member.get("job") in ["Director", "Producer", "Novel", "Screenplay", "Executive Producer"]]
    
    response["keywords"] = [keyword["name"].lower() for keyword in response.get("keywords", [])]
    
    return MovieDetail(**response)

@router.get("/movie/{movie_id}/recommendations", response_model=RecommendationResponse)
async def recommend(
    movie_id: int,
    top_k : int = Query(10, ge=1, le=50, description="Top k recommended movies"),
    min_vote_average: float = Query(7.5, ge=0, le=10, description="Minimum rating of a movie"),
    min_vote_count: int = Query(2000, ge=0, description="Minimum number of people who rated a movie")
):
    try:
        target_movie = await service.get_movie_details(movie_id=movie_id)
    except HTTPStatusError as e:
        match e.response.status_code:
            case 404:
                raise HTTPException(status_code=404, detail="Movie not found")
            case 429:
                raise HTTPException(status_code=429, detail="Too many requests, please try again later")
            case _:
                raise HTTPException(status_code=500, detail="Could not find movies")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")

    try:
        similar_movies = []
        same_genre_movies = []
        
        # for page in range(1, 5):
        #     response_similar = await service.get_similar_movies(movie_id=movie_id, page=page)
        #     similar_movies.extend(response_similar.get("results", []))

        similar_task = [service.get_similar_movies(movie_id=movie_id, page=p) for p in range(1, 5)]
        similar_response = await asyncio.gather(*similar_task, return_exceptions=True)

        for response in similar_response:
            if not isinstance(response, Exception):
                similar_movies.extend(response.get("results", {}))

        genre_ids = [genre["id"] for genre in target_movie.get("genres", [])]

        genre_tasks = []

        for page in range(1, 4):
            genre_tasks.append(service.discover_by_genres(genre_ids=genre_ids, page=page, sort_by="vote_average.desc", min_vote_count=1000))
            # same_genre = await service.discover_by_genres(genre_ids=genre_ids, page=page, sort_by="vote_average.desc", min_vote_count=1000)
            # same_genre_movies.extend(same_genre.get("results", []))

        for page in range(1, 3):
            genre_tasks.append(service.discover_by_genres(genre_ids=genre_ids, page=page, sort_by="popularity.desc", min_vote_count=500))
            # popular_genre = await service.discover_by_genres(genre_ids=genre_ids, page=page, sort_by="popularity.desc", min_vote_count=500)
            # same_genre_movies.extend(popular_genre.get("results", []))
        
        if len(genre_ids) >= 2:
            for i in range(len(genre_ids)):
                subset = [g for j, g in enumerate(genre_ids) if j != i]
                for page in range(1, 3):
                    # subset_results = await service.discover_by_genres(genre_ids=subset, page=page, sort_by="vote_average.desc", min_vote_count=1500)
                    # same_genre_movies.extend(subset_results.get("results", []))
                    genre_tasks.append(service.discover_by_genres(genre_ids=subset, page=page, sort_by="vote_average.desc", min_vote_count=1500))

        genre_response  = await asyncio.gather(*genre_tasks, return_exceptions=True)
        for response in genre_response:
            if not isinstance(response, Exception):
                same_genre_movies.extend(response.get("results", []))

        candidates_dict = {}

        for movie in similar_movies + same_genre_movies:
            if movie["id"] != movie_id and movie.get("vote_average", 0) >= min_vote_average and movie.get("vote_count", 0) >= min_vote_count:
                candidates_dict[movie["id"]] = movie
        
        candidates = list(candidates_dict.values())

        candidates_to_enrich = candidates[:50]
        enriched_candidates = []
        enriched_task = [service.get_movie_details(movie_id=candidate["id"]) for candidate in candidates_to_enrich]
        enriched_response = await asyncio.gather(*enriched_task, return_exceptions=True)

        for response in enriched_response:
            if not isinstance(response, Exception):
                enriched_candidates.append(response)

        candidates = enriched_candidates

        # for candidate in candidates_to_enrich:
        #     try:
        #         detailed = await service.get_movie_details(movie_id=candidate["id"])
        #         enriched_candidates.append(detailed)
        #     except:
        #         continue

    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not create candidates")

    if not candidates:
            raise HTTPException(status_code=500, detail="Could not find similar movies")

    recommendations = recommender.recommend(target_movie=target_movie,
                                           candidates=candidates,
                                           top_k=top_k)
    
    recommendations = [
        (movie, score) for movie, score in recommendations 
        if movie["id"] != movie_id
    ]
    
    recommendation_items = []
    for recommendation in recommendations:
        movie_dict = recommendation[0]
        similarity = recommendation[1]
        movie_summary = MovieSummary(**movie_dict)
        recommendation_item = RecommendationItem(movie=movie_summary, 
                                                score=similarity, 
                                                reason="Based on same genres and themes")
        recommendation_items.append(recommendation_item)
        
    return RecommendationResponse(recommendations=recommendation_items)

@router.get("/health")
async def status_check():
    return {"status": "healthy"}
