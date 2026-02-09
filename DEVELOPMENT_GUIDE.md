# CineMatch - Complete Development Guide
## Your Step-by-Step Learning Journey

This is your complete guide to building CineMatch from scratch. Follow every step in order, and you'll understand not just what to write, but why and how it all fits together.

---

## 🎯 Your Development Roadmap

### The Big Picture

You're building a full-stack application with three main parts:

1. **Backend (Python + FastAPI)** - The brain that fetches movie data and computes recommendations
2. **ML Recommender** - The algorithm that determines which movies are similar  
3. **Frontend (React Native)** - The mobile app users interact with

**Total estimated time:** 40-60 hours of focused work
**Skill level required:** Intermediate Python, basic JavaScript
**Prerequisites:** Python 3.10+, Node.js 18+, TMDB API key

---

## 📅 Week-by-Week Plan

### Week 1: Backend Foundation (12-15 hours)
**Goal:** Working FastAPI server that calls TMDB and returns movie data

- Day 1-2: Configuration and project setup (Files 1-3)
- Day 3-4: Data models and schemas (File 4)
- Day 5-7: TMDB service implementation and testing (File 5)

### Week 2: ML Recommender System (15-20 hours)
**Goal:** Content-based recommendation algorithm that ranks movies

- Day 1-2: Understanding similarity metrics and feature extraction
- Day 3-5: Implementing the recommender (File 6)
- Day 6-7: Testing and tuning the algorithm

### Week 3: API Layer & Frontend Setup (10-12 hours)
**Goal:** Complete backend API + frontend skeleton

- Day 1-2: API endpoints (File 7)
- Day 3: FastAPI app assembly (File 8)
- Day 4-5: Frontend project setup (Files 9-11)
- Day 6-7: API client and navigation (Files 12-13)

### Week 4: Frontend Screens & Polish (10-15 hours)
**Goal:** Working mobile app showing movies and recommendations

- Day 1-2: Components (Files 14-15)
- Day 3-5: Screens (Files 16-18)
- Day 6-7: Testing, debugging, styling

### Week 5+: Build, Test, Deploy (5-8 hours)
**Goal:** APK you can share with others

- Build configuration
- APK generation with EAS
- Testing on devices
- Final polish and fixes

---

## 🏗️ PHASE 1: BACKEND FOUNDATION

This is where everything starts. You MUST complete the backend before touching the frontend because the frontend depends entirely on having a working API to call.

---

## FILE 1: `backend/requirements.txt`

### When to Code This
**RIGHT NOW** - This is your absolute first file. Nothing else will work without it.

### Time Estimate
10-15 minutes

### What This File Does
Think of this as your project's shopping list. When someone (including future you) wants to run this project, they'll look at this file to know what Python packages to install. It's like a recipe listing all ingredients before you start cooking.

### What You Need to Write

Create a file called `requirements.txt` in your `backend` directory.

Write these package names, one per line:

**Line 1:** Write "fastapi" followed by two equals signs and "0.109.0" (or check PyPI for the latest version). This installs FastAPI version 0.109.0 exactly. The double equals means "exactly this version."

**Line 2:** Write "uvicorn" then open square bracket, write "standard" close square bracket, then equals equals "0.27.0". The square brackets tell pip to install uvicorn with extra performance features. Without [standard], you get a basic version that's slower.

**Line 3:** Write "pydantic" equals equals "2.5.3". Make absolutely sure it's version 2, not version 1. They're completely different and incompatible. Version 2 is newer and better.

**Line 4:** Write "pydantic-settings" equals equals "2.1.0". Notice the hyphen (not underscore). This is a separate package that extends Pydantic for configuration management.

**Line 5:** Write "python-dotenv" equals equals "1.0.0". This tiny package reads .env files and loads them into environment variables. Super useful for managing secrets.

**Line 6:** Write "httpx" equals equals "0.26.0". This is your HTTP client - like the popular "requests" library but with async support. You need async for good performance when calling external APIs.

**Line 7:** Write "scikit-learn" equals equals "1.4.0". This is the machine learning library. Provides TF-IDF vectorization and cosine similarity functions. It's massive (includes tons of ML algorithms) but you only need two functions.

**Line 8:** Write "numpy" equals equals "1.26.3". Required by scikit-learn. NumPy provides fast array operations. Most of Python's scientific computing ecosystem is built on NumPy.

**Line 9:** Write "pytest" equals equals "7.4.4". This is Python's most popular testing framework. You'll write tests later to make sure your code works correctly.

**Line 10:** Write "pytest-asyncio" equals equals "0.23.3". Adds support for testing async functions to pytest.

### How to Use This File

Save the file. Open your terminal, navigate to the backend directory, and run:

pip install -r requirements.txt

Watch as pip downloads and installs everything. This might take 2-5 minutes because scikit-learn is large.

If you get permission errors, use pip install --user or create a virtual environment first (recommended).

### Creating a Virtual Environment (Recommended)

Before installing, create an isolated environment for this project:

In terminal, in backend directory, run:
python -m venv venv

This creates a "venv" folder with an isolated Python environment.

Activate it:
- On Mac/Linux: source venv/bin/activate
- On Windows: venv\\Scripts\\activate

You'll see (venv) in your terminal prompt.

Now run pip install -r requirements.txt and packages install only in this environment, not globally.

### Why Version Pinning Matters

Using exact versions (==) means your project will work the same way today and in 5 years. Without it, pip might install a newer version that breaks your code.

Example: Pydantic v2 changed a lot from v1. If you wrote "pydantic" without a version, someone installing in 2024 might get v1, in 2025 might get v2 - same code, different results, lots of confusion.

### What You're Learning

- **Dependency management:** Every real project has dependencies. Learning to manage them is crucial.
- **Semantic versioning:** Version numbers have meaning (major.minor.patch). Major version changes can break compatibility.
- **Python packaging ecosystem:** PyPI (Python Package Index) is like an app store for Python code. Millions of packages available.
- **Virtual environments:** Isolating project dependencies prevents conflicts between projects.

### Common Mistakes to Avoid

❌ Typing package names wrong (case-sensitive, watch for hyphens vs underscores)
❌ Using Pydantic v1 by accident (specify v2 explicitly)
❌ Forgetting [standard] for uvicorn (your server will be slow)
❌ Installing globally without a virtual environment (causes conflicts later)
❌ Not testing the installation (run pip list to verify)

### Testing Your Installation

After pip finishes, verify everything installed:

pip list

You should see all 10 packages (plus their dependencies - might be 30+ total packages).

Try importing something:

python
import fastapi
import pydantic
print(f"FastAPI version: {fastapi.__version__}")
print(f"Pydantic version: {pydantic.__version__}")

Should print version numbers without errors.

### Moving Forward

Once installation succeeds, you're ready for File 2. Don't skip ahead - every file builds on previous ones.

---

## FILE 2: `backend/app/core/config.py`

### When to Code This
AFTER completing File 1 and installing packages

### Time Estimate
30-45 minutes (including testing and understanding)

### What This File Does

This is your application's configuration center. It loads secret API keys from environment variables, validates them, provides default values, and makes everything available as type-safe Python objects.

Think of it as your app's control panel. Instead of hardcoding "my API key" in 50 different files, you import settings from here. Need to change something? Update it in one place.

### Why This Approach

**The Wrong Way (what beginners do):**
Hardcode values directly in code:
- api_key = "123abc456def" 
- Then commit to git
- Now your secret key is public on GitHub
- Someone uses your key, exhausts your API quota
- Your app stops working

**The Right Way (what you're learning):**
- Store secrets in a .env file (never committed to git)
- Load them into environment variables
- Read them with type validation
- One central place for all configuration

### Implementation Steps

#### Step 1: Create the File

Create a new file: `backend/app/core/config.py`

The nested directory structure matters! It must be exactly:
backend/
  app/
    core/
      config.py

The app and core directories need __init__.py files (can be empty) to be valid Python packages.

#### Step 2: Write the Imports

At the very top of your file, write:

from pydantic_settings import BaseSettings

Note it's pydantic_settings (with underscore), not pydantic.settings (with dot). This is a common mistake. It's a separate package you installed.

Then write:

from typing import List

You need List to type hint that cors_origins will be a list of strings.

#### Step 3: Create the Settings Class

Start your class definition. Write:

class Settings(BaseSettings):

That colon at the end starts a code block. Everything indented under it belongs to the class.

The class name is Settings (capital S). It inherits from BaseSettings, which gives it superpowers (automatic environment variable loading, validation, etc.)

#### Step 4: Add TMDB Configuration

Inside your class (indented), create class attributes.

First attribute - write:
tmdb_api_key: str

That's the attribute name, colon, type hint. No equals sign, no default value. This makes it REQUIRED. If TMDB_API_KEY isn't in environment, Pydantic will raise a clear error: "Field required."

Second attribute - write:
tmdb_base_url: str = "https://api.themoviedb.org/3"

Same pattern but WITH an equals sign and default value. This makes it optional. If TMDB_BASE_URL isn't in environment, it uses this default.

The URL is TMDB's API version 3 endpoint. All their API calls start with this. Never hardcode it elsewhere - always use settings.tmdb_base_url.

#### Step 5: Add Server Configuration

Still inside the class, add:

backend_host: str = "0.0.0.0"

0.0.0.0 is special - means "listen on all network interfaces." Your server will accept connections from anywhere (localhost, local network, internet if exposed).

Alternative: "127.0.0.1" only allows localhost connections (more secure but can't test from phone on same WiFi).

Add:

backend_port: int = 8000

Notice the type is int, not str. Pydantic automatically converts the environment variable (which is always a string) to an integer. If someone sets BACKEND_PORT=abc, Pydantic catches the error immediately.

8000 is a common development port. Production often uses 80 (HTTP) or 443 (HTTPS).

#### Step 6: Add CORS Origins

Add:

cors_origins: List[str] = ["http://localhost:19006", "http://localhost:8081"]

Type hint is List[str] - a list containing strings.

Default value is a Python list with two strings. These are the default ports Expo's development server uses.

CORS (Cross-Origin Resource Sharing) is a browser security feature. Without this, your React Native app can't call your API (different ports = different origins = blocked by browser).

You can add more origins later (like your production frontend URL).

#### Step 7: Configure Pydantic

Inside your Settings class (same indentation level as the attributes), create a nested class:

Write:
model_config = {

Then on the next lines (indented inside the dictionary):

"env_file": ".env",

This tells Pydantic to look for a file called .env in the working directory and load variables from it.

"case_sensitive": False,

This means TMDB_API_KEY, tmdb_api_key, Tmdb_Api_Key all match the same attribute. Flexible and user-friendly.

"extra": "ignore",

If there are extra environment variables not defined in your Settings class, ignore them. Without this, Pydantic would raise an error.

Close the dictionary with a closing brace.

NOTE: This is Pydantic v2 syntax. V1 used a Config inner class - completely different. Make sure you're using v2.

#### Step 8: Create the Singleton Instance

Outside your Settings class (back to the left margin, no indentation), write:

settings = Settings()

This creates ONE instance of Settings. When Python imports this module, this line runs once. The settings object is created, loads all environment variables, validates everything, and is ready to use.

Every other file in your project will write:
from app.core.config import settings

They all get the same settings object. It's a singleton pattern.

### How This Works at Runtime

When Settings() is called:

1. Pydantic looks in the current directory for .env file
2. Reads it line by line, parsing KEY=value pairs
3. Also reads system environment variables (these override .env)
4. For each Settings attribute:
   - Looks for matching environment variable (case-insensitive)
   - If found, assigns it and validates the type
   - If not found and has default, uses default
   - If not found and required, raises error
5. Returns the validated Settings object

### Testing Your Config

Before moving on, TEST THIS FILE.

Create backend/.env file (in backend directory, same level as main.py will be):

Write in it:
TMDB_API_KEY=fake_key_for_testing

Save it.

Open Python console in backend directory:

python

In the console:

from app.core.config import settings
print(settings.tmdb_api_key)

Should print: fake_key_for_testing

print(settings.backend_port)

Should print: 8000

print(settings.tmdb_base_url)

Should print: https://api.themoviedb.org/3

If any of these fail:
- Check .env file exists and has correct content
- Check you're running Python from backend directory
- Check the __init__.py files exist in app/ and app/core/
- Check for typos in config.py

### Getting Your Real TMDB API Key

Don't use a fake key forever! Get a real one:

1. Go to https://www.themoviedb.org/
2. Create a free account
3. Go to Settings > API
4. Request an API key (choose "Developer" option)
5. Fill out the form (can say it's for learning/personal use)
6. You'll get a key immediately (looks like a long hex string)
7. Update your .env file with the real key

### What You're Learning

- **Environment variables:** How production applications manage configuration
- **Type validation:** Catching errors early with Pydantic
- **Singleton pattern:** One instance shared across the entire application
- **Security:** Never hardcode secrets; always use environment variables
- **The 12-factor app:** Industry-standard methodology for building maintainable apps

### Common Mistakes

❌ Importing from pydantic.settings instead of pydantic_settings
❌ Using Pydantic v1 Config class syntax instead of v2 model_config dict
❌ Creating Settings() inside the class instead of at module level
❌ Forgetting __init__.py files in directories
❌ Running Python from wrong directory (can't find .env)
❌ Committing .env to git (add to .gitignore!)

### Security Note

Add this to your .gitignore file:

.env
*.env

This prevents accidentally committing secrets. The .env.example file (next step) is safe to commit because it contains no real secrets.

---

## FILE 3: `.env.example`

### When to Code This
Right after File 2, while configuration is fresh in your mind

### Time Estimate
5 minutes

### What This File Does

This is a template that shows what environment variables your project needs. It's like a form with blank fields. Anyone cloning your project (including future you) will:

1. Copy .env.example to .env
2. Fill in the blank values
3. Start developing

### Where This File Lives

In the ROOT of your project (same level as backend and frontend directories):

CineMatch/
  .env.example  ← here
  backend/
  frontend/

### What to Write

Create the file .env.example and write:

TMDB_API_KEY=your_key_here

On the next line:
TMDB_BASE_URL=https://api.themoviedb.org/3

Continue adding:
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:19006,http://localhost:8081

### Important Details

The CORS_ORIGINS line has comma-separated values with NO SPACES. This is important! With spaces, it won't parse correctly.

The values here are either:
- Examples (your_key_here - needs to be replaced)
- Defaults (everything else - can be used as-is)

### Comments for Clarity

You can add comments above each variable to explain where to get it:

Add above TMDB_API_KEY:
# Get your API key from https://www.themoviedb.org/settings/api

### Why This File Exists

Imagine someone (or future you) cloning your GitHub repo:

1. They clone the code
2. Try to run it
3. Get error: "TMDB_API_KEY environment variable not found"
4. Confused - where do they get this?

With .env.example:

1. They clone the code
2. See .env.example
3. Run: cp .env.example .env
4. Edit .env, add their API key
5. Everything works

### The .gitignore Connection

Your .gitignore should have:

.env

But NOT:

.env.example

So .env (with real secrets) never goes to GitHub, but .env.example (template) does.

### For You Right Now

After creating .env.example, create your actual .env file:

cp .env.example .env

Then edit .env and replace your_key_here with your real TMDB API key from the previous step.

### What You're Learning

- **Security:** Separating templates from secrets
- **Documentation:** Self-documenting configuration requirements
- **Team collaboration:** Making it easy for others to set up the project
- **.gitignore:** Understanding what should and shouldn't be in version control

---

## FILE 4: `backend/app/schemas/__init__.py`

### When to Code This
After File 3, before writing any API or service code

### Time Estimate
45-60 minutes

### What This File Does

This file defines Pydantic models that represent the shape of data flowing through your API. Think of these as contracts or blueprints. They define exactly what a "MovieSummary" looks like, what a "MovieDetail" contains, what format search results take, etc.

These schemas serve three critical purposes:
1. **Validation:** Ensure data coming in and going out is correctly formatted
2. **Documentation:** Auto-generate API docs showing request/response formats
3. **Type safety:** Your IDE knows what fields exist and their types

### Why Schemas Are Separate

You might wonder: why not just pass raw TMDB JSON to the frontend?

**Problems with raw data:**
- TMDB returns 50+ fields per movie; you only need 10
- TMDB might change their format, breaking your app
- You can't control what the frontend sees
- No validation means bad data can slip through

**Benefits of schemas:**
- You choose exactly what fields to expose
- Frontend always gets consistent structure
- Easy to add computed fields
- Automatic validation catches errors early

### The Eight Schema Classes You'll Write

#### Schema 1: MovieSummary

**Purpose:** Lightweight movie information for lists (search results, recommendations).

**When it's used:** Anytime you show multiple movies in a list. You don't need full details, just enough to render a card.

**Fields to include:**
- Movie ID (integer) - TMDB's unique identifier
- Title (string) - The movie name
- Poster path (optional string) - Relative path to poster image, can be null
- Release date (optional date) - Release date in YYYY-MM-DD format, can be null
- Vote average (float with default 0.0) - Rating from 0.0 to 10.0
- Overview (optional string) - Short plot summary, can be null

**Why these fields?**
Enough to render a movie card: you can show the poster, title, year, rating, and a brief description. Small payload size (important for mobile apps on slow connections).

**Type considerations:**
- Use Optional for fields that might be missing (TMDB sometimes has incomplete data)
- Use defaults for numeric fields (better than null/None)
- Date type automatically parses YYYY-MM-DD strings

#### Schema 2: Genre

**Purpose:** Represents a single genre (Action, Drama, etc.)

**When it's used:** Embedded in MovieDetail to show what genres a movie belongs to.

**Fields to include:**
- ID (integer) - TMDB's genre ID (28 for Action, 18 for Drama, etc.)
- Name (string) - Human-readable genre name

**Why separate class?**
Genres are reusable objects. Instead of just strings, having IDs lets you filter by genre later.

#### Schema 3: CastMember

**Purpose:** Represents an actor in the movie

**When it's used:** Embedded in MovieDetail to show the cast.

**Fields to include:**
- Name (string) - Actor's name
- Character (string) - Character they played
- Profile path (optional string) - Path to actor's photo, can be null

**Why profile path is optional:**
Not all actors have photos in TMDB's database. Your app should handle missing photos gracefully.

#### Schema 4: CrewMember

**Purpose:** Represents behind-the-scenes people (directors, writers, producers)

**When it's used:** Embedded in MovieDetail to show crew.

**Fields to include:**
- Name (string) - Person's name
- Job (string) - Their role ("Director", "Writer", "Producer", etc.)

**Why job as string not enum?**
TMDB has hundreds of job types. Using string gives flexibility. You'll filter to just the important ones (Director, Writer, Producer) in your API code.

#### Schema 5: MovieDetail

**Purpose:** Complete movie information for the detail screen

**When it's used:** When user taps a movie to see full details.

**Fields to include:**
- All fields from MovieSummary (ID, title, overview, poster path, release date, vote average)
- Backdrop path (optional string) - Wide horizontal image for background
- Runtime (optional integer) - Movie length in minutes
- Vote count (integer with default 0) - Number of ratings
- Genres (list of Genre objects, default empty list)
- Cast (list of CastMember objects, default empty list)
- Crew (list of CrewMember objects, default empty list)
- Keywords (list of strings, default empty list) - Thematic tags
- Tagline (optional string) - Movie's tagline/slogan

**Why so much data?**
The detail screen shows everything. User is interested in this specific movie, so give them all available information.

**Nested models:**
Notice genres, cast, crew are lists of objects, not just strings. This is the power of Pydantic - you can nest models inside models.

**Default empty lists:**
If TMDB doesn't return cast (rare but possible), you get an empty list instead of null. Easier for frontend to handle.

#### Schema 6: SearchResponse

**Purpose:** Wraps search results with pagination metadata

**When it's used:** Response from the search endpoint

**Fields to include:**
- Results (list of MovieSummary objects) - The actual movies
- Page (integer) - Current page number
- Total pages (integer) - How many pages exist
- Total results (integer) - Total number of matching movies

**Why pagination metadata?**
TMDB returns results in pages (20 movies per page). Frontend needs to know if there are more results to load. This enables "infinite scroll" or "load more" buttons.

#### Schema 7: RecommendationItem

**Purpose:** A single recommendation with its score and explanation

**When it's used:** Each item in the recommendations list

**Fields to include:**
- Movie (MovieSummary object) - The recommended movie's basic info
- Score (float) - Similarity score between 0 and 1, with description "Similarity score between 0 and 1"
- Reason (optional string) - Human-readable explanation like "Shared genres: Sci-Fi, Action"

**Why include score?**
Transparency. User can see why recommendations are ordered the way they are. Could also display it in UI ("95% match").

**Why include reason?**
Makes recommendations explainable. Users trust recommendations more when they understand why they're being suggested.

#### Schema 8: RecommendationResponse

**Purpose:** Wraps the list of recommendations

**When it's used:** Response from the recommendations endpoint

**Fields to include:**
- Recommendations (list of RecommendationItem objects)

**Why wrap in an object?**
Even though it's just a list, wrapping it allows you to add metadata later (like "generated_at" timestamp or "algorithm_version") without breaking the API contract.

### Implementation Strategy

**Order matters:**
1. Start with simple schemas (Genre, CastMember, CrewMember)
2. Then MovieSummary
3. Then MovieDetail (which uses Genre, CastMember, CrewMember)
4. Then the response wrappers

**Import organization:**
- Import BaseModel from pydantic (not BaseSettings - different class)
- Import Field from pydantic for adding descriptions
- Import List, Optional from typing
- Import date from datetime

**Field validation options:**
- Use Field() to add descriptions (shown in API docs)
- Use Field(ge=0) for numbers that must be >= 0
- Use Field(min_length=1) for strings that can't be empty

### How These Get Used

**In your service layer:**
Service fetches raw TMDB JSON, then converts it to these schemas. The conversion validates everything.

**In your API layer:**
Route decorators use response_model=MovieDetail, which tells FastAPI:
- Validate the response before sending
- Auto-generate API documentation
- Serialize to JSON

**In your frontend:**
Frontend gets clean, predictable JSON that always has the same structure.

### Testing Your Schemas

After writing all eight schemas, test them:

Open Python console in backend directory, import your schemas, create test instances:

Create a test Genre with id 28 and name "Action". Should work fine.

Try creating a MovieSummary with just an id and title. Should work.

Try creating a MovieSummary with vote_average as a string. Pydantic should convert it to float.

Try creating a MovieSummary with an invalid date. Pydantic should raise validation error.

### What You're Learning

- **Data modeling:** Designing clean data structures
- **Pydantic validation:** Automatic type checking and conversion
- **API contracts:** Defining interfaces between systems
- **Nested models:** Complex data structures with validation
- **Optional vs required fields:** When to allow nulls

### Common Mistakes

❌ Using None as default instead of empty list for lists
❌ Forgetting Optional wrapper for nullable fields
❌ Not providing defaults for fields that might be missing
❌ Using str instead of Optional[str] for nullable strings
❌ Circular imports (importing schemas that import each other)

---

## FILE 5: `backend/app/services/__init__.py`

### When to Code This
After schemas are complete

### Time Estimate
60-90 minutes

### What This File Does

This is your TMDB API client - the service that talks to The Movie Database API. Every time you need movie data, you call methods from this service. It handles:
- Constructing proper URLs
- Adding authentication headers
- Making HTTP requests
- Handling errors
- Returning parsed JSON

Think of it as a translator between your app and TMDB's servers.

### Why a Separate Service Layer

**Without a service layer (bad approach):**
- Every API route directly calls TMDB
- Authentication code duplicated everywhere
- Hard to test (can't mock TMDB responses)
- If TMDB changes, you update 20 files

**With a service layer (what you're building):**
- One place that knows how to talk to TMDB
- API routes just call service methods
- Easy to mock for testing
- TMDB changes? Update one file

### The TMDBService Class

You'll create a class (not just functions) because:
- Maintains state (the HTTP client connection)
- Organizes related methods together
- Can be instantiated with different config for testing
- Professional, maintainable code structure

### Class Structure Overview

**Constructor (initialization):**
Set up base URL, authentication headers, create the HTTP client.

**Five main methods:**
1. search_movies - Search by title
2. get_movie_details - Get comprehensive movie info
3. get_similar_movies - Get TMDB's similar movies
4. discover_by_genres - Find movies by genre
5. close - Clean up HTTP client

**Singleton instance:**
One instance shared across your app.

### Method 1: Constructor (__init__)

**What it does:**
Initializes the service when an instance is created.

**What to set up:**
- Store the base URL from settings (settings.tmdb_base_url)
- Create a headers dictionary with two entries:
  - Authorization header with "Bearer " followed by your API key
  - Content-Type header set to "application/json"
- Create an async HTTP client with those headers and a 10 second timeout

**Why async client:**
When your API receives multiple requests, async lets them run concurrently without blocking each other. One request waiting for TMDB doesn't stop another request.

**Why 10 second timeout:**
If TMDB is down or slow, your request will fail after 10 seconds instead of hanging forever. Users get an error quickly rather than waiting indefinitely.

**Bearer token authentication:**
TMDB requires this specific format. "Bearer" is a type of HTTP authentication where the token itself proves identity. No username/password needed.

### Method 2: search_movies

**Purpose:**
Search for movies by title query.

**Parameters:**
- query (string) - What the user typed (e.g., "Inception")
- page (integer with default 1) - Which page of results

**What it should do:**
1. Construct the endpoint URL by combining base URL with "/search/movie"
2. Create params dictionary with query, page, and language set to "en-US"
3. Make async GET request with the URL and params
4. Call raise_for_status on the response (throws exception if 4xx/5xx error)
5. Return the parsed JSON as a Python dictionary

**Return value:**
Dictionary with keys: results (list of movies), page, total_pages, total_results

**Why language parameter:**
TMDB has data in many languages. Specifying "en-US" ensures you get English titles and overviews.

**Error handling:**
The raise_for_status call will throw an exception if TMDB returns an error. Let it bubble up - the API layer will catch and handle it.

### Method 3: get_movie_details

**Purpose:**
Get comprehensive information about a specific movie.

**Parameters:**
- movie_id (integer) - TMDB's movie ID

**What it should do:**
1. Construct URL: base URL + "/movie/" + movie_id
2. Create params dictionary with two entries:
   - append_to_response set to "credits,keywords"
   - language set to "en-US"
3. Make async GET request
4. Raise for status
5. Return parsed JSON

**The append_to_response trick:**
This is TMDB magic! Normally you'd need three separate requests:
- One for movie details
- One for credits (cast/crew)
- One for keywords

By using append_to_response, you get all three in ONE request. Massive performance win. The response will have nested credits and keywords objects.

**Why this is important:**
Your recommender needs credits and keywords to compute similarity. Without this parameter, you'd make 30+ API calls for 10 candidate movies. With it, you make 10 calls. Stays under TMDB's rate limits.

### Method 4: get_similar_movies

**Purpose:**
Get TMDB's own similar movies recommendation.

**Parameters:**
- movie_id (integer) - The movie to find similar ones for
- page (integer with default 1) - Page number

**What it should do:**
1. Construct URL: base URL + "/movie/" + movie_id + "/similar"
2. Create params with page and language
3. Make GET request
4. Raise for status
5. Return JSON

**How you'll use this:**
These become part of your candidate pool. TMDB's similar movies are decent - you're just re-ranking them with your own algorithm for better results.

### Method 5: discover_by_genres

**Purpose:**
Find movies that match specific genres, sorted by popularity.

**Parameters:**
- genre_ids (list of integers) - Genre IDs to match
- page (integer with default 1) - Page number

**What it should do:**
1. Construct URL: base URL + "/discover/movie"
2. Convert the genre_ids list to a comma-separated string (join them)
3. Create params dictionary with:
   - with_genres set to that comma-separated string
   - sort_by set to "popularity.desc"
   - page
   - language
4. Make GET request
5. Raise for status
6. Return JSON

**Why join with commas:**
TMDB expects genres as "28,12,878" not a JSON array. The comma format is their API spec.

**Why sort by popularity:**
You want well-known movies in your candidate pool. Obscure movies with few ratings might match on genre but aren't good recommendations.

**How you'll use this:**
After getting TMDB's similar movies, you'll expand the candidate pool with same-genre movies. This increases diversity and ensures you have enough candidates.

### Method 6: close

**Purpose:**
Clean up the HTTP client connection when shutting down.

**What it should do:**
Call aclose() on the HTTP client (async close method).

**When it's called:**
When your FastAPI app shuts down. You'll set up a shutdown event handler that calls this.

**Why it matters:**
Proper cleanup prevents resource leaks. In development it's not critical, but in production with thousands of requests, leaking connections causes problems.

### Creating the Singleton

After the class definition, at module level (no indentation), create one instance:

tmdb_service equals TMDBService()

This instance is created once when the module is first imported. Every other file imports this same instance.

### Error Handling Philosophy

This service lets errors bubble up. It doesn't try to catch and handle them. Why?

**Separation of concerns:**
- Service layer: Make requests, return data
- API layer: Handle errors, decide HTTP status codes
- If service tried to handle errors, it would need to know about HTTP responses (wrong layer)

**Specific errors to expect:**
- HTTPStatusError: TMDB returned 4xx or 5xx
- RequestError: Network problems
- TimeoutError: Request took longer than 10 seconds

The API layer will catch these and convert them to appropriate HTTP responses for your frontend.

### Rate Limiting Awareness

TMDB allows 40 requests per 10 seconds. With current design, you might hit this when fetching candidate details (30 requests rapidly).

**Solutions for later:**
- Add caching (cache responses for 5 minutes)
- Add delays between requests
- Pre-fetch popular movies offline

For now, be aware of it. If you see 429 errors, you're being rate limited.

### Testing Your Service

After writing this file, test it before moving on:

In Python console, import the service and settings, make sure you have a real API key in your env file, call the search method with a query like "Inception", inspect the returned dictionary, check that results key exists and contains movies.

Call get_movie_details with a known movie ID (like 550 for Fight Club), verify it returns title, credits with cast array, keywords with keywords array.

### What You're Learning

- **Async programming:** Using async/await for non-blocking IO
- **HTTP clients:** Making API requests properly
- **API integration:** Working with third-party APIs
- **Authentication:** Using Bearer tokens
- **Error handling:** Letting exceptions bubble up appropriately
- **Service layer pattern:** Separating data access from business logic

### Common Mistakes

❌ Forgetting the "Bearer " prefix in authorization header
❌ Not using async/await (service will block)
❌ Hardcoding URLs instead of using settings.tmdb_base_url
❌ Not testing with real API key before moving on
❌ Not handling the case where movie_id doesn't exist
❌ Forgetting to close HTTP client on shutdown

---

## FILE 6: `backend/app/recommender/__init__.py`

### When to Code This
After the TMDB service works and you understand the data

### Time Estimate
3-5 hours (this is the most complex file)

### What This File Does

This is the heart of your application - the machine learning recommendation engine. It takes a target movie and a list of candidates, extracts features from their metadata, computes similarity scores, blends them with weights, and returns ranked recommendations.

This is where you demonstrate real ML skills. Take your time with this one.

### The ContentBasedRecommender Class

**Why a class:**
- Encapsulates the TF-IDF vectorizer (stateful)
- Keeps all recommendation logic together
- Easy to test and modify
- Could be extracted into its own microservice later

### Class Structure Overview

**Constructor:**
Initialize the TF-IDF vectorizer with specific parameters.

**Seven methods:**
1. extract_features - Convert movie dict to feature dict
2. genre_similarity - Compute Jaccard similarity for genres
3. keyword_similarity - Compute Jaccard similarity for keywords
4. text_similarity - Compute cosine similarity for overviews (batch)
5. cast_crew_similarity - Compute people overlap
6. compute_similarity - Compute all similarities for all candidates
7. recommend - Public interface returning top K recommendations

**Singleton instance:**
One shared instance.

### Understanding the Algorithm Flow

Before coding, understand what you're building:

User views movie A → You fetch metadata for A → You fetch candidate movies B, C, D → For each candidate, you compute how similar it is to A using four different metrics → You blend those four scores into one final score → You sort by final score → You return the top 10.

### Method 1: Constructor

**What to initialize:**
Create a TfidfVectorizer object from scikit-learn.

**Parameters to set:**
- max_features to 500 (limit vocabulary to 500 most common words, keeps vectors manageable)
- stop_words to 'english' (removes common words like "the", "a", "is")
- ngram_range to (1, 2) (use both single words and two-word phrases)

**Why these parameters:**

Max features 500: Movie overviews are short (1-2 paragraphs). 500 words is plenty to capture meaning without bloating memory.

Stop words: "the" appears in every overview but tells you nothing about similarity. Removing them improves signal.

Ngram range (1, 2): Single words miss context. "time travel" as a phrase is more meaningful than "time" and "travel" separately. Including bigrams (2-word phrases) captures this.

**Store this vectorizer:**
It will be reused for every recommendation request.

### Method 2: extract_features

**Purpose:**
Convert a raw TMDB movie dictionary into a clean feature dictionary.

**Input:**
A dictionary representing one movie, with keys like 'genres', 'keywords', 'credits', 'overview'.

**Output:**
A dictionary with five keys:
- genre_ids (set of integers)
- keywords (set of lowercase strings)
- overview (string)
- cast_ids (set of integers for top 5 cast)
- director (string name or None)

**How to extract each:**

**Genre IDs:**
Navigate to the 'genres' key (if missing, use empty list). It's a list of dicts, each with 'id' and 'name'. Extract all IDs into a set. Sets automatically deduplicate and allow fast intersection/union operations.

**Keywords:**
Navigate to 'keywords' key, then nested 'keywords' key inside that (TMDB's structure is keywords.keywords). Each keyword has a 'name' field. Extract all names, convert to lowercase (for case-insensitive matching), put in a set.

**Overview:**
Simply get the 'overview' key (if missing, use empty string).

**Cast IDs:**
Navigate to 'credits' key, then 'cast' key inside that. Cast is a list of dicts, each with 'id', 'name', 'character'. Take only the first 5 elements (slice the list). Extract 'id' from each into a set. Top 5 because lead actors matter more than bit parts.

**Director:**
Navigate to 'credits', then 'crew'. Crew is a list of dicts with 'name' and 'job'. Loop through and find where 'job' equals 'Director'. Return that person's name. If multiple directors, take the first. If no director found, return None.

**Why sets:**
Sets give you fast membership testing and set operations (intersection, union) needed for Jaccard similarity.

**Edge cases:**
TMDB sometimes has incomplete data. A movie might have no keywords, no overview, missing credits. Your code must handle all these gracefully using dictionary get() with defaults.

### Method 3: genre_similarity

**Purpose:**
Compute how similar two sets of genres are using Jaccard Index.

**Parameters:**
- target_genres (set of integers)
- candidate_genres (set of integers)

**Algorithm:**
Check if either set is empty - if so, return 0.0 (can't compare nothing).

Compute intersection using set & operator (genres in both).

Compute union using set | operator (all unique genres across both).

Return: length of intersection divided by length of union.

**Example calculation:**
Target: {28, 12, 878} (Action, Adventure, Sci-Fi)
Candidate: {28, 878, 53} (Action, Sci-Fi, Thriller)
Intersection: {28, 878} - 2 items
Union: {28, 12, 878, 53} - 4 items
Score: 2/4 = 0.5

**Result range:**
Always between 0.0 (no overlap) and 1.0 (identical).

**Why Jaccard:**
It's symmetric (A to B equals B to A), normalized (easy to blend with other scores), and intuitive (shared items over total items).

### Method 4: keyword_similarity

**Purpose:**
Same as genre_similarity but for keyword sets.

**Implementation:**
Identical algorithm to genre_similarity. You could even make one generic set_similarity method and use it for both.

**Why separate method:**
Clarity. Reading code, you see "keyword_similarity" and immediately understand what it does. Generic "set_similarity" requires more mental overhead.

### Method 5: text_similarity

**Purpose:**
Compute TF-IDF based cosine similarity between target overview and all candidate overviews.

**Parameters:**
- target_overview (string)
- candidate_overviews (list of strings)

**Output:**
NumPy array of similarity scores, one per candidate.

**Algorithm:**

**Step 1: Edge case handling**
If target is empty or candidates list is empty, return array of zeros with length matching candidates.

**Step 2: Combine texts**
Create a list starting with target overview, followed by all candidate overviews. This will be one list with (1 + number of candidates) items.

**Step 3: Fit TF-IDF**
Call fit_transform on your vectorizer with that combined list. This returns a sparse matrix where:
- Each row is a document (movie overview)
- Each column is a word
- Each value is that word's TF-IDF score in that document

**Step 4: Extract vectors**
The first row (index 0) is your target. The remaining rows (index 1 onwards) are your candidates. Slice them into two separate matrices. Keep the target as a 2D matrix (row vector) even though it's one row.

**Step 5: Compute cosine similarity**
Call cosine_similarity function from scikit-learn passing target vector and candidate vectors. This returns a matrix, but since target is one row, you get one row of results. Extract that row (index 0) to get a 1D array.

**Step 6: Return**
Return that array of scores.

**Why batch process:**
Computing TF-IDF once for all documents together is much faster than computing it separately for each candidate. The vectorizer learns vocabulary across all documents, giving better features.

**Cosine similarity explained:**
Imagine each overview as an arrow in 5000-dimensional space (one dimension per word). Cosine similarity measures the angle between arrows. Parallel arrows (same direction) score 1.0. Perpendicular arrows score 0.0. It ignores length - a longer overview with the same words scores the same.

**Why this works:**
Overviews with similar plot descriptions will use similar vocabulary, giving similar TF-IDF vectors, resulting in high cosine similarity.

### Method 6: cast_crew_similarity

**Purpose:**
Compute similarity based on shared actors and director.

**Parameters:**
- target_cast (set of actor IDs)
- target_director (string name or None)
- candidate_cast (set of actor IDs)
- candidate_director (string name or None)

**Algorithm:**

**Step 1: Initialize score**
Start with 0.0.

**Step 2: Cast overlap**
If target cast is not empty:
- Compute intersection of target_cast and candidate_cast
- Divide intersection size by target cast size (normalization)
- Multiply by 0.6 (60% weight for cast)
- Add to score

**Step 3: Director match**
If both have directors AND they're the same name:
- Add 0.4 to score (40% weight for director)

**Step 4: Return**
Return the final score (between 0.0 and 1.0).

**Why normalize by target cast size:**
Prevents bias. A movie with 50 cast members might share 10 with the target. A movie with 10 cast members sharing the same 10 people is more similar. Dividing by target size makes it fair.

**Why weight director higher:**
Director influences style, tone, pacing, visual aesthetic. Shared director is a stronger signal than shared actor. Christopher Nolan films feel like Nolan films regardless of cast.

**Why 60/40 split:**
Subjective, but reasonable starting point. You can tune this later.

### Method 7: compute_similarity

**Purpose:**
Orchestrate all similarity computations for all candidates and blend the scores.

**Parameters:**
- target_movie (dictionary) - The movie user is viewing
- candidates (list of dictionaries) - Movies to compare against

**Output:**
List of tuples: (candidate_movie_dict, final_score), sorted by score descending.

**Algorithm:**

**Step 1: Extract target features**
Call extract_features on target_movie. Store the result.

**Step 2: Extract candidate features**
Loop through candidates, call extract_features on each, store all results in a list.

**Step 3: Batch process text similarities**
Extract just the overview from each candidate's features into a list. Call text_similarity with target overview and that list. You get back an array of scores.

**Step 4: Loop through candidates**
For each candidate (with its index for accessing the text scores array):

**Step 4a: Compute genre similarity**
Call genre_similarity with target genres and this candidate's genres.

**Step 4b: Compute keyword similarity**
Call keyword_similarity with target keywords and this candidate's keywords.

**Step 4c: Get text similarity**
Index into the text scores array at this candidate's position.

**Step 4d: Compute cast/crew similarity**
Call cast_crew_similarity with all four parameters (target cast, target director, candidate cast, candidate director).

**Step 4e: Blend scores**
Multiply genre similarity by 0.30, keyword similarity by 0.25, text similarity by 0.30, cast/crew similarity by 0.15. Add them all together. This is your final score.

**Step 4f: Store result**
Append a tuple: (candidate dict, final score) to your results list.

**Step 5: Sort**
Sort the results list by score (second element of tuple) in descending order. Use reverse=True.

**Step 6: Return**
Return the sorted list.

**Weight justification:**

30% genre: Strong, reliable signal. People search by genre.
30% text: Rich information, captures nuance.
25% keywords: Semantic middle ground.
15% cast/crew: Supporting signal.

These sum to 1.0 (100%). They're starting weights - experiment with different combinations!

### Method 8: recommend

**Purpose:**
Public interface - clean, simple method API routes will call.

**Parameters:**
- target_movie (dict)
- candidates (list of dicts)
- top_k (integer with default 10) - How many recommendations to return

**Algorithm:**
Call compute_similarity to get sorted list of all scored candidates. Slice the list to first top_k items. Return that slice.

**Why a wrapper:**
Separates the interface from the implementation. If you change how compute_similarity works, this method's signature stays the same. API routes don't break.

### Creating the Singleton

After class definition, create one instance:

recommender equals ContentBasedRecommender()

### Testing Your Recommender

This is critical. Before integrating with your API, test the recommender in isolation.

**Test 1: Feature extraction**
Create a mock movie dict with genres, keywords, credits, overview. Call extract_features. Print the result. Verify all five keys are present and look correct.

**Test 2: Genre similarity**
Create two sets: {28, 12, 878} and {28, 878, 53}. Call genre_similarity. Should return 0.5.

**Test 3: Text similarity**
Create a target overview: "A thief uses dream technology." Create candidate overviews: one similar ("A thief enters dreams"), one dissimilar ("A comedy about cats"). Call text_similarity. First candidate should score higher than second.

**Test 4: Full recommendation**
Fetch a real movie from TMDB (using your service), fetch similar movies as candidates, call recommend, inspect the results, check scores are between 0 and 1, check they're sorted descending.

### Tuning and Experimentation

After your app works end-to-end, come back and experiment:

**Weight tuning:**
Try [0.4, 0.2, 0.3, 0.1] (emphasize genres).
Try [0.2, 0.2, 0.5, 0.1] (emphasize text).
Compare results. Which feels better?

**Additional features:**
Add runtime similarity (prefer movies of similar length).
Add release year proximity (prefer movies from similar era).
Add vote average (boost highly-rated movies).

**Different algorithms:**
Try sentence embeddings instead of TF-IDF (more advanced NLP).
Try collaborative filtering if you add user accounts.

### What You're Learning

- **Feature engineering:** Converting raw data to numerical features (the most important ML skill)
- **Similarity metrics:** Jaccard, cosine, weighted overlap
- **TF-IDF:** Classic NLP technique still widely used
- **Score blending:** Combining multiple signals
- **Content-based filtering:** Core recommendation technique
- **Algorithm design:** Making trade-offs, choosing weights

This is real machine learning work. Not deep learning with neural networks, but foundational techniques that power real production systems.

### Common Mistakes

❌ Forgetting to handle empty sets/strings (crashes on edge cases)
❌ Not normalizing scores before blending (one metric dominates)
❌ Ignoring sparse TF-IDF matrix format (memory issues with large vocabularies)
❌ Processing candidates one at a time instead of batching (slow)
❌ Not testing with real TMDB data before integrating

---

(Continuing in next message due to length...)