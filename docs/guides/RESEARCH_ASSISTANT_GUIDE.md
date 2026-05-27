# Research Assistant Guide

A comprehensive guide for research assistants (Araştırma Görevlisi) using the UBIS system.

## Getting Started

### Logging In

1. Navigate to the UBIS login page
2. Enter your **username** (assigned by administration)
3. Enter your password
4. If 2FA is enabled, enter the TOTP code from your authenticator app

> Your sidebar will display **"Akademisyen Portalı"** after login. The system detects your research assistant role via `academicTitle: 'RES_ASST'`.

### How Role Detection Works

Research assistants are a sub-role of the `academic` role:

```
User.role = 'academic'
User.academicTitle = 'RES_ASST'
→ Sidebar shows: researchAssistant menu
```

This gives you a specialized menu focused on lab work, proctoring, and academic development.

---

## Navigation Menu

The research assistant sidebar has 7 sections:

### 🏠 General (Genel)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Anasayfa | `/dashboard` | Main dashboard |
| E-Posta | `/dashboard/emails` | Internal email system |
| Randevu Takvimi | `/dashboard/appointments` | Appointment scheduler |
| Hesap Ayarları | `/dashboard/settings` | Account settings, 2FA, theme |

### 🔬 Assistantship (Asistanlık)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Gözetmenliklerim | `/dashboard/proctoring` | Exam proctoring assignments |
| Laboratuvarlarım | `/dashboard/labs` | Lab session management |
| Bölüm Görevleri | `/dashboard/dept-tasks` | Department task assignments |

### 📚 Academic (Akademik)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Ders Programı | `/dashboard/schedule` | Your weekly schedule |
| Sınav Programı | `/dashboard/exam-schedule` | Exam timetable |

### 🎓 Academic Support (Akademik Destek)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Tez/Proje Asistanlığı | `/dashboard/thesis-support` | Assist with thesis/project advising |
| Sınav Okuma Desteği | `/dashboard/grading-support` | Help with exam grading |

### 📈 Personal Development (Kişisel Gelişim)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Akademik Takip | `/dashboard/academic-progress` | Track your own academic progress |
| Eğitimler | `/dashboard/trainings` | Training and workshop resources |

### 📋 Administrative (İdari)

| Menu Item | Path | Description |
|-----------|------|-------------|
| İzin İşlemleri | `/dashboard/leave-management` | Leave request management |

### 🔧 Tools (Araçlar)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Kütüphane Veritabanları | `/dashboard/library-db` | Academic databases and journals |
| Oda Rezervasyonu | `/dashboard/room-booking` | Room and lab booking |

---

## Key Differences from Instructor

| Feature | Research Assistant | Instructor |
|---------|-------------------|-----------|
| **Sidebar label** | "Akademisyen Portalı" | "Akademisyen Portalı" |
| **Menu focus** | Labs, proctoring, dept tasks | Teaching courses, grading, advising |
| **Grading** | Grading support (assistance) | Full grade entry |
| **Thesis** | Thesis support (assistance) | Thesis management (advising) |
| **Courses** | Not assigned as instructor | Assigned courses |
| **Student Lists** | ✅ Access | ✅ Access |
| **Publications** | ✅ Access | ✅ Access |

---

## Common Workflows

### Managing Proctoring Assignments

1. Navigate to **Asistanlık → Gözetmenliklerim**
2. View your assigned exam proctoring schedule
3. Confirm or request changes to proctoring duties
4. Use the **Proctoring Scheduler** for detailed scheduling

### Lab Session Management

1. Navigate to **Asistanlık → Laboratuvarlarım**
2. View your assigned lab sessions
3. Manage lab attendance and equipment tracking

### Department Task Tracking

1. Navigate to **Asistanlık → Bölüm Görevleri**
2. View tasks assigned by your department
3. Update task status and progress

### Thesis/Project Assistance

1. Navigate to **Akademik Destek → Tez/Proje Asistanlığı**
2. View thesis projects you're assisting with
3. Track student progress and milestones

### Exam Grading Support

1. Navigate to **Akademik Destek → Sınav Okuma Desteği**
2. Access assigned exams for grading
3. Enter grades and submit for instructor review

### Tracking Your Academic Progress

1. Navigate to **Kişisel Gelişim → Akademik Takip**
2. View your own academic milestones
3. Track publications, courses, and research progress

### Booking a Room or Lab

1. Navigate to **Araçlar → Oda Rezervasyonu**
2. Select date and time
3. Choose available room or lab
4. Submit reservation request

---

## Available API Endpoints

Research assistants have `academic` role access, which includes:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /api/courses` | GET | View courses |
| `GET /api/schedule` | GET | View schedule |
| `GET /api/attendance` | GET/POST | View and record attendance |
| `GET /api/announcements` | GET | View announcements |
| `GET /api/students` | GET | View student lists |
| `GET /api/evaluations/academic` | GET | View evaluations |
| `GET /api/grades` | GET | View grades (read access) |

---

## Tips

- 🔬 **Labs**: Keep your lab schedule updated for students to see
- 📝 **Proctoring**: Check your proctoring assignments regularly
- 🎓 **Academic Progress**: Track your own thesis/research milestones alongside student support
- 📅 **Room Booking**: Book rooms early, especially during exam periods
- 🤖 **AI Assistant**: Use the floating widget for quick system questions
