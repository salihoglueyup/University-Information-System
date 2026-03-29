const fs = require('fs');
const path = require('path');

const RECORDS_ROOT = path.join(__dirname, '../client/src/data/records/faculties');

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to get random array item
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to get random subset of array
const randomSubset = (arr, count) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Course Types
// const COURSE_TYPES = ['Zorunlu', 'Seçmeli', 'Mesleki Seçmeli'];

// Locations
const LOCATIONS = ['D-101', 'D-203', 'A-105', 'B-302', 'Lab-1', 'Lab-2', 'Amfi-1', 'Amfi-2', 'Online'];

// Sample Course Names by Keyword (Simple heuristic)
const COURSE_PATTERNS = {
    'bilgisayar': ['Programlama Temelleri', 'Veri Yapıları', 'Algoritma Analizi', 'Web Tasarımı', 'Veritabanı Yönetimi', 'İşletim Sistemleri', 'Bilgisayar Ağları', 'Yazılım Mühendisliği', 'Siber Güvenlik', 'Yapay Zeka', 'Mobil Uygulama Geliştirme'],
    'yazilim': ['Nesne Yönelimli Programlama', 'Yazılım Mimarisi', 'Yazılım Testi', 'DevOps Kültürü', 'Büyük Veri', 'Bulut Bilişim', 'Mikroservisler', 'İleri Web Programlama'],
    'ascilik': ['Temel Mutfak Bilgisi', 'Türk Mutfağı', 'Dünya Mutfakları', 'Pastacılık Teknikleri', 'Gıda Hijyeni', 'Menü Planlama', 'Yiyecek İçecek Maliyet Kontrolü', 'Soğuk Mutfak', 'Banket Yönetimi'],
    'adalet': ['Anayasa Hukuku', 'Medeni Hukuk', 'Ceza Hukuku', 'İdare Hukuku', 'Borçlar Hukuku', 'Ticaret Hukuku', 'Hukuk Başlangıcı', 'Kalem Mevzuatı'],
    'hukuk': ['Roma Hukuku', 'Anayasa Hukuku', 'Medeni Hukuk', 'Ceza Hukuku Genel Hükümler', 'Uluslararası Hukuk', 'İş Hukuku', 'Vergi Hukuku'],
    'tip': ['Anatomi', 'Fizyoloji', 'Histoloji', 'Biyokimya', 'Tıbbi Biyoloji', 'Patoloji', 'Farmakoloji', 'Dahiliye', 'Cerrahi'],
    'diec': ['Temel Tasarım', 'Teknik Resim', 'Malzeme Bilgisi', 'Ergonomi', 'Renk Teorisi', 'İç Mimari Proje', 'Bilgisayar Destekli Tasarım'],
    'isletme': ['Genel İşletme', 'Pazarlama İlkeleri', 'Yönetim ve Organizasyon', 'Finansal Muhasebe', 'İnsan Kaynakları Yönetimi', 'Üretim Yönetimi', 'Stratejik Yönetim'],
    'default': ['Akademik Türkçe', 'Yabancı Dil I', 'Yabancı Dil II', 'Atatürk İlkeleri ve İnkılap Tarihi', 'Kariyer Planlama', 'Bilgi Teknolojileri Kullanımı']
};

// --- Generators for new files ---

const generateObjectives = (courseName) => ({
    outcomes: [
        `${courseName} konusundaki temel kavramları tanımlayabilme.`,
        `Alanla ilgili problemleri analiz edip çözüm üretebilme.`,
        `Teorik bilgiyi pratik uygulamalara aktarabilme.`,
        `Disiplinler arası ilişki kurabilme.`
    ],
    competencies: [
        "Analitik Düşünme",
        "Problem Çözme",
        "Takım Çalışması",
        "İletişim Becerileri"
    ]
});

const generateBooks = (courseName) => ({
    textbooks: [
        {
            title: `${courseName} Temelleri`,
            author: "Prof. Dr. Yazar Adı",
            year: 2024,
            isbn: "978-605-1234-56-7",
            publisher: "Akademik Yayıncılık"
        }
    ],
    recommended: [
        {
            title: `Modern ${courseName} Yaklaşımları`,
            author: "Dr. Yazar İki",
            year: 2023,
            publisher: "Bilim Kitabevi"
        }
    ]
});

const generateSoftware = (keywords) => {
    let items = [];
    if (keywords.some(k => k.includes('bilgisayar') || k.includes('yazilim') || k.includes('tasarim'))) {
        items = [
            { name: "Visual Studio Code", version: "Latest", required: true, url: "https://code.visualstudio.com" },
            { name: "Git", version: "2.x", required: true, url: "https://git-scm.com" }
        ];
    } else {
        items = [
            { name: "Microsoft Office", version: "365", required: true, url: "https://office.com" },
            { name: "Adobe Acrobat Reader", version: "DC", required: false, url: "https://get.adobe.com/reader" }
        ];
    }
    return { items };
};

const generateGradingPolicy = () => ({
    rules: [
        "Devam zorunluluğu %70'tir.",
        "Ödevler zamanında teslim edilmelidir, geç teslimlerde günlük -10 puan uygulanır.",
        "Sınavlara itiraz süresi sonuçlar açıklandıktan sonra 3 gündür."
    ],
    scale: "Bağıl Değerlendirme Sistemi (Çan Eğrisi) uygulanmaktadır.",
    passingGrade: 50
});

const generateAnnouncements = (courseName) => ({
    items: [
        { id: "ann1", date: "2025-09-15", title: "Ders Kaynakları Hakkında", message: `${courseName} dersi için gerekli kaynaklar sisteme yüklenmiştir.` },
        { id: "ann2", date: "2025-09-10", title: "Ders Başlangıcı", message: "Derslerimiz belirtilen saat ve derslikte başlayacaktır. Hepinize başarılar dilerim." }
    ]
});

const generateWorkload = (ects) => {
    // 1 ECTS = ~25-30 hours. Let's say 25.
    const totalHours = ects * 25;
    const lectureHours = 14 * 3; // 14 weeks, 3 hours
    const remaining = totalHours - lectureHours;

    return {
        activities: [
            { name: "Ders Saati (14 hafta)", count: 14, duration: 3, total: lectureHours },
            { name: "Sınıf Dışı Çalışma", count: 14, duration: Math.floor(remaining / 28), total: Math.floor(remaining / 2) },
            { name: "Ara Sınav Hazırlık", count: 1, duration: Math.floor(remaining / 4), total: Math.floor(remaining / 4) },
            { name: "Final Sınavı Hazırlık", count: 1, duration: Math.floor(remaining / 4), total: Math.floor(remaining / 4) }
        ],
        totalWorkload: totalHours,
        ects: ects
    };
};

const generateFAQ = () => ({
    items: [
        { q: "Devam zorunluluğu var mı?", a: "Evet, teorik derslere %70 devam zorunluluğu vardır." },
        { q: "Sınav tarihleri ne zaman belli olur?", a: "Akademik takvime göre fakülte tarafından ilan edilecektir." },
        { q: "Kaynak kitap zorunlu mu?", a: "Hayır, ancak ders takibi için önerilmektedir." }
    ]
});

const generateStatistics = () => ({
    lastTerm: {
        average: randomInt(65, 85),
        passRate: randomInt(70, 95),
        topScore: randomInt(90, 100),
        distribution: {
            "AA": randomInt(5, 15),
            "BA": randomInt(10, 20),
            "BB": randomInt(20, 30),
            "CB": randomInt(15, 25),
            "CC": randomInt(10, 20),
            "FF": randomInt(0, 10)
        }
    }
});

const generateStaff = () => ({
    assistants: [
        { id: `RA-${randomInt(100, 999)}`, name: "Arş. Gör. Ali Veli", email: "aliveli@aydin.edu.tr", role: "Teaching Assistant" }
    ],
    lecturers: [] // In case of shared teaching
});

// --- Even MORE New Generators (Round 3) ---

const generateCareer = (programName) => {
    const sectors = programName.includes('bilgisayar') || programName.includes('yazilim') ? ["Bilgi Teknolojileri", "Ar-Ge", "Finans Teknolojileri"] : ["İlgili Sektör", "Akademi", "Kamu"];
    const titles = programName.includes('bilgisayar') ? ["Yazılım Geliştirici", "Sistem Analisti", "Veri Bilimci"] : ["Uzman", "Yönetici Adayı", "Danışman"];
    return {
        sectors: sectors,
        titles: titles,
        skills: ["Analitik Düşünme", "Takım Çalışması", "Proje Yönetimi", "Yabancı Dil"]
    };
};

const generateReviews = (courseName) => ({
    rating: (randomInt(35, 50) / 10).toFixed(1), // 3.5 - 5.0
    totalReviews: randomInt(10, 100),
    comments: [
        { user: "Öğrenci*** (Gizli)", comment: `${courseName} dersi alanıma çok katkı sağladı.`, date: "2024-01-15", rating: 5 },
        { user: "Ahmet Y.", comment: "Hocanın anlatımı çok akıcıydı, teşekkürler.", date: "2024-01-10", rating: 4 },
        { user: "Zeynep K.", comment: "Ödevler biraz zordu ama öğreticiydi.", date: "2023-12-28", rating: 4 }
    ]
});

const generateEquipment = (programName) => {
    let required = ["Laptop"];
    let provided = ["Kampüs Wi-Fi", "Kütüphane Erişimi"];

    if (programName.includes('ascilik')) {
        required = ["Şef Bıçağı Seti", "Önlük", "Kaydırmaz Ayakkabı"];
        provided = ["Endüstriyel Mutfak", "Temel Malzemeler"];
    } else if (programName.includes('tasarim') || programName.includes('mimari')) {
        required = ["Çizim Tableti", "Eskiz Defteri", "Marker Seti"];
        provided = ["Çizim Masası", "Atölye"];
    }

    return { required, provided };
};

const generateEvents = (courseName) => ({
    upcoming: [
        {
            id: "evt1",
            title: `Sektörden Konuk: ${courseName} Uygulamaları`,
            date: "2025-11-05",
            time: "14:00",
            location: "Konferans Salonu A",
            description: "Alanında uzman konuşmacılarla söyleşi."
        }
    ],
    past: [
        {
            id: "evt2",
            title: `${courseName} Proje Sergisi`,
            date: "2024-05-20",
            location: "Fuaye Alanı"
        }
    ]
});

// Generate realistic syllabus (Enhanced)
const generateSyllabus = (courseName) => {
    return {
        weeks: Array.from({ length: 14 }, (_, i) => ({
            week: i + 1,
            topic: `${courseName} - Hafta ${i + 1} Konusu`,
            method: i % 2 === 0 ? "Yüz Yüze Anlatım" : "Uygulama / Tartışma",
            materials: [`Hafta-${i + 1}-Sunum.pdf`, `Ders-Notlari-${i + 1}.pdf`],
            readings: [`Ders Kitabı Bölüm ${i + 1}`, `Makale ${i + 1}`],
            assignments: i % 4 === 3 ? [`Quiz ${Math.ceil((i + 1) / 4)}`] : [],
            outcomes: [`Bu hafta ${courseName} ile ilgili temel kavramlar öğrenilecek.`]
        }))
    };
};

// Generate assignments
const generateAssignments = () => {
    return {
        items: [
            { id: "vize", title: "Ara Sınav (Vize)", type: "Exam", weight: 40, dueDate: "2025-11-20" },
            { id: "final", title: "Final Sınavı", type: "Exam", weight: 60, dueDate: "2026-01-15" },
            { id: "odev1", title: "Proje Ödevi 1", type: "Homework", weight: 0, dueDate: "2025-12-01", description: "Ders içi uygulama." }
        ]
    };
};

// Generate Resources
const generateResources = (courseCode) => {
    return {
        categories: [
            {
                id: "lectures",
                name: "Ders Sunumları",
                files: [
                    { id: "s1", name: "Hafta 1 Sunum.pptx", type: "pptx", url: "#", size: "3.2 MB", date: "2025-09-20", format: "Presentation" },
                    { id: "s2", name: "Hafta 2 Sunum.pptx", type: "pptx", url: "#", size: "4.1 MB", date: "2025-09-27", format: "Presentation" }
                ]
            },
            {
                id: "refs",
                name: "Kaynaklar",
                files: [
                    { id: "r1", name: "Ders Kitabı.pdf", type: "pdf", url: "#", size: "12.5 MB", date: "2025-09-15", format: "PDF" }
                ]
            }
        ]
    };
};

function generateCoursesForProgram(facultyPath, programDir) {
    const programPath = path.join(facultyPath, programDir);
    const coursesPath = path.join(programPath, 'courses');

    if (!fs.existsSync(coursesPath)) {
        fs.mkdirSync(coursesPath, { recursive: true });
    }

    // Determine keywords based on program name
    const programName = programDir.replace(/-/g, ' ');
    let keywords = COURSE_PATTERNS['default']; // Always include default courses

    for (const [key, courses] of Object.entries(COURSE_PATTERNS)) {
        if (programName.includes(key)) {
            keywords = [...keywords, ...courses];
        }
    }

    // If no specific match, add some generic ones + defaults
    if (keywords.length === COURSE_PATTERNS['default'].length) {
        keywords = [...keywords, `Giriş: ${programName}`, `${programName} Temelleri`, `İleri ${programName}`, `${programName} Uygulamaları`];
    }

    const uniqueCodes = new Set();
    const prefix = programDir.substring(0, 3).toUpperCase();

    let generatedCount = 0;

    keywords.forEach((courseName, index) => {
        const semester = (index % 8) + 1; // 1 to 8
        const year = Math.ceil(semester / 2);

        // Generate code: Odd semesters get odd numbers (101, 103), Even get even (102, 104)
        // This prevents 101 being in Semester 2
        const codeOffset = Math.floor(index / 8) * 2 + (semester % 2 === 1 ? 1 : 2);
        // Ensure strictly 3 digits
        const courseNumber = year * 100 + (codeOffset % 100);
        const courseCode = `${prefix}${courseNumber}`;

        if (uniqueCodes.has(courseCode)) return;
        uniqueCodes.add(courseCode);

        const courseDir = path.join(coursesPath, courseCode);
        if (!fs.existsSync(courseDir)) {
            fs.mkdirSync(courseDir, { recursive: true });
        }

        // 1. Metadata (Enhanced)
        const capacity = randomItem([40, 50, 60, 80, 100]);
        // Prereq logic: Year 2+ courses might require Year 1 courses
        const prerequisites = [];
        if (year > 1) {
            // Require the 101 course of this program
            prerequisites.push(`${prefix}101`);
        }

        const ects = randomInt(3, 8);

        const metadata = {
            id: courseCode,
            code: courseCode,
            name: courseName,
            department: programName,
            language: "TR",
            type: index < 5 ? "Zorunlu" : "Seçmeli",
            level: "Lisans",
            mode: "Yüz Yüze", // New: Delivery Mode
            credits: {
                ects: ects,
                local: randomInt(2, 4),
                theory: 3,
                practice: randomInt(0, 2)
            },
            semester: semester,
            instructor: {
                id: `AC-${randomInt(1000, 9999)}`,
                name: "Dr. Öğr. Üyesi Örnek Hoca"
            },
            description: `${courseName} dersi, öğrencilere alanın temel yetkinliklerini kazandırmayı amaçlar.`,
            schedule: [
                { day: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"][randomInt(0, 4)], startTime: "09:00", endTime: "11:50", classroom: randomItem(LOCATIONS) }
            ],
            capacity: capacity,
            enrolledCount: randomInt(Math.floor(capacity / 2), capacity),
            prerequisites: prerequisites,
            tags: ["Ana Ders", "Teorik", programName.split(' ')[0]] // New: Tags
        };

        fs.writeFileSync(path.join(courseDir, 'metadata.json'), JSON.stringify(metadata, null, 2));

        // 2. Syllabus
        fs.writeFileSync(path.join(courseDir, 'syllabus.json'), JSON.stringify(generateSyllabus(courseName), null, 2));

        // 3. Assignments
        fs.writeFileSync(path.join(courseDir, 'assignments.json'), JSON.stringify(generateAssignments(), null, 2));

        // 4. Resources
        fs.writeFileSync(path.join(courseDir, 'resources.json'), JSON.stringify(generateResources(courseCode), null, 2));

        // 5. New Expanded Files
        fs.writeFileSync(path.join(courseDir, 'objectives.json'), JSON.stringify(generateObjectives(courseName), null, 2));
        fs.writeFileSync(path.join(courseDir, 'books.json'), JSON.stringify(generateBooks(courseName), null, 2));
        fs.writeFileSync(path.join(courseDir, 'software.json'), JSON.stringify(generateSoftware([programName]), null, 2));
        fs.writeFileSync(path.join(courseDir, 'grading_policy.json'), JSON.stringify(generateGradingPolicy(), null, 2));
        fs.writeFileSync(path.join(courseDir, 'announcements.json'), JSON.stringify(generateAnnouncements(courseName), null, 2));

        // 6. Even MORE New Files
        fs.writeFileSync(path.join(courseDir, 'workload.json'), JSON.stringify(generateWorkload(ects), null, 2));
        fs.writeFileSync(path.join(courseDir, 'faq.json'), JSON.stringify(generateFAQ(), null, 2));
        fs.writeFileSync(path.join(courseDir, 'statistics.json'), JSON.stringify(generateStatistics(), null, 2));
        fs.writeFileSync(path.join(courseDir, 'staff.json'), JSON.stringify(generateStaff(), null, 2));

        // 7. AND EVEN MORE NEW FILES (Round 3)
        fs.writeFileSync(path.join(courseDir, 'career.json'), JSON.stringify(generateCareer(programName), null, 2));
        fs.writeFileSync(path.join(courseDir, 'reviews.json'), JSON.stringify(generateReviews(courseName), null, 2));
        fs.writeFileSync(path.join(courseDir, 'equipment.json'), JSON.stringify(generateEquipment(programName), null, 2));
        fs.writeFileSync(path.join(courseDir, 'events.json'), JSON.stringify(generateEvents(courseName), null, 2));

        generatedCount++;
    });

    return generatedCount;
}

function main() {
    console.log("Starting Course Generation (ULTRA MAX Detail Mode)...");

    if (!fs.existsSync(RECORDS_ROOT)) {
        console.error("Records root not found at: " + RECORDS_ROOT);
        return;
    }

    const faculties = fs.readdirSync(RECORDS_ROOT).filter(f => fs.statSync(path.join(RECORDS_ROOT, f)).isDirectory());
    let totalCourses = 0;

    faculties.forEach(faculty => {
        if (faculty === 'metadata') return; // Skip metadata folder
        const facultyPath = path.join(RECORDS_ROOT, faculty);
        const programs = fs.readdirSync(facultyPath).filter(f => fs.statSync(path.join(facultyPath, f)).isDirectory());

        programs.forEach(program => {
            if (program === 'dean.json') return;
            // console.log(`Generating courses for ${faculty}/${program}...`);
            const count = generateCoursesForProgram(facultyPath, program);
            totalCourses += count;
        });
    });

    console.log(`\nSuccess! Generated and enriched total ${totalCourses} courses across all programs with ULTRA MAX DETAIL.`);
}

main();
