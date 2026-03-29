const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assignment = require('./models/Assignment');
const Schedule = require('./models/Schedule');
const GradeData = require('./models/GradeData');
const Course = require('./models/Course');
const Announcement = require('./models/Announcement');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('MongoDB Connected for Seeding Data');

        const user = await User.findOne({ username: 'salihoglueyup' });
        if (!user) {
            console.log('Target user not found, please create them first.');
            process.exit(1);
        }

        const userId = user._id;

        // --- 1. SEED SCHEDULE ---
        // Delete old schedules created for 'salihoglueyup' ID
        await Schedule.deleteMany({ userId: userId.toString() });
        const realSchedules = [
            { userId: userId.toString(), day: "Pazartesi", start: "09:00", end: "12:00", course: "Yazılım Testi (Grup A)", room: "D-201", type: "Ders", instructor: "Prof. Dr. Ahmet Yılmaz" },
            { userId: userId.toString(), day: "Pazartesi", start: "14:00", end: "16:00", course: "Yazılım Mimarisi (Grup A)", room: "D-203", type: "Ders", instructor: "Doç. Dr. Ayşe Kaya" },
            { userId: userId.toString(), day: "Salı", start: "09:00", end: "12:00", course: "Web Programlama (Grup A)", room: "Lab-3", type: "Lab", instructor: "Dr. Ayşe Kaya" },
            { userId: userId.toString(), day: "Çarşamba", start: "10:00", end: "13:00", course: "Yapay Zeka Uygulamaları", room: "Lab-1", type: "Lab", instructor: "Doç. Dr. Mehmet Demir" },
            { userId: userId.toString(), day: "Cuma", start: "09:00", end: "12:00", course: "Bitirme Projesi I", room: "Sanal Sınıf", type: "Online", instructor: "Dr. Danışman" }
        ];
        await Schedule.insertMany(realSchedules);
        console.log('Schedules seeded.');

        // --- 2. SEED GRADES ---
        await GradeData.deleteMany({ userId: userId.toString() });
        const gradeData = new GradeData({
            userId: userId.toString(),
            currentSemester: [
                { courseCode: "YAZ401", courseName: "Bitirme Projesi I", credit: 5, midterm: 85, final: null, status: "Aktif" },
                { courseCode: "YAZ403", courseName: "Yazılım Testi", credit: 4, midterm: 70, final: 80, status: "Geçti" },
                { courseCode: "YAZ405", courseName: "Yazılım Mimarisi", credit: 4, midterm: 90, final: null, status: "Aktif" },
                { courseCode: "YZM407", courseName: "Yapay Zeka Uygulamaları", credit: 3, midterm: null, final: null, status: "Aktif" }
            ],
            history: [
                { semester: '2024 Güz', gno: 3.40 },
                { semester: '2024 Bahar', gno: 3.50 },
                { semester: '2025 Güz', gno: 3.65 }
            ],
            distribution: [
                { subject: "Yazılım", score: 85 },
                { subject: "Matematik", score: 70 },
                { subject: "Algoritma", score: 90 },
                { subject: "Donanım", score: 60 },
                { subject: "Seçmeli", score: 80 }
            ]
        });
        await gradeData.save();
        console.log('GradeData seeded.');

        // --- 3. SEED ASSIGNMENTS ---
        await Assignment.deleteMany({ userId: userId.toString() });
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

        const assignments = [
            { userId: userId.toString(), course: "Yazılım Testi", courseCode: "YAZ403", title: "Selenium JUnit Test Raporu", dueDate: oneWeekFromNow.toISOString().split('T')[0], daysLeft: 7, status: "Bekliyor", type: "Proje" },
            { userId: userId.toString(), course: "Yazılım Mimarisi", courseCode: "YAZ405", title: "Clean Architecture Analizi", dueDate: new Date().toISOString().split('T')[0], daysLeft: 0, status: "Bekliyor", type: "Ödev" },
            { userId: userId.toString(), course: "Bitirme Projesi I", courseCode: "YAZ401", title: "Literatür Taraması Teslimi", dueDate: "2026-02-10", daysLeft: -10, status: "Tamamlandı", type: "Proje" }
        ];
        await Assignment.insertMany(assignments);
        console.log('Assignments seeded.');

        // --- 4. SEED GENERAL ANNOUNCEMENTS ---
        // (If table is empty, seed some general ones)
        const announcementCount = await Announcement.countDocuments();
        if (announcementCount === 0) {
            const announcements = [
                { title: "Bahar Dönemi Harç Ödemeleri Son Gün", text: "Özel kampanya dâhilinde peşin ödemelerde %5 indirim.", type: "Genel", date: new Date() },
                { title: "Mühendislik Fakültesi Semineri", text: "Yapay zeka ve gelecek üzerine Dr. XYZ'nin konuşması 2. Kat konferans salonunda.", type: "Fakülte", date: new Date() },
                { title: "Yazılım Mimarisi Dersi İptali", text: "Öğretim görevlisinin sağlık sorunları nedeniyle bu haftaki ders iptal edilmiştir.", type: "Ders", date: new Date() }
            ];
            await Announcement.insertMany(announcements);
            console.log('Announcements seeded.');
        }

        console.log('--- ALL SEEDING COMPLETE ---');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
