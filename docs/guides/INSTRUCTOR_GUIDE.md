# Instructor Guide

A comprehensive guide for instructors and academic staff using the UBIS system.

## Getting Started

### Logging In

1. Navigate to the UBIS login page
2. Enter your **username** (assigned by administration)
3. Enter your password
4. If 2FA is enabled, enter the TOTP code from your authenticator app

> Your sidebar will display **"Akademisyen Portalı"** after login.

### Dashboard Overview

The instructor dashboard shows:
- **Quick Stats** — Your course count, advisee count, pending actions
- **Today's Schedule** — Upcoming lectures
- **Recent Announcements** — University and department news
- **Notification Bell** — Real-time alerts for new submissions, evaluations

---

## Navigation Menu

The instructor sidebar has 5 sections:

### 🏠 General (Genel)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Anasayfa | `/dashboard` | Main dashboard with overview |
| E-Posta | `/dashboard/emails` | Internal email system |
| Randevu Takvimi | `/dashboard/appointments` | Appointment scheduler |
| Hesap Ayarları | `/dashboard/settings` | Account, password, 2FA, theme |

### 📚 Academic (Akademik)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Verilen Dersler | `/dashboard/teaching-courses` | Your assigned courses with detail links |
| Ders Programı | `/dashboard/schedule` | Your weekly teaching schedule |
| Not Girişi | `/dashboard/grading` | Grade entry and management |

### 🎓 Advising (Danışmanlık)

| Menu Item | Path | Description |
|-----------|------|-------------|
| Öğrencilerim | `/dashboard/advisees` | List of your advisee students |
| Tez/Proje Yönetimi | `/dashboard/thesis` | Thesis/project advising dashboard |

### 📋 Administrative (İdari)

| Menu Item | Path | Description |
|-----------|------|-------------|
| İzin İşlemleri | `/dashboard/leave-management` | Leave request management |
| Belge Yönetimi | `/dashboard/documents` | Document upload and management |

### 🔧 Tools (Araçlar)

| Menu Item | Path | Description |
|-----------|------|-------------|
| UZEM – Moodle | `/dashboard/moodle` | Online learning platform |
| Kütüphane Veritabanları | `/dashboard/library-db` | Academic databases and journals |
| Oda Rezervasyonu | `/dashboard/room-booking` | Room and lab booking |

---

## Additional Pages (Role-Protected)

Beyond the sidebar, instructors have access to:

| Page | Path | Description |
|------|------|-------------|
| Course Detail | `/dashboard/course/:courseId` | Detailed view of a specific course |
| Syllabus Editor | `/dashboard/syllabus-editor/:courseId` | Rich text syllabus editor (TipTap) |
| Resource Hub | `/dashboard/resource-hub/:courseId` | Course materials management |
| Grading Grid | `/dashboard/grading/:courseId/:assessmentId` | Spreadsheet-style grading |
| Student 360 | `/dashboard/student-360/:studentId` | Comprehensive student profile |
| Transcript View | `/dashboard/transcript-view/:studentId` | View a student's transcript |
| Thesis Kanban | `/dashboard/thesis-kanban` | Kanban board for thesis management |
| Milestone Tracker | `/dashboard/milestone-tracker/:id` | Thesis milestone tracking |
| Proctoring | `/dashboard/proctoring` | Exam proctoring assignments |
| Proctoring Scheduler | `/dashboard/proctoring-scheduler` | Schedule exam proctoring |
| Student Lists | `/dashboard/student-lists` | Department student lists |
| Publications | `/dashboard/publications` | Academic publication management |
| Office Hours | `/dashboard/office-hours` | Office hours setup |
| Question Bank | `/dashboard/question-bank` | Exam question bank |
| Syllabus | `/dashboard/syllabus` | Syllabus overview |
| Academic Profile | `/dashboard/profile` | Your academic profile |

---

## Common Workflows

### Entering Grades

1. Navigate to **Akademik → Not Girişi**
2. Select the course from the dropdown
3. Choose the assessment type (Vize, Final, Bütünleme)
4. Use the **Grading Grid** for spreadsheet-style batch entry
5. Enter grades for each student
6. Submit grades

> **Note:** Students receive a real-time notification when new grades are posted via Socket.io.

### Managing Course Content

1. Navigate to **Akademik → Verilen Dersler**
2. Click on a course to view its detail page
3. Use the **Syllabus Editor** to create/edit the course syllabus (rich text with TipTap)
4. Use the **Resource Hub** to upload course materials (PDFs, slides, etc.)

### Viewing Advisee Students

1. Navigate to **Danışmanlık → Öğrencilerim**
2. View all your advisee students
3. Click on a student to see their **Student 360** comprehensive profile:
   - Personal info, grades, attendance, payments, courses
4. Use **Transcript View** for their official grade record

### Thesis/Project Management

1. Navigate to **Danışmanlık → Tez/Proje Yönetimi**
2. View all thesis projects you're advising
3. Use the **Thesis Kanban** board for visual progress tracking
4. Track milestones via **Milestone Tracker**
5. Students can see their progress via their own dashboard

### Creating Announcements

1. Navigate to any page where announcement creation is available
2. Instructors can create announcements scoped to:
   - `ders` — Course-specific
   - `fakulte` — Faculty-wide
3. Announcements are broadcast via Socket.io to all connected users

### Proctoring

1. Navigate to **Gözetmenliklerim** (Proctoring)
2. View your assigned exam proctoring duties
3. Use the **Proctoring Scheduler** to manage schedules

### Recording Attendance

Instructors can manage attendance via the API:
- `POST /api/attendance` — Create attendance records for students in their courses
- This requires `academic` role authorization

---

## API Endpoints Available to Instructors

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/courses` | GET | View all courses |
| `/api/courses` | POST | Create a new course |
| `/api/grades` | GET | View grades |
| `/api/grades` | POST | Create/update grades |
| `/api/assignments` | GET/POST | View and create assignments |
| `/api/attendance` | GET/POST | View and record attendance |
| `/api/announcements` | GET | View announcements |
| `/api/announcements` | POST | Create announcements |
| `/api/schedule` | GET/POST | View and create schedule entries |
| `/api/evaluations/academic` | GET | View evaluations for your courses |

---

## Tips

- 🎓 **Student 360**: Right-click on any student name in your advisee list to see their complete profile
- 📊 **Grading Grid**: Use Tab/Enter to navigate cells quickly for batch grading
- 📝 **Syllabus Editor**: Supports rich text formatting, tables, images, and embedded media
- 🔔 **Notifications**: You'll receive alerts when students submit assignments or evaluations
- 🤖 **AI Assistant**: Use the floating widget for quick system-related questions
