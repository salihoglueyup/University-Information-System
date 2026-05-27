# ADR-006: MeiliSearch for Full-Text Search

## Status
**Accepted** — Implemented in v3.0.0

## Context
UBIS needs full-text search across students, courses, and announcements. MongoDB's built-in `$text` search is limited in Turkish language support, typo tolerance, and relevance ranking.

## Decision
Use **MeiliSearch** as a dedicated search engine alongside MongoDB.

## Rationale

| Factor | MongoDB $text | MeiliSearch | Elasticsearch |
|--------|--------------|-------------|--------------|
| Typo tolerance | ❌ None | ✅ Built-in | ✅ With config |
| Turkish support | ⚠️ Basic stemming | ✅ Good | ✅ With analyzer |
| Setup complexity | ✅ Zero (built-in) | ✅ Single binary | ❌ Complex (JVM) |
| Memory usage | N/A | ~50MB | ~500MB+ |
| Relevance ranking | ⚠️ Basic | ✅ Smart defaults | ✅ Highly configurable |
| Real-time indexing | ⚠️ Background | ✅ Sub-second | ✅ Near real-time |
| Hosting cost | Free (part of Mongo) | Free (self-hosted) | High (resource hungry) |

### Key factors:
1. **Typo tolerance** — Students may misspell course names or instructor names
2. **Low resource usage** — ~50MB vs Elasticsearch's 500MB+
3. **Simple API** — RESTful, easy to integrate
4. **Auto-sync via Mongoose hooks** — Transparent data synchronization
5. **Graceful degradation** — App works without MeiliSearch

## Implementation
- Mongoose `post('save')`, `post('findOneAndUpdate')`, `post('findOneAndDelete')` hooks
- 3 indexes: `students`, `courses`, `announcements`
- Sync errors silently logged (never crash the app)
- Admin endpoint `POST /api/search/sync` for full re-sync

## Consequences
### Positive
- Sub-50ms search results with typo tolerance
- Transparent sync via Mongoose hooks
- Low operational overhead
- Works perfectly for the project's scale

### Negative
- Additional service to manage (Docker container)
- Data duplication (MongoDB + MeiliSearch)
- No complex query support (no aggregations, no joins)
- Sync can lag under heavy write load
