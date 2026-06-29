# CineMatch — Local dev and deploy notes

This file explains how to run the backend locally with Docker and how to prepare for production.

Local dev with Docker Compose

1. Start services:

```bash
docker-compose up --build
```

This will start:
- Postgres on `localhost:5432` (user: `cine`, pass: `cinepass`, db: `cinematch`)
- MailHog on `http://localhost:8025` (SMTP port: 1025)
- Backend on `http://localhost:8000`

2. Apply migrations (inside container or locally):

```bash
# if running locally with venv
cd backend
source ../venv/bin/activate
alembic -c alembic.ini upgrade head

# or inside running container
docker-compose exec backend alembic -c alembic.ini upgrade head
```

Production checklist (high level)
- Provision PostgreSQL managed service and set `DATABASE_URL`.
- Set secrets in your hosting provider (JWT_SECRET_KEY, TMDB_API_KEY, SMTP credentials, PUBLIC_BACKEND_URL).
- Ensure `alembic -c alembic.ini upgrade head` runs during deployment before starting the app.
- Use Redis for distributed rate limiting.
- Configure HTTPS and health checks.
