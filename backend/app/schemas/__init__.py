from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class MovieSummary(BaseModel):
    id: int = Field(..., gt=0, description="TMDB Movie ID")
    title : str = Field(..., min_length=1, description="Movie Title")
    poster_path : Optional[str] = Field(None, description="Path to movie poster")
    release_date: Optional[date] = Field(None, description="Release date of the movie")
    vote_average: float = Field(0.0, ge=0.0, le=10.0, description="Rating of the movie")
    overview: Optional[str] = Field(None, description="Short plot summary")
    
class Genre(BaseModel):
    id: int = Field(..., gt=0, description="Genre ID")
    name: str = Field(..., min_length=1, description="Name of the genre")

class SearchResponse(BaseModel):
    results: List[MovieSummary] = Field(..., description="List of actual movies")
    page: int = Field(1, description="Current page number")
    total_pages: int = Field(..., "Number of pages that exist")
    total_results: int = Field(..., "Number of matching movies")
