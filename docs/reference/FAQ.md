# Frequently Asked Questions

## General

### What is UBIS?

UBIS (Üniversite Bilgi Sistemi) is a comprehensive Student Information System built for Istanbul Aydın University. It covers academic records, course management, financial operations, campus services, and more.

### What technology stack does UBIS use?

- **Frontend:** React 19, Vite 6, TailwindCSS, Zustand, TanStack Query
- **Backend:** Express 5, Mongoose 9, JWT, Socket.io
- **Database:** MongoDB 7, Redis 7, MeiliSearch 1.6
- **Message Queue:** RabbitMQ 3
- **Infrastructure:** Docker Compose, Kubernetes, Nginx, Prometheus, Grafana

### What user roles are supported?

| Role | Code | Description |
|------|------|-------------|
| Student | `student` | Default role for university students |
| Academic | `academic` | Instructors and research assistants |
| Admin | `admin` | System administrators with full access |

---

## Setup & Development

### How do I set up the project locally?

**Fastest method (Docker):**
```bash
cd docker && cp .env.example .env && docker compose up -d
```

**Manual method:**
```bash
cd server && cp .env.example .env && npm install && npm run dev
cd ../client && npm install && npm run dev
```

See [Setup Guide](../getting-started/SETUP_GUIDE.md) for detailed instructions.

### Do I need Redis, RabbitMQ, and MeiliSearch to run the app?

**No.** These are optional services. The server gracefully degrades:
- Without Redis → In-memory rate limiting, no caching
- Without RabbitMQ → No async notifications
- Without MeiliSearch → Search functionality disabled

Only **MongoDB** is required.

### What Node.js version do I need?

Node.js **20+** (LTS recommended). The Docker images use `node:20-alpine`.

### How do I seed test data?

```bash
cd server
node seed.js                    # Admin user + courses + announcements
node import-students-simple.js  # Test student accounts
```

### What are the default login credentials?

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `ChangeMe!123` |
| Student | `B211200051` | `ChangeMe!123` |

### Why does my client show a CORS error?

Ensure the `CLIENT_URL` environment variable in `server/.env` matches your frontend URL (including port):
```env
CLIENT_URL=http://localhost:5173
```

For multiple origins, use comma separation:
```env
CLIENT_URL=http://localhost:5173,http://localhost:3000
```

### Why do I get a CSRF error on POST requests?

UBIS uses the Double Submit Cookie CSRF pattern. The client automatically handles this, but if you're testing via curl or Postman:

1. First, get a CSRF token: `GET /api/csrf-token`
2. Include the token in your header: `X-CSRF-Token: <token>`
3. Include the cookie that was set by the response

---

## Authentication

### How long do JWT tokens last?

JWT tokens expire after **1 hour**. After expiry, the client automatically redirects to the login page.

### How do I enable 2FA?

1. Log in → Settings → Two-Factor Authentication
2. Click "Enable 2FA"
3. Scan the QR code with Google Authenticator, Authy, or similar app
4. Enter the 6-digit code to confirm

### Can I use Google to log in?

Yes, if Google OAuth is configured. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env` file.

### I forgot my password. What do I do?

1. Click "Forgot Password" on the login page
2. Enter your email address
3. Check your email for a reset link
4. Click the link and set a new password

> The reset link expires after 1 hour.

---

## Architecture

### Where are the API routes defined?

All route files are in `server/routes/`. They are registered in `server/index.js`:
```javascript
app.use("/api/auth", authRoute);
app.use("/api/courses", verifyToken, coursesRoute);
// ... 21 more route groups
```

### How does the caching work?

Redis caches GET responses for 10 minutes. Cache keys are user-scoped:
```
api-cache:{userId}:GET:/api/faculties
```

Bypass cache with `?nocache=1`. Check the `X-Cache` response header for HIT/MISS.

### How does real-time notification work?

```
Controller → RabbitMQ → Notification Consumer → Socket.io → React Client → Toast
```

See [Real-time](../architecture/REALTIME.md) for details.

### What happens if Redis goes down?

The application continues running:
- Rate limiting falls back to in-memory
- Cache middleware is skipped
- Redis reconnects automatically (up to 3 retries with exponential backoff)

---

## Docker

### How do I run the monitoring stack?

```bash
cd docker
docker compose -f docker-compose.monitoring.yml up -d
```

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

### How do I view container logs?

```bash
docker logs ubis_server          # Server logs
docker logs ubis_mongo           # MongoDB logs
docker logs -f ubis_server       # Follow live
```

### How do I reset the database?

```bash
cd docker
docker compose down -v           # Remove containers AND volumes
docker compose up -d             # Fresh start
# Then re-seed data
docker exec -it ubis_server node seed.js
```

---

## Troubleshooting

### The page is stuck loading (spinner forever)

The app has a recovery mechanism — after 8 seconds, a button appears to redirect to the login page. If this happens frequently:
- Clear browser cache and cookies
- Check that the server is running (`curl http://localhost:5000`)
- Check for JavaScript errors in browser DevTools console

### API returns 429 Too Many Requests

You've hit the rate limit (100 requests / 15 minutes). Wait 15 minutes or restart Redis to clear the counters.

### MongoDB authentication fails in Docker

```bash
# Reset everything
docker compose down -v
docker compose up -d
```

The `mongo-init.js` script creates the app user on first startup. If volumes persist with old credentials, they need to be cleared.

### Port is already in use

The server automatically tries up to 10 alternative ports if 5000 is taken. Check the console output for the actual port.

For Docker, change the port mapping in `.env`:
```env
SERVER_PORT=5001
CLIENT_PORT=3000
```

---

## Contributing

### How do I add a new API endpoint?

Follow the pattern: **Route → Controller → Service → Model**

See [Contributing — Adding a New API Endpoint](../community/CONTRIBUTING.md#adding-a-new-api-endpoint).

### How do I add a new frontend page?

1. Create the component in `client/src/pages/dashboard/`
2. Add a lazy import in `App.jsx`
3. Add a `<Route>` in the dashboard routes
4. Optionally add to `navigationConfig.jsx` for sidebar visibility

See [Contributing — Adding a New Frontend Page](../community/CONTRIBUTING.md#adding-a-new-frontend-page).

### Where do I put tests?

Backend tests go in `server/tests/` following the pattern `*.test.js`. Run with `npm test`.
