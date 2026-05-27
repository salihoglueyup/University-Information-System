# Setup Guide

Step-by-step guide for setting up UBIS for local development.

> For deployment instructions (Docker, Kubernetes, production), see [Deployment](../infrastructure/DEPLOYMENT.md).

## Prerequisites

| Software | Version | Required | Notes |
|----------|---------|----------|-------|
| **Node.js** | 20+ (LTS) | ✅ | [nodejs.org](https://nodejs.org) |
| **npm** | 10+ | ✅ | Bundled with Node.js |
| **MongoDB** | 7+ | ✅ | Local, Docker, or Atlas |
| **Git** | 2.40+ | ✅ | Version control |
| **Docker Desktop** | Latest | ⚠️ Optional | Recommended for infrastructure |
| **Redis** | 7+ | ❌ Optional | Caching & rate limiting |
| **RabbitMQ** | 3+ | ❌ Optional | Async notifications |
| **MeiliSearch** | 1.6+ | ❌ Optional | Full-text search |

> **Note:** Redis, RabbitMQ, and MeiliSearch are optional. The server gracefully degrades without them (see [Architecture — Graceful Degradation](../architecture/ARCHITECTURE.md#graceful-degradation)).

---

## Quick Start (Docker — Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/salihoglueyup/University-Information-System.git
cd ubis

# 2. Start all services with Docker Compose
cd docker
cp .env.example .env           # Create environment file
docker compose up -d            # Start 7 services

# 3. Seed test data
docker exec -it ubis_server node seed.js
docker exec -it ubis_server node import-students-simple.js

# 4. Access the application
# Client: http://localhost:5173
# Server: http://localhost:5000
# Swagger: http://localhost:5000/api-docs
# MeiliSearch: http://localhost:7700
# RabbitMQ: http://localhost:15672 (guest/guest)
```

---

## Manual Setup (Without Docker)

### Step 1: Clone & Install

```bash
git clone https://github.com/salihoglueyup/University-Information-System.git
cd ubis

# Install server dependencies
cd server
cp .env.example .env
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables

Edit `server/.env`:

```env
# Required
MONGO_URL=mongodb://localhost:27017/ubis
JWT_SEC=your-super-secret-jwt-key-change-this
CSRF_SECRET=your-csrf-secret-key-change-this

# Client URL (CORS whitelist)
CLIENT_URL=http://localhost:5173

# Optional — Redis
REDIS_URL=redis://localhost:6379

# Optional — RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Optional — MeiliSearch
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=your-meili-key

# Optional — SMTP (Email)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Optional — Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional — Seed scripts
SEED_PASSWORD=ChangeMe!123
```

### Step 3: Start MongoDB

**Option A — Local MongoDB:**
```bash
mongod --dbpath /data/db
```

**Option B — Docker MongoDB only:**
```bash
docker run -d --name ubis_mongo -p 27017:27017 mongo:7
```

**Option C — MongoDB Atlas:**
Set `MONGO_URL` to your Atlas connection string.

### Step 4: Start the Application

```bash
# Terminal 1 — Server
cd server
npm run dev     # Starts with nodemon on :5000

# Terminal 2 — Client
cd client
npm run dev     # Starts Vite dev server on :5173
```

### Step 5: Seed Data

```bash
cd server
node seed.js                    # Creates admin user, courses, announcements
node import-students-simple.js  # Creates test students
```

### Step 6: Verify

| URL | Expected |
|-----|----------|
| http://localhost:5000 | `"IAU UBIS API is running"` |
| http://localhost:5000/api-docs | Swagger UI |
| http://localhost:5173 | Login page |

### Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `ChangeMe!123` (from `SEED_PASSWORD`) |
| Student | `B211200051` | `ChangeMe!123` |

---

## Environment Variables Reference

### Server (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | — |
| `MONGO_URL` | MongoDB connection URI | `mongodb://localhost:27017/ubis` | ✅ |
| `JWT_SEC` | JWT signing secret | — | ✅ |
| `CSRF_SECRET` | CSRF token secret | Falls back to `JWT_SEC` | ⚠️ |
| `CLIENT_URL` | Allowed CORS origins (comma-separated) | `http://localhost:5173` | ✅ |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` | — |
| `REDIS_MAX_RETRIES` | Max Redis reconnect attempts | `3` | — |
| `RABBITMQ_URL` | RabbitMQ connection URL | `amqp://localhost` | — |
| `MEILI_HOST` | MeiliSearch URL | `http://localhost:7700` | — |
| `MEILI_MASTER_KEY` | MeiliSearch API key | — | — |
| `MAIL_HOST` | SMTP server host | — | — |
| `MAIL_PORT` | SMTP port | — | — |
| `MAIL_USER` | SMTP username | — | — |
| `MAIL_PASS` | SMTP password | — | — |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | — | — |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | — | — |
| `SEED_PASSWORD` | Default password for seed scripts | `ChangeMe!123` | — |
| `NODE_ENV` | Environment mode | `development` | — |
| `API_URL` | Swagger server URL | `http://localhost:5000/api` | — |

---

## Troubleshooting

### Server won't start

| Error | Solution |
|-------|----------|
| `MongoNetworkError` | Ensure MongoDB is running and `MONGO_URL` is correct |
| `EADDRINUSE` | Port 5000 is in use. The server auto-retries up to 10 ports |
| `JWT_SEC required` | Set `JWT_SEC` in your `.env` file |
| `Cannot find module` | Run `npm install` in the `server/` directory |

### Client won't start

| Error | Solution |
|-------|----------|
| `EADDRINUSE :5173` | Another process is using port 5173 |
| `Module not found` | Run `npm install` in the `client/` directory |
| `Vite build error` | Check for TypeScript/JSX errors in source files |

### Docker issues

| Error | Solution |
|-------|----------|
| `port is already allocated` | Stop conflicting services or change port in `.env` |
| `container exited (1)` | Check logs: `docker logs ubis_server` |
| `mongo: authentication failed` | Reset volumes: `docker compose down -v && docker compose up -d` |
| `ENOSPC` on WSL2 | Increase WSL2 memory in `.wslconfig` |

### API requests failing

| Symptom | Solution |
|---------|----------|
| `401 Unauthorized` | Token expired — log in again |
| `403 Forbidden (CSRF)` | Clear cookies and refresh the page |
| `CORS error` | Ensure `CLIENT_URL` matches your frontend URL |
| `429 Too Many Requests` | Wait 15 minutes or restart Redis |

---

## Recommended IDE Setup

### VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| **ESLint** | JavaScript linting |
| **Tailwind CSS IntelliSense** | Tailwind class autocomplete |
| **Prettier** | Code formatting |
| **MongoDB for VS Code** | Database browsing |
| **Thunder Client** | REST API testing |
| **Docker** | Container management |
| **GitLens** | Git blame & history |

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.workingDirectories": ["./client", "./server"],
  "tailwindCSS.includeLanguages": { "javascript": "javascript" }
}
```
