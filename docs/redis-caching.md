Redis caching strategy and operations for FredonBytes

Overview
--------

This document explains how the site uses Redis caching and outlines the changes that were made to avoid long request wait times when Redis is slow or unavailable, particularly noticeable on the `/pricing` page.

Key implementations (done)
-------------------------

- Fast-fail Redis accessor: `getRedisClientOrNull(timeoutMs)` returns quickly (default 200ms) when Redis is not available, avoiding request blocking.
- Per-operation timeouts: Redis GET/SET operations are wrapped with a promise timeout defaulting to `REDIS_OP_TIMEOUT_MS=250ms`.
- Circuit breaker: When repeated failures happen, the module sets a circuit open window (`REDIS_CIRCUIT_BREAK_MS`, default 30000ms) where Redis usage is skipped to prevent thrashing.
- Endpoint fetch resilience: `/pricing` client now uses per-request timeouts `NEXT_PUBLIC_PRICING_FETCH_TIMEOUT_MS` (default 3000ms) and `Promise.allSettled` to handle partial failures gracefully.
- `getCachedData` pre-checks Redis availability with a short timeout to skip Redis checks entirely when the circuit is open.

Env variables (defaults shown)
------------------------------

- REDIS_URL (existing) - connection string to your Redis instance (defaults to redis://redis:6379)
- REDIS_OP_TIMEOUT_MS (new) - per-redis command timeout, default 250
- REDIS_CIRCUIT_BREAK_MS (new) - duration to skip redis connection attempts after detecting downtime, default 30000
- NEXT_PUBLIC_PRICING_FETCH_TIMEOUT_MS (new) - fetch timeout for client pricing fetches, default 3000

Recommended next actions
------------------------

1. Add metrics around Redis hits/misses/timeouts (logs or a metrics sink) for production monitoring.
2. Consider a warm-up task or worker that establishes connections to gracefully detect Redis availability on startup.
3. Add a small in-memory cache for extremely latency-sensitive pages for brief periods, optionally with stale-while-revalidate behavior.
4. Add integration tests or monitoring health checks to alert on Redis unavailability.

Notes
-----

The changes are intentionally lightweight and backward compatible: when Redis is available, caching will continue to operate as before. If Redis is unavailable, the site will quickly fall back to database reads without blocking the user.

If you want, I can also implement optional metrics and an admin dashboard to visualize the cache health.
