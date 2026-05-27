# UBIS Documentation

> Comprehensive documentation for the University Information System (UBIS) — 40+ technical documents organized into 10 categories.

## Quick Navigation

| I want to... | Go to |
|---|---|
| Set up the project locally | [Setup Guide](./getting-started/SETUP_GUIDE.md) |
| Understand the system architecture | [Architecture](./architecture/ARCHITECTURE.md) |
| Look up an API endpoint | [API Reference](./api/API_REFERENCE.md) |
| Understand the database models | [Database Schema](./architecture/DATABASE_SCHEMA.md) |
| Learn how authentication works | [Authentication](./security/AUTHENTICATION.md) |
| Deploy to production | [Deployment](./infrastructure/DEPLOYMENT.md) |
| Review security practices | [Security](./security/SECURITY.md) |
| Contribute to the project | [Contributing](./community/CONTRIBUTING.md) |
| Read the FAQ | [FAQ](./reference/FAQ.md) |
| See the project roadmap | [Roadmap](./community/ROADMAP.md) |

---

## 🚀 Getting Started

| Document | Description |
|----------|-------------|
| [Setup Guide](./getting-started/SETUP_GUIDE.md) | Local development setup, environment variables, seed data |
| [Env Reference](./getting-started/ENV_REFERENCE.md) | Complete environment variables reference |
| [Docker Cheatsheet](./getting-started/DOCKER_CHEATSHEET.md) | Quick reference for all Docker commands |

## 🏗️ Architecture

| Document | Description |
|----------|-------------|
| [Architecture](./architecture/ARCHITECTURE.md) | System design, tech stack, layered architecture, request lifecycle |
| [Database Schema](./architecture/DATABASE_SCHEMA.md) | 22 Mongoose models, relationships, indexes |
| [Middleware](./architecture/MIDDLEWARE.md) | All middleware modules, execution order, config |
| [Real-time](./architecture/REALTIME.md) | Socket.io events, RabbitMQ consumers, cron jobs |

## 📡 API

| Document | Description |
|----------|-------------|
| [API Reference](./api/API_REFERENCE.md) | All 23 REST API endpoint groups with examples |
| [API Examples](./api/API_EXAMPLES.md) | Practical curl examples for all endpoints |
| [Error Handling](./api/ERROR_HANDLING.md) | AppError, catchAsync, error classification, client recovery |

## 🖥️ Frontend

| Document | Description |
|----------|-------------|
| [Frontend Guide](./frontend/FRONTEND_GUIDE.md) | React 19 SPA architecture, routing, state management |
| [UI Components](./frontend/UI_COMPONENTS.md) | Reusable component library catalog (13 categories) |
| [Hooks Reference](./frontend/HOOKS_REFERENCE.md) | All 12 custom React hooks with API reference |

## 🔒 Security & Quality

| Document | Description |
|----------|-------------|
| [Security](./security/SECURITY.md) | Security layers, threat model, hardening measures |
| [Authentication](./security/AUTHENTICATION.md) | JWT, 2FA (TOTP), Google OAuth, CSRF, role-based access |
| [Testing](./security/TESTING.md) | Jest, Supertest, Cypress, test strategy, CI integration |

## ⚙️ Infrastructure

| Document | Description |
|----------|-------------|
| [Deployment](./infrastructure/DEPLOYMENT.md) | Docker Compose (dev/prod), Kubernetes, Nginx, health checks |
| [CI/CD](./infrastructure/CI_CD.md) | GitHub Actions pipeline, linting, testing, build |
| [Monitoring](./infrastructure/MONITORING.md) | Prometheus metrics, Grafana dashboards, Winston logging |
| [Caching Strategy](./infrastructure/CACHING_STRATEGY.md) | Redis cache middleware, TTL, key format, fallback |
| [Search](./infrastructure/SEARCH.md) | MeiliSearch full-text search, auto-sync hooks |
| [Performance](./infrastructure/PERFORMANCE.md) | Optimization guide, bottleneck analysis, scaling |

## 👥 User Guides

| Document | Description |
|----------|-------------|
| [Student Guide](./guides/STUDENT_GUIDE.md) | Complete guide for students (navigation, workflows, tips) |
| [Instructor Guide](./guides/INSTRUCTOR_GUIDE.md) | Guide for academic staff (grading, advising, tools) |
| [Research Assistant Guide](./guides/RESEARCH_ASSISTANT_GUIDE.md) | Guide for research assistants |
| [Admin Guide](./guides/ADMIN_GUIDE.md) | Guide for system administrators |

## 📖 Reference

| Document | Description |
|----------|-------------|
| [Data Dictionary](./reference/DATA_DICTIONARY.md) | All enums, status codes, constants, error codes |
| [Glossary](./reference/GLOSSARY.md) | Turkish-English term reference |
| [Scripts Guide](./reference/SCRIPTS_GUIDE.md) | All 18 seed & data generation scripts reference |
| [Troubleshooting](./reference/TROUBLESHOOTING.md) | Diagnosis guide for common issues |
| [FAQ](./reference/FAQ.md) | Frequently asked questions |

## 🏛️ Architecture Decision Records (ADR)

| ADR | Decision |
|-----|----------|
| [ADR-001](./adr/ADR-001-mongodb.md) | MongoDB as primary database |
| [ADR-002](./adr/ADR-002-csrf-pattern.md) | CSRF Double Submit Cookie pattern |
| [ADR-003](./adr/ADR-003-redis-caching.md) | Redis for response caching |
| [ADR-004](./adr/ADR-004-express5.md) | Express 5 migration |
| [ADR-005](./adr/ADR-005-zustand-tanstack.md) | Zustand + TanStack Query for state |
| [ADR-006](./adr/ADR-006-meilisearch.md) | MeiliSearch for full-text search |

## 🤝 Community

| Document | Description |
|----------|-------------|
| [Contributing](./community/CONTRIBUTING.md) | Development workflow, code style, PR process |
| [Changelog](./community/CHANGELOG.md) | Version history (Keep a Changelog format) |
| [Roadmap](./community/ROADMAP.md) | Planned features and technical debt |

---

## Documentation Structure

```
docs/
├── README.md                    # This file (master index)
├── getting-started/             # 🚀 Setup & configuration
├── architecture/                # 🏗️ System design & data models
├── api/                         # 📡 REST API documentation
├── frontend/                    # 🖥️ React SPA documentation
├── security/                    # 🔒 Security & testing
├── infrastructure/              # ⚙️ Deploy, monitor, cache, search
├── guides/                      # 👥 End-user guides
├── reference/                   # 📖 Glossary, FAQ, troubleshooting
├── adr/                         # 🏛️ Architecture Decision Records
├── community/                   # 🤝 Contributing, changelog, roadmap
└── assets/                      # 🎨 Screenshots & diagrams
```
