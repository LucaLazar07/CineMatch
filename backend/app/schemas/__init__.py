from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class MovieSummary(BaseModel):
    id: int = Field(..., gt=0, description="TMDB Movie ID")
    title: str = Field(..., min_length=1, description="Movie Title")
    poster_path: Optional[str] = Field(None, description="Path to movie poster")
    release_date: Optional[date] = Field(None, description="Release date of the movie")
    vote_average: float = Field(0.0, ge=0.0, le=10.0, description="Rating of the movie")
    vote_count: int = Field(0, description="Number of people who rated the movie")
    overview: Optional[str] = Field(None, description="Short plot summary")
    
class Genre(BaseModel):
    id: int = Field(..., gt=0, description="Genre ID")
    name: str = Field(..., min_length=1, description="Name of the genre")

class Cast(BaseModel):
    name: str = Field(..., description="Name of the actor")
    character: str = Field(..., description="Name of the character played by the actor")
    profile_path: Optional[str] = Field(None, description="Path to actor's profile")

class Crew(BaseModel):
    name: str = Field(..., description="Name of the crew member")
    job: str = Field(..., description="Crew member job on set")
    
class MovieDetail(BaseModel):
    id: int = Field(..., gt=0, description="TMDB Movie ID")
    title: str = Field(..., min_length=1, description="Movie Title")
    poster_path: Optional[str] = Field(None, description="Path to movie poster")
    release_date: Optional[date] = Field(None, description="Release date of the movie")
    vote_average: float = Field(0.0, ge=0.0, le=10.0, description="Rating of the movie")
    vote_count: int = Field(0, description="Number of people who rated the movie")
    overview: Optional[str] = Field(None, description="Short plot summary")
    backdrop_path: Optional[str] = Field(None, description="Image background")
    runtime: int = Field(0, description="Movie length in minutes")
    genres: List[Genre] = Field(..., description="List of genres")
    cast: List[Cast] = Field(..., description="List of Cast members")
    crew: List[Crew] = Field(..., description="List of Crew members")
    tagline: Optional[str] = Field(None, description="Movie's motto")
    keywords: List[str] = Field(..., description="List of keywords")

class SearchResponse(BaseModel):
    results: List[MovieSummary] = Field(..., description="List of actual movies")
    page: int = Field(1, description="Current page number")
    total_pages: int = Field(..., description="Number of pages that exist")
    total_results: int = Field(..., description="Number of matching movies")

class RecommendationItem(BaseModel):
    movie: MovieSummary = Field(..., description="The recommended movie")
    score: float = Field(..., ge=0.0, le=1.0, description="Similarity score between 0 and 1")
    reason: Optional[str] = Field(None, description="Human-readable explanation for the recommendation")

class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem] = Field(..., description="List of recommended movies with scores")
