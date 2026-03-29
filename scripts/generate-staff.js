
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../client/src/data/records');
const metadataDir = path.join(rootDir, 'metadata');

// --- POOLS ---
const firstNames = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Cengiz", "Can", "Volkan", "Emre", "Murat", "Ömer", "Halil", "Süleyman", "Ayşe", "Fatma", "Emine", "Hatice", "Zeynep", "Elif", "Bahar", "Derya", "Selin", "Pelin", "Burcu"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Koç", "Kurt", "Özkan", "Şimşek", "Polat", "Erdoğan"];
const researchInterests = ["Artificial Intelligence", "Machine Learning", "Data Mining", "Cyber Security", "Software Engineering", "Cloud Computing", "IoT", "Blockchain", "Computer Vision", "NLP"];
const paperTitles = ["Analysis of Deep Learning Models", "Review of IoT Security", "Blockchain in Education", "Smart City Algorithms", "Cloud Architecture Patterns", "Data Privacy in Big Data"];
const universities = ["İTÜ", "ODTÜ", "Boğaziçi Üniversitesi", "Yıldız Teknik Üniversitesi", "İstanbul Üniversitesi", "Sabancı Üniversitesi", "Koç Üniversitesi", "Bilkent Üniversitesi"];
const awardsList = ["Best Paper Award", "Young Scientist Award", "Excellence in Teaching", "Research Grant"];
const certifications = ["AWS Certified Solutions Architect", "Google Cloud Professional", "PMP", "Cisco CCNP", "Microsoft Azure Fundamentals"];

const titles = {
    dean: "Prof. Dr.",
    prof: "Prof. Dr.",
    assocProf: "Doç. Dr.",
    assistProf: "Dr. Öğr. Üyesi",
    resAssist: "Arş. Gör."
};

// --- HELPERS ---
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateStaffId(role, deptId, index) {
    const roleCode = role === 'Dean' || role === 'Professor' ? 1 : role === 'Research Assistant' ? 3 : 2;
    const deptSuffix = deptId ? deptId.slice(-3) : '000';
    return `AC${deptSuffix}${roleCode}${index.toString().padStart(3, '0')}`;
}

// --- GENERATORS ---

function generateProfile(id, role, title, firstName, lastName, facultyName, deptName) {
    const rawName = `${firstName} ${lastName}`;
    const cleanName = rawName.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '');

    return {
        id: id,
        username: cleanName,
        password: "123", // Default password for testing
        title: title,
        name: rawName,
        fullName: `${title} ${rawName}`,
        role: role,
        department: deptName,
        faculty: facultyName,
        email: `${cleanName}@aydin.edu.tr`,
        phone: `+90 212 444 1 444`,
        mobile: `05${randomInt(30, 59)} ${randomInt(100, 999)} ${randomInt(10, 99)} ${randomInt(10, 99)}`,
        office: `${randomItem(['A', 'B', 'C', 'D'])} Blok - Oda ${randomInt(100, 500)}`,
        avatar: `https://i.pravatar.cc/150?u=${id}`,
        links: {
            googleScholar: `https://scholar.google.com/citations?user=${id}`,
            linkedin: `https://linkedin.com/in/${cleanName}`,
            researchGate: `https://researchgate.net/profile/${firstName}-${lastName}`
        }
    };
}

function generateSchedule() {
    return {
        officeHours: [
            { day: "Salı", start: "13:00", end: "15:00", location: "Ofis" },
            { day: "Perşembe", start: "10:00", end: "12:00", location: "Online (Zoom)" }
        ],
        teachingLoad: randomInt(6, 15),
        weeklySchedule: [
            { day: "Pazartesi", time: "09:00 - 12:00", course: "Lecture", location: "D-201" },
            { day: "Çarşamba", time: "14:00 - 17:00", course: "Lab", location: "Lab-3" }
        ]
    };
}

function generateResearch(role) {
    const isProf = role.includes("Prof");
    const paperCount = isProf ? randomInt(10, 50) : randomInt(1, 5);

    const papers = [];
    for (let i = 0; i < paperCount; i++) {
        papers.push({
            title: randomItem(paperTitles),
            year: randomInt(2015, 2025),
            citation: "IEEE Trans. on Computers, Vol. " + randomInt(10, 50),
            doi: `10.1109/TC.202${randomInt(0, 5)}.${randomInt(1000, 9999)}`
        });
    }

    return {
        interests: [randomItem(researchInterests), randomItem(researchInterests), randomItem(researchInterests)],
        stats: {
            publishedPapers: paperCount,
            projects: isProf ? randomInt(2, 10) : randomInt(0, 2),
            citations: isProf ? randomInt(100, 2000) : randomInt(0, 50),
            hIndex: isProf ? randomInt(5, 20) : randomInt(0, 3)
        },
        papers: papers,
        projects: [
            { title: "TÜBİTAK 1001 Project", role: "Principal Investigator", status: "Completed", budget: "500.000 TL" },
            { title: "EU Horizon 2020", role: "Researcher", status: "Ongoing", budget: "2.000.000 EUR" }
        ]
    };
}

function generateAdministrative(role) {
    const committees = [];
    if (role === 'Dean') committees.push("Faculty Board", "University Senate", "Strategic Planning Committee");
    if (role.includes("Prof")) committees.push("Ethics Committee", "Graduate School Board");

    return {
        committees: committees,
        duties: role === 'Dean' ? ["Dean"] : ["Member", "Advisor"],
        startDate: "2020-09-01",
        endDate: null
    };
}

function generateQualifications(role) {
    const degrees = [
        { level: "Lisans", field: randomItem(["Bilgisayar Mühendisliği", "Elektrik Mühendisliği", "Matematik"]), university: randomItem(universities), year: randomInt(2005, 2010) },
        { level: "Yüksek Lisans", field: "Bilgisayar Bilimleri", university: randomItem(universities), year: randomInt(2010, 2012) }
    ];

    if (role.includes("Prof") || role.includes("Dr")) {
        degrees.push({ level: "Doktora", field: "Yapay Zeka", university: randomItem(universities), year: randomInt(2013, 2016) });
    }

    return {
        degrees: degrees,
        languages: ["English (C1)", "German (B2)", "Turkish (Native)"],
        certifications: [randomItem(certifications), randomItem(certifications)]
    };
}

function generateAwards(role) {
    if (!role.includes("Prof") && Math.random() > 0.3) return { awards: [] };

    return {
        awards: [
            { title: randomItem(awardsList), organization: "IEEE", year: randomInt(2020, 2024) },
            { title: "Best Paper", organization: "Conference on AI", year: randomInt(2018, 2023) }
        ]
    };
}

function generatePerformance() {
    return {
        reviews: [
            { year: 2024, score: randomInt(85, 100), comment: "Excellent research output and teaching performance." },
            { year: 2023, score: randomInt(80, 95), comment: "Good progress on projects." }
        ]
    };
}

function generateAdvisees() {
    // Determine number of advisees based on mock random
    const count = randomInt(5, 20);
    const studentIds = [];
    for (let i = 0; i < count; i++) {
        studentIds.push(`B21${randomInt(10, 99)}00${randomInt(10, 99)}`);
    }
    return {
        studentIds: studentIds
    };
}

// --- MAIN ---
async function generate() {
    console.log("🚀 Starting Enhanced Staff Generation V2...");

    if (!fs.existsSync(metadataDir)) {
        console.error("❌ Metadata directory not found!");
        return;
    }

    const faculties = JSON.parse(fs.readFileSync(path.join(metadataDir, 'faculties.json')));
    const departments = JSON.parse(fs.readFileSync(path.join(metadataDir, 'departments.json')));

    let totalStaff = 0;

    for (const faculty of faculties) {
        const facultyDir = path.join(rootDir, 'faculties', faculty.slug);

        // 1. Generate Dean 
        const deanId = `ACFAC001`;
        const deanDir = path.join(facultyDir, 'management', 'dean');
        if (!fs.existsSync(deanDir)) fs.mkdirSync(deanDir, { recursive: true });

        const deanName = { first: randomItem(firstNames), last: randomItem(lastNames) };
        const deanRole = "Dean";

        // Generate Dean Files
        fs.writeFileSync(path.join(deanDir, 'profile.json'), JSON.stringify(generateProfile(deanId, deanRole, titles.dean, deanName.first, deanName.last, faculty.name, "Dean's Office"), null, 2));
        fs.writeFileSync(path.join(deanDir, 'schedule.json'), JSON.stringify(generateSchedule(), null, 2));
        fs.writeFileSync(path.join(deanDir, 'research.json'), JSON.stringify(generateResearch(deanRole), null, 2));
        fs.writeFileSync(path.join(deanDir, 'administrative.json'), JSON.stringify(generateAdministrative(deanRole), null, 2));
        fs.writeFileSync(path.join(deanDir, 'qualifications.json'), JSON.stringify(generateQualifications(deanRole), null, 2));
        fs.writeFileSync(path.join(deanDir, 'awards.json'), JSON.stringify(generateAwards(deanRole), null, 2));
        fs.writeFileSync(path.join(deanDir, 'performance.json'), JSON.stringify(generatePerformance(), null, 2));
        // Deans might not advise specific students directly in this model, or they might. Let's skip advisees for Dean for now to keep it simple or add if needed.

        totalStaff++;

        // Filter departments for this faculty
        const facultyDepts = departments.filter(d => d.facultyId === faculty.id);

        for (const dept of facultyDepts) {
            const deptDir = path.join(facultyDir, dept.slug);
            const staffRootDir = path.join(deptDir, 'staff');

            if (!fs.existsSync(staffRootDir)) {
                fs.mkdirSync(staffRootDir, { recursive: true });
            }

            const staffTypes = [
                { count: 2, role: "Professor", title: titles.prof },
                { count: 6, role: "Assistant Professor", title: titles.assistProf },
                { count: 12, role: "Research Assistant", title: titles.resAssist }
            ];

            let index = 0;
            for (const type of staffTypes) {
                for (let i = 0; i < type.count; i++) {
                    const id = generateStaffId(type.role, dept.id, index++);
                    const staffDir = path.join(staffRootDir, id);
                    if (!fs.existsSync(staffDir)) fs.mkdirSync(staffDir);

                    const name = { first: randomItem(firstNames), last: randomItem(lastNames) };

                    fs.writeFileSync(path.join(staffDir, 'profile.json'), JSON.stringify(generateProfile(id, type.role, type.title, name.first, name.last, faculty.name, dept.name), null, 2));
                    fs.writeFileSync(path.join(staffDir, 'schedule.json'), JSON.stringify(generateSchedule(), null, 2));
                    fs.writeFileSync(path.join(staffDir, 'research.json'), JSON.stringify(generateResearch(type.role), null, 2));
                    fs.writeFileSync(path.join(staffDir, 'administrative.json'), JSON.stringify(generateAdministrative(type.role), null, 2));

                    // New Modules
                    fs.writeFileSync(path.join(staffDir, 'qualifications.json'), JSON.stringify(generateQualifications(type.role), null, 2));
                    fs.writeFileSync(path.join(staffDir, 'awards.json'), JSON.stringify(generateAwards(type.role), null, 2));
                    fs.writeFileSync(path.join(staffDir, 'performance.json'), JSON.stringify(generatePerformance(), null, 2));
                    fs.writeFileSync(path.join(staffDir, 'advisees.json'), JSON.stringify(generateAdvisees(), null, 2));

                    totalStaff++;
                }
            }
        }
    }

    console.log(`✅ Staff Generation V2 Complete! Created ${totalStaff} staff records with detailed directory structure and robust data.`);
}

generate();
