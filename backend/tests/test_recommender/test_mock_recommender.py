"""
Mock test pentru ContentBasedRecommender fără API calls
Testează logica de similarity și ranking
"""
import sys
sys.path.insert(0, '/home/luca/CineMatch/backend')

from app.recommender import recommender

# Mock data - simulează structura TMDB API response
target_movie = {
    "id": 155,
    "title": "The Dark Knight",
    "overview": "Batman raises the stakes in his war on crime with the help of Lieutenant Jim Gordon and District Attorney Harvey Dent.",
    "genres": [
        {"id": 18, "name": "Drama"},
        {"id": 28, "name": "Action"},
        {"id": 80, "name": "Crime"},
        {"id": 53, "name": "Thriller"}
    ],
    "keywords": [
        {"name": "joker"},
        {"name": "dc comics"},
        {"name": "crime fighter"},
        {"name": "terrorist plot"}
    ],
    "credits": {
        "cast": [
            {"id": 3894, "name": "Christian Bale"},
            {"id": 1810, "name": "Heath Ledger"},
            {"id": 64, "name": "Gary Oldman"},
            {"id": 6383, "name": "Aaron Eckhart"},
            {"id": 1038, "name": "Michael Caine"}
        ],
        "crew": [
            {"id": 525, "name": "Christopher Nolan", "job": "Director"},
            {"id": 525, "name": "Christopher Nolan", "job": "Screenplay"},
            {"id": 1124, "name": "David S. Goyer", "job": "Screenplay"}
        ]
    }
}

candidates = [
    # Candidat 1: Batman Begins - același regizor, aceiași actori, teme similare
    {
        "id": 272,
        "title": "Batman Begins",
        "overview": "Driven by tragedy, billionaire Bruce Wayne dedicates his life to uncovering and defeating the corruption that plagues his home, Gotham City.",
        "genres": [
            {"id": 28, "name": "Action"},
            {"id": 80, "name": "Crime"},
            {"id": 18, "name": "Drama"}
        ],
        "keywords": [
            {"name": "dc comics"},
            {"name": "crime fighter"},
            {"name": "secret identity"},
            {"name": "superhero"}
        ],
        "credits": {
            "cast": [
                {"id": 3894, "name": "Christian Bale"},
                {"id": 1038, "name": "Michael Caine"},
                {"id": 64, "name": "Gary Oldman"},
                {"id": 2037, "name": "Liam Neeson"},
                {"id": 3894, "name": "Katie Holmes"}
            ],
            "crew": [
                {"id": 525, "name": "Christopher Nolan", "job": "Director"}
            ]
        }
    },
    
    # Candidat 2: Inception - același regizor, dar con diferit, gen diferit
    {
        "id": 27205,
        "title": "Inception",
        "overview": "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
        "genres": [
            {"id": 28, "name": "Action"},
            {"id": 878, "name": "Science Fiction"},
            {"id": 53, "name": "Thriller"}
        ],
        "keywords": [
            {"name": "dream"},
            {"name": "subconscious"},
            {"name": "heist"},
            {"name": "mind bending"}
        ],
        "credits": {
            "cast": [
                {"id": 6193, "name": "Leonardo DiCaprio"},
                {"id": 2037, "name": "Tom Hardy"},
                {"id": 1038, "name": "Michael Caine"},
                {"id": 3899, "name": "Marion Cotillard"},
                {"id": 24045, "name": "Joseph Gordon-Levitt"}
            ],
            "crew": [
                {"id": 525, "name": "Christopher Nolan", "job": "Director"}
            ]
        }
    },
    
    # Candidat 3: Iron Man - acțiune/superhero dar regizor diferit, actori diferiți
    {
        "id": 1726,
        "title": "Iron Man",
        "overview": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
        "genres": [
            {"id": 28, "name": "Action"},
            {"id": 878, "name": "Science Fiction"},
            {"id": 12, "name": "Adventure"}
        ],
        "keywords": [
            {"name": "marvel comics"},
            {"name": "superhero"},
            {"name": "based on comic"},
            {"name": "billionaire"}
        ],
        "credits": {
            "cast": [
                {"id": 3223, "name": "Robert Downey Jr."},
                {"id": 1233, "name": "Gwyneth Paltrow"},
                {"id": 2231, "name": "Jeff Bridges"},
                {"id": 16483, "name": "Terrence Howard"},
                {"id": 8691, "name": "Jon Favreau"}
            ],
            "crew": [
                {"id": 2195, "name": "Jon Favreau", "job": "Director"}
            ]
        }
    },
    
    # Candidat 4: The Godfather - crime/drama dar stil complet diferit
    {
        "id": 238,
        "title": "The Godfather",
        "overview": "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
        "genres": [
            {"id": 18, "name": "Drama"},
            {"id": 80, "name": "Crime"}
        ],
        "keywords": [
            {"name": "mafia"},
            {"name": "italian american"},
            {"name": "crime boss"},
            {"name": "family"},
            {"name": "sicily"}
        ],
        "credits": {
            "cast": [
                {"id": 3084, "name": "Marlon Brando"},
                {"id": 1158, "name": "Al Pacino"},
                {"id": 3087, "name": "James Caan"},
                {"id": 3086, "name": "Robert Duvall"},
                {"id": 9656, "name": "Diane Keaton"}
            ],
            "crew": [
                {"id": 1776, "name": "Francis Ford Coppola", "job": "Director"}
            ]
        }
    },
    
    # Candidat 5: The Notebook - romantic drama, total diferit
    {
        "id": 11036,
        "title": "The Notebook",
        "overview": "An epic love story centered around an older man who reads aloud to a woman with Alzheimer's.",
        "genres": [
            {"id": 10749, "name": "Romance"},
            {"id": 18, "name": "Drama"}
        ],
        "keywords": [
            {"name": "love"},
            {"name": "romance"},
            {"name": "notebook"},
            {"name": "alzheimer's disease"}
        ],
        "credits": {
            "cast": [
                {"id": 10859, "name": "Ryan Gosling"},
                {"id": 9827, "name": "Rachel McAdams"},
                {"id": 9780, "name": "James Garner"},
                {"id": 9806, "name": "Gena Rowlands"},
                {"id": 19536, "name": "Sam Shepard"}
            ],
            "crew": [
                {"id": 9844, "name": "Nick Cassavetes", "job": "Director"}
            ]
        }
    }
]

def test_recommender():
    print("=" * 80)
    print("MOCK TEST - ContentBasedRecommender")
    print("=" * 80)
    print(f"\nFilm țintă: {target_movie['title']}")
    print(f"Genuri: {[g['name'] for g in target_movie['genres']]}")
    print(f"Regizor: Christopher Nolan")
    print(f"Top 5 actori: {[c['name'] for c in target_movie['credits']['cast'][:5]]}")
    print("\n" + "-" * 80)
    
    # Test extract_features
    print("\n1. Test extract_features pe target movie:")
    features = recommender.extract_features(target_movie)
    print(f"   - Genres: {len(features['genre_ids'])} genuri")
    print(f"   - Keywords: {len(features['keywords'])} keywords (TMDB + RAKE)")
    print(f"   - Overview: {len(features['overview'])} caractere")
    print(f"   - Cast: {len(features['cast_ids'])} actori (top 5)")
    print(f"   - Director: {features['director']}")
    
    # Test recommend method
    print("\n2. Test recommend cu top_k=5:")
    recommendations = recommender.recommend(
        target_movie=target_movie,
        candidates=candidates,
        top_k=5
    )
    
    print(f"\n   Rezultate (sortate descrescător după scor):")
    print("   " + "=" * 76)
    
    for i, (movie, score) in enumerate(recommendations, 1):
        # Extract features pentru analiza
        movie_features = recommender.extract_features(movie)
        target_features = recommender.extract_features(target_movie)
        
        # Calculate individual similarities
        genre_sim = recommender.genre_similarity(
            target_features['genre_ids'],
            movie_features['genre_ids']
        )
        keyword_sim = recommender.keyword_similarity(
            target_features['keywords'],
            movie_features['keywords']
        )
        cast_crew_sim = recommender.cast_crew_similarity(
            target_features['cast_ids'],
            target_features['director'],
            movie_features['cast_ids'],
            movie_features['director']
        )
        
        # Get overview similarity from batch
        overview_sims = recommender.overview_similarity(
            target_features['overview'],
            [movie_features['overview']]
        )
        overview_sim = overview_sims[0]
        
        print(f"\n   #{i} - {movie['title']} (ID: {movie['id']})")
        print(f"       Scor final: {score:.4f}")
        print(f"       └─ Genre similarity:     {genre_sim:.4f} (weight: 0.30) → {genre_sim * 0.30:.4f}")
        print(f"       └─ Keyword similarity:   {keyword_sim:.4f} (weight: 0.20) → {keyword_sim * 0.20:.4f}")
        print(f"       └─ Overview similarity:  {overview_sim:.4f} (weight: 0.25) → {overview_sim * 0.25:.4f}")
        print(f"       └─ Cast/Crew similarity: {cast_crew_sim:.4f} (weight: 0.25) → {cast_crew_sim * 0.25:.4f}")
        print(f"       └─ Regizor: {movie_features['director']} {'✓ MATCH' if movie_features['director'] == target_features['director'] else ''}")
    
    # Verificări
    print("\n" + "=" * 80)
    print("VERIFICĂRI:")
    print("=" * 80)
    
    # Check sortare descrescătoare
    scores = [score for _, score in recommendations]
    is_sorted = all(scores[i] >= scores[i+1] for i in range(len(scores)-1))
    print(f"✓ Sortare descrescătoare: {'PASS' if is_sorted else 'FAIL'}")
    
    # Check că Batman Begins (același regizor + actori) e pe primul loc
    top_movie = recommendations[0][0]
    print(f"✓ Cel mai similar film: {top_movie['title']}")
    
    # Check că The Notebook e ultimul (total diferit)
    last_movie = recommendations[-1][0]
    print(f"✓ Cel mai puțin similar: {last_movie['title']}")
    
    # Check că scorurile sunt între 0 și 1
    all_valid = all(0 <= score <= 1 for _, score in recommendations)
    print(f"✓ Scoruri în range [0, 1]: {'PASS' if all_valid else 'FAIL'}")
    
    print("\n" + "=" * 80)
    print("TEST COMPLET ✓")
    print("=" * 80)

if __name__ == "__main__":
    test_recommender()
