from __future__ import annotations

from time import time
from typing import Optional

from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse, Response

from app.core.config import settings


class AuthRateLimitMiddleware(BaseHTTPMiddleware):
    """Redis-backed simple fixed-window limiter for auth endpoints.

    If `settings.redis_url` is not configured, falls back to an in-memory
    best-effort limiter (lost on restart, single-instance only).
    """

    def __init__(self, app):
        super().__init__(app)
        self._redis = None
        self._in_memory = {}

        if settings.redis_url:
            try:
                import redis

                self._redis = redis.from_url(settings.redis_url, decode_responses=True)
            except Exception:
                self._redis = None

    def _get_client_ip(self, request: Request) -> str:
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        if request.client and request.client.host:
            return request.client.host

        return "unknown"

    async def dispatch(self, request: Request, call_next) -> Response:
        # Only throttle POST auth endpoints
        if request.method == "POST" and "/auth/" in request.url.path:
            client_ip = self._get_client_ip(request)
            # Use path less query params
            path = request.url.path
            key = f"ratelimit:auth:{client_ip}:{path}"
            max_requests = settings.auth_rate_limit_max_requests
            window = settings.auth_rate_limit_window_seconds

            if self._redis:
                try:
                    count = self._redis.incr(key)
                    if count == 1:
                        self._redis.expire(key, window)
                    if int(count) > int(max_requests):
                        return JSONResponse(
                            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            content={"detail": "Too many auth requests. Please try again later."},
                        )
                except Exception:
                    # Redis errors should not block requests; fallback to in-memory
                    self._redis = None

            if not self._redis:
                now = int(time())
                bucket = self._in_memory.get(key)
                if not bucket:
                    bucket = {"count": 0, "reset_at": now + window}
                    self._in_memory[key] = bucket

                if now > bucket["reset_at"]:
                    bucket["count"] = 0
                    bucket["reset_at"] = now + window

                bucket["count"] += 1
                if bucket["count"] > max_requests:
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={"detail": "Too many auth requests. Please try again later."},
                    )

        return await call_next(request)