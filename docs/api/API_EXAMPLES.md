# API Examples

Practical curl examples for all major UBIS API endpoints. All examples assume the server is running on `localhost:5000`.

> **Prerequisites:** Most endpoints require a JWT token. See [Authentication](#get-jwt-token) below.

## Authentication

### Get JWT Token

```bash
# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "ChangeMe!123"}'

# Response:
# {
#   "_id": "664a...",
#   "username": "admin",
#   "role": "admin",
#   "fullName": "System Admin",
#   "accessToken": "eyJhbGciOiJIUzI1NiI..."
# }

# Save token for subsequent requests
TOKEN="eyJhbGciOiJIUzI1NiI..."
```

### Get CSRF Token

```bash
# Required before any POST/PUT/DELETE request
curl -c cookies.txt http://localhost:5000/api/csrf-token

# Response: { "csrfToken": "abc123..." }
CSRF="abc123..."
```

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "B211200099",
    "email": "student@iau.edu.tr",
    "password": "SecurePass123",
    "fullName": "Test Student"
  }'
```

### Forgot Password

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt \
  -d '{"email": "student@iau.edu.tr"}'

# Always returns 200 (prevents email enumeration)
```

### Enable 2FA

```bash
# Step 1: Generate 2FA secret and QR code
curl -X POST http://localhost:5000/api/auth/2fa/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt

# Response: { "secret": "JBSWY3DPEHPK3PXP", "qrCode": "data:image/png;base64,..." }

# Step 2: Verify with TOTP code from authenticator app
curl -X POST http://localhost:5000/api/auth/2fa/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt \
  -d '{"token": "123456"}'
```

---

## Courses

### List All Courses

```bash
curl http://localhost:5000/api/courses \
  -H "Authorization: Bearer $TOKEN"
```

### List with Pagination & Sort

```bash
# Page 2, 10 items per page, sorted by name ascending
curl "http://localhost:5000/api/courses?page=2&limit=10&sort=name" \
  -H "Authorization: Bearer $TOKEN"
```

### List with Filtering

```bash
# Only elective courses in spring semester
curl "http://localhost:5000/api/courses?type=Seçmeli&semester=Bahar" \
  -H "Authorization: Bearer $TOKEN"

# Courses with 3+ credits
curl "http://localhost:5000/api/courses?credit[gte]=3" \
  -H "Authorization: Bearer $TOKEN"
```

### Create a Course

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt \
  -d '{
    "code": "BLM305",
    "name": "Yapay Zeka",
    "credit": 3,
    "ects": 5,
    "type": "Seçmeli",
    "instructor": "Dr. Ahmet Yılmaz",
    "semester": "Güz"
  }'
```

---

## Students

### Get Student by ID

```bash
curl http://localhost:5000/api/students/B211200051 \
  -H "Authorization: Bearer $TOKEN"
```

### Student 360 View

```bash
# Comprehensive profile (cached for 10 min)
curl http://localhost:5000/api/students/B211200051/360 \
  -H "Authorization: Bearer $TOKEN"

# Bypass cache
curl "http://localhost:5000/api/students/B211200051/360?nocache=1" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Grades

### List Grades

```bash
# All grades (for current user)
curl http://localhost:5000/api/grades \
  -H "Authorization: Bearer $TOKEN"

# Grades for specific user
curl "http://localhost:5000/api/grades?userId=664a1b2c3d4e5f" \
  -H "Authorization: Bearer $TOKEN"
```

### Create Grade Entry

```bash
curl -X POST http://localhost:5000/api/grades \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt \
  -d '{
    "studentId": "B211200051",
    "courseCode": "BLM101",
    "midterm": 85,
    "final": 90,
    "letterGrade": "AA"
  }'
```

---

## Announcements

### List Announcements

```bash
# All announcements
curl http://localhost:5000/api/announcements \
  -H "Authorization: Bearer $TOKEN"

# Filter by category
curl "http://localhost:5000/api/announcements?category=academic" \
  -H "Authorization: Bearer $TOKEN"
```

### Create Announcement

```bash
curl -X POST http://localhost:5000/api/announcements \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt \
  -d '{
    "title": "Kayıt Yenileme Başlıyor",
    "text": "2026 Güz dönemi kayıt yenileme işlemleri 1 Eylül tarihinde başlayacaktır.",
    "category": "academic",
    "priority": "high"
  }'
```

---

## Search

### Full-Text Search

```bash
# Search across students, courses, announcements
curl "http://localhost:5000/api/search?q=bilgisayar" \
  -H "Authorization: Bearer $TOKEN"

# Response:
# {
#   "students": [...],
#   "courses": [{ "code": "BLM101", "title": "Bilgisayar Müh. Giriş" }],
#   "announcements": [...]
# }
```

### Force MeiliSearch Sync (Admin)

```bash
curl -X POST http://localhost:5000/api/search/sync \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt
```

---

## Users (Admin Only)

### List All Users

```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

### Update User Role

```bash
curl -X PUT http://localhost:5000/api/users/664a1b2c3d4e5f \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt \
  -d '{"role": "academic"}'
```

### Delete User

```bash
curl -X DELETE http://localhost:5000/api/users/664a1b2c3d4e5f \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt
```

---

## Analytics (Admin Only)

### System Analytics

```bash
curl http://localhost:5000/api/analytics \
  -H "Authorization: Bearer $TOKEN"

# Check cache status
curl -v http://localhost:5000/api/analytics \
  -H "Authorization: Bearer $TOKEN" 2>&1 | grep X-Cache
# X-Cache: HIT  (served from Redis)
# X-Cache: MISS (served from MongoDB)
```

### GPA Distribution

```bash
curl http://localhost:5000/api/analytics/gpa-distribution \
  -H "Authorization: Bearer $TOKEN"
```

---

## System Logs (Admin Only)

```bash
# All logs
curl http://localhost:5000/api/logs \
  -H "Authorization: Bearer $TOKEN"

# Filter by action
curl "http://localhost:5000/api/logs?action=login&sort=-createdAt&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

---

## File Upload

```bash
# Upload a document
curl -X POST http://localhost:5000/api/documents \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -b cookies.txt \
  -F "file=@/path/to/document.pdf"
```

---

## Document Verification (Public)

```bash
# Verify a document by hash (no auth required)
curl http://localhost:5000/api/verifications/abc123def456
```

---

## Prometheus Metrics

```bash
# Raw metrics (Prometheus format)
curl http://localhost:5000/metrics
```

---

## Health Check

```bash
curl http://localhost:5000/
# "IAU UBIS API is running"
```

---

## Common Patterns

### Pagination

```bash
# All list endpoints support:
?page=1          # Page number (default: 1)
?limit=20        # Items per page (default: 50, max: 100)
?sort=-createdAt # Sort field (- prefix for descending)
?fields=name,code # Select specific fields
```

### Filtering

```bash
# Exact match
?status=Aktif

# Comparison operators
?credit[gte]=3        # Greater than or equal
?credit[lt]=5         # Less than
?gpa[gt]=3.0&gpa[lte]=4.0  # Range
```

### CSRF for Write Requests

```bash
# Every POST/PUT/DELETE/PATCH needs:
# 1. CSRF cookie (from GET /api/csrf-token, stored in cookies.txt)
# 2. CSRF header (-H "X-CSRF-Token: $CSRF")
# 3. Cookie jar (-b cookies.txt)
```
