from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import jax 
import jax.numpy as jnp
import rake_nltk
from rake_nltk import Rake
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')
from typing import List

class ContentBasedRecommender:
    def __init__(self):
        self.count = CountVectorizer(
            max_features=500,
            ngram_range=(1, 2),
            min_df=1,
            lowercase=True
        )
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

    def genre_similarity( self,target_genres: set, candidate_genres: set) -> float:
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

    def overview_similarity(self, target_overview: str, candidate_overviews: List[str]):
        if not target_overview or not candidate_overviews:
            return np.zeros(len(candidate_overviews))
        overviews = []
        overviews.append(target_overview)
        overviews.extend(candidate_overviews)

        count_matrix = self.count.fit_transform(overviews)
        cos_sim = cosine_similarity(count_matrix[0:1], count_matrix[1:])

        return cos_sim[0]

    def cast_crew_similarity(self, target_cast: set, target_director: str,
                             candidate_cast: set, candidate_director: str) -> float:
        similarity = 0.0

        if target_cast and candidate_cast:
            intersection = len(target_cast & candidate_cast)
            # dividing by len(target_cast) as the user is interested in how much the candidate matches the target
            # not the other way around
            normalization = intersection / len(target_cast)
            similarity += 0.6 * normalization

        if target_director and candidate_director and target_director == candidate_director:
            similarity += 0.4

        return similarity

    def compute_similarity(self, target_movie: dict, candidates: List[dict]):
        target_features = self.extract_features(target_movie)
        candidate_features = []
        overviews = []

        for candidate in candidates:
            candidate_features.append(self.extract_features(candidate))
            overviews.append(candidate.get("overview", ""))

        target_overview = target_features["overview"]
        overview_similarities = self.overview_similarity(target_overview=target_overview, candidate_overviews=overviews)

        results = []
        for index, candidate_feature in enumerate(candidate_features):
            genre_similarity = self.genre_similarity(
                target_genres=target_features["genre_ids"],
                candidate_genres=candidate_feature["genre_ids"]
            )

            keyword_similarity = self.keyword_similarity(
                target_keywords=target_features["keywords"],
                candidate_keywords=candidate_feature["keywords"]
            )
            
            overview_similarity = overview_similarities[index]

            cast_crew_similarity = self.cast_crew_similarity(
                target_cast=target_features["cast_ids"],
                target_director=target_features["director"],
                candidate_cast=candidate_feature["cast_ids"],
                candidate_director=candidate_feature["director"]
            )
            
            similarity = (
                genre_similarity * 0.30 + 
                keyword_similarity * 0.20 +
                overview_similarity * 0.25 +
                cast_crew_similarity * 0.25
            )
            
            results.append((candidates[index], similarity))

        # for every element x from the results list, it sorts by x[1] which is the score
        return sorted(results, key=lambda x: x[1], reverse=True)
                        
    def recommend(self, target_movie: dict, candidates: List[dict], top_k: int = 10):
        recommendations = self.compute_similarity(target_movie=target_movie,
                                                  candidates=candidates)
        
        return recommendations[0:top_k]

recommender = ContentBasedRecommender()
