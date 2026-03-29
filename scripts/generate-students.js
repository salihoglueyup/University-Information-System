
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../client/src/data/records');
const metadataDir = path.join(rootDir, 'metadata');

// --- DATA POOLS ---
const firstNames = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Hasan", "İbrahim", "İsmail", "Osman", "Yusuf", "Murat", "Ömer", "Ramazan", "Halil", "Süleyman", "Ayşe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif", "Meryem", "Şerife", "Zehra", "Sultan", "Hanife", "Merve", "Havva", "Zeliha", "Esra"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt", "Özkan", "Şimşek"];
const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Şanlıurfa", "Kocaeli"];
const streets = ["Atatürk Cad.", "Cumhuriyet Cad.", "İnönü Cad.", "Fatih Sultan Mehmet Cad.", "Bağdat Cad.", "İstiklal Cad."];
const hobbies = ["Coding", "Photography", "Hiking", "Gaming", "Music", "Reading", "Swimming", "Chess"];
const skills = ["Python", "JavaScript", "React", "Node.js", "Java", "C++", "SQL", "Git", "Docker", "AWS"];
const clubs = ["Software Club", "Photography Club", "Dance Club", "Music Club", "Robotics Club", "Entrepreneurship Club", "Debate Club"];
const carModels = ["Fiat Egea", "Renault Clio", "Ford Focus", "Toyota Corolla", "Honda Civic", "Volkswagen Golf"];

// --- HELPERS ---
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomDate(startYear, endYear) {
    const year = randomInt(startYear, endYear);
    const month = randomInt(1, 12).toString().padStart(2, '0');
    const day = randomInt(1, 28).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function generateStudentId(year, deptId, index) {
    const deptCode = deptId.split('-')[1].padStart(3, '0');
    const idx = index.toString().padStart(3, '0');
    return `B${year.toString().slice(2)}${deptCode}${idx}`;
}

// --- GENERATORS ---
// ... (Previous generators remain same, adding new ones)

function generateProfile(id, firstName, lastName) {
    const rawName = `${firstName} ${lastName}`;
    const cleanName = rawName.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '');

    return {
        id: id,
        username: cleanName,
        password: "123", // Default password for testing
        fullName: rawName,
        email: `${cleanName}@stu.aydin.edu.tr`,
        avatar: `https://i.pravatar.cc/150?u=${id}`,
        status: "Aktif Öğrenci",
        contact: {
            phone: `05${randomInt(30, 55)} ${randomInt(100, 999)} ${randomInt(10, 99)} ${randomInt(10, 99)}`,
            address: `${randomItem(cities)}, ${randomItem(streets)} No:${randomInt(1, 100)}`,
            personalEmail: `${cleanName}@gmail.com`,
            emergencyContact: `Veli - 0532 555 00 00`
        },
        personal: {
            tcNo: `${randomInt(10000000000, 99999999999)}`,
            birthDate: `${randomDate(2000, 2005)}`,
            birthPlace: randomItem(cities),
            nationality: "T.C."
        }
    };
}

function generateAcademic(dept, faculty, gpa) {
    const credits = Math.floor(gpa * 30) + 30;
    return {
        department: dept.name,
        faculty: faculty.name,
        gpa: gpa.toFixed(2),
        semester: randomInt(1, 8),
        totalCredits: 240,
        completedCredits: credits,
        registrationDate: `${randomDate(2021, 2024)}`,
        advisor: `Dr. Öğr. Üyesi ${randomItem(firstNames)} ${randomItem(lastNames)}`,
        programInfo: {
            language: dept.name.includes("İngilizce") || dept.name.includes("(İng") ? "İngilizce" : "Türkçe",
            degreeLevel: "Lisans",
            educationType: "Örgün Öğretim"
        }
    };
}

function generateFinance() {
    const total = 140000;
    const paid = randomItem([0, 35000, 70000, 140000]);
    return {
        tuition: {
            totalAmount: `${total.toLocaleString('tr-TR')} ₺`,
            scholarship: randomItem(["Tam Burslu", "%50 Burslu", "%25 Burslu", "Burssuz"]),
            paidAmount: `${paid.toLocaleString('tr-TR')} ₺`,
            remainingAmount: `${(total - paid).toLocaleString('tr-TR')} ₺`,
            nextInstallment: "2026-03-01"
        },
        installments: [
            { id: 1, term: "2025-2026 Güz", amount: "70.000 ₺", status: "Ödendi", date: "2025-09-01" },
            { id: 2, term: "2025-2026 Bahar", amount: "70.000 ₺", status: paid === 140000 ? "Ödendi" : "Ödenmedi", date: "2026-02-01" }
        ]
    };
}

function generateSocialTranscript() {
    const points = randomInt(0, 500);
    const level = points > 400 ? "Diamond" : points > 300 ? "Platinum" : points > 200 ? "Gold" : points > 100 ? "Silver" : "Bronze";

    return {
        totalPoints: points,
        level: level,
        badges: [
            { id: 1, name: "Aktif Üye", date: "2025-10-10", icon: "award" },
            { id: 2, name: "Gönüllü", date: "2024-05-15", icon: "heart" }
        ],
        activities: [
            { id: 101, category: "Sosyal Sorumluluk", name: "Kampüs Temizlik Günü", date: "2025-09-20", points: 20, status: "Onaylandı" },
            { id: 102, category: "Kültür & Sanat", name: "Tiyatro Gösterisi", date: "2025-11-05", points: 15, status: "Onaylandı" }
        ],
        clubs: [
            { id: 1, name: randomItem(clubs), role: randomItem(["Başkan", "Üye", "Yönetim Kurulu"]), joinDate: "2023-10-01" }
        ]
    };
}

function generateCareer() {
    return {
        cv: {
            summary: "I am a passionate student looking for opportunities.",
            skills: [randomItem(skills), randomItem(skills), randomItem(skills)],
            languages: ["Turkish (Native)", "English (B2)"],
            hobbies: [randomItem(hobbies), randomItem(hobbies)]
        },
        internships: [
            { company: "Tech Corp", position: "Software Intern", startDate: "2024-06-01", endDate: "2024-07-01", status: "Tamamlandı" }
        ],
        jobApplications: [
            { id: 1, title: "Frontend Developer Intern", company: "StartUp Inc", status: "Değerlendiriliyor", date: "2026-01-15" }
        ]
    };
}

function generateProjects() {
    return {
        thesis: {
            title: "Yapay Zeka Destekli Eğitim Sistemleri",
            advisor: "Prof. Dr. Ahmet Yılmaz",
            status: "Devam Ediyor",
            description: "Eğitimde kişiselleştirilmiş öğrenme rotaları oluşturan bir sistem.",
            milestones: [
                { id: 1, title: "Literatür Taraması", status: "Tamamlandı", date: "2025-10-15" },
                { id: 2, title: "Veri Toplama", status: "Devam Ediyor", date: "2026-02-01" }
            ]
        },
        assignments: [
            { id: 1, course: "Web Programlama", title: "E-Ticaret Sitesi", dueDate: "2026-05-20", status: "Bekliyor" }
        ]
    };
}

function generateLibrary() {
    return {
        loans: [
            { bookId: 101, title: "Clean Code", author: "Robert C. Martin", borrowDate: "2026-01-10", dueDate: "2026-02-10", status: "Teslim Edildi" },
            { bookId: 102, title: "Introduction to Algorithms", author: "Cormen", borrowDate: "2026-02-05", dueDate: "2026-03-05", status: "Okunuyor" }
        ],
        reservations: [],
        debts: 0
    };
}

function generateHealth() {
    return {
        bloodGroup: randomItem(["A Rh+", "A Rh-", "B Rh+", "B Rh-", "0 Rh+", "0 Rh-", "AB Rh+"]),
        appointments: [
            { id: 1, clinic: "Diş Hekimliği", doctor: "Dr. Ayşe Ozan", date: "2025-12-10", time: "14:00", status: "Tamamlandı" }
        ],
        reports: [
            { id: 1, diagnosis: "Grip", start: "2025-01-05", end: "2025-01-08", days: 3, status: "Onaylandı" }
        ]
    };
}

function generateDocuments() {
    return {
        requests: [
            { id: 1, type: "Öğrenci Belgesi", date: "2026-01-20", status: "Hazır", downloadUrl: "#" },
            { id: 2, type: "Transkript", date: "2025-06-15", status: "Hazır", downloadUrl: "#" }
        ]
    };
}

// --- NEW DATA GENERATORS ---

function generateSettings() {
    // 5% chance of being a Student Assistant (Teaching Assistant)
    const isAssistant = Math.random() < 0.05;
    const roles = ["student"];
    if (isAssistant) roles.push("teaching_assistant");

    return {
        theme: randomItem(["system", "light", "dark"]),
        language: "tr",
        notifications: {
            email: true,
            sms: Math.random() > 0.5,
            push: true
        },
        roles: roles,
        privacy: {
            showGpa: Math.random() > 0.5,
            showSocial: true
        }
    };
}

function generateHousing() {
    // 30% chance of staying in dorm
    if (Math.random() > 0.3) return { type: "Off-Campus", status: "Inactive" };

    return {
        type: "Dormitory",
        dormName: randomItem(["Block A - Boys", "Block B - Boys", "Block C - Girls", "Block D - Girls"]),
        roomNumber: randomInt(100, 400).toString(),
        bedNumber: randomInt(1, 3).toString(),
        checkIn: "2025-09-01",
        status: "Active"
    };
}

function generateTransport() {
    const hasCar = Math.random() < 0.2;
    return {
        shuttleRoute: randomItem(["Avcılar - Campus", "Bakırköy - Campus", "Beylikdüzü - Campus", "None"]),
        cardId: `TR-${randomInt(100000, 999999)}`,
        vehicle: hasCar ? {
            plate: `34 ${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))} ${randomInt(100, 999)}`,
            model: randomItem(carModels),
            permit: "Student Parking B"
        } : null
    };
}

// --- MAIN ---
async function generate() {
    console.log("🚀 Starting Comprehensive Data Generation...");

    if (!fs.existsSync(metadataDir)) {
        console.error("❌ Metadata directory not found! Run scaffold-data.js first.");
        return;
    }

    const faculties = JSON.parse(fs.readFileSync(path.join(metadataDir, 'faculties.json')));
    const departments = JSON.parse(fs.readFileSync(path.join(metadataDir, 'departments.json')));

    console.log(`Found ${departments.length} departments.`);

    let totalStudents = 0;

    // Process batches to avoid blocking too long (conceptually)
    for (const dept of departments) {
        const faculty = faculties.find(f => f.id === dept.facultyId);
        const deptDir = path.join(rootDir, 'faculties', faculty.slug, dept.slug, 'students');

        if (!fs.existsSync(deptDir)) {
            fs.mkdirSync(deptDir, { recursive: true });
        }

        console.log(`Generating students for ${dept.name}...`);

        for (let i = 0; i < 100; i++) {
            const firstName = randomItem(firstNames);
            const lastName = randomItem(lastNames);
            const year = randomInt(20, 24);
            const studentId = generateStudentId(year, dept.id, i + 100);
            const gpa = (Math.random() * 2) + 2;

            const studentDir = path.join(deptDir, studentId);
            if (!fs.existsSync(studentDir)) fs.mkdirSync(studentDir);

            // Core Data
            fs.writeFileSync(path.join(studentDir, 'profile.json'), JSON.stringify(generateProfile(studentId, firstName, lastName), null, 2));
            fs.writeFileSync(path.join(studentDir, 'academic.json'), JSON.stringify(generateAcademic(dept, faculty, gpa), null, 2));
            fs.writeFileSync(path.join(studentDir, 'finance.json'), JSON.stringify(generateFinance(), null, 2));

            // Expanded Data
            fs.writeFileSync(path.join(studentDir, 'socialTranscript.json'), JSON.stringify(generateSocialTranscript(), null, 2));
            fs.writeFileSync(path.join(studentDir, 'career.json'), JSON.stringify(generateCareer(), null, 2));
            fs.writeFileSync(path.join(studentDir, 'projects.json'), JSON.stringify(generateProjects(), null, 2));
            fs.writeFileSync(path.join(studentDir, 'library.json'), JSON.stringify(generateLibrary(), null, 2));
            fs.writeFileSync(path.join(studentDir, 'health.json'), JSON.stringify(generateHealth(), null, 2));
            fs.writeFileSync(path.join(studentDir, 'documents.json'), JSON.stringify(generateDocuments(), null, 2));

            // New Modules (Role, Housing, Transport)
            fs.writeFileSync(path.join(studentDir, 'settings.json'), JSON.stringify(generateSettings(), null, 2));
            fs.writeFileSync(path.join(studentDir, 'housing.json'), JSON.stringify(generateHousing(), null, 2));
            fs.writeFileSync(path.join(studentDir, 'transport.json'), JSON.stringify(generateTransport(), null, 2));

            totalStudents++;
        }
    }

    console.log(`✅ Generation Complete! Created ${totalStudents} student records with comprehensive data.`);
}

generate();
