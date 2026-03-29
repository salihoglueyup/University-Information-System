# İç Mimarı (Architecture Deep Dive)

Bu dokuman, UBIS'in sistem mimarisini, katmanlarını ve bileşenlerini detaylı açıklar.

## Sistem Mimarisi (3-Tier)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT TIER (React)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ UI Components (Dashboard, Sidebars, Forms, Tables)   │  │
│  │ State Management (Context API, Custom Hooks)         │  │
│  │ Data Fetching (TanStack Query, Axios)                │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              ↓ REST API
┌──────────────────────────────────────────────────────────────┐
│                   API TIER (Express.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes & Controllers (API endpoints)                 │   │
│  │ Middleware (Auth, CSRF, Validation, Error Handler)  │   │
│  │ Business Logic (Services, Utilities)                 │   │
│  │ Socket.io (Real-time events)                         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
        ↓ Database Queries    ↓ Cache    ↓ Message Queue
┌──────────────────────────────────────────────────────────────┐
│              PERSISTENCE TIER (Data Layer)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Primary: MongoDB (Collections, Schemas)              │   │
│  │ Cache: Redis (Session, Query cache)                  │   │
│  │ Index: MeiliSearch (Full-text search)                │   │
│  │ Queue: RabbitMQ (Async tasks, notifications)         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Frontend Katmanları

### 1. Pages (Sayfa Bileşenleri)

```
src/pages/
├── Dashboard.jsx              # Role-based router
├── dashboard/
│   ├── StudentDashboard.jsx   # Student view
│   ├── AcademicDashboard.jsx  # TA/Researcher view
│   └── AdminDashboard.jsx     # Admin view
└── [FeatureName].jsx          # Specific feature pages
```

**Sorumluluk**: 
- Route'a göre içeriği render et
- Page-level state yönet
- Çocuk component'lerin layout'unu düzenle

### 2. Components (Reusable Bileşenler)

```
src/components/
├── layout/
│   ├── Sidebar.jsx            # Navigation menu
│   ├── Header.jsx             # Top navigation
│   └── Footer.jsx             # Footer
├── common/
│   ├── Card.jsx               # Reusable card
│   ├── Button.jsx             # Button styles
│   └── Modal.jsx              # Modal dialog
├── dashboard/
│   ├── StudentStats.jsx       # Dashboard widgets
│   ├── GradesTable.jsx        # Academic data tables
│   └── ScheduleWidget.jsx     # Course schedule
└── forms/
    ├── LoginForm.jsx
    ├── CourseForm.jsx
    └── GradeForm.jsx
```

**Sorumluluk**:
- UI'yi render et (Tailwind + Framer Motion animasyon)
- Props'dan veri al, event handler'ları çalıştır
- Reusable ve testable ol

### 3. Hooks (Custom Logic)

```
src/hooks/
├── useAuth.js                 # User & token yönetimi
├── useFetch.js                # Data fetching wrapper
├── useLocalStorage.js         # LocalStorage bridge
└── useRoleCheck.js            # Role-based access
```

### 4. Context (Global State)

```
src/context/
├── AuthContext.jsx            # User context
├── ThemeContext.jsx           # Dark/Light mode
└── NotificationContext.jsx    # Toast messages
```

---

## Backend Katmanları

### 1. Routes (HTTP Endpoints)

```
server/routes/
├── index.js                   # Mount all routes
├── auth.js                    # POST /api/auth/*
├── students.js                # GET /api/students
├── courses.js                 # GET /api/courses
├── grades.js                  # GET/POST /api/grades
└── [domain].js                # Domain-specific routes
```

**Format**:
```javascript
// Example: server/routes/grades.js
router.get('/', verifyToken, gradeController.getStudentGrades);
router.post('/', verifyToken, verifyRole(['academic', 'admin']), gradeController.createGrade);
router.patch('/:id', verifyToken, verifyRole(['academic']), gradeController.updateGrade);
```

### 2. Controllers (Request Handlers)

```
server/controllers/
├── authController.js          # Login, Register, 2FA
├── studentController.js       # Student CRUD
├── gradeController.js         # Grade operations
└── [domain]Controller.js      # Domain logic
```

**Sorumluluk**:
- Request'i parse et
- Service'i çağır
- Response'ı döndür

```javascript
exports.createGrade = async (req, res, next) => {
  try {
    const grade = await gradeService.createGrade(req.body);
    res.status(201).json({ status: 'success', data: grade });
  } catch (err) {
    next(err);  // Error handler middleware'e geç
  }
};
```

### 3. Services (Business Logic)

```
server/services/
├── authService.js             # JWT generation, password hashing
├── studentService.js          # Student queries + enrichment
├── gradeService.js            # Grade calculations, validations
└── [domain]Service.js         # Domain-specific logic
```

**Sorumluluk**:
- Database queries
- Validation (role checks, date ranges, vb.)
- Enrichment (bir öğrenci verisiyle GPA hesapla)
- Cache invalidation

### 4. Models (Database Schemas)

```
server/models/
├── User.js                    # Base user schema
├── Student.js                 # Student-specific fields
├── Course.js                  # Course catalog
├── Grade.js                   # Grade records
└── [Domain].js                # Domain models
```

**Örnek Mongoose Schema**:
```javascript
const gradeSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  grade: { type: String, enum: ['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'F'] },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
```

### 5. Middleware (Request Processing)

```
server/middleware/
├── auth.js                    # JWT verification
├── validate.js                # Zod/Joi validation
├── errorHandler.js            # Centralized error handling
├── cache.js                   # Redis caching
└── upload.js                  # Multipart file handling
```

**Auth Middleware Flow**:
```
Request → verifyToken (JWT check) → verifyRole (permission check) → Route Handler
```

---

## Data Flow (Örnek: Not Girme)

### Frontend → Backend

```javascript
// 1. Frontend (instructorGradingForm.jsx)
const handleSubmitGrade = async (formData) => {
  try {
    // 2. API call (axiosInstance automatically adds JWT + CSRF token)
    const response = await axiosInstance.post('/api/grades', {
      studentId: '123',
      courseId: 'COMP101',
      grade: 'AA'
    });
    // 3. Success
    showNotification('Grade saved');
  } catch (error) {
    // 4. Error handling (see API_MODULES.md for error types)
    handleApiError(error);
  }
};
```

### Backend Processing

```javascript
// 1. Request hits route
POST /api/grades
  → verifyToken middleware (JWT check)
  → verifyRole(['academic', 'admin']) (permission check)
  → validate(gradeSchema) (input validation)
  → gradeController.createGrade()

// 2. Controller
exports.createGrade = async (req, res, next) => {
  // Validate again with service
  const grade = await gradeService.createGrade(req.body);
  
  // 3. Service handles business logic
  // - Check semester dates (422 error if closed)
  // - Validate grade value
  // - Save to MongoDB
  // - Invalidate student cache
  // - Emit Socket.io event for student notification
  
  res.status(201).json({ status: 'success', data: grade });
};

// 4. Response sent back to frontend
```

---

## Caching Strategy

### Redis Layers

```
┌─ Session Cache ──────────────┐
│ Key: session_{userId}         │
│ Value: JWT token, user data   │
│ TTL: 24 hours                 │
└───────────────────────────────┘

┌─ Query Cache ────────────────────┐
│ Key: student_360_{studentId}     │
│ Value: GPA, grades, transcript   │
│ TTL: 5 minutes                   │
└──────────────────────────────────┘

┌─ Config Cache ───────────────────┐
│ Key: academic_calendar           │
│ Value: Term dates, deadlines     │
│ TTL: 1 hour                      │
└──────────────────────────────────┘
```

**Invalidation Rules**:
- Grade kaydedildi → student_360 temizle
- Semester başladı → academic_calendar temizle
- User role değişti → session temizle

### MeiliSearch Indexing

```
Index: courses
├── Field: id (searchable)
├── Field: name (searchable)
├── Field: instructor (searchable)
└── Field: department (facet)

Query Example:
GET /api/search?q=calculus category:math
```

---

## Real-time Features (Socket.io)

### Connection Flow

```javascript
// Client (socket.io setup)
const socket = io(SOCKET_URL, { query: { userId } });

// Server (socket.io event handlers)
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  socket.join(`user_${userId}`); // Room setup
  
  // Broadcast new grade to student
  io.to(`user_${studentId}`).emit('grade_posted', {
    course: 'COMP101',
    grade: 'AA'
  });
});
```

### Event Types

| Event | Emitter | Recipient | Payload |
| --- | --- | --- | --- |
| `grade_posted` | Backend | Student | `{ courseId, grade, timestamp }` |
| `assignment_due` | Backend via Cron | Students | `{ assignmentId, dueDate }` |
| `announcement_new` | Frontend (instructor) | Class | `{ title, content }` |
| `user_online` | Client | Dashboard | `{ userId, timestamp }` |

---

## Database Design

### Collections (MongoDB)

```javascript
// Users (Authentication base)
db.users.find({ email: 'student1@ubis.local' })
→ { _id, email, password_hash, role, createdAt }

// Students (Extends Users)
db.students.find({ userId: ObjectId('...') })
→ { userId, studentNumber, department, major, gpa, ... }

// Courses
db.courses.find({ department: 'Computer Engineering' })
→ { courseCode, name, credits, instructor, section, capacity, ... }

// Grades
db.grades.find({ studentId: ObjectId('...') })
→ { studentId, courseId, grade, semester, submittedBy, createdAt }

// Indexes (for performance)
db.students.createIndex({ email: 1 });
db.grades.createIndex({ studentId: 1, semester: 1 });
```

---

## Error Handling Hierarchy

```
Frontend (Form validation)
    ↓
axiosInstance (Interceptor checks)
    ↓
Backend Route (Basic middleware)
    ↓
Controller (Logic execution)
    ↓
Service (Business logic + validation)
    ↓
Database (Schema validation)
    ↓
Error → Express Error Handler Middleware
    ↓
    └─ Development: Full stack trace
    └─ Production: Generic message (for security)
```

**Response Format** (consistent everywhere):
```json
{
  "status": "fail" | "error",
  "message": "Human-readable error",
  "messages": ["Array of validation errors if applicable"]
}
```

---

## Security Layers

### 1. Input Validation
- Zod schemas (backend)
- React Hook Form (frontend)

### 2. Authentication
- JWT tokens (localStorage)
- Session management (Redis)
- 2FA support (optional)

### 3. Authorization
- Role-based access (verifyRole middleware)
- Owner checks (user can only see own data)
- Resource-level permissions

### 4. CSRF Protection
- Double-submit cookies
- SameSite cookie flag
- CSRF token in headers

### 5. Data Protection
- MongoDB injection prevention (mongoSanitize)
- XSS protection (Helmet headers)
- Rate limiting (Redis or in-memory)

---

## Deployment Architecture

```
                    ┌────────────────────┐
                    │   User Browser     │
                    └────────────┬───────┘
                                 │ HTTPS
    ┌────────────────────────────┼────────────────────────────┐
    │                    Nginx Reverse Proxy                   │
    │         (Load balancing, SSL termination)                │
    └──────────┬──────────────────┬──────────────────┬────────┘
               │ HTTP             │ HTTP             │ HTTP
    ┌──────────▼──┐    ┌──────────▼──┐    ┌──────────▼──┐
    │  Client Pod │    │  Server Pod │    │  Server Pod │
    │  (Nginx)    │    │ (Express.js)│    │ (Express.js)│
    │  React SPA  │    │   Port 5000 │    │   Port 5000 │
    └──────────┬──┘    └──────────┬──┘    └──────────┬──┘
               │                  │                  │
               └──────────┬───────┴──────────┬───────┘
                          │                  │
              ┌───────────▼──────────────────▼────────┐
              │   MongoDB Replica Set (Persistent)    │
              │   Redis Cluster (Cache)               │
              │   MeiliSearch (Indexing)              │
              │   RabbitMQ (Message Queue)            │
              └─────────────────────────────────────────┘
```

---

## Development Workflow

```
1. Feature Branch
   git checkout -b feature/grade-widget

2. Develop (Frontend + Backend)
   client/: npm run dev
   server/: npm run dev

3. Test Locally
   docker compose up -d
   npm run test

4. Lint & Format
   npm run lint:fix

5. Git Commit & Push
   git add .
   git commit -m "feat: add grade widget"
   git push origin feature/grade-widget

6. Create Pull Request
   - Automated CI/CD runs tests
   - Code review
   - Merge to main
```

---

## Performance Optimization

### Frontend
- Code splitting (Vite chunking)
- Lazy loading components (React.lazy)
- Image optimization (WebP, sizes)
- Caching strategies (Service Worker PWA)

### Backend
- Database indexing (MongoDB)
- Redis caching (query results)
- Query optimization (lean(), select())
- Connection pooling (Mongoose)

### Network
- Gzip compression (Express middleware)
- HTTP/2 (Nginx reverse proxy)
- CDN for static assets (Cloudflare, etc.)

---

## References

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Pattern Library](https://reactpatterns.com/)
- [OWASP Security Checklist](https://owasp.org/)
