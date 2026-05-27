# API Reference

Complete reference for the UBIS REST API. All endpoints are prefixed with `/api`.

**Base URL**: `http://localhost:5000/api`
**Swagger UI**: `http://localhost:5000/api-docs`

## Table of Contents

- [Authentication & Headers](#authentication--headers)
- [Rate Limiting](#rate-limiting)
- [Pagination, Filtering & Sorting](#pagination-filtering--sorting)
- [Error Responses](#error-responses)
- [Auth](#auth)
- [Users](#users)
- [Students](#students)
- [Courses](#courses)
- [Grades](#grades)
- [Assignments](#assignments)
- [Attendance](#attendance)
- [Schedule](#schedule)
- [Academic Calendar](#academic-calendar)
- [Faculties](#faculties)
- [Departments](#departments)
- [Announcements](#announcements)
- [Emails](#emails)
- [Documents](#documents)
- [Library](#library)
- [Payments](#payments)
- [Dormitory](#dormitory)
- [Evaluations](#evaluations)
- [Search](#search)
- [Analytics](#analytics)
- [Logs](#logs)
- [Verifications](#verifications)
- [AI Assistant](#ai-assistant)

---

## Authentication & Headers

Most endpoints require a **JWT Bearer token** in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

For **mutating requests** (POST, PUT, DELETE, PATCH), a **CSRF token** is also required:

```
X-CSRF-Token: <csrf_token>
```

### Obtaining a CSRF Token

```http
GET /api/csrf-token
```

**Response:**
```json
{
  "csrfToken": "abc123def456..."
}
```

> The CSRF token is set as an HttpOnly cookie and must also be sent in the `X-CSRF-Token` header for write operations.

---

## Rate Limiting

| Scope | Limit | Window | Response Header |
|-------|-------|--------|-----------------|
| **General** (`/api/*`) | 100 requests | 15 minutes | `RateLimit-*` |
| **Auth** (`/api/auth/*`) | 20 requests | 15 minutes | `RateLimit-*` |

When exceeded, you'll receive:
```json
{
  "error": "Too many requests, please try again later."
}
```

---

## Pagination, Filtering & Sorting

All list endpoints support the `ApiFeatures` query system:

### Pagination

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `page` | 1 | — | Page number (1-indexed) |
| `limit` | 50 | 100 | Results per page |

**Example:** `GET /api/courses?page=2&limit=20`

### Sorting

| Parameter | Default | Description |
|-----------|---------|-------------|
| `sort` | `-createdAt` | Comma-separated fields. Prefix with `-` for descending |

**Example:** `GET /api/students?sort=-gpa,name`

### Field Selection

| Parameter | Description |
|-----------|-------------|
| `fields` | Comma-separated fields to include/exclude |

**Example:** `GET /api/students?fields=name,faculty,gpa`

### Filtering

Use comparison operators as query parameters:

| Operator | Example | Meaning |
|----------|---------|---------|
| (none) | `?status=Aktif` | Exact match |
| `gte` | `?gpa[gte]=3.0` | Greater than or equal |
| `gt` | `?semester[gt]=4` | Greater than |
| `lte` | `?gpa[lte]=4.0` | Less than or equal |
| `lt` | `?semester[lt]=8` | Less than |

### Cache Bypass

Add `?nocache=1` to skip Redis cache for any GET request.

The `X-Cache` response header indicates `HIT` or `MISS`.

---

## Error Responses

All errors follow a consistent format:

```json
{
  "status": "fail",
  "message": "Human-readable error message"
}
```

### Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| `400` | Bad Request | Validation error, duplicate key |
| `401` | Unauthorized | Missing/invalid/expired JWT token |
| `403` | Forbidden | Insufficient role, bad CSRF token |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate username on register |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |

### Validation Error Response (Zod)

```json
{
  "status": "fail",
  "message": "Zod Validation Error",
  "messages": [
    "Username must be at least 3 characters",
    "Email must be a valid email address"
  ]
}
```

---

## Auth

**Base path:** `/api/auth`
**Rate limit:** 20 requests / 15 minutes

### POST `/auth/register`

Create a new user account.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `username` | string | ✅ | 3–30 characters |
| `email` | string | ✅ | Valid email |
| `password` | string | ✅ | 6–128 characters |
| `fullName` | string | ❌ | 2–100 characters |
| `faculty` | string | ❌ | — |
| `department` | string | ❌ | — |

**Response:** `201 Created`
```json
{
  "_id": "664a...",
  "username": "B123456",
  "role": "student",
  "fullName": "Eyüp Salihoğlu",
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

### POST `/auth/login`

Authenticate and receive a JWT token.

| Field | Type | Required |
|-------|------|----------|
| `username` | string | ✅ |
| `password` | string | ✅ |

**Response:** `200 OK`
```json
{
  "_id": "664a...",
  "username": "B123456",
  "role": "student",
  "fullName": "Eyüp Salihoğlu",
  "accessToken": "eyJhbGci..."
}
```

**If 2FA is enabled:**
```json
{
  "requires2FA": true,
  "tempToken": "eyJhbGci...",
  "user": { "username": "B123456" }
}
```

### POST `/auth/forgot-password`

Send a password reset email. Always returns 200 to prevent email enumeration.

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |

### POST `/auth/reset-password`

Reset password using a token from the email link.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `token` | string | ✅ | From reset email |
| `password` | string | ✅ | Min 6 characters |

### GET `/auth/google`

Initiates Google OAuth 2.0 login flow. Redirects to Google.

### GET `/auth/google/callback`

Google OAuth callback. Redirects to frontend with JWT token:
```
{CLIENT_URL}/auth/callback?token={jwt}
```

### POST `/auth/2fa/generate`

🔒 **Requires:** `verifyToken`

Generate a 2FA secret and QR code for the authenticated user.

**Response:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,..."
}
```

### POST `/auth/2fa/verify`

🔒 **Requires:** `verifyToken`

Verify a TOTP code and (if first time) enable 2FA.

| Field | Type | Required |
|-------|------|----------|
| `token` | string | ✅ |

---

## Users

**Base path:** `/api/users`
🔒 **Requires:** `verifyToken` (all routes)

### GET `/users/profile`

Get the authenticated user's profile.

### GET `/users`

🔒 **Requires:** `admin` role

List all users with pagination and filtering.

### PUT `/users/:id`

🔒 **Requires:** `admin` role

Update a user's role or information.

### DELETE `/users/:id`

🔒 **Requires:** `admin` role

Delete a user.

---

## Students

**Base path:** `/api/students`
🔒 **Requires:** `verifyToken` (all routes)

### GET `/students`

🔒 **Requires:** `admin` or `academic` role

List all students with pagination, filtering, and sorting.

### GET `/students/:id`

🔒 **Requires:** Owner or staff (`verifyOwnerOrStaff`)

Get a specific student's profile. `:id` can be MongoDB ObjectId or student number (e.g., `B085100`).

### GET `/students/:id/360`

🔒 **Requires:** Owner or staff
📦 **Cached:** Redis (10 min TTL)

Get comprehensive Student 360 data (grades, attendance, courses, payments, etc.).

---

## Courses

**Base path:** `/api/courses`
🔒 **Requires:** `verifyToken` (GET routes)

### GET `/courses`

List all courses.

### POST `/courses`

🔒 **Requires:** `admin` or `academic` role

Create a new course.

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `code` | string | ✅ | — |
| `name` | string | ✅ | — |
| `credit` | number | ✅ | — |
| `ects` | number | ✅ | — |
| `type` | string | ❌ | `"Zorunlu"` |
| `instructor` | string | ❌ | `"Atanmadı"` |
| `semester` | string | ❌ | `"Güz"` |

---

## Grades

**Base path:** `/api/grades`
🔒 **Requires:** `verifyToken`

### GET `/grades`

Get grades for the authenticated user.

### POST `/grades`

🔒 **Requires:** `admin` or `academic` role

Create or update grades.

---

## Assignments

**Base path:** `/api/assignments`
🔒 **Requires:** `verifyToken`

### GET `/assignments`

List all assignments for the user.

### POST `/assignments`

Create a new assignment.

### POST `/assignments/:id/submit`

Submit an assignment with a file upload.

| Field | Type | Description |
|-------|------|-------------|
| `file` | file | Upload via `multipart/form-data` |

---

## Attendance

**Base path:** `/api/attendance`
🔒 **Requires:** `verifyToken`

### GET `/attendance`

Get attendance records for the user.

### POST `/attendance`

🔒 **Requires:** `admin` or `academic` role

Create attendance record.

---

## Schedule

**Base path:** `/api/schedule`
🔒 **Requires:** `verifyToken`

### GET `/schedule`

Get schedule entries.

### POST `/schedule`

🔒 **Requires:** `admin` or `academic` role

Create a schedule entry.

---

## Academic Calendar

**Base path:** `/api/academic-calendar`
🔒 **Requires:** `verifyToken`
📦 **Cached:** GET routes (Redis, 10 min TTL)

### GET `/academic-calendar`

Get all academic calendar events.

### POST `/academic-calendar`

🔒 **Requires:** `admin` or `academic` role

Create an academic calendar event.

---

## Faculties

**Base path:** `/api/faculties`
🔒 **Requires:** `verifyToken`
📦 **Cached:** GET `/` (Redis, 10 min TTL)

### GET `/faculties`

List all faculties.

### GET `/faculties/:id`

Get a specific faculty by ID.

---

## Departments

**Base path:** `/api/departments`
🔒 **Requires:** `verifyToken`
📦 **Cached:** Redis (10 min TTL)

### GET `/departments`

List all departments.

---

## Announcements

**Base path:** `/api/announcements`
🔒 **Requires:** `verifyToken`

### GET `/announcements`

List all announcements.

### POST `/announcements`

🔒 **Requires:** `admin` or `academic` role
**Validation:** Zod schema (`announcement`)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | ✅ | 3–200 characters |
| `text` | string | ✅ | Min 5 characters |
| `category` | enum | ❌ | `genel`, `fakulte`, `ders`, `events` |

---

## Emails

**Base path:** `/api/emails`
🔒 **Requires:** `verifyToken`

### GET `/emails`

Get all emails for the logged-in user.

### POST `/emails/send`

Send a new email.

---

## Documents

**Base path:** `/api/documents`
🔒 **Requires:** `verifyToken`

### GET `/documents`

Get documents for the authenticated user.

### POST `/documents/upload`

Upload a document file.

| Field | Type | Description |
|-------|------|-------------|
| `file` | file | Upload via `multipart/form-data` |

---

## Library

**Base path:** `/api/library`
🔒 **Requires:** `verifyToken` (except catalog)

### GET `/library/catalog`

Browse the book catalog (public within authenticated context).

### GET `/library/borrowed`

Get borrowed books for the current user.

### POST `/library/borrow`

Borrow a book.

---

## Payments

**Base path:** `/api/payments`
🔒 **Requires:** `verifyToken`

### GET `/payments`

Get payment overview for the current user (tuition, balance, transactions).

### POST `/payments/pay-tuition`

Process a tuition payment.

### POST `/payments/transaction`

Create a new financial transaction.

### GET `/payments/finance-stats`

🔒 **Requires:** `admin` role

Get monthly finance statistics (aggregation).

---

## Dormitory

**Base path:** `/api/dormitory`
🔒 **Requires:** `verifyToken`

### GET `/dormitory`

Get dormitory information for the current user.

---

## Evaluations

**Base path:** `/api/evaluations`
🔒 **Requires:** `verifyToken`

### GET `/evaluations/me`

Get evaluations submitted by the current student.

### GET `/evaluations/academic`

Get evaluations for the current academic staff member.

### GET `/evaluations/all`

🔒 **Requires:** `admin` role

Get all evaluations.

### POST `/evaluations`

Submit a new course evaluation.

**Validation:** Zod schema (`evaluation`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `courseId` | string | ✅ | Course ID |
| `answers` | object | ✅ | Key-value pairs (dynamic) |
| `comment` | string | ❌ | Max 1000 characters |

---

## Search

**Base path:** `/api/search`
🔒 **Requires:** `verifyToken`

### GET `/search?q={query}`

Full-text search across students, courses, and announcements using MeiliSearch.

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query text |

### POST `/search/sync`

🔒 **Requires:** `admin` role

Manually sync MongoDB data to MeiliSearch indexes.

---

## Analytics

**Base path:** `/api/analytics`
🔒 **Requires:** `verifyToken` + `admin` role (enforced at route mount)
📦 **Cached:** Redis (10 min TTL)

### GET `/analytics`

🔒 **Requires:** `admin` role

General system analytics (aggregation-based dashboard stats).

### GET `/analytics/gpa-distribution`

🔒 **Requires:** `admin` or `academic` role

Faculty-level GPA distribution statistics.

---

## Logs

**Base path:** `/api/logs`
🔒 **Requires:** `verifyRole(['admin'])` (enforced at route mount, includes verifyToken)

### GET `/logs`

Get all system logs. Supports pagination and filtering.

### POST `/logs`

🔒 **Requires:** `verifyToken`

Create a new log entry.

---

## Verifications

**Base path:** `/api/verifications`
⚠️ **Note:** This route is mounted **before** CSRF protection middleware.

### POST `/verifications/create`

🔒 **Requires:** `verifyToken`

Create a document verification record with a unique hash.

### GET `/verifications/:hash`

🌐 **Public** — No authentication required.

Verify a document by its hash (e.g., from a QR code).

---

## AI Assistant

**Base path:** `/api/ai`
🔒 **Requires:** `verifyToken`

### POST `/ai/ask`

Send a prompt to the UBIS AI Assistant.

| Field | Type | Required |
|-------|------|----------|
| `prompt` | string | ✅ |

**Response:**
```json
{
  "reply": "AI-generated response..."
}
```
