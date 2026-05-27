# Changelog

All notable changes to the UBIS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] — 2026-05-01

### Added
- **2FA Authentication** — TOTP-based two-factor authentication via Speakeasy
- **Google OAuth** — Sign in with Google via Passport.js
- **CSRF Protection** — Double Submit Cookie pattern using `csrf-csrf`
- **MeiliSearch** — Full-text search across students, courses, and announcements
- **RabbitMQ** — Async message queue for email notifications and analytics
- **Redis Caching** — Response caching middleware with user-scoped keys
- **Real-time Notifications** — Socket.io event-driven notifications
- **Prometheus Metrics** — Custom auth metrics + express-prom-bundle
- **Grafana Dashboards** — Monitoring visualization
- **AI Assistant** — Floating AI chatbot widget (UBIS AI)
- **PWA Support** — Progressive Web App with service worker via vite-plugin-pwa
- **Internationalization** — i18next infrastructure (translations pending)
- **Cron Jobs** — Automated assignment due-date checks and library alerts
- **Document Verification** — QR-based document hash verification
- **Comprehensive Documentation** — 17 technical docs + 3 role guides
- **Dark Mode** — System-wide dark theme with Zustand persistence
- **121+ Pages** — Full SPA with role-based access control
- **13-Category UI Library** — Reusable component system
- **Kubernetes Manifests** — k8s deployment and service configs
- **Multi-stage Dockerfiles** — Optimized production images
- **Graceful Degradation** — Redis, RabbitMQ, MeiliSearch fallbacks

### Security
- Helmet.js security headers
- Rate limiting (Redis-backed with in-memory fallback)
- NoSQL injection prevention (mongoSanitizeCompat + ApiFeatures sanitize)
- Input validation via Zod schemas
- bcrypt password hashing (salt rounds: 10)
- JWT 1-hour expiration tokens
- Non-root Docker container user

### Infrastructure
- Docker Compose dev environment (7 services)
- Docker Compose production environment (resource limits, auth, log rotation)
- Docker Compose monitoring stack (Prometheus + Grafana)
- GitHub Actions CI pipeline (lint + test + build)
- WSL2 compatible development setup

## [2.0.0] — 2026-01-15

### Added
- Express 5 migration (from Express 4)
- React 19 upgrade
- Zustand state management (replaced Redux)
- TanStack Query for server state
- Framer Motion animations
- Socket.io real-time communication
- Winston structured logging
- TailwindCSS 3.4
- ESLint flat config

### Changed
- Route architecture refactored with lazy loading
- API layer consolidated to single Axios instance
- Error handling standardized with AppError class

## [1.0.0] — 2025-09-01

### Added
- Initial MERN stack implementation
- Basic CRUD for students, courses, grades
- JWT authentication
- MongoDB with Mongoose ODM
- React SPA with React Router
- Docker Compose development setup
- Basic CI with GitHub Actions

---

## Versioning Guide

When making changes, increment the version as follows:

| Change Type | Version | Example |
|-------------|---------|---------|
| Breaking API changes | **Major** (X.0.0) | Removing an endpoint, changing auth flow |
| New features, non-breaking | **Minor** (0.X.0) | Adding a new page, new endpoint |
| Bug fixes, patches | **Patch** (0.0.X) | Fixing a calculation, UI tweak |
