-- Create pgvector extension and embeddings table
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS movie_embeddings (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER UNIQUE NOT NULL,
  title TEXT,
  overview TEXT,
  keywords TEXT[],
  embedding VECTOR(384),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_movie_embeddings_embedding ON movie_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
