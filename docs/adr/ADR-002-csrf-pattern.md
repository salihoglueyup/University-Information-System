# ADR-002: CSRF Double Submit Cookie Pattern

## Status

**Accepted** — Implemented since v3.0.0

## Context

UBIS needs CSRF (Cross-Site Request Forgery) protection for all state-changing API endpoints. The authentication system uses JWT tokens stored in `localStorage`, which are not automatically sent by the browser (unlike session cookies). However, the CSRF cookie is set as HttpOnly for additional security.

## Decision

We chose the **Double Submit Cookie** pattern via the `csrf-csrf` library.

## How It Works

1. Server generates a CSRF token and sets it as an HttpOnly cookie
2. Server also returns the token in a JSON response body
3. Client stores the token and sends it in the `X-CSRF-Token` header for write requests
4. Server compares the header value against the cookie value
5. If they match, the request is legitimate

## Rationale

| Pattern | Pros | Cons |
|---------|------|------|
| **Double Submit Cookie** ✅ | Stateless, no server-side storage | Requires client-side header management |
| Synchronizer Token | Proven, session-based | Requires server-side state (sessions) |
| SameSite Cookie only | Simple | Not supported by all browsers equally |
| Custom header check | Very simple | Weaker protection |

### Key factors:

1. **Stateless** — Aligns with JWT-based auth (no server sessions)
2. **No Redis dependency** — Token validation is cryptographic, not stored
3. **Library support** — `csrf-csrf` is actively maintained and well-tested
4. **Auto-retry** — Client automatically refreshes CSRF token on 403 errors

## Consequences

### Positive
- No server-side session state required
- Compatible with horizontal scaling (any server instance can validate)
- Transparent to users (handled automatically by Axios interceptors)

### Negative
- Requires client-side logic in the Axios instance
- First request after page load needs a CSRF token fetch
- Route ordering matters (auth routes must be registered before CSRF middleware)

## References

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [`csrf-csrf` npm package](https://www.npmjs.com/package/csrf-csrf)
