# Data Dictionary

This document provides detailed descriptions of every enumeration, status code, category, and constant value used across the UBIS data models and API. Use this as a reference when working with data validation, UI rendering, or API integration.

## Enumerations by Model

### User.role

Controls access to features, API endpoints, and sidebar navigation.

| Value | Label | Access Level | Registration |
|-------|-------|-------------|-------------|
| `student` | Student | Personal data only | Default for new users |
| `academic` | Academic Staff | Students + academic management | Assigned by admin |
| `admin` | Administrator | Full system access | Seed script or admin creation |

### Announcement.category

Determines how announcements are filtered and displayed.

| Value | Display | Scope | Example |
|-------|---------|-------|---------|
| `genel` | Genel | System-wide | System maintenance notice |
| `fakulte` | Fakülte | Faculty-specific | Faculty dean's announcement |
| `ders` | Ders | Course-specific | Homework due date change |
| `academic` | Academic | Academic affairs | Exam schedule update |
| `administrative` | Administrative | Admin operations | Registration period opening |
| `events` | Events | Campus events | Graduation ceremony details |

### Announcement.priority

Affects display styling and notification urgency.

| Value | Display | Visual Treatment |
|-------|---------|-----------------|
| `normal` | Normal | Standard card |
| `high` | Yüksek | Highlighted card |
| `urgent` | Acil | Red alert banner |

### Assignment.status

Tracks assignment completion state. Updated by both users and cron jobs.

| Value | Meaning | Set By |
|-------|---------|--------|
| `Bekliyor` | Pending | Default on creation |
| `Tamamlandı` | Completed | Student marks as done |
| `Gecikti` | Overdue | Cron job (midnight daily) |

### Assignment.type

Categorizes the type of academic work.

| Value | Meaning |
|-------|---------|
| `Ödev` | Homework / Assignment |
| `Proje` | Project |

### Course.type

Indicates whether a course is mandatory or elective.

| Value | Meaning |
|-------|---------|
| `Zorunlu` | Mandatory / Required |
| `Seçmeli` | Elective / Optional |

### Course.semester

Indicates the academic term for a course.

| Value | Meaning |
|-------|---------|
| `Güz` | Fall Semester |
| `Bahar` | Spring Semester |

### Email.folder

Virtual folder for organizing internal messages.

| Value | Meaning | Default |
|-------|---------|---------|
| `Gelen Kutusu` | Inbox | ✅ |
| `Arşiv` | Archive | — |
| `Çöp Kutusu` | Trash | — |
| `Yıldızlı` | Starred / Favorites | — |

### Transaction.type

Financial transaction direction.

| Value | Amount Sign | Meaning |
|-------|------------|---------|
| `income` | Positive (+) | Money received |
| `expense` | Negative (-) | Money spent |

### Log.status

Result of a logged system action.

| Value | Meaning | Example |
|-------|---------|---------|
| `success` | Successful operation | Login success |
| `error` | Failed operation | Login failure, 500 error |

### Dormitory Permission Status

Leave permission request states.

| Value | Meaning | Transition |
|-------|---------|-----------|
| `Bekliyor` | Pending Review | Initial state |
| `Onaylandı` | Approved | Admin/staff approves |
| `Reddedildi` | Rejected | Admin/staff rejects |

---

## Status Codes by Domain

### Student Status

| Value | Meaning | Academic Impact |
|-------|---------|----------------|
| `Aktif` | Active enrollment | Can register for courses |
| `Pasif` | Inactive / Suspended | Cannot register |
| `Mezun` | Graduated | Read-only access |
| `Kayıt Dondurma` | Enrollment frozen | Temporary suspension |

### Education Type

| Value | Meaning |
|-------|---------|
| `Örgün Öğretim` | Formal (daytime) education |
| `İkinci Öğretim` | Evening education |

### Degree Level

| Value | Meaning | Typical Duration |
|-------|---------|-----------------|
| `Lisans` | Bachelor's degree | 4 years (8 semesters) |
| `Yüksek Lisans` | Master's degree | 2 years |
| `Doktora` | PhD / Doctorate | 4+ years |

### Registration Type

| Value | Meaning | Exam/Process |
|-------|---------|-------------|
| `YKS` | University Entrance Exam | National exam placement |
| `DGS` | Vertical Transfer Exam | 2-year → 4-year transfer |
| `Yatay Geçiş` | Lateral Transfer | University-to-university |

---

## Constants

### Rate Limits

| Limiter | Max Requests | Window | Scope |
|---------|-------------|--------|-------|
| General API | 100 | 15 minutes | Per IP |
| Auth endpoints | 20 | 15 minutes | Per IP |

### Cache TTL

| Context | TTL | Notes |
|---------|-----|-------|
| API response cache | 600 seconds (10 min) | Redis `SET EX` |
| Password reset token | 3600 seconds (1 hour) | MongoDB field |
| JWT token | 3600 seconds (1 hour) | Token claim `exp` |
| 2FA temp token | 600 seconds (10 min) | Short-lived |

### File Upload Limits

| Property | Value |
|----------|-------|
| Max file size | 10 MB |
| Storage path | `/uploads/` |
| Allowed by | Multer v2 |

### Pagination Defaults

| Property | Value |
|----------|-------|
| Default page | 1 |
| Default limit | varies by endpoint |
| Max limit | 100 |
| Sort default | `-createdAt` (newest first) |

---

## Response Headers

| Header | Values | Meaning |
|--------|--------|---------|
| `X-Cache` | `HIT`, `MISS` | Cache status |
| `RateLimit-Limit` | number | Max requests in window |
| `RateLimit-Remaining` | number | Remaining requests |
| `RateLimit-Reset` | timestamp | When limit resets |

---

## Error Codes

### HTTP Status Codes Used

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET, PUT responses |
| 201 | Created | POST creates a resource |
| 204 | No Content | DELETE success |
| 400 | Bad Request | Validation error, duplicate key |
| 401 | Unauthorized | Missing or invalid JWT |
| 403 | Forbidden | CSRF mismatch, insufficient role |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled exception |

### Custom Error Types

| Error Class | `isOperational` | Description |
|------------|-----------------|-------------|
| `AppError` | `true` | Safe, expected errors with messages |
| Mongoose `CastError` | handled | Invalid MongoDB ObjectId format |
| Mongoose `11000` | handled | Duplicate key violation |
| Zod `ZodError` | handled | Input validation failure |
| JWT errors | handled | Token expired, invalid, malformed |
| CSRF errors | handled | Token mismatch → 403 |
