const fs = require('fs');
const path = require('path');

const RECORDS_ROOT = path.join(__dirname, '../client/src/data/records/faculties');

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const randomBool = (prob = 0.5) => Math.random() < prob;

// --- Generators ---

function generateLabReservations() {
    const reservations = [];
    const resources = ["3D Printer A", "Laser Cutter", "Recording Studio", "Chemistry Bench 4", "VR Headset"];

    for (let i = 0; i < randomInt(0, 3); i++) {
        reservations.push({
            id: randomInt(1000, 9999),
            resource: randomItem(resources),
            date: `2026-0${randomInt(2, 4)}-${randomInt(1, 28)}`,
            time: `${randomInt(9, 16)}:00-${randomInt(10, 17)}:00`,
            status: randomBool(0.8) ? "Confirmed" : "Pending"
        });
    }
    return { reservations };
}

function generatePrintLogs() {
    const logs = [];
    const files = ["Thesis_Draft.pdf", "Lab_Report_1.docx", "Project_Specs.pdf", "Resume.pdf", "Lecture_Notes.ppt"];

    for (let i = 0; i < randomInt(1, 10); i++) {
        logs.push({
            file: randomItem(files),
            pages: randomInt(1, 50),
            color: randomBool(0.2), // 20% color
            date: `2026-0${randomInt(1, 2)}-${randomInt(1, 28)} ${randomInt(8, 18)}:${randomInt(10, 59)}`
        });
    }
    // Calculate totals
    const totalPages = logs.reduce((acc, log) => acc + log.pages, 0);
    return { logs, quotaUsed: totalPages };
}

function generateEcoFootprint() {
    const transportScore = randomInt(50, 100);
    const paperScore = randomInt(60, 90);
    const dietScore = randomInt(40, 90);
    const total = (transportScore + paperScore + dietScore) * 3; // Max ~900

    return {
        carbonScore: total,
        metrics: {
            transport: randomItem(["Shuttle", "Public Transit", "Private Car", "Bike"]),
            paper: total > 700 ? "Low" : "High",
            diet: randomItem(["Mixed", "Vegetarian", "Vegan"]),
            energy: "Standard Dorm Usage"
        },
        ranking: total > 800 ? "Top 10%" : "Average",
        badges: total > 800 ? ["Eco Warrior"] : []
    };
}

function generateClubRanking() {
    const clubs = [];
    const clubList = ["Robotics", "Dance", "Debate", "Esports", "Music", "Cinema"];

    for (let i = 0; i < randomInt(1, 3); i++) {
        clubs.push({
            name: randomItem(clubList),
            role: randomBool(0.1) ? "Board Member" : "Member",
            contributionPoints: randomInt(50, 500),
            eventsAttended: randomInt(2, 12),
            joinedDate: `202${randomInt(3, 5)}-09-15`
        });
    }
    return { clubs };
}

function generateCodingActivity() {
    // Only meaningful for engineering/CS, but we'll generate broadly for now or random
    const isActive = randomBool(0.6);
    if (!isActive) return { commits: 0, repositories: 0, languages: {}, streak: 0 };

    return {
        commits: randomInt(50, 800),
        repositories: randomInt(2, 20),
        languages: {
            JavaScript: `${randomInt(20, 50)}%`,
            Python: `${randomInt(20, 40)}%`,
            HTML: `${randomInt(10, 20)}%`
        },
        streak: randomInt(0, 45),
        lastCommit: "2026-02-14"
    };
}

function generateWifiSessions() {
    const sessions = [];
    const locations = ["Library 2nd Floor", "Dormitory", "Cafeteria", "Student Center", "Computer Lab"];

    for (let i = 0; i < randomInt(3, 8); i++) {
        sessions.push({
            location: randomItem(locations),
            duration: `${randomInt(1, 5)}h ${randomInt(0, 59)}m`,
            data: `${randomFloat(0.1, 5.5)}GB`,
            device: randomItem(["Laptop", "Phone"]),
            date: `2026-02-${randomInt(1, 14)}`
        });
    }
    return { sessions };
}


function enrichStudent(studentDir) {
    if (!fs.existsSync(studentDir)) return;

    fs.writeFileSync(path.join(studentDir, 'lab_reservations.json'), JSON.stringify(generateLabReservations(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'print_logs.json'), JSON.stringify(generatePrintLogs(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'eco_footprint.json'), JSON.stringify(generateEcoFootprint(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'club_ranking.json'), JSON.stringify(generateClubRanking(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'coding_activity.json'), JSON.stringify(generateCodingActivity(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'wifi_sessions.json'), JSON.stringify(generateWifiSessions(), null, 2));
}

function main() {
    console.log("Starting Deep Campus Integration Data Enrichment (V4)...");

    if (!fs.existsSync(RECORDS_ROOT)) {
        console.error("Records root not found.");
        return;
    }

    const faculties = fs.readdirSync(RECORDS_ROOT).filter(f => fs.statSync(path.join(RECORDS_ROOT, f)).isDirectory());
    let count = 0;

    faculties.forEach(faculty => {
        if (faculty === 'metadata') return;
        const facultyPath = path.join(RECORDS_ROOT, faculty);
        const programs = fs.readdirSync(facultyPath).filter(f => fs.statSync(path.join(facultyPath, f)).isDirectory());

        programs.forEach(program => {
            if (program === 'dean.json') return;
            const studentsPath = path.join(facultyPath, program, 'students');
            if (fs.existsSync(studentsPath)) {
                const students = fs.readdirSync(studentsPath).filter(f => fs.statSync(path.join(studentsPath, f)).isDirectory());
                students.forEach(studentId => {
                    enrichStudent(path.join(studentsPath, studentId));
                    count++;
                });
            }
        });
    });

    console.log(`\nSuccess! Enriched ${count} students with 6 new Deep Integration files.`);
}

main();
