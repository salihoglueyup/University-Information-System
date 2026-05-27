# Admin Guide

A comprehensive guide for system administrators managing the UBIS platform.

## Getting Started

### Logging In

1. Navigate to the UBIS login page
2. Enter your admin username (e.g., `admin`)
3. Enter your password
4. Enter 2FA code if enabled (strongly recommended for admin accounts)

> Your sidebar will display **"Yönetim Paneli"** after login.

### Default Admin Credentials

| Username | Password | Created By |
|----------|----------|------------|
| `admin` | `ChangeMe!123` (default) | `seed.js` script |

> ⚠️ **Change the default password immediately** after first login.

---

## Navigation Menu

The admin sidebar has 4 sections:

### 🏠 General (Genel)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Panel Anasayfa | `/dashboard` | Admin dashboard with system-wide stats |
| Kampüs İkizi | `/dashboard/campus-map` | Interactive campus map (Leaflet) |
| Sistem Analitiği | `/dashboard/analytics` | System-wide analytics dashboard |

### 🔧 Management (Yönetim)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Kullanıcı Yönetimi | `/dashboard/users` | CRUD operations for all users |
| Akademik Kokpit | `/dashboard/academics` | Academic staff overview |
| Bölüm / Fakülte | `/dashboard/departments` | Department and faculty management |
| Ders Atamaları | `/dashboard/course-assignments` | Assign courses to instructors |

### 📊 Reporting (Raporlama)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Akademik Raporlar | `/dashboard/academic-reports` | Academic statistics and reports |
| Sistem Logları | `/dashboard/logs` | System audit log viewer |
| Mali Raporlar | `/dashboard/financial-reports` | Financial statistics and trends |

### ⚙️ System (Sistem)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Genel Ayarlar | `/dashboard/system-settings` | System-wide configuration |
| Veritabanı Yedekleme | `/dashboard/backup` | Database backup management |
| Kurumsal Mesajlar | `/dashboard/emails` | System-wide email management |

---

## Admin-Exclusive Features

### User Management

**Path:** `/dashboard/users`

| Action | Description |
|--------|-------------|
| View all users | List with pagination, search, and role filtering |
| Create user | Register new students, academics, or admins |
| Edit user | Change role, update information |
| Delete user | Remove user account |

**API Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/users` | GET | List all users |
| `PUT /api/users/:id` | PUT | Update user role/info |
| `DELETE /api/users/:id` | DELETE | Delete a user |

### System Logs

**Path:** `/dashboard/logs`

View all system activity logs including:
- Login attempts (success/failure)
- Data modifications
- Error events
- User actions with IP addresses

**API:** `GET /api/logs` — Supports pagination and filtering.

### Analytics Dashboard

**Path:** `/dashboard/analytics`

System-wide statistics powered by MongoDB aggregation:
- Total students, courses, active users
- Enrollment trends
- GPA distribution by faculty
- Revenue overview

**API Endpoints:**

| Endpoint | Purpose |
|----------|---------|
| `GET /api/analytics` | General system statistics |
| `GET /api/analytics/gpa-distribution` | Faculty GPA distribution |

> Both endpoints are cached in Redis (10 min TTL).

### Financial Reports

**Path:** `/dashboard/financial-reports`

| Feature | Description |
|---------|-------------|
| Monthly finance stats | Income vs expenses over time |
| Tuition collection rate | Percentage of paid tuitions |
| Transaction breakdown | Category-wise spending analysis |

**API:** `GET /api/payments/finance-stats`

### Student Affairs

**Path:** `/dashboard/student-affairs`

Manage student administrative processes:
- Enrollment management
- Status changes (active, suspended, graduated)
- Bulk operations

### System Settings

**Path:** `/dashboard/system-settings`

Configure system-wide parameters.

### Database Backup

**Path:** `/dashboard/backup`

Manage database backup operations.

### MeiliSearch Sync

Force a full re-sync of MongoDB data to MeiliSearch:

```bash
# Via API
curl -X POST http://localhost:5000/api/search/sync \
  -H "Authorization: Bearer <admin_jwt>" \
  -H "X-CSRF-Token: <csrf_token>"
```

**API:** `POST /api/search/sync`

---

## Common Admin Workflows

### Creating a New User

1. Navigate to **Yönetim → Kullanıcı Yönetimi**
2. Click "Yeni Kullanıcı"
3. Fill in username, email, password, role
4. Submit the form

> Or via API: `POST /api/auth/register`

### Changing a User's Role

1. Navigate to **Yönetim → Kullanıcı Yönetimi**
2. Find the user (use search)
3. Click Edit
4. Change the role dropdown: `student`, `academic`, `admin`
5. Save

### Viewing System Health

1. **Swagger UI**: `http://localhost:5000/api-docs` — Test all API endpoints
2. **Prometheus**: `http://localhost:9090` — Raw metrics
3. **Grafana**: `http://localhost:3001` — Visual dashboards
4. **Health Endpoint**: `GET /` → `"IAU UBIS API is running"`

### Monitoring Real-Time Activity

- Check **Sistem Logları** for user activity audit trail
- Check **Sistem Analitiği** for current stats
- The online user count is tracked via Socket.io

### Running Seed Scripts

```bash
# Base data (admin user, initial courses, announcements)
cd server && node seed.js

# Test students
node import-students-simple.js

# Comprehensive student data
node import-students.js

# Realistic enriched data
node seed-real-data.js

# Sync students to user accounts
node sync-students-to-users.js
```

### Database Operations

```bash
# Connect to MongoDB shell
docker exec -it ubis_mongo mongosh

# Connect with auth (production)
docker exec -it ubis_mongo_prod mongosh -u admin -p <password>

# Export a collection
docker exec -it ubis_mongo mongoexport --db=ubis --collection=users --out=/tmp/users.json

# Import data
docker exec -it ubis_mongo mongoimport --db=ubis --collection=students --file=/tmp/students.json
```

---

## Admin API Reference

Admin-exclusive API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/users` | GET | List all users |
| `PUT /api/users/:id` | PUT | Update user |
| `DELETE /api/users/:id` | DELETE | Delete user |
| `GET /api/logs` | GET | View system logs |
| `GET /api/analytics` | GET | System analytics |
| `GET /api/analytics/gpa-distribution` | GET | GPA stats |
| `GET /api/evaluations/all` | GET | All course evaluations |
| `GET /api/payments/finance-stats` | GET | Financial stats |
| `POST /api/search/sync` | POST | Re-sync MeiliSearch |

---

## Security Recommendations

| Item | Priority | Action |
|------|----------|--------|
| Change default password | 🔴 Critical | Immediately after first login |
| Enable 2FA | 🔴 Critical | Via Settings → Two-Factor Authentication |
| Set unique `JWT_SEC` | 🔴 Critical | In `.env` file (production) |
| Set unique `CSRF_SECRET` | 🔴 Critical | In `.env` file (must differ from JWT_SEC) |
| Review logs regularly | 🟡 Important | Check `/dashboard/logs` weekly |
| Monitor analytics | 🟡 Important | Watch for anomalies in user activity |
| Restrict register endpoint | 🟠 Recommended | Currently open — consider admin-only |

---

## Monitoring & Observability

See [Monitoring](../MONITORING.md) for detailed setup.

| Tool | URL | Purpose |
|------|-----|---------|
| Swagger UI | `:5000/api-docs` | API exploration and testing |
| Prometheus | `:9090` | Raw metrics and queries |
| Grafana | `:3001` | Visual dashboards |
| RabbitMQ UI | `:15672` | Message queue monitoring |
| MeiliSearch | `:7700` | Search engine dashboard |
