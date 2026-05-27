# Troubleshooting

Comprehensive guide for diagnosing and resolving common issues in UBIS.

## 1. Authentication Issues

### 401 Unauthorized

| Symptom | Cause | Solution |
|---------|-------|----------|
| Every request returns 401 | Token expired (1hr) | Log out and log in again |
| Redirect loop to `/login` | No token in localStorage | Clear storage, re-login |
| "Token is not valid" | Corrupted or wrong JWT_SEC | Use consistent `JWT_SEC` |
| 401 after server restart | JWT_SEC env changed | Keep same `.env` across restarts |

### Login Fails

| Symptom | Cause | Solution |
|---------|-------|----------|
| "Invalid credentials" | Wrong password | Default: `ChangeMe!123` |
| "User not found" | User doesn't exist | Run `node seed.js` |

---

## 2. CSRF Issues (403)

| Symptom | Cause | Solution |
|---------|-------|----------|
| POST/PUT/DELETE → 403 | Missing CSRF token | Refresh the page |
| "Invalid CSRF token" | Cookie/header mismatch | Clear cookies, refresh |
| CSRF error in curl/Postman | Not sending CSRF header | `GET /api/csrf-token` first, include `X-CSRF-Token` header + cookie |

---

## 3. CORS Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| Browser blocks request | Frontend URL not whitelisted | Set `CLIENT_URL=http://localhost:5173` in `.env` |
| Multiple origins needed | Single origin set | Comma-separate: `CLIENT_URL=http://localhost:5173,http://localhost:3000` |

---

## 4. Server Errors (500)

| Symptom | Cause | Solution |
|---------|-------|----------|
| "Something went wrong!" | Unhandled error | Check `docker logs ubis_server` or terminal |
| MongoNetworkError | MongoDB not running | `docker compose up -d mongo` |
| ECONNREFUSED :6379 | Redis down | Optional — app continues without Redis |
| Mongoose CastError | Invalid ObjectId in URL | Check ID format |
| Mongoose 11000 | Duplicate key | Value already exists |

---

## 5. Docker Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| "port already allocated" | Port in use | Change port in `.env` |
| Container exits immediately | Startup error | `docker logs <container>` |
| "mongo: auth failed" | Stale volume credentials | `docker compose down -v && docker compose up -d` |
| Build fails | Cached layers | `docker compose build --no-cache` |
| ENOSPC (no space) | Docker disk full | `docker system prune -a` |

### WSL2 Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| Slow file access | Cross-filesystem | Store project in WSL (`/home/...`) |
| `main.jsx` hangs | Vite HMR | Add `server.watch.usePolling: true` to vite config |
| Out of memory | WSL2 limit | Create `.wslconfig` with memory limit |

---

## 6. Rate Limiting (429)

| Limiter | Limit | Window | Fix |
|---------|-------|--------|-----|
| General API | 100 req | 15 min | Wait or flush Redis |
| Auth endpoints | 20 req | 15 min | Wait or flush Redis |

```bash
# Quick reset (dev): docker exec ubis_redis redis-cli FLUSHALL
```

---

## 7. Data Issues

### MeiliSearch Out of Sync

```bash
curl -X POST http://localhost:5000/api/search/sync \
  -H "Authorization: Bearer $TOKEN" -H "X-CSRF-Token: $CSRF" -b cookies.txt
```

### Redis Cache Stale

```bash
# Flush: docker exec ubis_redis redis-cli FLUSHALL
# Bypass: ?nocache=1 query parameter
```

---

## 8. Diagnostic Commands

```bash
curl http://localhost:5000/                              # Server health
curl http://localhost:5000/metrics                       # Prometheus metrics
docker exec ubis_mongo mongosh --eval "db.runCommand({ping:1})"  # MongoDB
docker exec ubis_redis redis-cli ping                    # Redis
curl http://localhost:7700/health                         # MeiliSearch
docker exec ubis_rabbitmq rabbitmqctl status              # RabbitMQ
docker compose ps                                         # Container status
```
