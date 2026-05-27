# Glossary

Turkish-English term reference for UBIS. The system uses Turkish labels in the UI and data models. This glossary maps them to their English equivalents.

## User Roles

| Turkish | English | Value in Code |
|---------|---------|--------------|
| Öğrenci | Student | `student` |
| Akademisyen | Academic / Instructor | `academic` |
| Yönetici | Administrator | `admin` |
| Araştırma Görevlisi | Research Assistant | `academic` (with `academicTitle: 'RES_ASST'`) |

## Assignment Status

| Turkish | English | Used In |
|---------|---------|---------|
| Bekliyor | Pending | `Assignment.status` |
| Tamamlandı | Completed | `Assignment.status` |
| Gecikti | Overdue | `Assignment.status` (set by cron job) |

## Assignment Type

| Turkish | English | Used In |
|---------|---------|---------|
| Ödev | Homework | `Assignment.type` |
| Proje | Project | `Assignment.type` |

## Course Type

| Turkish | English | Used In |
|---------|---------|---------|
| Zorunlu | Mandatory / Required | `Course.type` |
| Seçmeli | Elective | `Course.type` |

## Semester

| Turkish | English | Used In |
|---------|---------|---------|
| Güz | Fall | `Course.semester` |
| Bahar | Spring | `Course.semester` |

## Announcement Category

| Turkish | English | Used In |
|---------|---------|---------|
| genel | General | `Announcement.category` |
| fakulte | Faculty | `Announcement.category` |
| ders | Course | `Announcement.category` |
| academic | Academic | `Announcement.category` |
| administrative | Administrative | `Announcement.category` |
| events | Events | `Announcement.category` |

## Announcement Priority

| Turkish | English | Used In |
|---------|---------|---------|
| normal | Normal | `Announcement.priority` |
| high | High | `Announcement.priority` |
| urgent | Urgent | `Announcement.priority` |

## Email Folders

| Turkish | English | Used In |
|---------|---------|---------|
| Gelen Kutusu | Inbox | `Email.folder` |
| Arşiv | Archive | `Email.folder` |
| Çöp Kutusu | Trash | `Email.folder` |
| Yıldızlı | Starred | `Email.folder` |

## Library / Book Status

| Turkish | English | Used In |
|---------|---------|---------|
| Teslim Edildi | Returned | `BorrowedBook.status` |
| Süresi Yaklaşıyor | Due Soon | `BorrowedBook.status` (set by cron) |
| Gecikti | Overdue | `BorrowedBook.status` |

## Dormitory Permission Status

| Turkish | English | Used In |
|---------|---------|---------|
| Bekliyor | Pending | `Dormitory.permissions.status` |
| Onaylandı | Approved | `Dormitory.permissions.status` |
| Reddedildi | Rejected | `Dormitory.permissions.status` |

## Payment / Transaction

| English | Description | Used In |
|---------|-------------|---------|
| income | Money received | `Transaction.type` |
| expense | Money spent | `Transaction.type` |

## Transaction Categories

| Turkish | English | Used In |
|---------|---------|---------|
| Yemek | Food/Dining | `Transaction.category` |
| Ceza | Fine/Penalty | `Transaction.category` |
| Transfer | Transfer | `Transaction.category` |

## Log Status

| English | Description | Used In |
|---------|-------------|---------|
| success | Successful operation | `Log.status` |
| error | Failed operation | `Log.status` |

## Education Types

| Turkish | English | Context |
|---------|---------|---------|
| Örgün Öğretim | Formal Education | `Student.educationType` |
| İkinci Öğretim | Evening Education | `Student.educationType` |
| Lisans | Bachelor's | `Student.degreeLevel` |
| Yüksek Lisans | Master's | `Student.degreeLevel` |
| Doktora | PhD | `Student.degreeLevel` |

## Registration Types

| Turkish | English | Context |
|---------|---------|---------|
| YKS | University Entrance Exam | `Student.registrationType` |
| DGS | Transfer Exam | `Student.registrationType` |
| Yatay Geçiş | Lateral Transfer | `Student.registrationType` |

## Student Status

| Turkish | English | Context |
|---------|---------|---------|
| Aktif | Active | `Student.status` |
| Pasif | Inactive | `Student.status` |
| Mezun | Graduated | `Student.status` |
| Kayıt Dondurma | Enrollment Frozen | `Student.status` |

## UI Labels (Sidebar)

| Turkish | English |
|---------|---------|
| Anasayfa | Home / Dashboard |
| Yazıldığım Dersler | Enrolled Courses |
| Ders Programım | My Schedule |
| Devamsızlık Çizelgem | My Attendance |
| Ders Notlarım | My Grades |
| Ödevlerim | My Assignments |
| Transkript | Transcript |
| Sınav Programım | My Exam Schedule |
| Sınav Sonuçlarım | My Exam Results |
| Kariyer Merkezi | Career Center |
| Staj Bilgilerim | My Internship Info |
| Yemekhane Menüsü | Dining Menu |
| Kütüphane | Library |
| Ring Seferleri | Shuttle Schedule |
| Sosyal Karne | Social Transcript |
| Öğrenci Kulüpleri | Student Clubs |
| Finans ve Cüzdan | Finance & Wallet |
| Burs ve İndirimlerim | My Scholarships |
| Mezuniyet İşlemleri | Graduation Procedures |
| Yurt İşlemleri | Dormitory Services |
| Hesap Ayarları | Account Settings |
| Oturumu Kapat | Log Out |
| Canlı Destek | Live Support |
| Kullanıcı Yönetimi | User Management |
| Sistem Logları | System Logs |
| Sistem Analitiği | System Analytics |

## Common API Terms

| Term | Meaning |
|------|---------|
| `req.user` | Authenticated user object (from JWT) |
| `verifyToken` | Middleware that validates JWT |
| `restrictTo` | Middleware that checks role |
| `ApiFeatures` | Query helper for filter/sort/paginate |
| `AppError` | Custom operational error class |
| `isOperational` | Flag indicating safe-to-show error |
