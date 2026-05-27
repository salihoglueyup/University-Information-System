# ADR-004: Express 5 Migration

## Status
**Accepted** — Implemented in v2.0.0

## Context
UBIS was originally built on Express 4. Express 5 reached stable release with significant improvements to error handling, routing, and async support.

## Decision
Migrate from Express 4 to **Express 5**.

## Rationale
| Factor | Express 4 | Express 5 |
|--------|-----------|-----------|
| Async errors | Must wrap with `catchAsync` | Native async error forwarding |
| `req.query` | Mutable object | Getter-only (more secure) |
| Path matching | Regex-based | Path-to-regexp v8 (faster) |
| `res.json()` | Returns res | Returns res (unchanged) |
| Maintenance | Legacy | Active development |

### Key migration changes:
1. `req.query` became read-only — required custom `mongoSanitizeCompat` wrapper
2. `app.del()` removed — use `app.delete()`
3. Path parameters syntax changes in routes
4. Native promise rejection handling in middleware

## Consequences
### Positive
- Better async/await error handling
- More secure query parameter handling
- Future-proof (active maintenance)

### Negative
- Required custom `mongoSanitizeCompat` middleware for Express 5 compatibility
- Some middleware libraries needed updates
- Breaking change requiring careful testing
