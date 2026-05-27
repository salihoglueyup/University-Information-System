# ADR-001: MongoDB as Primary Database

## Status

**Accepted** — Implemented since v1.0.0

## Context

UBIS needs a primary datastore for all student, course, grade, and administrative data. The system handles:
- ~22 distinct data models with varying schemas
- Student profiles with 25+ optional fields
- Nested documents (e.g., dormitory permissions, embedded sub-schemas)
- Full-text search requirements
- High read volume with occasional bulk writes (grade entry, imports)

## Decision

We chose **MongoDB** (document database) over PostgreSQL (relational) or other alternatives.

## Rationale

| Factor | MongoDB | PostgreSQL |
|--------|---------|-----------|
| **Schema flexibility** | ✅ Schema-less documents | ❌ Rigid schemas, migrations needed |
| **Nested data** | ✅ Native embedded documents | ⚠️ Requires JOINs or JSONB |
| **Development speed** | ✅ Mongoose ODM, fast iteration | ⚠️ Sequelize/TypeORM, more boilerplate |
| **JavaScript ecosystem** | ✅ Native BSON, same language | ⚠️ SQL query strings |
| **Aggregation** | ✅ Pipeline for analytics | ✅ Strong with complex JOINs |
| **Horizontal scaling** | ✅ Built-in sharding | ⚠️ More complex replication |
| **Transactions** | ⚠️ Multi-document since 4.0 | ✅ Native ACID |

### Key factors:

1. **Schema flexibility** — Student data has many optional fields; some students have YKS scores, others have DGS transfer data
2. **Embedded documents** — Dormitory permissions, payment history fit naturally as nested arrays
3. **MERN stack alignment** — JavaScript end-to-end (JSON ↔ BSON ↔ JSON)
4. **Mongoose hooks** — Post-save hooks for MeiliSearch auto-sync
5. **Aggregation pipeline** — Used for analytics and GPA distribution reports

## Consequences

### Positive
- Fast prototyping with flexible schemas
- Natural fit for document-oriented student profiles
- Auto-sync hooks for MeiliSearch integration
- Aggregation pipeline for complex analytics

### Negative
- No referential integrity enforcement (must be handled in application code)
- Complex JOINs require `$lookup` aggregation (slower than SQL JOINs)
- Manual index management required for performance
- Transaction support less mature than PostgreSQL

## Alternatives Considered

- **PostgreSQL** — Better for strict relational data, but over-engineered for this use case
- **MySQL** — Similar tradeoffs to PostgreSQL
- **Firebase Firestore** — Real-time but vendor lock-in, cost concerns at scale
