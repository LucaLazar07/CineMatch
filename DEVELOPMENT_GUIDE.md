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

## FILE 7: `backend/app/api/__init__.py`

### When to Code This
After recommender, schemas, and service are all working

### Time Estimate
90-120 minutes

### What This File Does

This is your API layer - the FastAPI route handlers that connect HTTP requests to your business logic. It receives requests from the frontend, validates inputs, calls the service and recommender, transforms data into schemas, handles errors, and returns responses.

Think of it as the waiter in a restaurant: takes orders (requests), talks to the kitchen (service/recommender), brings food (responses).

### The APIRouter

You'll create an APIRouter object (not the full FastAPI app - that's in main.py). The router groups related endpoints together.

**Why a router:**
- Separation of concerns (routes in one place)
- Can add prefix to all routes (like "/api/v1")
- Can be included in multiple apps (reusability)

### The Four Routes You'll Build

#### Route 1: POST /search

**Purpose:** Search for movies by title

**Request body:** Should expect a JSON object with:
- query (string, required, minimum length 1)
- page (optional integer, default 1)

**Process:**
1. Define a Pydantic model for the request body right in this file (or at the top with the other imports). This model validates incoming JSON.
2. Use that model as the parameter type in the route function.
3. Call tmdb_service.search_movies with the query and page.
4. The raw response is a dict with results, page, total_pages, total_results.
5. Transform the results list: Loop through each raw movie dict and create a MovieSummary schema from it. You'll need to extract the right fields.
6. Create a SearchResponse schema with the transformed results and the pagination metadata.
7. Return that SearchResponse. FastAPI auto-serializes it to JSON.

**HTTP method why POST:**
Even though this is a read operation, you're sending a JSON body. POST is clearer than GET with body (which is discouraged).

**Error handling:**
Wrap the service call in try/except. Catch HTTPStatusError from httpx. If caught, check the status code:
- 404: Raise HTTPException with 404 status and message "No results found"
- 429: Raise HTTPException with 429 status and message "Too many requests, please try again later"
- Other: Raise HTTPException with 500 status and generic message

**Why transform to schemas:**
Raw TMDB JSON has 50+ fields. Your frontend only needs the fields in MovieSummary. Sending less data = faster response = better mobile experience.

#### Route 2: GET /movie/{movie_id}

**Purpose:** Get full details for a specific movie

**Path parameter:**
- movie_id (integer) - Part of the URL path

**Process:**
1. Define route with path parameter syntax.
2. Call tmdb_service.get_movie_details with the movie_id.
3. The raw response is a complex nested dict with movie info, credits object (with cast and crew lists), and keywords object (with keywords list).
4. Transform to MovieDetail schema:
   - Extract basic fields (id, title, overview, etc.) directly.
   - Transform genres list: Loop through genres, create Genre schema for each.
   - Transform cast list: Take first 10 from credits.cast, create CastMember schema for each.
   - Transform crew list: Filter credits.crew to only Directors, Writers, Producers. Create CrewMember schema for each.
   - Transform keywords: Extract from keywords.keywords (yes, nested), get just the name strings into a list.
5. Return the MovieDetail schema.

**HTTP method why GET:**
True read operation, no body needed, ID in URL is RESTful.

**Error handling:**
Same try/except pattern. Additionally catch 404 specifically - movie ID doesn't exist. Return "Movie not found".

**Why limit cast to 10:**
Most users recognize lead actors. Showing 50 cast members clutters the UI and increases response size.

**Why filter crew:**
TMDB has hundreds of crew roles (Best Boy, Gaffer, Key Grip, etc.). Most users only care about Director, Writer, Producer. Filtering makes data actionable.

#### Route 3: POST /recommendations

**Purpose:** Get content-based recommendations for a movie

**Request body:** JSON object with:
- movie_id (integer, required)
- top_k (optional integer, default 10, maximum 50)

**Validation:**
Use Field with gt=0 (greater than zero) and le=50 (less than or equal 50) for top_k. Prevents abuse.

**Process:**

**Step 1: Fetch target movie**
Call tmdb_service.get_movie_details with movie_id. This is the movie the user is viewing.

**Step 2: Build candidate pool**
Call tmdb_service.get_similar_movies with movie_id. This gives you TMDB's similar movies (page 1, which is 20 movies).

Extract genre IDs from the target movie. Call tmdb_service.discover_by_genres with those genre IDs. This gives you popular movies in same genres.

Combine both lists. Deduplicate based on movie ID (use a dict with ID as key, then extract values).

**Step 3: Run recommender**
Call recommender.recommend with target movie, candidates, and top_k.

This returns a list of tuples: (movie_dict, score).

**Step 4: Transform to response schema**
Loop through each result tuple:
- Extract the movie dict and score
- Create a MovieSummary schema from the movie dict
- Create a RecommendationItem schema with the MovieSummary, score, and a reason string
- For the reason, you can generate it from the features: check which genres overlap, mention them. Or just say "Based on similar genres and themes" for simplicity.

Put all RecommendationItem objects in a list.

Create a RecommendationResponse schema with that list.

Return it.

**Error handling:**
If movie_id doesn't exist, tmdb_service.get_movie_details will throw 404. Catch it and return "Movie not found".

If no candidates are found (rare), return an empty recommendations list rather than erroring.

**Why this candidate strategy:**
TMDB's similar movies are decent but limited to 20. Adding genre discovery expands the pool to 40+ movies, giving the recommender more options. Better recommendations result.

**Why deduplicate:**
Same movie might appear in both similar and genre discovery results. Deduplicating prevents the recommender from scoring the same movie twice.

#### Route 4: GET /health

**Purpose:** Health check endpoint for monitoring

**Process:**
Just return a JSON object with "status": "healthy".

**Why this endpoint:**
When deploying to production, monitoring systems ping this endpoint to check if the service is up. If it doesn't respond or returns an error, alerts fire.

It's also useful during development - a quick way to test if your server is running.

**HTTP method:**
GET - simple, no parameters.

### Request/Response Models

At the top of your file (after imports, before routes), define the Pydantic models for request bodies:

**SearchRequest:**
- query: str with Field(min_length=1)
- page: int with default 1

**RecommendationRequest:**
- movie_id: int
- top_k: int with default 10, Field(gt=0, le=50)

**Why separate request models:**
Clear contract for what the endpoint expects. Auto-generates API docs showing required fields.

### Dependency Injection

FastAPI supports dependency injection - pass the settings object as a parameter with Depends(). This makes testing easier (you can inject mocks).

For now, you can directly import settings, tmdb_service, and recommender. As you advance, refactor to use Depends().

### Response Models

Use the response_model parameter in route decorators. This tells FastAPI:
- Validate the response (catches bugs where you return wrong data)
- Auto-generate docs showing response structure
- Serialize Pydantic models to JSON

### Status Codes

Specify status codes explicitly:
- 200 for successful GET
- 201 for successful POST creating something (not applicable here)
- 404 for not found
- 429 for rate limit exceeded
- 500 for server errors

Use FastAPI's status module for constants like status.HTTP_200_OK.

### CORS Headers

CORS will be handled in main.py middleware, not in routes. Routes don't need to think about CORS.

### Testing Your API

After writing all routes, test them:

**Start your server:**
Run uvicorn with your main:app.

**Use Swagger docs:**
Navigate to http://localhost:8000/docs (FastAPI auto-generates this). You'll see all your endpoints with "Try it out" buttons. Test each one.

**Test search:**
Search for "Inception". Should return results with pagination.

**Test movie details:**
Get details for movie ID 27205 (Inception's ID). Should return full details with cast, crew, genres, keywords.

**Test recommendations:**
Get recommendations for 27205. Should return 10 similar movies with scores.

**Test health:**
Should return status healthy.

### What You're Learning

- **REST API design:** HTTP methods, status codes, resource-based URLs
- **FastAPI framework:** Route decorators, dependency injection, auto docs
- **Error handling:** Try/except, translating exceptions to HTTP errors
- **Data transformation:** Raw data to schemas, business logic
- **API documentation:** Self-documenting code with Pydantic

### Common Mistakes

❌ Returning raw dicts instead of schema objects (no validation)
❌ Not handling TMDB errors (crashes on API failures)
❌ Forgetting to deduplicate candidates (same movie scored twice)
❌ Not limiting top_k parameter (users request 10000 recommendations)
❌ Using sync code instead of async (blocks the event loop)

---

## FILE 8: `backend/main.py`

### When to Code This
After all other backend files are complete

### Time Estimate
30-45 minutes

### What This File Does

This is the entry point - where your FastAPI application is created, configured, and launched. It's the main coordinator that brings everything together.

### The FastAPI App Instance

Create a FastAPI instance with specific parameters:

**Title parameter:**
Set to "CineMatch API" - appears in docs.

**Description parameter:**
Brief description like "Movie recommendation API using content-based filtering".

**Version parameter:**
Start with "1.0.0" - follows semantic versioning.

**Why these matter:**
They populate the automatic API documentation at /docs. Professional touch for a portfolio project.

### CORS Middleware

Add CORS middleware to your app. This allows your React Native frontend to call your API from different origins.

**Import:**
You'll need CORSMiddleware from fastapi.middleware.cors.

**Parameters:**
- allow_origins: List of origins that can call your API. In development, use ["*"] (allow all). In production, specify your frontend's exact URL.
- allow_credentials: Set to True.
- allow_methods: Use ["*"] (allow all HTTP methods).
- allow_headers: Use ["*"] (allow all headers).

**Why CORS is needed:**
Browsers block cross-origin requests by default for security. Your frontend (on localhost:19006 or a phone) making requests to your backend (on localhost:8000) is cross-origin. CORS middleware adds headers that tell the browser it's allowed.

**Development vs production:**
In dev, ["*"] is convenient. In production, specify exact domains: ["https://yourdomain.com"]. Wildcard in production is a security risk.

### Including the API Router

Import your router from app.api. Include it in the app with a prefix.

Use app.include_router, pass the router object, set prefix to "/api", set tags to ["movies"] (for docs organization).

**Why prefix:**
All routes become /api/search, /api/movie/{id}, etc. This is a versioning strategy - later you could add /api/v2 with breaking changes while keeping /api or /api/v1 stable.

**Tags:**
Organize endpoints in the Swagger docs. All movie-related endpoints appear under "movies" section.

### Startup Event

Define a startup event handler function. This runs once when the server starts.

**What to do in startup:**
- Print a message: "Starting CineMatch API..."
- Optionally, validate that settings are loaded correctly (check if TMDB API key exists)

**Why startup events:**
Initialize resources that need to be ready before handling requests. Could pre-load data, establish database connections (if you had a database), warm up caches, etc.

### Shutdown Event

Define a shutdown event handler function. This runs when the server stops.

**What to do in shutdown:**
- Print a message: "Shutting down CineMatch API..."
- Call tmdb_service.close() to close the HTTP client

**Why shutdown events:**
Clean up resources. Close connections, save state, flush caches. Prevents resource leaks.

### Root Endpoint

Define a GET route at "/" (root).

Return a simple JSON object with:
- message: "Welcome to CineMatch API"
- docs: "/docs"
- health: "/api/health"

**Why:**
Provides entry point information. If someone visits your API URL, they know where to find docs and health check.

### Running the Server

At the bottom of the file, add the standard Python main block:

if __name__ equals "__main__":
    Import uvicorn
    Run uvicorn with "main:app", host from settings, port from settings, reload=True

**Parameters explained:**

"main:app" - Tells uvicorn to import main module and look for app variable.

host from settings - Allows binding to specific interface. "0.0.0.0" makes it accessible from other devices on your network (useful for testing on phone). "127.0.0.1" only allows local access.

port from settings - Typically 8000. Configurable via environment variable.

reload=True - Auto-restart server when code changes. Only use in development! In production, set to False.

### Testing Your Complete Backend

This is the moment of truth:

**Step 1: Start the server**
Run the file directly with Python. Or use uvicorn command: uvicorn main:app --reload.

**Step 2: Check the logs**
Should see "Starting CineMatch API..." message, followed by uvicorn logs showing server is running on your host:port.

**Step 3: Visit the docs**
Open browser, go to http://localhost:8000/docs. You should see Swagger UI with all your endpoints documented.

**Step 4: Test root endpoint**
Go to http://localhost:8000/ - should see the welcome message.

**Step 5: Test health**
Use the docs or curl to hit /api/health - should return healthy status.

**Step 6: Test full flow**
Search for a movie, get its details, get recommendations. Trace the flow: FastAPI receives request → routes to API handler → handler calls service → service calls TMDB → data returns → schema transformation → response sent.

**Step 7: Stop the server**
Ctrl+C in terminal. Should see "Shutting down CineMatch API..." message.

### What You're Learning

- **Application structure:** How web frameworks organize code
- **Middleware:** Cross-cutting concerns like CORS
- **Lifecycle events:** Startup and shutdown hooks
- **Server deployment:** Running ASGI servers with uvicorn
- **API documentation:** Auto-generated docs with Swagger

### Common Mistakes

❌ Forgetting to include the router (routes don't work)
❌ Not adding CORS middleware (frontend gets CORS errors)
❌ Using wrong host (can't access from phone)
❌ Setting reload=True in production (slow, resets state)
❌ Not closing HTTP client on shutdown (resource leak)

---

## FRONTEND DEVELOPMENT

Now we move to the React Native frontend. The backend is complete and testable. The frontend will consume your API.

---

## FILE 9: `frontend/package.json`

### When to Code This
First frontend file to create/edit

### Time Estimate
15-20 minutes

### What This File Does

This is your Node.js project manifest. It defines:
- Project metadata (name, version)
- Dependencies (libraries you need)
- Scripts (commands you'll run)

### The Dependencies Section

List all libraries your app needs:

**Core dependencies:**
- expo - The Expo framework itself (SDK version ~50.0.0 or latest)
- react - React library (version compatible with Expo, usually ~18.2.0)
- react-native - React Native core (version comes from Expo)
- expo-status-bar - Handles status bar styling

**Navigation:**
- @react-navigation/native - Core navigation library
- @react-navigation/native-stack - Stack navigator for screen transitions
- react-native-screens - Native screen management (required by navigation)
- react-native-safe-area-context - Handle device notches/safe areas (required by navigation)

**HTTP client:**
- axios - For making API requests

**UI/UX:**
- expo-linear-gradient - Gradient backgrounds (optional, for polish)

**Why these specific libraries:**

Expo: Framework that simplifies React Native development. Handles native modules without Xcode/Android Studio.

React Navigation: Most popular navigation library. Stack navigator gives you push/pop screen behavior like native apps.

Axios: Cleaner API than fetch, handles request/response transformations easily.

### The DevDependencies Section

Libraries needed only during development:

- @babel/core - JavaScript compiler (required by React Native)

Typically minimal because Expo handles most dev tooling.

### The Scripts Section

Define npm commands:

**"start" script:**
Runs "expo start" - starts the development server.

**"android" script:**
Runs "expo start --android" - starts server and opens on Android emulator/device.

**"ios" script:**
Runs "expo start --ios" - starts server and opens on iOS simulator (Mac only).

**"web" script:**
Runs "expo start --web" - runs in web browser (for quick testing).

**Why these scripts:**
Convenient shortcuts. Instead of typing "expo start --android", you just run "npm run android".

### Version Considerations

Use tilde (~) or caret (^) prefixes:
- Tilde (~1.2.3) - Allow patch updates (1.2.4, 1.2.5 but not 1.3.0)
- Caret (^1.2.3) - Allow minor updates (1.3.0, 1.4.0 but not 2.0.0)

For Expo projects, usually use caret to get minor updates (bug fixes and features) but avoid breaking changes.

### The Private Field

Set "private": true - prevents accidental publishing to npm registry. Your app is not a library, so it shouldn't be published.

### After Creating This File

Run "npm install" (or "yarn install") in the frontend directory. This reads package.json and downloads all dependencies into node_modules folder.

**Check that it works:**
Should complete without errors. If you see dependency conflict warnings, that's usually okay. If you see errors, Google the error message - usually fixable by updating versions.

### What You're Learning

- **Package management:** How npm/yarn work
- **Dependency graphs:** Libraries depend on other libraries
- **Semantic versioning:** Major.minor.patch version numbers
- **Build tooling:** The ecosystem around JavaScript projects

### Common Mistakes

❌ Mismatched versions (Expo 50 with React 17 - incompatible)
❌ Forgetting to run npm install after creating file
❌ Adding dependencies manually instead of using npm install <package>
❌ Not setting private: true (accidentally publishable)

---

## FILE 10: `frontend/app.json`

### When to Code This
After package.json

### Time Estimate
15-20 minutes

### What This File Does

Expo configuration file. Defines app settings, icons, splash screen, build configurations, and more.

### The Expo Configuration Object

Your file contains one large JSON object with an "expo" key.

**Essential fields:**

**name:**
"CineMatch" - Human-readable app name, shown under icon on home screen.

**slug:**
"cinematch" - URL-safe identifier, used in Expo Go and URLs.

**version:**
"1.0.0" - Your app's version number. Increment with each release.

**orientation:**
"portrait" - Lock to portrait mode. Users can't rotate to landscape. If you want to allow rotation, use "default".

**icon:**
"./assets/icon.png" - Path to app icon image (1024x1024 PNG recommended).

**splash:**
Object with:
- image: "./assets/splash.png"
- resizeMode: "contain"
- backgroundColor: "#1a1a1a" (dark background)

Splash screen shows while app loads.

**platforms:**
Array: ["ios", "android"] - Which platforms you're targeting. You can also include "web" if supporting web browsers.

**ios:**
Object with:
- supportsTablet: true - App works on iPads
- bundleIdentifier: "com.yourname.cinematch" - Unique identifier for App Store (reverse domain format)

**android:**
Object with:
- adaptiveIcon: Object with foreground and background images
- package: "com.yourname.cinematch" - Unique identifier for Play Store (reverse domain format)
- versionCode: 1 - Integer version for Android (increment with each release)

**extra:**
Object for custom config you want to access in your code. Add:
- apiUrl: "http://192.168.1.100:8000/api" - Your backend URL

**Why apiUrl here:**
You'll access it using expo-constants. Easier than hardcoding in files. Can have different URLs for dev/staging/production.

**Replace the IP address:**
Use your computer's local network IP (run "ifconfig" on Mac/Linux or "ipconfig" on Windows). Don't use localhost - it won't work from a phone.

### Assets

You need two images:

**icon.png (in assets folder):**
1024x1024 PNG, transparent or solid background. Your app's logo.

**splash.png (in assets folder):**
2048x2048 PNG. Shown while app loads.

For now, you can use placeholder images or simple colored squares. Design them later.

### Bundle Identifiers

**Format:** com.yourname.appname

**Rules:**
- All lowercase
- Reverse domain notation (com.myname.myapp)
- Must be globally unique
- Used by app stores to identify your app

**Choose carefully:**
Can't change after publishing to app stores. Use your real domain if you have one, or use a pattern like com.github.yourusername.cinematch.

### Version Numbers

**version (string):**
Semantic version shown to users. "1.0.0" → "1.1.0" → "2.0.0"

**versionCode (Android integer):**
Internal version. Must increment with every release. 1 → 2 → 3. Google Play won't accept a build with same or lower versionCode.

### Testing Your Configuration

After creating app.json, run "expo start". Expo validates the config file. If there are errors, they'll show in terminal.

Use Expo Go app on your phone:
1. Download Expo Go from app store
2. Run "expo start" on computer
3. Scan the QR code with your phone
4. App should load (might be blank screen - that's okay, we haven't added UI yet)

### What You're Learning

- **Mobile app configuration:** Platform-specific settings
- **Asset management:** Icons, splash screens
- **App identifiers:** Bundle IDs, package names
- **Expo ecosystem:** How Expo simplifies React Native

### Common Mistakes

❌ Using localhost for apiUrl (doesn't work on phone)
❌ Not using correct image dimensions (icon looks blurry)
❌ Typos in bundle identifier (can't publish)
❌ Forgetting to increment versionCode for Android updates

---

## FILE 11: `frontend/eas.json`

### When to Code This
After app.json, before building APK

### Time Estimate
10-15 minutes

### What This File Does

Configuration for EAS Build - Expo's cloud build service. This is how you'll generate the APK file for Android without needing Android Studio locally.

### The Build Profiles

You define different profiles for different purposes:

**development profile:**
For internal testing. Includes dev tools, connects to localhost.

**preview profile:**
For QA testing. Like production but faster builds.

**production profile:**
For release to Google Play Store. Fully optimized.

### Structure

Top-level keys:
- cli: Configuration for EAS CLI
- build: Build profiles

**cli section:**
- version: "latest" - Use latest CLI version

**build section:**

**development profile:**
- developmentClient: true - Includes Expo dev client
- distribution: "internal" - Not for stores
- android: Object with buildType: "apk" or "apk"

**preview profile:**
- distribution: "internal"
- android: Object with buildType: "apk"

**production profile:**
- android: Object with buildType: "app-bundle" - AAB format for Play Store

**APK vs AAB:**
- APK: Single file installable directly on Android devices
- AAB (Android App Bundle): Optimized format for Play Store, smaller downloads

For testing, you want APK. For publishing, you need AAB.

### Building Your First APK

After creating this file:

**Step 1: Install EAS CLI**
Run "npm install -g eas-cli" globally.

**Step 2: Login to Expo**
Run "eas login" and use your Expo account (create one at expo.dev if needed).

**Step 3: Configure project**
Run "eas build:configure" in your frontend folder. This may add/update eas.json.

**Step 4: Start build**
Run "eas build --platform android --profile preview".

**Step 5: Wait**
Build happens in the cloud. Takes 10-20 minutes. You'll get a URL to download the APK when done.

**Step 6: Install**
Transfer APK to your Android device and install it. You may need to enable "Install from unknown sources" in settings.

### Free Tier Limits

Expo offers free builds but with limits (number of builds per month). Check current limits on expo.dev. For your project, preview builds are usually enough during development.

### What You're Learning

- **Mobile app building:** How native apps are compiled
- **Cloud build services:** Remote building without local setup
- **Distribution formats:** APK vs AAB
- **CI/CD concepts:** Automated building and deployment

### Common Mistakes

❌ Forgetting to install EAS CLI (command not found)
❌ Not being logged in to Expo account (build fails)
❌ Using wrong profile (production when you want testing)
❌ Exceeding free tier build limits (builds queued indefinitely)

---

## FILE 12: `frontend/App.js`

### When to Code This
After expo configuration files

### Time Estimate
30-40 minutes

### What This File Does

The root component of your React Native app. It sets up navigation, wraps the app with providers, and defines the overall structure.

### Import Organization

**React imports:**
React and hooks (useState, useEffect) from 'react'.

**React Native imports:**
StatusBar from 'expo-status-bar'.

**Navigation imports:**
NavigationContainer from '@react-navigation/native'.
createNativeStackNavigator from '@react-navigation/native-stack'.

**Screen imports:**
Import your screen components (HomeScreen, MovieDetailScreen, SearchResultsScreen).

### Creating the Navigator

Call createNativeStackNavigator to create a Stack object. This gives you Stack.Navigator and Stack.Screen components.

**Stack Navigator pattern:**
Push screens onto a stack, pop them off. Like a deck of cards - new screen slides on top, back button removes the top card.

### The App Component

Your main component function:

**Return structure:**
NavigationContainer wrapping Stack.Navigator wrapping multiple Stack.Screen components.

**NavigationContainer:**
Required wrapper for all navigation. Manages navigation state.

**Stack.Navigator:**
The container for your stack of screens.

**Configuration:**
- initialRouteName: "Home" - Which screen shows first
- screenOptions: Object with style options applying to all screens

**Screen options:**
- headerStyle: backgroundColor "#1a1a1a" (dark theme)
- headerTintColor: "#ffffff" (white text)
- headerTitleStyle: fontWeight "bold"

### Defining Screens

Inside Stack.Navigator, add Stack.Screen components:

**Screen 1: Home**
- name: "Home"
- component: HomeScreen
- options: Object with title: "CineMatch"

**Screen 2: MovieDetail**
- name: "MovieDetail"
- component: MovieDetailScreen
- options: Object with title: "Movie Details"

**Screen 3: SearchResults**
- name: "SearchResults"
- component: SearchResultsScreen
- options: Object with title: "Search Results"

**Name vs title:**
- name: Used in code to navigate (navigation.navigate("Home"))
- title: Shown in the header bar

### StatusBar Component

At the end, before closing tags, add StatusBar component with style="light" (makes status bar icons white on dark background).

### Navigation Flow

User opens app → NavigationContainer initializes → Stack.Navigator renders Home screen → User taps a movie → navigate("MovieDetail", { movieId: 123 }) → MovieDetailScreen pushes on top → User presses back → MovieDetailScreen pops off, Home screen visible again.

### Passing Parameters

When navigating, pass params as second argument:

navigation.navigate("MovieDetail", { movieId: 27205 })

The MovieDetailScreen component receives route prop with params:

route.params.movieId equals 27205

### Testing This File

After writing (but before screens are built), you'll get errors about missing screen components. That's expected.

Create placeholder screen components temporarily:
- Each screen just returns a View with Text saying the screen name
- Test that navigation works (buttons to navigate between screens)
- Verify header styling
- Once confirmed, build out the real screens

### What You're Learning

- **React component structure:** How components compose
- **React Navigation:** Stack-based navigation pattern
- **Props and params:** Passing data between screens
- **App initialization:** Setting up the root component

### Common Mistakes

❌ Forgetting NavigationContainer wrapper (navigation errors)
❌ Mismatched screen names (navigate("MovieDetails") but screen named "MovieDetail")
❌ Not importing screen components (undefined component errors)
❌ Wrong initialRouteName (app crashes or shows wrong screen)

---

## FILE 13: `frontend/src/services/api.js`

### When to Code This
Before building screens (screens will need this)

### Time Estimate
45-60 minutes

### What This File Does

Your API client - handles all HTTP communication with your backend. Screens call functions from this file instead of making axios requests directly.

**Benefits:**
- Centralized URL management
- Consistent error handling
- Easy to mock for testing
- If API changes, update one file

### Import and Configuration

Import axios.

Import Constants from expo-constants (to access the apiUrl from app.json).

Create a base URL variable: get it from Constants.expoConfig.extra.apiUrl or fall back to a default like "http://localhost:8000/api".

Create an axios instance with axios.create(), passing baseURL set to that URL. This preconfigures axios.

### Error Handling Helper

Define a function to handle errors consistently.

**Function: handleApiError**
**Parameter:** error (the caught exception)

**Logic:**
Check if error.response exists (means server responded with error status).

If it exists:
- Extract status and data from error.response
- Log the error with console.error
- Throw a new Error with a message like "API Error (status): message from data"

If error.response doesn't exist:
- It's a network error (server not reachable)
- Log it
- Throw new Error "Network error: check backend is running"

**Why a helper:**
Every API function will use the same error handling pattern. Don't repeat yourself.

### The Five API Functions

#### Function 1: searchMovies

**Purpose:** Search for movies by title

**Parameters:**
- query (string) - search term
- page (number) - default 1

**Implementation:**
Try block:
- Call axios instance's post method with "/search" and a body object containing query and page
- Return response.data

Catch block:
- Call handleApiError with the error

**Return value:**
SearchResponse object with results array and pagination metadata.

**Usage example:**
Screen calls searchMovies("Inception") → gets array of movie summaries back → renders them in a list.

#### Function 2: getMovieDetails

**Purpose:** Get full details for a movie

**Parameters:**
- movieId (number)

**Implementation:**
Try block:
- Call axios instance's get method with "/movie/${movieId}" (template string)
- Return response.data

Catch block:
- Call handleApiError

**Return value:**
MovieDetail object with all fields (cast, crew, genres, etc.).

**Usage example:**
User taps movie 27205 → Screen calls getMovieDetails(27205) → gets full movie object → displays on detail screen.

#### Function 3: getRecommendations

**Purpose:** Get content-based recommendations

**Parameters:**
- movieId (number)
- topK (number) - default 10

**Implementation:**
Try block:
- Call axios instance's post method with "/recommendations" and body { movie_id: movieId, top_k: topK }
- Return response.data.recommendations (extract just the recommendations array from the response)

Catch block:
- Call handleApiError

**Return value:**
Array of RecommendationItem objects (each has movie, score, reason).

**Usage example:**
On movie detail screen, call getRecommendations(27205) → get array of 10 similar movies → display in "You might also like" section.

#### Function 4: checkHealth

**Purpose:** Check if backend is reachable

**Parameters:** None

**Implementation:**
Try block:
- Call axios instance's get method with "/health"
- Return response.data

Catch block:
- Call handleApiError

**Return value:**
Object with status: "healthy".

**Usage example:**
On app startup, call checkHealth() to verify backend is running. If it throws error, show alert to user: "Can't connect to server".

#### Function 5: searchByGenre (optional bonus)

If you want to add genre filtering:

**Parameters:**
- genreId (number)

**Implementation:**
You could add a /genres/{genreId} endpoint to your backend that uses discover_by_genres. Not essential for MVP but nice to have.

### Exporting the API

Export an object containing all functions:

export default object with: searchMovies, getMovieDetails, getRecommendations, checkHealth

### Using in Screens

In your screen files:

import api from '../services/api'

Then call: api.searchMovies("Avatar"), api.getMovieDetails(movieId), etc.

### Testing the API Client

Before using in screens, test it:

Create a simple test file that imports api and calls each function. Run it with node (but you'll need to adjust imports since React Native modules won't work in Node).

Better: Test directly in a screen:
- Create a button in HomeScreen
- OnPress, call api.checkHealth() and log the result
- If it works, you know your backend is reachable

### What You're Learning

- **API client patterns:** Abstracting HTTP calls
- **Axios usage:** Making requests, handling responses
- **Error handling:** Try/catch, throwing meaningful errors
- **Module exports:** Creating reusable modules

### Common Mistakes

❌ Hardcoding URLs instead of using baseURL (change is painful)
❌ Not handling network errors (app crashes when offline)
❌ Forgetting await on async calls (promises instead of values)
❌ Wrong endpoint URLs (typos cause 404 errors)

---

## FILE 14: `frontend/src/components/SearchBar.js`

### When to Code This
After api.js, before HomeScreen

### Time Estimate
30-40 minutes

### What This File Does

A reusable search bar component with a text input and search button. Used on the home screen for searching movies.

### Import Organization

**React imports:**
React, useState from 'react'.

**React Native imports:**
View, TextInput, TouchableOpacity, Text, StyleSheet from 'react-native'.

### The SearchBar Component

**Props:**
- onSearch (function) - Callback when search is triggered, receives the query string

**State:**
Use useState to manage the text input value. Initial value empty string.

### Component Structure

Return a View (the container):

**Inside the View:**

**Element 1: TextInput**
- value prop: The state variable
- onChangeText prop: The state setter function
- placeholder: "Search for a movie..."
- placeholderTextColor: "#888888" (gray text)
- style: styles.input (you'll define below)
- returnKeyType: "search" (shows search button on keyboard)
- onSubmitEditing: Call the onSearch prop with the current value (allows searching by pressing enter/search on keyboard)

**Element 2: TouchableOpacity (Search button)**
- onPress: Call onSearch prop with current value
- style: styles.button
- activeOpacity: 0.7 (slight fade when pressed)

**Inside TouchableOpacity:**
Text component with text "Search" and style styles.buttonText.

### The Styles

Use StyleSheet.create to define styles:

**container style:**
- flexDirection: "row" (input and button side by side)
- alignItems: "center" (vertically center)
- backgroundColor: "#2a2a2a" (dark gray)
- borderRadius: 8 (rounded corners)
- paddingHorizontal: 12
- paddingVertical: 4
- marginHorizontal: 16 (space from screen edges)
- marginVertical: 16

**input style:**
- flex: 1 (takes available space)
- color: "#ffffff" (white text)
- fontSize: 16
- paddingVertical: 8

**button style:**
- backgroundColor: "#e50914" (Netflix-ish red, or choose your brand color)
- paddingHorizontal: 20
- paddingVertical: 10
- borderRadius: 6

**buttonText style:**
- color: "#ffffff"
- fontWeight: "bold"
- fontSize: 14

### Behavior

User types in TextInput → state updates with each keystroke → User presses Search button or hits enter on keyboard → onSearch callback fires with the query → Parent component (HomeScreen) handles the search (calls API, navigates to results).

### Validation

Add validation before calling onSearch:

If query is empty or only whitespace, don't call onSearch. Optionally show an alert: "Please enter a search term".

Use query.trim() to remove leading/trailing whitespace.

### Accessibility

For production apps, add accessibility props:
- accessibilityLabel: "Search for movies"
- accessibilityHint: "Enter a movie title"

Not critical for MVP but good practice.

### Testing the Component

Create it in isolation first:

In HomeScreen, render SearchBar with onSearch prop that just logs the query. Type in the input, press search, check console for the query.

### What You're Learning

- **Controlled components:** State-driven inputs
- **Event handling:** onPress, onChangeText callbacks
- **Styling:** Flexbox layout, colors, spacing
- **Component reusability:** Props make components flexible

### Common Mistakes

❌ Not using controlled component pattern (value and onChangeText)
❌ Forgetting to trim whitespace (empty searches go through)
❌ Hard-to-tap buttons (too small, insufficient padding)
❌ Not handling empty query (API error or wasted request)

---

## FILE 15: `frontend/src/components/MovieCard.js`

### When to Code This
After SearchBar, before screens use it

### Time Estimate
45-60 minutes

### What This File Does

A reusable card component displaying a movie's poster, title, year, and rating. Used in search results and recommendations lists.

### Import Organization

**React imports:**
React from 'react'.

**React Native imports:**
View, Text, Image, TouchableOpacity, StyleSheet from 'react-native'.

### The MovieCard Component

**Props:**
- movie (object) - A MovieSummary with id, title, poster_path, release_date, vote_average
- onPress (function) - Callback when card is tapped, receives movie object

### Component Structure

Return a TouchableOpacity (makes entire card tappable):
- onPress: Call onPress prop with movie object
- activeOpacity: 0.8
- style: styles.container

**Inside TouchableOpacity:**

**Element 1: Poster Image**
Check if movie.poster_path exists.

If it exists:
- Render Image component
- source prop: { uri: "https://image.tmdb.org/t/p/w500${movie.poster_path}" }
- style: styles.poster
- resizeMode: "cover"

If poster_path is null:
- Render View with styles.posterPlaceholder
- Inside it, Text saying "No Image"

**Element 2: Info Container**
View with styles.info containing:

**Title Text:**
- Text component with movie.title
- style: styles.title
- numberOfLines: 2 (truncate if too long)
- ellipsizeMode: "tail" (add ... at end)

**Year Text:**
- Extract year from movie.release_date (first 4 characters)
- Text component displaying the year
- style: styles.year

**Rating Text:**
- Display movie.vote_average formatted to 1 decimal place
- Add a star symbol (use "⭐" or "★")
- Text component: "⭐ vote_average/10"
- style: styles.rating

### TMDB Image URLs

TMDB poster paths are relative (like "/abc123.jpg"). You need to construct full URL:

Base URL: "https://image.tmdb.org/t/p/"

Size: Use "w500" for 500px width (good balance of quality and loading speed)

Full URL: base + size + poster_path

### The Styles

**container:**
- width: 150 (fixed width for grid layout)
- marginHorizontal: 8
- marginVertical: 8
- backgroundColor: "#2a2a2a"
- borderRadius: 8
- overflow: "hidden" (clips image to rounded corners)

**poster:**
- width: 150 (match container)
- height: 225 (3:2 aspect ratio like movie posters)

**posterPlaceholder:**
- Same dimensions as poster
- backgroundColor: "#1a1a1a"
- justifyContent: "center"
- alignItems: "center"

**info:**
- padding: 8

**title:**
- color: "#ffffff"
- fontSize: 14
- fontWeight: "600"
- marginBottom: 4

**year:**
- color: "#888888"
- fontSize: 12
- marginBottom: 4

**rating:**
- color: "#ffb900" (gold/yellow for rating)
- fontSize: 12
- fontWeight: "bold"

### Handling Missing Data

Not all movies have all fields. Handle gracefully:
- No poster: Show placeholder
- No release_date: Don't show year or show "N/A"
- vote_average is 0: Show "Not Rated" instead of "0.0/10"

Use conditional rendering and optional chaining.

### Layout Considerations

This card is designed for use in FlatList with numColumns (grid layout). The fixed width allows clean grid arrangements.

### Testing the Component

Render a single MovieCard with test data:

movie object with id: 1, title: "Test Movie", poster_path: "/test.jpg", release_date: "2024-01-01", vote_average: 7.5

onPress function that logs the movie

Tap it, verify onPress fires, verify image loads, verify text displays correctly.

### What You're Learning

- **Component composition:** Building UI from smaller pieces
- **Image handling:** Remote URLs, placeholders, loading states
- **Touch interactions:** Making components tappable
- **Responsive design:** Fixed vs flexible sizing

### Common Mistakes

❌ Not handling null poster_path (image fails to load)
❌ Wrong image URL format (broken images)
❌ Not truncating long titles (breaks layout)
❌ Forgetting to pass onPress (cards not tappable)

---

## FILE 16: `frontend/src/screens/HomeScreen.js`

### When to Code This
After components are complete

### Time Estimate
60-90 minutes

### What This File Does

The main landing screen. Shows a search bar, featured movies, and handles navigation to search results or movie details.

### Import Organization

**React imports:**
React, useState, useEffect from 'react'.

**React Native imports:**
View, Text, FlatList, StyleSheet, ActivityIndicator, Alert from 'react-native'.

**Component imports:**
SearchBar from '../components/SearchBar'.
MovieCard from '../components/MovieCard'.

**Service imports:**
api from '../services/api'.

### The HomeScreen Component

**Props:**
- navigation (provided by React Navigation automatically)

**State variables:**
- featured Movies (array, initial empty)
- loading (boolean, initial true)

### Component Structure

**useEffect hook (runs on mount):**
Define an async function inside the useEffect. This function fetches featured movies.

**What the function does:**
1. Call api.searchMovies with query "popular" (or you could call a trending endpoint if you add one).
2. Extract the results array from the response.
3. Slice to first 20 movies (don't need all of them).
4. Set the featuredMovies state.
5. Set loading to false.

**Error handling:**
Wrap in try/catch. If error, show an Alert with the error message and set loading false.

**The dependency array:**
Empty array (run only once on mount).

**Call the async function:**
After defining it, call it immediately (since useEffect can't be async directly).

### Handler Functions

**handleSearch function:**
- Parameter: query (string)
- Validates query is not empty after trimming
- If valid, navigate to SearchResults screen passing { query } as params
- If invalid, show Alert asking user to enter a search term

**handleMoviePress function:**
- Parameter: movie (object)
- Navigate to MovieDetail screen passing { movieId: movie.id } as params

### Render Logic

**If loading:**
Return a View centered on screen with ActivityIndicator (loading spinner) and text "Loading...".

**If not loading:**
Return a View (main container) with styles.container:

**Element 1: SearchBar**
- onSearch prop: handleSearch function

**Element 2: Section Header**
- Text component: "Featured Movies"
- style: styles.sectionHeader

**Element 3: FlatList**
- data prop: featuredMovies array
- renderItem prop: Function that receives { item } and returns MovieCard with movie={item} and onPress={handleMoviePress}
- keyExtractor prop: item => item.id.toString()
- numColumns: 2 (two-column grid)
- columnWrapperStyle: styles.row (space between columns)
- contentContainerStyle: styles.listContent (padding around list)
- showsVerticalScrollIndicator: false (cleaner look)

### The Styles

**container:**
- flex: 1 (fill screen)
- backgroundColor: "#1a1a1a" (dark background)

**loadingContainer:**
- flex: 1
- justifyContent: "center"
- alignItems: "center"
- backgroundColor: "#1a1a1a"

**loadingText:**
- color: "#ffffff"
- marginTop: 10
- fontSize: 16

**sectionHeader:**
- color: "#ffffff"
- fontSize: 20
- fontWeight: "bold"
- marginHorizontal: 16
- marginBottom: 8

**listContent:**
- paddingBottom: 20

**row:**
- justifyContent: "space-between" (or "space-around")
- paddingHorizontal: 8

### Screen Flow

User opens app → HomeScreen mounts → useEffect runs → Fetches featured movies → Shows loading spinner → Data loads → Renders search bar and grid of movies → User types in search bar and presses search → Navigates to SearchResults → OR user taps a movie card → Navigates to MovieDetail.

### Alternative: Trending Movies

Instead of searching for "popular", you could add a /trending endpoint to your backend that calls TMDB's trending API. More appropriate for a home screen.

Or fetch multiple categories (Popular, Top Rated, etc.) and show multiple horizontal scrolling lists.

For MVP, a simple search for popular movies works fine.

### Error State

If fetching featured movies fails, you could show an error message instead of an empty screen. Add an error state variable and render error UI when it's set.

### What You're Learning

- **Screen components:** Full-screen UI with navigation
- **useEffect for data fetching:** Side effects in React
- **Loading states:** Showing spinners while data loads
- **Lists and grids:** FlatList with numColumns
- **Navigation:** Moving between screens with parameters

### Common Mistakes

❌ Not handling loading state (blank screen while fetching)
❌ Not handling errors (app crashes on network failure)
❌ Forgetting keyExtractor (React warnings)
❌ Not trimming search query (empty searches)
❌ Wrong numColumns (doesn't match MovieCard width)

---

## FILE 17: `frontend/src/screens/MovieDetailScreen.js`

### When to Code This
After HomeScreen

### Time Estimate
90-120 minutes

### What This File Does

Shows comprehensive details for a single movie: poster, title, overview, cast, crew, genres, and recommendations. The most complex screen.

### Import Organization

**React imports:**
React, useState, useEffect from 'react'.

**React Native imports:**
View, Text, Image, ScrollView, FlatList, StyleSheet, ActivityIndicator, Dimensions from 'react-native'.

**Component imports:**
MovieCard from '../components/MovieCard'.

**Service imports:**
api from '../services/api'.

### The MovieDetailScreen Component

**Props:**
- navigation (from React Navigation)
- route (from React Navigation, contains params)

**State variables:**
- movie (object or null, initial null)
- recommendations (array, initial empty)
- loading (boolean, initial true)

**Extract movie ID:**
const movieId = route.params.movieId

### Component Structure

**useEffect hook:**
Define an async function to fetch data.

**What the function does:**
1. Call api.getMovieDetails(movieId).
2. Set the movie state with the result.
3. Call api.getRecommendations(movieId, 10).
4. Set the recommendations state with the result.
5. Set loading to false.

**Error handling:**
Try/catch, show Alert on error, set loading false.

**Dependencies:**
[movieId] - refetch if movieId changes (happens if user navigates from one movie detail to another).

### Handler Functions

**handleRecommendationPress function:**
- Parameter: recommendedMovie (object, from recommendations array)
- Extract the nested movie object: recommendedMovie.movie (remember recommendations have { movie, score, reason })
- Navigate to MovieDetail with { movieId: movie.id }
- This allows navigating from one movie detail to another seamlessly

### Render Logic

**If loading or movie is null:**
Return centered loading view with spinner.

**If movie loaded:**
Return a ScrollView (allows scrolling the entire screen):

**Section 1: Backdrop Image**
- Check if movie.backdrop_path exists
- If yes, render Image with source using TMDB backdrop URL (same pattern as poster but use w780 size for backdrops)
- Style: full width, height 200, resizeMode "cover"
- If no backdrop, skip this section or show solid color View

**Section 2: Poster and Basic Info**
- View container with flexDirection "row", padding
- Left side: Image with poster (w342 size, 120x180 dimensions)
- Right side: View with flex 1, marginLeft 16
  - Title Text (fontSize 24, fontWeight "bold", color white)
  - Year Text (extract from release_date, color gray)
  - Rating Text (vote_average with star emoji, color gold)
  - Runtime Text (if exists, format as "120 min", color gray)

**Section 3: Genres**
- View with flexDirection "row", flexWrap "wrap", marginVertical
- Map over movie.genres array
- For each genre, render a small pill/badge View with:
  - Genre name as Text
  - backgroundColor "#333", borderRadius 12, padding horizontal 10, vertical 4
  - marginRight 8, marginBottom 8
  - Text color white, fontSize 12

**Section 4: Tagline**
- If movie.tagline exists, render Text with italic styling, color gray, marginVertical

**Section 5: Overview**
- Text header "Overview" (fontSize 18, fontWeight "bold", color white, marginBottom 8)
- Text with movie.overview (fontSize 14, color "#ccc", lineHeight 20)

**Section 6: Cast**
- Text header "Cast" (same style as Overview header)
- Horizontal ScrollView (showsHorizontalScrollIndicator false)
- Map over movie.cast (slice to first 10)
- For each cast member, render a small card:
  - View with width 80, marginRight 12
  - Image with profile_path if exists (w185 size, 80x120)
  - Text with name (fontSize 12, color white, numberOfLines 2)
  - Text with character (fontSize 10, color gray, numberOfLines 1)

**Section 7: Crew**
- Text header "Crew"
- Map over movie.crew (filter to Director, Writer, Producer only)
- For each crew member, render:
  - View with flexDirection "row", marginBottom 4
  - Text with job (fontSize 12, color white, fontWeight "bold", width 80)
  - Text with name (fontSize 12, color gray)

**Section 8: Recommendations**
- Text header "You Might Also Like"
- Check if recommendations array has items
- If yes, render horizontal FlatList:
  - data: recommendations
  - renderItem: Extract item.movie (the nested MovieSummary), pass to MovieCard with onPress handleRecommendationPress
  - horizontal: true
  - keyExtractor: item => item.movie.id.toString()
  - showsHorizontalScrollIndicator: false
- If no recommendations, show Text "No recommendations available"

### The Styles

**scrollContainer:**
- backgroundColor: "#1a1a1a"

**backdrop:**
- width: Dimensions.get('window').width (full width)
- height: 200

**posterInfoContainer:**
- flexDirection: "row"
- padding: 16

**poster:**
- width: 120
- height: 180
- borderRadius: 8

**infoContainer:**
- flex: 1
- marginLeft: 16

**title:**
- fontSize: 24
- fontWeight: "bold"
- color: "#ffffff"
- marginBottom: 8

**detailText:**
- fontSize: 14
- color: "#888888"
- marginBottom: 4

**rating:**
- fontSize: 16
- color: "#ffb900"
- fontWeight: "bold"
- marginVertical: 4

**sectionHeader:**
- fontSize: 18
- fontWeight: "bold"
- color: "#ffffff"
- marginHorizontal: 16
- marginTop: 16
- marginBottom: 8

**overview:**
- fontSize: 14
- color: "#cccccc"
- lineHeight: 20
- marginHorizontal: 16
- marginBottom: 16

**genreContainer:**
- flexDirection: "row"
- flexWrap: "wrap"
- marginHorizontal: 16
- marginVertical: 8

**genrePill:**
- backgroundColor: "#333333"
- borderRadius: 12
- paddingHorizontal: 10
- paddingVertical: 4
- marginRight: 8
- marginBottom: 8

**genreText:**
- color: "#ffffff"
- fontSize: 12

**castCard:**
- width: 80
- marginRight: 12

**castImage:**
- width: 80
- height: 120
- borderRadius: 8
- marginBottom: 4

**castName:**
- fontSize: 12
- color: "#ffffff"
- numberOfLines: 2

**castCharacter:**
- fontSize: 10
- color: "#888888"
- numberOfLines: 1

**crewItem:**
- flexDirection: "row"
- marginHorizontal: 16
- marginBottom: 4

**crewJob:**
- fontSize: 12
- color: "#ffffff"
- fontWeight: "bold"
- width: 80

**crewName:**
- fontSize: 12
- color: "#888888"

### Image URL Handling

TMDB image sizes:
- Posters: w342 for detail screen (better quality than w185)
- Backdrops: w780 (wide horizontal images)
- Profiles (cast): w185

Always check if image path exists before rendering Image component.

### Navigation Considerations

When user taps a recommendation, you navigate to the same screen (MovieDetailScreen) but with a different movieId. React Navigation handles this by updating the params, and your useEffect with [movieId] dependency will re-run, fetching new data.

### Performance

This screen fetches a lot of data and renders many images. To optimize:
- Use FlatList for recommendations (already done)
- Consider lazy loading images (advanced)
- Limit the number of cast members shown
- Cache API responses (future enhancement)

### What You're Learning

- **Complex layouts:** Combining multiple UI patterns
- **Image galleries:** Horizontal scrolling lists
- **Nested navigation:** Navigating within same screen
- **Data transformation:** Filtering and mapping complex objects
- **Responsive design:** Using Dimensions for full-width elements

### Common Mistakes

❌ Not checking for null/undefined before accessing nested properties (crashes)
❌ Not slicing cast array (renders 50+ cards, slow)
❌ Wrong image URL sizes (blurry or unnecessarily large)
❌ Forgetting to extract nested movie from recommendations (undefined errors)
❌ Not handling missing data (crashes when fields don't exist)

---

## FILE 18: `frontend/src/screens/SearchResultsScreen.js`

### When to Code This
After MovieDetailScreen

### Time Estimate
45-60 minutes

### What This File Does

Displays search results in a grid. Allows loading more results (pagination). Simpler than detail screen but with pagination logic.

### Import Organization

**React imports:**
React, useState, useEffect from 'react'.

**React Native imports:**
View, Text, FlatList, StyleSheet, ActivityIndicator from 'react-native'.

**Component imports:**
MovieCard from '../components/MovieCard'.

**Service imports:**
api from '../services/api'.

### The SearchResultsScreen Component

**Props:**
- navigation
- route (contains { query } params)

**State variables:**
- results (array, initial empty)
- loading (boolean, initial true)
- loadingMore (boolean, initial false)
- page (number, initial 1)
- hasMore (boolean, initial true)

**Extract query:**
const query = route.params.query

### Component Structure

**useEffect hook:**
Define async function to perform initial search.

**What the function does:**
1. Set loading true.
2. Call api.searchMovies(query, 1).
3. Set results to response.results.
4. Set hasMore to page < response.total_pages.
5. Set loading false.

**Error handling:**
Try/catch, Alert on error.

**Dependencies:**
[query] - if query changes (user performs new search from this screen), refetch.

### Handler Functions

**handleLoadMore function:**
Called when user scrolls to the end of the list.

**Logic:**
- Check if already loading or loadingMore or not hasMore - if any are true, return early (prevent duplicate loads).
- Set loadingMore true.
- Increment page: const nextPage = page + 1.
- Call api.searchMovies(query, nextPage).
- Append new results to existing results: setResults([...results, ...response.results]).
- Set page to nextPage.
- Update hasMore based on nextPage < response.total_pages.
- Set loadingMore false.

**Error handling:**
Try/catch, Alert on error, set loadingMore false.

**handleMoviePress function:**
- Parameter: movie (object)
- Navigate to MovieDetail with { movieId: movie.id }

### Render Logic

**If loading (initial load):**
Return centered loading view.

**If results loaded:**
Return View container with:

**Header section:**
- Text showing query: "Results for '{query}'"
- style: styles.header

**FlatList:**
- data: results
- renderItem: MovieCard with movie and onPress
- keyExtractor: item.id.toString()
- numColumns: 2
- columnWrapperStyle: styles.row
- onEndReached: handleLoadMore (triggers when scrolling near bottom)
- onEndReachedThreshold: 0.5 (trigger when 50% from bottom)
- ListFooterComponent: If loadingMore, show ActivityIndicator
- ListEmptyComponent: If results empty, show Text "No results found"

### The Styles

**container:**
- flex: 1
- backgroundColor: "#1a1a1a"

**header:**
- fontSize: 18
- fontWeight: "bold"
- color: "#ffffff"
- marginHorizontal: 16
- marginVertical: 16

**row:**
- justifyContent: "space-between"
- paddingHorizontal: 8

**footer:**
- paddingVertical: 20
- alignItems: "center"

**emptyText:**
- color: "#888888"
- fontSize: 16
- textAlign: "center"
- marginTop: 50

### Pagination Explained

**onEndReached:**
FlatList calls this function when user scrolls close to the end. Perfect for loading more items.

**onEndReachedThreshold:**
How close to the end before triggering. 0.5 means trigger when the end of the list is within half a screen's distance.

**Preventing duplicate loads:**
The checks in handleLoadMore (loading, loadingMore, hasMore) prevent calling the API multiple times for the same page.

**Appending results:**
Use spread operator to combine existing and new results. Don't replace the array or you lose previous pages.

### Edge Cases

**No results:**
If results array is empty after loading, show "No results found" message.

**Last page:**
When hasMore is false, don't show footer loading indicator. User has reached the end.

**Very long queries:**
If query is extremely long, it might break the header layout. Consider truncating or using ellipsis.

### What You're Learning

- **Pagination:** Loading data in chunks
- **Infinite scroll:** onEndReached pattern
- **State management:** Managing multiple loading states
- **User feedback:** Loading indicators for different states

### Common Mistakes

❌ Not preventing duplicate loads (multiple API calls for same page)
❌ Replacing results instead of appending (previous pages disappear)
❌ Not handling empty results (blank screen)
❌ Triggering loadMore on every scroll (API spam)
❌ Wrong onEndReachedThreshold (loads too early or too late)

---

## TESTING YOUR COMPLETE APP

After completing all files, test the entire flow:

### Backend Testing

1. **Start backend:** cd backend, activate venv, run python main.py
2. **Check health:** Visit http://localhost:8000/api/health
3. **View docs:** Visit http://localhost:8000/docs
4. **Test search:** Use Swagger to search for "Avatar"
5. **Test details:** Get details for a movie ID from search results
6. **Test recommendations:** Get recommendations for that movie ID
7. **Verify all responses** have correct structure matching your schemas

### Frontend Testing

1. **Install dependencies:** cd frontend, run npm install
2. **Start Expo:** Run npm start
3. **Test on Expo Go:** Scan QR code with your phone
4. **Test home screen:** Should show featured movies grid
5. **Test search:** Type "Inception" and search
6. **Test search results:** Should show results, try scrolling to trigger pagination
7. **Test movie details:** Tap a movie, verify all sections load (poster, overview, cast, recommendations)
8. **Test recommendations navigation:** Tap a recommended movie, verify it navigates to that movie's details
9. **Test back navigation:** Press back button, verify you return to previous screen

### Integration Testing

The critical test: Does frontend successfully call backend?

**Checklist:**
- [ ] Backend running and accessible
- [ ] Frontend configured with correct backend IP in app.json
- [ ] Phone/emulator on same network as computer (if testing on device)
- [ ] Search returns results from TMDB via your backend
- [ ] Movie details show comprehensive info
- [ ] Recommendations show and are tappable
- [ ] Error messages appear if backend is stopped
- [ ] Loading states show while fetching data

### Common Integration Issues

**"Network Error":**
- Backend not running - start it
- Wrong IP in app.json - use ipconfig/ifconfig to find correct IP
- Firewall blocking - allow connections on port 8000
- Different networks - phone and computer must be on same WiFi

**"CORS Error":**
- Missing or misconfigured CORS middleware in main.py
- Check allow_origins includes "*" or your exact origin

**"404 Not Found":**
- Wrong endpoint URLs in api.js
- Check prefix in main.py (should be "/api")
- Typo in route definitions

**Images not loading:**
- Check image URL construction (should start with https://image.tmdb.org/t/p/)
- Verify poster_path has leading slash
- Check network tab in debugging tools

---

## BUILDING THE APK

Once everything works in Expo Go, build a standalone APK:

### Step 1: Prepare for Build

Make sure:
- All features work in Expo Go
- No console errors or warnings
- App looks good on your test device
- Backend URL in app.json is correct (use your computer's network IP for testing, or deploy backend first for production APK)

### Step 2: Install EAS CLI

If not already installed:
- Run: npm install -g eas-cli

### Step 3: Configure EAS

In frontend directory:
- Run: eas build:configure
- Select Android when prompted
- This creates/updates eas.json

### Step 4: Build Preview APK

Run: eas build --platform android --profile preview

**What happens:**
- Code uploaded to Expo servers
- Android build environment spins up
- Dependencies installed
- App compiled to APK
- Takes 10-20 minutes

**Output:**
URL to download the APK file.

### Step 5: Install APK

**On your Android device:**
1. Download APK from the URL
2. Open the file (may need to enable "Install from unknown sources" in settings)
3. Install and open
4. App runs standalone, no Expo Go needed!

### Step 6: Test Standalone App

**Key differences from Expo Go:**
- App is standalone (doesn't need Expo Go)
- Loads faster
- Icon and splash screen are yours
- Behaves like a real app

**Test thoroughly:**
- All features work
- Backend connection works (use network IP, not localhost)
- No crashes or bugs
- Performance is smooth

---

## DEPLOYMENT CONSIDERATIONS

For a production app (beyond portfolio demo):

### Backend Deployment

**Options:**
1. **Heroku:** Easy, free tier available, supports Python
2. **Railway:** Modern, simple deployment
3. **AWS EC2:** More control, requires more setup
4. **DigitalOcean:** Good balance of simplicity and power

**Steps (general):**
1. Push code to GitHub
2. Connect deployment platform to GitHub repo
3. Set environment variables (TMDB API key)
4. Deploy
5. Get production URL (https://your-app.com)

**Update frontend:**
Change apiUrl in app.json to production URL, rebuild APK.

### Frontend Deployment

**For testing:**
- Share APK with friends
- They install directly (sideloading)

**For production:**
- Build AAB (app bundle) with: eas build --platform android --profile production
- Create Google Play Developer account ($25 one-time fee)
- Upload AAB to Play Store
- Fill in store listing (screenshots, description)
- Submit for review
- Once approved, users download from Play Store

### Security for Production

**Backend:**
- Use HTTPS (SSL certificate)
- Restrict CORS to your frontend domain only
- Add rate limiting to prevent abuse
- Never commit .env files
- Rotate API keys periodically

**Frontend:**
- Don't hardcode API keys in frontend code
- Validate all user input
- Handle errors gracefully (don't show stack traces to users)

---

## FINAL NOTES

### What You've Built

A full-stack, ML-powered movie recommendation app:
- **Backend:** FastAPI with async architecture, TMDB integration, content-based ML recommender
- **Frontend:** React Native with Expo, clean UI, smooth navigation
- **Deployment:** APK generation, ready for Play Store

### Skills Demonstrated

**Backend:**
- REST API design
- Async Python programming
- Third-party API integration
- Machine learning (content-based filtering)
- Data modeling and validation

**Frontend:**
- React Native mobile development
- Component-based architecture
- State management
- Navigation
- HTTP client implementation

**Full-stack:**
- End-to-end application development
- Frontend-backend integration
- Error handling across layers
- Production build process

### Next Steps for Learning

**Immediate enhancements:**
1. Add user accounts (authentication)
2. Save favorite movies (requires database)
3. Implement collaborative filtering (user-based recommendations)
4. Add movie trailers (YouTube API integration)
5. Social features (share recommendations with friends)

**Advanced improvements:**
1. Deploy to production (backend on Heroku, APK on Play Store)
2. Add tests (pytest for backend, Jest for frontend)
3. Implement caching (Redis) to reduce API calls
4. Add analytics (track user behavior)
5. Optimize performance (lazy loading, image caching)

**Learning resources:**
- FastAPI docs: fastapi.tiangolo.com
- React Native docs: reactnative.dev
- React Navigation: reactnavigation.org
- Expo docs: docs.expo.dev
- Machine learning: scikit-learn.org
- TMDB API: developers.themoviedb.org

### Portfolio Presentation

When showcasing this project:

**Highlight:**
- Full-stack capability (backend + frontend)
- ML implementation (recommender system)
- API design skills
- Mobile development experience
- Problem-solving (handling TMDB data, building algorithms)

**Demo flow:**
1. Show the app working (search, browse, get recommendations)
2. Explain the ML algorithm (content-based filtering with TF-IDF)
3. Walk through code structure (backend layers, frontend components)
4. Discuss challenges and solutions
5. Show it running as a standalone APK

**GitHub README:**
- Include screenshots
- Explain architecture with diagrams
- List technologies used
- Provide setup instructions
- Link to demo video

### Final Encouragement

This is a substantial project - roughly 40-60 hours of focused development. Take your time with each file. Understand the concepts before moving to the next.

When you get stuck:
1. Re-read the relevant section in this guide
2. Check official documentation
3. Google the specific error message
4. Ask specific questions (not "it doesn't work" but "I'm getting X error when doing Y")

Every error is a learning opportunity. Professional developers spend half their time debugging. It's part of the process.

You're building real skills that translate directly to job requirements. Machine learning, APIs, mobile development - these are all in-demand areas.

Good luck, and enjoy building your movie recommender!

---

## APPENDIX: Quick Reference

### Essential Commands

**Backend:**
```
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

**Frontend:**
```
cd frontend
npm install
npm start
npm run android
```

**Building APK:**
```
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

### File Checklist

#### Backend (8 files)
- [ ] requirements.txt
- [ ] backend/app/core/config.py
- [ ] .env and .env.example
- [ ] backend/app/schemas/__init__.py
- [ ] backend/app/services/__init__.py
- [ ] backend/app/recommender/__init__.py
- [ ] backend/app/api/__init__.py
- [ ] backend/main.py

#### Frontend (9 files)
- [ ] frontend/package.json
- [ ] frontend/app.json
- [ ] frontend/eas.json
- [ ] frontend/App.js
- [ ] frontend/src/services/api.js
- [ ] frontend/src/components/SearchBar.js
- [ ] frontend/src/components/MovieCard.js
- [ ] frontend/src/screens/HomeScreen.js
- [ ] frontend/src/screens/MovieDetailScreen.js
- [ ] frontend/src/screens/SearchResultsScreen.js

#### Configuration (1 file)
- [ ] .gitignore

**Total:** 18 files + configuration

### TMDB API Endpoints Used

- GET /search/movie - Search movies
- GET /movie/{id} - Get movie details
- GET /movie/{id}/similar - Get similar movies
- GET /discover/movie - Discover by genres

### TMDB Image URLs

- Base: https://image.tmdb.org/t/p/
- Poster sizes: w185, w342, w500
- Backdrop sizes: w780, w1280
- Profile sizes: w185

### HTTP Status Codes

- 200: Success
- 404: Not found
- 429: Rate limit exceeded
- 500: Server error

### Color Scheme (Dark Theme)

- Background: #1a1a1a
- Secondary background: #2a2a2a
- Text: #ffffff
- Secondary text: #888888
- Accent/Rating: #ffb900
- Primary button: #e50914

### Recommended ML Weights

- Genre similarity: 30%
- Text similarity: 30%
- Keyword similarity: 25%
- Cast/crew similarity: 15%

(Experiment with different weights!)

---

**End of Development Guide**

This guide has covered every file you need to write, explained in detail without providing code snippets. You now have a complete roadmap for building CineMatch from start to finish. Take it file by file, test as you go, and you'll have a professional-quality portfolio project. Happy coding!