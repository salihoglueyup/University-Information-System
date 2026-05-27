# Deployment

This document covers all deployment strategies for UBIS: Docker Compose (development & production), Kubernetes, and infrastructure configuration.

## Deployment Options

| Method | Environment | Complexity | Recommended For |
|--------|------------|------------|-----------------|
| [Docker Compose (Dev)](#docker-compose-development) | Development | Low | Local development |
| [Docker Compose (Prod)](#docker-compose-production) | Production | Medium | Single-server production |
| [Kubernetes](#kubernetes) | Production | High | Scalable multi-node production |
| [Manual](#manual-setup) | Development | Low | Quick local testing |

---

## Docker Compose (Development)

### Quick Start

```bash
cd docker
cp .env.example .env      # Edit environment variables
docker compose up -d       # Start all 7 services
```

### Services Architecture

```mermaid
graph TB
    subgraph dev["Docker Compose — Development"]
        Client["Client<br/>:5173<br/>Vite Dev Server"]
        Server["Server<br/>:5000<br/>Nodemon"]
        Mongo["MongoDB 7<br/>:27017"]
        Redis["Redis 7<br/>(internal only)"]
        RabbitMQ["RabbitMQ 3<br/>:5672 / :15672"]
        Meili["MeiliSearch 1.6<br/>:7700"]
        Nginx["Nginx Gateway<br/>:80<br/>(optional profile)"]
    end

    Client --> Server
    Server --> Mongo
    Server --> Redis
    Server --> RabbitMQ
    Server --> Meili
    Nginx --> Client
    Nginx --> Server
```

### Service Details

| Service | Image | Ports | Health Check | Volume |
|---------|-------|-------|-------------|--------|
| **mongo** | `mongo:7` | 27017 | `mongosh ping` | `mongo_data` |
| **redis** | `redis:7-alpine` | internal only | `redis-cli ping` | `redis_data` |
| **rabbitmq** | `rabbitmq:3-management-alpine` | 5672, 15672 | `rabbitmq-diagnostics` | `rabbitmq_data` |
| **meilisearch** | `getmeili/meilisearch:v1.6` | 7700 | `wget /health` | `meili_data` |
| **server** | Custom (Dockerfile) | 5000 | `wget /` | Source mount + `server_node_modules` |
| **client** | Custom (Dockerfile) | 5173 | `wget /` | Source mount + `client_node_modules` |
| **nginx-gateway** | `nginx:1.27-alpine` | 80 | `wget /` | Config mount |

### Networks

| Network | Purpose | Services |
|---------|---------|----------|
| `frontend` | Client-facing traffic | client, nginx-gateway |
| `backend` | Internal API & data traffic | All services |

### Optional Nginx Gateway

```bash
docker compose --profile gateway up -d
```

### Hot Reload

Both client and server mount source directories as volumes for live development:
- `../server:/app` — Server source code
- `../client:/app` — Client source code
- `node_modules` in named volumes to prevent host conflicts

---

## Docker Compose (Production)

### Quick Start

```bash
cd docker
cp .env.production.example .env.production
# Edit ALL required variables (marked with ?)
docker compose -f docker-compose.prod.yml up -d --build
```

### Key Differences from Development

| Feature | Development | Production |
|---------|-------------|------------|
| **Node.js** | `nodemon` (hot reload) | `node index.js` |
| **Client** | Vite dev server | Nginx serving static build |
| **Build target** | `development` | `production` |
| **MongoDB** | No auth | Root + app user auth |
| **Redis** | No password | Password required |
| **RabbitMQ** | Management UI exposed | Management UI closed |
| **Resource limits** | None | CPU/memory limits set |
| **Log rotation** | 10MB × 3 | 50MB × 5 (server) |
| **Required env vars** | Optional | Enforced with `?` |
| **Source volumes** | Mounted | Not mounted (built into image) |

### Required Environment Variables

> Variables marked with `?` will cause Docker to fail if not set.

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_ROOT_PASSWORD` | ✅ | MongoDB root password |
| `MONGO_APP_PASSWORD` | ✅ | MongoDB app user password |
| `MEILI_MASTER_KEY` | ✅ | MeiliSearch API key |
| `JWT_SEC` | ✅ | JWT signing secret |
| `CSRF_SECRET` | ✅ | CSRF token secret |
| `REDIS_PASSWORD` | ⚠️ | Defaults to `changeme` |
| `CLIENT_URL` | ⚠️ | Your domain URL |

### Resource Limits

| Service | Memory Limit | CPU Limit | Memory Reservation |
|---------|-------------|-----------|-------------------|
| **server** | 512MB | 1.0 CPU | 256MB |
| **client** | 128MB | 0.5 CPU | 64MB |

### Multi-Stage Dockerfiles

#### Server Dockerfile

```
Stage 1: development
  └── node:20-alpine, npm install, nodemon

Stage 2: production
  └── node:20-alpine, npm ci --omit=dev
  └── Non-root user (node)
  └── Built-in HEALTHCHECK
  └── Directories: /app/uploads, /app/logs
```

#### Client Dockerfile

```
Stage 1: development
  └── node:20-alpine, npm install, vite dev

Stage 2: build
  └── node:20-alpine, npm ci, vite build

Stage 3: production
  └── nginx:1.27-alpine
  └── Custom nginx config
  └── Static files from build stage
  └── Built-in HEALTHCHECK
```

---

## Monitoring Stack

```bash
cd docker
docker compose -f docker-compose.monitoring.yml up -d
```

| Service | Port | Purpose |
|---------|------|---------|
| **Prometheus** | 9090 | Metrics collection |
| **Grafana** | 3001 | Dashboard visualization |

Prometheus scrapes the Express server's `/metrics` endpoint (exposed by `express-prom-bundle`).

See [Monitoring](./MONITORING.md) for detailed configuration.

---

## Kubernetes

### Manifests

```
k8s/
├── deployment.yaml    # Backend deployment (3 replicas)
└── service.yaml       # ClusterIP service
```

### Deployment Configuration

| Property | Value |
|----------|-------|
| Replicas | 3 |
| Image | `yourdockerhubuser/ubis-backend:latest` |
| Container port | 5000 |
| Memory request | 256Mi |
| Memory limit | 512Mi |
| CPU request | 250m |
| CPU limit | 500m |
| Readiness probe | `GET /api/csrf-token:5000` every 5s |

### Secrets

Sensitive values are pulled from a Kubernetes Secret named `ubis-secrets`:

```yaml
env:
  - name: MONGO_URL
    valueFrom:
      secretKeyRef:
        name: ubis-secrets
        key: mongo-url
  - name: REDIS_URL
    valueFrom:
      secretKeyRef:
        name: ubis-secrets
        key: redis-url
```

Create the secret:

```bash
kubectl create secret generic ubis-secrets \
  --from-literal=mongo-url='mongodb://user:pass@mongo:27017/ubis' \
  --from-literal=redis-url='redis://:password@redis:6379' \
  --from-literal=jwt-sec='your-jwt-secret' \
  --from-literal=csrf-secret='your-csrf-secret'
```

### Service

```yaml
type: ClusterIP
port: 80 → targetPort: 5000
```

---

## Manual Setup

### Prerequisites

- Node.js 20+
- MongoDB 7+ (running locally or remote)
- Redis 7+ (optional)
- RabbitMQ 3+ (optional)
- MeiliSearch 1.6+ (optional)

### Server

```bash
cd server
cp .env.example .env    # Configure environment variables
npm install
npm run dev             # Starts with nodemon on :5000
```

### Client

```bash
cd client
npm install
npm run dev             # Starts Vite dev server on :5173
```

### Seed Data

```bash
cd server
node seed.js                    # Base data (admin, courses)
node import-students-simple.js  # Test students
```

---

## Health Checks

All services have health checks configured:

| Service | Method | Endpoint | Interval | Timeout | Retries |
|---------|--------|----------|----------|---------|---------|
| MongoDB | `mongosh` | `ping` | 10-15s | 5s | 5 |
| Redis | `redis-cli` | `ping` | 10-15s | 5s | 5 |
| RabbitMQ | `rabbitmq-diagnostics` | `check_running` | 10-15s | 5s | 5 |
| MeiliSearch | `wget` | `/health` | 15s | 5s | 5 |
| Server | `wget` | `/` | 30s | 10s | 3 |
| Client | `wget` | `/` | 30s | 3-10s | 3 |

---

## Graceful Shutdown

The server handles `SIGTERM` and `SIGINT` signals:

1. Stop accepting new connections
2. Close HTTP server
3. Close MongoDB connection
4. Close Redis connection
5. Close RabbitMQ channel and connection
6. Exit process

**Forced timeout**: 10 seconds — if graceful shutdown doesn't complete, the process exits forcefully.
