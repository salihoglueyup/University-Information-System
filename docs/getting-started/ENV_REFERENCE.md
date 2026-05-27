# Environment Variables Reference

Complete reference for all environment variables used across the UBIS system.

## Server Variables (`server/.env`)

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection URI | `mongodb://localhost:27017/ubis` |
| `JWT_SEC` | JWT signing secret (min 32 chars recommended) | `my-super-secret-jwt-key-2026` |
| `CLIENT_URL` | Allowed CORS origins (comma-separated) | `http://localhost:5173` |

### Security

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `CSRF_SECRET` | CSRF token signing secret | Falls back to `JWT_SEC` | **Should always be unique** |
| `SEED_PASSWORD` | Default password for seed scripts | `ChangeMe!123` | Change in production |

### Infrastructure (Optional)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` | No — graceful fallback |
| `REDIS_MAX_RETRIES` | Max Redis reconnect attempts | `3` | No |
| `RABBITMQ_URL` | RabbitMQ connection URL | `amqp://localhost:5672` | No — graceful fallback |
| `MEILI_HOST` | MeiliSearch URL | `http://localhost:7700` | No — graceful fallback |
| `MEILI_MASTER_KEY` | MeiliSearch API key | — | No |

### Email (SMTP)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MAIL_HOST` | SMTP server hostname | — | For password reset |
| `MAIL_PORT` | SMTP port | — | For password reset |
| `MAIL_USER` | SMTP username | — | For password reset |
| `MAIL_PASS` | SMTP password | — | For password reset |

### Google OAuth

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | — | For Google login |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | — | For Google login |

### Server Config

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server listen port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `API_URL` | Swagger server URL | `http://localhost:5000/api` |

---

## Docker Production Variables (`docker/.env.production`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_ROOT_PASSWORD` | ✅ `?` enforced | MongoDB root user password |
| `MONGO_APP_PASSWORD` | ✅ `?` enforced | MongoDB app user password |
| `MEILI_MASTER_KEY` | ✅ `?` enforced | MeiliSearch master key |
| `JWT_SEC` | ✅ `?` enforced | JWT signing secret |
| `CSRF_SECRET` | ✅ `?` enforced | CSRF token secret |
| `MONGO_ROOT_USER` | ⚠️ | MongoDB root username (default: `admin`) |
| `MONGO_APP_USER` | ⚠️ | MongoDB app username (default: `ubis_user`) |
| `REDIS_PASSWORD` | ⚠️ | Redis password (default: `changeme`) |
| `CLIENT_URL` | ⚠️ | Frontend domain URL |
| `SERVER_PORT` | — | Host port mapping (default: `5001`) |
| `CLIENT_PORT` | — | Host port mapping (default: `80`) |

> Variables marked with `?` will cause Docker Compose to **fail to start** if not set.

---

## CSRF Cookie Names

| Environment | Cookie Name |
|-------------|------------|
| Development | `ubis.x-csrf-token` |
| Production | `__Host-ubis.x-csrf-token` |

## Security Recommendations

| Variable | Recommendation |
|----------|---------------|
| `JWT_SEC` | Use 64+ random characters, never commit to git |
| `CSRF_SECRET` | Always set separately from `JWT_SEC` |
| `MONGO_ROOT_PASSWORD` | Strong, unique password |
| `REDIS_PASSWORD` | Change from default `changeme` |
| `SEED_PASSWORD` | Change default after initial setup |
| `MEILI_MASTER_KEY` | Required in production for API security |
