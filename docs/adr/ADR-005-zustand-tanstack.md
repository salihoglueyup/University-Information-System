# ADR-005: Zustand + TanStack Query for State Management

## Status
**Accepted** — Implemented in v2.0.0

## Context
The application needed both **client state** (theme, language preferences) and **server state** (API data like courses, grades, students). Previous implementation used a mix of Redux and local React state.

## Decision
Replace Redux with **Zustand** for client state and add **TanStack Query** for server state.

## Rationale

### Why separate client and server state?
| Concern | Client State | Server State |
|---------|-------------|-------------|
| Nature | UI preferences, flags | API data, cached responses |
| Source of truth | Browser (localStorage) | Server (database) |
| Freshness | Static until user changes | Stale after time period |
| Examples | Theme, language, sidebar | Courses, grades, users |

### Why Zustand over Redux?
| Factor | Redux | Zustand |
|--------|-------|---------|
| Boilerplate | High (actions, reducers, store) | Minimal (single `create()`) |
| Bundle size | ~7KB + middleware | ~1KB |
| DevTools | Requires middleware | Built-in |
| Persistence | Requires redux-persist | Built-in `persist` middleware |
| Learning curve | Steep | Minimal |

### Why TanStack Query?
| Factor | Manual fetch + useState | TanStack Query |
|--------|------------------------|----------------|
| Caching | Manual implementation | Automatic with `staleTime` |
| Refetching | Manual | Automatic (window focus, interval) |
| Loading states | Manual tracking | `isLoading`, `isError` built-in |
| Deduplication | None | Automatic for same query key |
| Mutations | Manual | `useMutation` with cache invalidation |

## Consequences
### Positive
- Dramatically reduced boilerplate
- Clear separation of concerns
- Automatic cache management for API data
- Tiny bundle size impact (~1KB for Zustand)
- `persist` middleware gives free localStorage sync

### Negative
- Two different state systems to learn
- TanStack Query has its own mental model (stale vs fresh)
- Debugging requires understanding both systems
