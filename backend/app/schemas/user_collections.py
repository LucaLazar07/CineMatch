from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class SavedItem(BaseModel):
    movie_id: int
    saved_at: datetime

    model_config = {"from_attributes": True}


class SavedListResponse(BaseModel):
    items: List[SavedItem]
    page: int
    page_size: int
    total: int


class SavedStateResponse(BaseModel):
    movie_id: int
    saved: bool
    saved_at: Optional[datetime] = None


class WatchedItem(BaseModel):
    movie_id: int
    watched_at: datetime

    model_config = {"from_attributes": True}


class WatchedListResponse(BaseModel):
    items: List[WatchedItem]
    page: int
    page_size: int
    total: int


class WatchedUpsertRequest(BaseModel):
    watched_at: Optional[datetime] = None


class WatchedStateResponse(BaseModel):
    movie_id: int
    watched: bool
    watched_at: Optional[datetime] = None


class NoteUpsertRequest(BaseModel):
    note: str = Field(..., max_length=2000)


class NoteResponse(BaseModel):
    movie_id: int
    note: str
    updated_at: Optional[datetime] = None


class ProfileSummaryResponse(BaseModel):
    saved_count: int
    watched_count: int
    notes_count: int
    last_watched_at: Optional[datetime] = None


class PreferredGenresUpdateRequest(BaseModel):
    preferred_genre_ids: List[int] = Field(..., min_length=1)


class PreferredGenresResponse(BaseModel):
    preferred_genre_ids: List[int]


class HomeSuggestionResponse(BaseModel):
    movie_id: int
    reason: Optional[str] = None
