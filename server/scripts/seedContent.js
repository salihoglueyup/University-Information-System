/**
 * Seeds demo content for the dashboards so the screens are populated.
 * Idempotent: each collection is cleared (for the seed users / globally) and
 * re-inserted. Run inside the server container after seedUsers.js:
 *   docker exec ubis_server node scripts/seedContent.js
 */
const mongoose = require('mongoose');

const STUDENT = 'ogrenci';
const ACADEMICS = ['arsgor', 'ogrgor'];

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/ubis';

// Models
const OnlineCourse = require('../models/OnlineCourse');
const LibraryFine = require('../models/LibraryFine');
const AccessLog = require('../models/AccessLog');
const PartTimeWork = require('../models/PartTimeWork');
const HealthAppointment = require('../models/HealthAppointment');
const ElectronicExam = require('../models/ElectronicExam');
const UzemExam = require('../models/UzemExam');
const GraduationStatus = require('../models/GraduationStatus');
const SocialTranscript = require('../models/SocialTranscript');
const TranscriptEntry = require('../models/TranscriptEntry');
const TuitionFee = require('../models/TuitionFee');
const ExamApplication = require('../models/ExamApplication');
const SemCourse = require('../models/SemCourse');
const StudentClub = require('../models/StudentClub');

const ProctoringDuty = require('../models/ProctoringDuty');
const Question = require('../models/Question');
const Publication = require('../models/Publication');
const DeptTask = require('../models/DeptTask');
const ThesisStudent = require('../models/ThesisStudent');
const ThesisMilestone = require('../models/ThesisMilestone');
const ThesisTask = require('../models/ThesisTask');
const ThesisAssistance = require('../models/ThesisAssistance');
const InstructorCourse = require('../models/InstructorCourse');
const GradingTask = require('../models/GradingTask');
const OfficeHour = require('../models/OfficeHour');
const ExamSession = require('../models/ExamSession');

const Prerequisite = require('../models/Prerequisite');
const DepartmentCourse = require('../models/DepartmentCourse');
const CatalogCourse = require('../models/CatalogCourse');
const RadioSchedule = require('../models/RadioSchedule');
const InfoResource = require('../models/InfoResource');
const SportsFacility = require('../models/SportsFacility');
const ShuttleRoute = require('../models/ShuttleRoute');
const VirtualTourSpot = require('../models/VirtualTourSpot');
const AcademicReport = require('../models/AcademicReport');
const FinancialReport = require('../models/FinancialReport');

async function reset(Model, filter = {}) {
    await Model.deleteMany(filter);
}

async function seed() {
    await mongoose.connect(MONGO_URL);
    console.log(`Connected to ${MONGO_URL}\n`);

    // ---------------- STUDENT (ogrenci) ----------------
    await reset(OnlineCourse, { userId: STUDENT });
    await OnlineCourse.insertMany([
        { userId: STUDENT, code: 'BIL301', name: 'Veritabanı Yönetim Sistemleri', instructor: 'Doç. Dr. Ayşe Kaya', progress: 72, lastAccess: '2026-05-28', nextLiveSession: '2026-06-02 14:00', platform: 'Moodle' },
        { userId: STUDENT, code: 'BIL305', name: 'Yapay Zekaya Giriş', instructor: 'Prof. Dr. Mehmet Demir', progress: 40, lastAccess: '2026-05-27', nextLiveSession: '2026-06-03 10:00', platform: 'UZEM' },
        { userId: STUDENT, code: 'ENG201', name: 'Akademik İngilizce', instructor: 'Öğr. Gör. Jane Doe', progress: 90, lastAccess: '2026-05-29', nextLiveSession: '', platform: 'Moodle' }
    ]);

    await reset(LibraryFine, { userId: STUDENT });
    await LibraryFine.insertMany([
        { userId: STUDENT, book: 'Sefiller - Victor Hugo', fine: '12,50 ₺', returnDate: '2026-05-20', dueDate: '2026-05-10', status: 'Ödenmedi' },
        { userId: STUDENT, book: 'Algoritmalara Giriş - CLRS', fine: '7,50 ₺', returnDate: '2026-04-18', dueDate: '2026-04-13', status: 'Ödenmedi' },
        { userId: STUDENT, book: 'Suç ve Ceza - Dostoyevski', fine: '15,00 ₺', returnDate: '2026-03-01', dueDate: '2026-02-20', status: 'Ödendi', paidDate: '2026-03-02' }
    ]);

    await reset(AccessLog, { userId: STUDENT });
    await AccessLog.insertMany([
        { userId: STUDENT, location: 'A Blok Turnike', type: 'Giriş', time: '2026-05-30 08:32' },
        { userId: STUDENT, location: 'Kütüphane', type: 'Giriş', time: '2026-05-30 10:05' },
        { userId: STUDENT, location: 'Kütüphane', type: 'Çıkış', time: '2026-05-30 12:40' },
        { userId: STUDENT, location: 'A Blok Turnike', type: 'Çıkış', time: '2026-05-30 17:15' }
    ]);

    await reset(PartTimeWork, { userId: STUDENT });
    await PartTimeWork.create({
        userId: STUDENT, role: 'Öğrenci Asistanı (Lab)', department: 'Bilgisayar Mühendisliği', status: 'Aktif',
        hourlyRate: '120 ₺', salary: '4.800 ₺', workedThisMonth: '40 saat', monthlyLimit: '80 saat',
        shifts: [
            { date: '2026-05-28', hours: '09:00-13:00', total: 4 },
            { date: '2026-05-26', hours: '13:00-17:00', total: 4 },
            { date: '2026-05-22', hours: '09:00-12:00', total: 3 }
        ]
    });

    await reset(HealthAppointment, { userId: STUDENT });
    await HealthAppointment.insertMany([
        { userId: STUDENT, department: 'Diş Hekimliği', doctor: 'Dr. Ada Yılmaz', date: '2026-06-04', time: '10:30' },
        { userId: STUDENT, department: 'Dahiliye', doctor: 'Dr. Cem Aksoy', date: '2026-06-11', time: '14:15' }
    ]);

    await reset(ElectronicExam, { userId: STUDENT });
    await ElectronicExam.insertMany([
        { userId: STUDENT, course: 'BIL301 - Final', date: '2026-06-15 10:00', center: 'E-Sınav Merkezi A-104', status: 'Randevu Alındı' },
        { userId: STUDENT, course: 'ENG201 - Final', date: '2026-06-18 13:00', center: 'E-Sınav Merkezi B-201', status: 'Randevu Bekliyor' }
    ]);

    await reset(UzemExam, { userId: STUDENT });
    await UzemExam.insertMany([
        { userId: STUDENT, code: 'BIL305', name: 'Yapay Zekaya Giriş', type: 'Vize', date: '2026-06-05 11:00', duration: '60 dk', status: 'Aktif' },
        { userId: STUDENT, code: 'MAT202', name: 'Diferansiyel Denklemler', type: 'Final', date: '2026-06-20 09:00', duration: '90 dk', status: 'Bekliyor' }
    ]);

    await reset(GraduationStatus, { userId: STUDENT });
    await GraduationStatus.create({ userId: STUDENT, totalCredits: 198, requiredCredits: 240, gpa: 3.12, internshipStatus: 'Tamamlandı', libraryStatus: 'Temiz', thesisStatus: 'Bekliyor' });

    await reset(SocialTranscript, { userId: STUDENT });
    await SocialTranscript.create({
        userId: STUDENT, requiredPoints: 100,
        badges: [{ id: 1, name: 'Gönüllü Lider', description: '50 saat gönüllülük' }, { id: 2, name: 'Sporcu', description: 'Üniversite takımı' }],
        categories: [
            { id: 1, title: 'Akademik Gelişim', items: [{ id: 1, description: 'Seminer katılımı', points: 10, maxPoints: 10, completed: true }, { id: 2, description: 'Sertifika programı', points: 0, maxPoints: 15, completed: false }] },
            { id: 2, title: 'Sosyal-Kültürel', items: [{ id: 3, description: 'Kulüp üyeliği', points: 8, maxPoints: 10, completed: true }] },
            { id: 3, title: 'Spor', items: [{ id: 4, description: 'Turnuva katılımı', points: 12, maxPoints: 15, completed: true }] }
        ],
        extraPoints: [{ id: 1, category: 'Temsil', officer: 'Dekanlık', date: '2026-04-10', points: 5 }]
    });

    await reset(TranscriptEntry, { userId: STUDENT });
    await TranscriptEntry.insertMany([
        { userId: STUDENT, semester: '2024-2025 Güz', code: 'BIL201', name: 'Veri Yapıları', credit: 4, ects: 6, letter: 'AA', final: 92, status: 'Geçti', termGpa: 3.40, cumGpa: 3.10 },
        { userId: STUDENT, semester: '2024-2025 Güz', code: 'MAT201', name: 'Olasılık ve İstatistik', credit: 3, ects: 5, letter: 'BB', final: 78, status: 'Geçti', termGpa: 3.40, cumGpa: 3.10 },
        { userId: STUDENT, semester: '2024-2025 Bahar', code: 'BIL301', name: 'Veritabanı Yönetim Sistemleri', credit: 4, ects: 6, letter: 'BA', final: 85, status: 'Geçti', termGpa: 3.25, cumGpa: 3.12 },
        { userId: STUDENT, semester: '2024-2025 Bahar', code: 'ENG201', name: 'Akademik İngilizce', credit: 3, ects: 4, letter: 'CB', final: 68, status: 'Geçti', termGpa: 3.25, cumGpa: 3.12 }
    ]);

    await reset(TuitionFee, { userId: STUDENT });
    await TuitionFee.insertMany([
        { userId: STUDENT, term: '2025-2026 Güz', amount: '21.500 ₺', date: '2025-09-15', status: 'Ödendi', receipt: true, paidDate: '2025-09-10' },
        { userId: STUDENT, term: '2025-2026 Bahar', amount: '21.500 ₺', date: '2026-02-15', status: 'Ödenmedi', receipt: false }
    ]);

    // ---------------- GLOBAL CATALOGS ----------------
    await reset(ExamApplication);
    await ExamApplication.insertMany([
        { name: 'İngilizce Muafiyet Sınavı', type: 'Muafiyet Sınavı', date: '2026-06-25', deadline: '2026-06-15', status: 'Başvuruya Açık', order: 1 },
        { name: 'Temel Bilgisayar Muafiyet', type: 'Muafiyet Sınavı', date: '2026-06-26', deadline: '2026-06-16', status: 'Başvuruya Açık', order: 2 },
        { name: 'BIL101 Tek Ders Sınavı', type: 'Tek Ders Sınavı', date: '2026-07-01', deadline: '2026-06-20', status: 'Başvuruya Açık', order: 3 }
    ]);

    await reset(SemCourse);
    await SemCourse.insertMany([
        { title: 'Veri Bilimi ve Python', price: '1.500 ₺', duration: '6 Hafta', instructor: 'Dr. Ada Lovelace', order: 1 },
        { title: 'Dijital Pazarlama', price: '1.200 ₺', duration: '4 Hafta', instructor: 'Uzm. Kerem Yıldız', order: 2 },
        { title: 'İş Sağlığı ve Güvenliği', price: '900 ₺', duration: '3 Hafta', instructor: 'Müh. Selin Acar', order: 3 }
    ]);

    await reset(StudentClub);
    await StudentClub.insertMany([
        { name: 'Robotik Kulübü', description: 'Otonom robot ve gömülü sistem projeleri.', logo: '🤖', members: 124, order: 1 },
        { name: 'Yazılım Kulübü', description: 'Hackathon, açık kaynak ve kariyer etkinlikleri.', logo: '💻', members: 210, order: 2 },
        { name: 'Dağcılık ve Doğa Sporları', description: 'Kamp, tırmanış ve doğa yürüyüşleri.', logo: '🏔️', members: 86, order: 3 },
        { name: 'Fotoğrafçılık Kulübü', description: 'Atölyeler ve foto safari etkinlikleri.', logo: '📷', members: 73, order: 4 }
    ]);

    await reset(Prerequisite);
    await Prerequisite.insertMany([
        { code: 'BIL201', name: 'Veri Yapıları', prerequisites: ['BIL101 Programlamaya Giriş'], order: 1 },
        { code: 'BIL202', name: 'Algoritma Analizi', prerequisites: ['BIL201 Veri Yapıları'], order: 2 },
        { code: 'BIL301', name: 'Veritabanı Yönetim Sistemleri', prerequisites: ['BIL201 Veri Yapıları'], order: 3 },
        { code: 'BIL401', name: 'Bitirme Projesi', prerequisites: ['BIL301 VTYS', 'BIL305 Yapay Zeka'], order: 4 }
    ]);

    await reset(DepartmentCourse);
    await DepartmentCourse.insertMany([
        { code: 'BIL101', name: 'Programlamaya Giriş', credit: 4, ects: 6, semester: 1, type: 'Zorunlu' },
        { code: 'BIL201', name: 'Veri Yapıları', credit: 4, ects: 6, semester: 3, type: 'Zorunlu' },
        { code: 'BIL301', name: 'Veritabanı Yönetim Sistemleri', credit: 4, ects: 6, semester: 5, type: 'Zorunlu' },
        { code: 'BIL355', name: 'Mobil Programlama', credit: 3, ects: 5, semester: 5, type: 'Seçmeli' },
        { code: 'BIL401', name: 'Bitirme Projesi', credit: 4, ects: 8, semester: 7, type: 'Zorunlu' }
    ]);

    await reset(CatalogCourse);
    await CatalogCourse.insertMany([
        { code: 'YZM401', courseName: 'Yazılım Test Mühendisliği', department: 'Yazılım Müh.', credit: 3, ects: 5, semester: 7, type: 'Zorunlu' },
        { code: 'YZM403', courseName: 'Kriptografi', department: 'Yazılım Müh.', credit: 3, ects: 5, semester: 7, type: 'Seçmeli' },
        { code: 'BIL305', courseName: 'Yapay Zekaya Giriş', department: 'Bilgisayar Müh.', credit: 3, ects: 6, semester: 5, type: 'Zorunlu' },
        { code: 'BIL301', courseName: 'Veritabanı Yönetim Sistemleri', department: 'Bilgisayar Müh.', credit: 4, ects: 6, semester: 5, type: 'Zorunlu' }
    ]);

    await reset(RadioSchedule);
    await RadioSchedule.insertMany([
        { time: '09:00', program: 'Günaydın Kampüs', host: 'Deniz & Ece', order: 1 },
        { time: '12:00', program: 'Öğle Arası Liste', host: 'DJ Mert', order: 2 },
        { time: '16:00', program: 'Kampüsün Sesi', host: 'Selin Acar', order: 3 },
        { time: '20:00', program: 'Akustik Akşamlar', host: 'Kerem Yıldız', order: 4 }
    ]);

    await reset(InfoResource);
    await InfoResource.insertMany([
        { name: 'IEEE Xplore', type: 'Veritabanı', url: 'https://ieeexplore.ieee.org', order: 1 },
        { name: 'ScienceDirect', type: 'Veritabanı', url: 'https://www.sciencedirect.com', order: 2 },
        { name: 'YÖK Tez Merkezi', type: 'Tez Arşivi', url: 'https://tez.yok.gov.tr', order: 3 },
        { name: 'Turnitin', type: 'İntihal Tespit', url: 'https://www.turnitin.com', order: 4 }
    ]);

    await reset(SportsFacility);
    await SportsFacility.insertMany([
        { name: 'Kapalı Spor Salonu', image: 'https://picsum.photos/seed/gym/400/240', status: 'Açık', occupancy: 65, hours: '08:00 - 22:00', order: 1 },
        { name: 'Yarı Olimpik Yüzme Havuzu', image: 'https://picsum.photos/seed/pool/400/240', status: 'Açık', occupancy: 40, hours: '07:00 - 21:00', order: 2 },
        { name: 'Fitness Merkezi', image: 'https://picsum.photos/seed/fit/400/240', status: 'Açık', occupancy: 88, hours: '06:00 - 23:00', order: 3 },
        { name: 'Tenis Kortları', image: 'https://picsum.photos/seed/tennis/400/240', status: 'Kapalı', occupancy: 0, hours: '09:00 - 19:00', order: 4 }
    ]);

    await reset(ShuttleRoute);
    await ShuttleRoute.insertMany([
        { route: 'Kampüs ↔ Metro İstasyonu', times: ['08:00', '08:30', '09:00', '12:00', '17:00', '17:30'], order: 1 },
        { route: 'Kampüs ↔ Şehir Merkezi', times: ['08:15', '10:15', '13:15', '16:15', '18:15'], order: 2 },
        { route: 'Kampüs ↔ Yurtlar Bölgesi', times: ['07:45', '08:45', '17:45', '18:45', '21:00'], order: 3 }
    ]);

    await reset(VirtualTourSpot);
    await VirtualTourSpot.insertMany([
        { title: 'Merkez Kampüs Meydanı', url: 'https://picsum.photos/seed/campus1/600/450', order: 1 },
        { title: 'Merkez Kütüphane', url: 'https://picsum.photos/seed/lib/600/450', order: 2 },
        { title: 'Mühendislik Fakültesi', url: 'https://picsum.photos/seed/eng/600/450', order: 3 },
        { title: 'Sosyal Yaşam Merkezi', url: 'https://picsum.photos/seed/social/600/450', order: 4 }
    ]);

    await reset(ExamSession);
    await ExamSession.insertMany([
        { courseName: 'Veritabanı Yönetim Sistemleri', courseCode: 'BIL301', examType: 'Final', date: '2026-06-15', time: '10:00 - 11:30', classrooms: ['A-104', 'A-105'], studentsCount: 84, instructor: 'Doç. Dr. Ayşe Kaya', proctors: ['Arş. Gör. Ayşe Kaya', 'Öğr. Gör. Mehmet Demir'], status: 'Planlandı' },
        { courseName: 'Yapay Zekaya Giriş', courseCode: 'BIL305', examType: 'Final', date: '2026-06-18', time: '13:00 - 14:30', classrooms: ['B-201'], studentsCount: 52, instructor: 'Prof. Dr. Mehmet Demir', proctors: ['Arş. Gör. Ayşe Kaya'], status: 'Taslak' },
        { courseName: 'Akademik İngilizce', courseCode: 'ENG201', examType: 'Vize', date: '2026-05-10', time: '09:00 - 10:00', classrooms: ['C-110'], studentsCount: 120, instructor: 'Öğr. Gör. Jane Doe', proctors: ['Öğr. Gör. Mehmet Demir'], status: 'Tamamlandı' }
    ]);

    await reset(AcademicReport);
    await AcademicReport.create({
        facultyStats: [
            { name: 'Mühendislik', students: 1200 }, { name: 'İİBF', students: 980 },
            { name: 'Tıp', students: 640 }, { name: 'Hukuk', students: 520 }, { name: 'Eğitim', students: 720 }
        ],
        enrollmentTrends: [
            { year: '2021', students: 3200 }, { year: '2022', students: 3550 },
            { year: '2023', students: 3900 }, { year: '2024', students: 4100 }, { year: '2025', students: 4260 }
        ]
    });

    await reset(FinancialReport);
    await FinancialReport.create({
        paymentStats: [
            { name: 'Ödendi', value: 72, color: '#10B981' },
            { name: 'Bekliyor', value: 21, color: '#F59E0B' },
            { name: 'Gecikmiş', value: 7, color: '#EF4444' }
        ],
        monthlyRevenue: [
            { month: 'Oca', amount: 4200000 }, { month: 'Şub', amount: 6100000 }, { month: 'Mar', amount: 3800000 },
            { month: 'Nis', amount: 2900000 }, { month: 'May', amount: 3300000 }, { month: 'Haz', amount: 5400000 }
        ]
    });

    // ---------------- ACADEMICS (arsgor + ogrgor) ----------------
    for (const acad of ACADEMICS) {
        await reset(ProctoringDuty, { userId: acad });
        await ProctoringDuty.insertMany([
            { userId: acad, examName: 'BIL301 Final Gözetmenliği', date: '2026-06-15', time: '10:00', room: 'A-104', instructor: 'Doç. Dr. Ayşe Kaya', status: 'pending' },
            { userId: acad, examName: 'ENG201 Vize Gözetmenliği', date: '2026-05-10', time: '09:00', room: 'C-110', instructor: 'Öğr. Gör. Jane Doe', status: 'confirmed', confirmedDate: '2026-05-08' }
        ]);

        await reset(Question, { userId: acad });
        await Question.insertMany([
            { userId: acad, text: 'B-ağacı ile B+ ağacı arasındaki temel fark nedir?', course: 'BIL301', topic: 'İndeksleme', difficulty: 'Orta', type: 'Klasik', date: '2026-05-20' },
            { userId: acad, text: 'Normalizasyonda 3NF şartlarını açıklayınız.', course: 'BIL301', topic: 'Normalizasyon', difficulty: 'Zor', type: 'Klasik', date: '2026-05-18' },
            { userId: acad, text: 'SQL JOIN türlerinden INNER ve LEFT farkı nedir?', course: 'BIL301', topic: 'SQL', difficulty: 'Kolay', type: 'Test', date: '2026-05-15' }
        ]);

        await reset(Publication, { userId: acad });
        await Publication.insertMany([
            { userId: acad, title: 'Graf Sinir Ağları ile Trafik Tahmini', type: 'SCI Makale', year: 2025, points: 25, status: 'Yayınlandı' },
            { userId: acad, title: 'Federated Learning Üzerine Bir İnceleme', type: 'Konferans Bildirisi', year: 2024, points: 10, status: 'Yayınlandı' }
        ]);

        await reset(DeptTask, { userId: acad });
        await DeptTask.insertMany([
            { userId: acad, task: 'Final sınav sorularını komisyona teslim et', status: 'todo', priority: 'high', deadline: '2026-06-08', assignedBy: 'Bölüm Başkanlığı' },
            { userId: acad, task: 'Ders izlencelerini güncelle', status: 'in-progress', priority: 'medium', deadline: '2026-06-12', assignedBy: 'Dekanlık' },
            { userId: acad, task: 'Akademik teşvik dosyasını hazırla', status: 'done', priority: 'low', deadline: '2026-05-20', assignedBy: 'Rektörlük' }
        ]);

        await reset(InstructorCourse, { userId: acad });
        await InstructorCourse.insertMany([
            { userId: acad, code: 'BIL301', name: 'Veritabanı Yönetim Sistemleri', type: 'Zorunlu', schedule: 'Pzt 09:00-12:00', room: 'D-201', studentsEnrolled: 84, attendanceRate: 91, syllabusStatus: 'Tamamlandı', pendingGrading: 12 },
            { userId: acad, code: 'BIL355', name: 'Mobil Programlama', type: 'Seçmeli', schedule: 'Çar 13:00-16:00', room: 'D-205', studentsEnrolled: 46, attendanceRate: 78, syllabusStatus: 'Bekliyor', pendingGrading: 0 }
        ]);

        await reset(GradingTask, { userId: acad });
        await GradingTask.insertMany([
            { userId: acad, courseName: 'Veritabanı Yönetim Sistemleri', type: 'Vize', dueDate: '2026-06-10', pendingCount: 12 },
            { userId: acad, courseName: 'Mobil Programlama', type: 'Proje', dueDate: '2026-06-14', pendingCount: 0 }
        ]);

        await reset(OfficeHour, { userId: acad });
        await OfficeHour.insertMany([
            { userId: acad, day: 'Pazartesi', time: '14:00 - 16:00', location: 'B-204' },
            { userId: acad, day: 'Perşembe', time: '10:00 - 12:00', location: 'B-204' }
        ]);

        await reset(ThesisStudent, { userId: acad });
        const theses = await ThesisStudent.insertMany([
            { userId: acad, name: 'Ali Yılmaz', projectTitle: 'Derin Öğrenme ile Görüntü Sınıflandırma', progress: 65, deadline: '2026-07-30', status: 'Devam Ediyor' },
            { userId: acad, name: 'Ayşe Demir', projectTitle: 'Blokzincir Tabanlı Oylama Sistemi', progress: 30, deadline: '2026-08-15', status: 'Gecikmeli' }
        ]);

        await reset(ThesisMilestone, { thesisId: { $in: theses.map(t => String(t._id)) } });
        await ThesisMilestone.create({
            thesisId: String(theses[0]._id), student: 'Ali Yılmaz', project: 'Derin Öğrenme ile Görüntü Sınıflandırma',
            startDate: '2026-02-01', endDate: '2026-07-30',
            milestones: [
                { id: 1, title: 'Literatür Taraması', date: '2026-02-28', status: 'Tamamlandı', grade: 90, feedback: 'Kapsamlı bir tarama olmuş.' },
                { id: 2, title: 'Veri Toplama ve Önişleme', date: '2026-04-15', status: 'Tamamlandı', grade: 85, feedback: '' },
                { id: 3, title: 'Model Geliştirme', date: '2026-06-10', status: 'Devam Ediyor' },
                { id: 4, title: 'Tez Yazımı', date: '2026-07-20', status: 'Bekliyor' }
            ]
        });

        await reset(ThesisAssistance, { userId: acad });
        await ThesisAssistance.insertMany([
            { userId: acad, studentName: 'Ali Yılmaz', projectTitle: 'Derin Öğrenme ile Görüntü Sınıflandırma', advisor: 'Doç. Dr. Ayşe Kaya', status: 'Draft Review', progress: 65, tasks: [{ id: 1, title: 'Bölüm 3 taslağı', completed: true }, { id: 2, title: 'Deney sonuçları', completed: false }] },
            { userId: acad, studentName: 'Ayşe Demir', projectTitle: 'Blokzincir Tabanlı Oylama Sistemi', advisor: 'Doç. Dr. Ayşe Kaya', status: 'Proposal', progress: 30, tasks: [{ id: 1, title: 'Öneri sunumu', completed: true }] }
        ]);

        await reset(ThesisTask, { userId: acad });
        await ThesisTask.insertMany([
            { userId: acad, content: 'Literatür taramasını tamamla', student: 'Ali Yılmaz', priority: 'high', date: '2026-06-05', column: 'completed', order: 0 },
            { userId: acad, content: 'Model mimarisini tasarla', student: 'Ali Yılmaz', priority: 'medium', date: '2026-06-12', column: 'in_progress', order: 0 },
            { userId: acad, content: 'Öneri savunması planla', student: 'Ayşe Demir', priority: 'high', date: '2026-06-20', column: 'todo', order: 0 },
            { userId: acad, content: 'Etik kurul başvurusu', student: 'Ayşe Demir', priority: 'low', date: '2026-06-25', column: 'todo', order: 1 }
        ]);
    }

    console.log('Content seed complete. Refresh the dashboards to see populated screens.');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('Content seed failed:', err);
    process.exit(1);
});
