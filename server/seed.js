const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Course = require('./models/Course');
const Announcement = require('./models/Announcement');
const Schedule = require('./models/Schedule');
const Assignment = require('./models/Assignment');
const AcademicCalendar = require('./models/AcademicCalendar');
const GradeData = require('./models/GradeData');
const Attendance = require('./models/Attendance');
const Faculty = require('./models/Faculty');
const Department = require('./models/Department');
const Student = require('./models/Student');
const Log = require('./models/Log');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

console.log('Connecting to MongoDB at:', process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/ubis')
    .then(async () => {
        console.log('MongoDB Connected');

        try {
            // Check if admin exists
            const oldUser = await User.findOne({ username: 'admin' });
            if (oldUser) {
                console.log('Admin user already exists.');
            } else {
                console.log('Creating new admin user...');
                const hashedPassword = await bcrypt.hash('123', 10);
                const newUser = new User({
                    username: 'admin',
                    password: hashedPassword,
                    fullName: 'Admin User',
                    role: 'admin'
                });

                await newUser.save();
                console.log('Admin user created successfully.');
            }
            console.log('Username: admin');
            console.log('Password: 123');

            console.log('Seeding courses...');
            await Course.deleteMany({});
            await Course.insertMany([
                { code: "BİL101", name: "Bilgisayar Mühendisliğine Giriş", credit: 3, ects: 5, type: "Zorunlu", instructor: "Prof. Dr. Ahmet Yılmaz", semester: "Güz" },
                { code: "BİL102", name: "Algoritma ve Programlama", credit: 4, ects: 6, type: "Zorunlu", instructor: "Dr. Ayşe Kaya", semester: "Bahar" },
                { code: "MAT101", name: "Matematik I", credit: 4, ects: 6, type: "Zorunlu", instructor: "Prof. Dr. Mehmet Öz", semester: "Güz" }
            ]);

            console.log('Seeding announcements...');
            await Announcement.deleteMany({});
            await Announcement.insertMany([
                { title: "Bahar Dönemi Ders Kayıtları", text: "<p><strong>2025-2026 Bahar dönemi ders kayıtları</strong> 15 Şubat'ta başlıyor.</p><ul><li>Sabah 10:00 itibarıyla.</li></ul>", category: "genel" },
                { title: "Erasmus+ Sınavı", text: "<p>Yeni dönem Erasmus+ İngilizce yeterlilik sınavı 20 Mart tarihinde yapılacaktır.</p>", category: "events" },
                { title: "Kampüs Kart Dağıtımı", text: "<p>Yeni öğrenci kimlik kartlarınızı D Blok öğrenci işlerinden alabilirsiniz.</p>", category: "genel" }
            ]);

            console.log('Seeding schedule...');
            await Schedule.deleteMany({});
            await Schedule.insertMany([
                { course: "Bilgisayar Mühendisliğine Giriş (BİL101)", type: "Ders", day: "Pazartesi", start: "09:00", end: "11:50", room: "D-201" },
                { course: "Algoritma ve Programlama (BİL102)", type: "Ders", day: "Pazartesi", start: "13:00", end: "15:50", room: "D-203" },
                { course: "Matematik I (MAT101)", type: "Ders", day: "Salı", start: "10:00", end: "12:50", room: "D-105" }
            ]);

            console.log('Seeding assignments...');
            await Assignment.deleteMany({});
            await Assignment.insertMany([
                { course: "Algoritma ve Programlama", courseCode: "BİL102", title: "Proje 1 - Diziler", dueDate: "18.03.2026", daysLeft: 2, status: "Bekliyor", type: "Proje" },
                { course: "Bilgisayar Mühendisliğine Giriş", courseCode: "BİL101", title: "Ödev 2", dueDate: "20.03.2026", daysLeft: 4, status: "Bekliyor", type: "Ödev" },
                { course: "Matematik I", courseCode: "MAT101", title: "Problem Seti 1", dueDate: "10.03.2026", daysLeft: -1, status: "Tamamlandı", type: "Ödev" }
            ]);

            console.log('Seeding academic calendar...');
            await AcademicCalendar.deleteMany({});
            await AcademicCalendar.insertMany([
                {
                    month: "Şubat 2026", events: [
                        { day: 16, title: "Bahar Dönemi Ders Başlangıcı", type: "Academic" },
                        { day: 20, title: "Ders Ekle-Sil Son Gün", type: "Deadline" }
                    ]
                },
                {
                    month: "Mart 2026", events: [
                        { day: 23, title: "Ara Sınavlar Başlangıcı", type: "Exam" }
                    ]
                }
            ]);

            console.log('Seeding grades...');
            await GradeData.deleteMany({});
            await GradeData.create({
                userId: "all",
                currentSemester: [
                    { code: "YZM302", name: "Yazılım Mimarisi", credit: 4, ects: 6, midterm: 85, final: 92, letter: "AA", status: "Geçti" },
                    { code: "YZM304", name: "Web Programlama", credit: 4, ects: 6, midterm: 90, final: 88, letter: "AA", status: "Geçti" },
                    { code: "YZM306", name: "Veri Madenciliği", credit: 3, ects: 5, midterm: 75, final: 80, letter: "BA", status: "Geçti" }
                ],
                history: [
                    { semester: "2023 Güz", gno: 3.75 },
                    { semester: "2023 Bahar", gno: 3.82 },
                    { semester: "2024 Güz", gno: 3.65 }
                ],
                distribution: [
                    { name: "AA", value: 12 },
                    { name: "BA", value: 8 },
                    { name: "BB", value: 5 }
                ]
            });

            console.log('Seeding attendance...');
            await Attendance.deleteMany({});
            await Attendance.insertMany([
                { code: "YZM302", name: "Yazılım Mimarisi", total: 14, attended: 12, absent: 2, percent: 85 },
                { code: "YZM304", name: "Web Programlama", total: 14, attended: 14, absent: 0, percent: 100 },
                { code: "YZM306", name: "Veri Madenciliği", total: 14, attended: 10, absent: 4, percent: 71 },
                { code: "ISL102", name: "İşletme Yönetimi", total: 14, attended: 9, absent: 5, percent: 64 }
            ]);

            console.log('Seeding faculties and departments...');
            const recordsPath = path.join(__dirname, '../client/src/data/records/metadata');
            const facultiesData = JSON.parse(fs.readFileSync(path.join(recordsPath, 'faculties.json'), 'utf-8'));
            const departmentsData = JSON.parse(fs.readFileSync(path.join(recordsPath, 'departments.json'), 'utf-8'));
            const studentsData = JSON.parse(fs.readFileSync(path.join(recordsPath, 'students-index.json'), 'utf-8'));

            await Faculty.deleteMany({});
            await Department.deleteMany({});
            await Student.deleteMany({});
            await Log.deleteMany({});

            console.log("Existing data cleared.");

            // Insert Logs
            const logs = [
                { user: "admin", action: "Sisteme giriş yaptı", status: "success", ip: "192.168.1.105" },
                { user: "ayse.yilmaz", action: "Not girişi başarısız", status: "error", ip: "10.0.0.12" },
                { user: "mehmet.demir", action: "Yeni ders programı oluşturdu", status: "success", ip: "85.102.34.11" },
                { user: "admin", action: "Veritabanı yedeği alındı", status: "success", ip: "192.168.1.105" },
                { user: "fatma.kurt", action: "Şifre değiştirme hatası", status: "error", ip: "46.20.111.45" }
            ];
            await Log.insertMany(logs);
            console.log("Added proxy system logs.");

            await Faculty.insertMany(facultiesData);
            await Department.insertMany(departmentsData);

            // Chunked insert for students as it might be large (1440+ records)
            console.log(`Seeding ${studentsData.length} students...`);
            const chunkSize = 500;
            for (let i = 0; i < studentsData.length; i += chunkSize) {
                const chunk = studentsData.slice(i, i + chunkSize);
                await Student.insertMany(chunk);
            }

            console.log('Database seeded successfully!');
            process.exit(0);
        } catch (err) {
            console.error('Error creating user:', err);
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });
