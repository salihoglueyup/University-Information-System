# ADR-003: Redis for Caching and Rate Limiting

## Status

**Accepted** — Implemented since v3.0.0

## Context

UBIS needs:
1. **Response caching** for expensive aggregation queries (analytics, GPA distribution)
2. **Rate limiting** that works across multiple server instances
3. Both features should be optional — the app must work without Redis

## Decision

We chose **Redis** as an in-memory data store for both caching and rate limiting, with automatic fallback to in-memory alternatives when Redis is unavailable.

## Rationale

| Factor | Redis | In-Memory Only |
|--------|-------|---------------|
| Multi-instance sharing | ✅ Shared across replicas | ❌ Per-process only |
| Persistence | ✅ Optional RDB/AOF | ❌ Lost on restart |
| TTL support | ✅ Native key expiration | ⚠️ Must implement manually |
| Performance | ✅ Sub-millisecond reads | ✅ Even faster (same process) |
| Operational complexity | ⚠️ Extra service to manage | ✅ Zero dependencies |

### Fallback strategy:

```
Redis available? → Use Redis for cache + rate limiting
Redis unavailable? → In-memory rate limiting, skip caching
```

## Consequences

### Positive
- Response caching reduces MongoDB load for analytics
- Rate limiting protects against brute-force attacks
- Graceful degradation ensures uptime without Redis

### Negative
- Additional infrastructure to manage
- Cache invalidation is TTL-only (no write-through invalidation yet)
- Rate limit counters reset if Redis restarts

## References

- [express-rate-limit with Redis store](https://www.npmjs.com/package/rate-limit-redis)
- [Redis documentation](https://redis.io/documentation)
