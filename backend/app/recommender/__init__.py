from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import jax 
import jax.numpy as jnp
import rake_nltk
from rake_nltk import Rake
import nltk

class ContentBasedRecommender:
    def __init__(self):
        self.count = CountVectorizer(max_features=500, stop_words="english", ngram_range=(1, 2))
        self.rake = Rake()
    
    def extract_features(self, movie: dict) -> dict:
        genre_ids = {genre["id"] for genre in movie.get("genres", [])}
        keywords = {keyword["name"].lower() for keyword in movie.get("keywords", [])}
        overview = movie.get("overview", "")
        if overview:
            self.rake.extract_keywords_from_text(overview)
            phrases = self.rake.get_ranked_phrases()
            keywords.update(phrase.lower() for phrase in phrases)
        cast_list = movie.get("credits", {}).get("cast", [])
        cast_ids = {cast["id"] for index, cast in enumerate(cast_list) if index < 5}
        crew_list = movie.get("credits", {}).get("crew", [])
        director = next((crew["name"] for crew in crew_list if crew.get("job") == "Director"), None)
        
        return {
            "genre_ids": genre_ids,
            "keywords": keywords,
            "overview": overview,
            "cast_ids": cast_ids,
            "director": director
        }
    
    def genre_similarity(self, target_genres: set, candidate_genres: set) -> float:
        if not target_genres or not candidate_genres:
            return 0.0
        
        intersection = len(target_genres & candidate_genres)
        union = len(target_genres | candidate_genres)
        
        jaccard_similarity = intersection / union
        
        return jaccard_similarity

    def keyword_similarity(self, target_keywords: set, candidate_keywords: set) -> float:
        if not target_keywords or not candidate_keywords:
            return 0.0
        
        intersection = len(target_keywords & candidate_keywords)
        union = len(target_keywords | candidate_keywords)
        
        jaccard_similarity = intersection / union
        
        return jaccard_similarity
        