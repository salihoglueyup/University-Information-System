const fs = require('fs');
const path = require('path');

const RECORDS_ROOT = path.join(__dirname, '../client/src/data/records/faculties');

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const randomBool = (prob = 0.5) => Math.random() < prob;

// --- Generators ---

function generateGamification() {
    const level = randomInt(5, 50);
    const xpCurrent = randomInt(0, 1000);
    const xpNext = 1000 + (level * 100);
    const titles = ["Campus Rookie", "Library Worm", "Social Butterfly", "Event Hunter", "Academic Star", "Campus Legend"];
    const title = titles[Math.min(Math.floor(level / 10), titles.length - 1)];

    return {
        level,
        xp: { current: xpCurrent, next: xpNext },
        title,
        badges: ["Early Bird", "Night Owl", "First A", "Club Leader"].filter(() => randomBool(0.3)),
        quests: [
            { title: "Visit Library 3 times this week", progress: randomInt(0, 3), total: 3, reward: 150 },
            { title: "Attend a Club Event", progress: randomInt(0, 1), total: 1, reward: 300 }
        ]
    };
}

function generateSocialConnections() {
    // In a real graph, we'd link actual IDs. Here we mock it.
    const friendCount = randomInt(5, 50);
    const friends = [];
    for (let i = 0; i < friendCount; i++) {
        friends.push({
            id: `FRIEND_${randomInt(1000, 9999)}`,
            name: `Friend ${i + 1}`,
            since: `202${randomInt(3, 5)}-09-${randomInt(10, 28)}`
        });
    }

    const groups = [];
    if (randomBool(0.7)) {
        groups.push({ course: "ASC101", name: "Culinary Arts Group A", members: randomInt(4, 10) });
    }
    if (randomBool(0.4)) {
        groups.push({ course: "COMP101", name: "Hackathon Team", members: 4 });
    }

    return { friends, studyGroups: groups };
}

function generateCareerMentorship() {
    const hasMentor = randomBool(0.4);
    if (!hasMentor) return { mentor: null, meetings: [] };

    return {
        mentor: {
            name: randomItem(["Ahmet Yılmaz", "Ayşe Demir", "Canan Kara", "Ali Veli"]),
            company: randomItem(["THY", "Aselsan", "Trendyol", "Getir", "Koç Sistem"]),
            role: randomItem(["Senior Developer", "Product Manager", "Chef de Cuisine", "HR Lead"]),
            connectedDate: "2025-10-15"
        },
        meetings: [
            { date: "2025-11-01", topic: "Intro & Goals", status: "Completed" },
            { date: "2026-01-20", topic: "CV Review", status: "Completed" },
            { date: "2026-03-10", topic: "Mock Interview", status: "Scheduled" }
        ]
    };
}

function generateVolunteeringEvents() {
    const events = [];
    const activities = ["Campus Cleanup", "Animal Shelter Visit", "Library Book Drive", "Coding Workshop for Kids", "Food Bank Help"];

    for (let i = 0; i < randomInt(0, 5); i++) {
        const hours = randomInt(2, 6);
        events.push({
            name: randomItem(activities),
            date: `202${randomInt(4, 5)}-${randomInt(1, 12)}-${randomInt(1, 28)}`,
            hours: hours,
            status: "Verified",
            CertificateUrl: "/assets/certificates/vol_1.pdf"
        });
    }

    const totalHours = events.reduce((acc, e) => acc + e.hours, 0);
    return { totalHours, events };
}

function generateStudyRoomBookings() {
    const history = [];
    const rooms = ["Study Room A (Silence)", "Group Room 1", "Media Room", "Individual Pod 5"];

    for (let i = 0; i < randomInt(0, 8); i++) {
        history.push({
            room: randomItem(rooms),
            date: `2026-0${randomInt(1, 3)}-${randomInt(1, 28)}`,
            slot: `${randomInt(9, 18)}:00-${randomInt(10, 19)}:00`,
            participants: randomInt(1, 6),
            status: "Completed"
        });
    }
    return { history };
}


function enrichStudent(studentDir) {
    if (!fs.existsSync(studentDir)) return;

    fs.writeFileSync(path.join(studentDir, 'gamification.json'), JSON.stringify(generateGamification(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'social_connections.json'), JSON.stringify(generateSocialConnections(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'career_mentorship.json'), JSON.stringify(generateCareerMentorship(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'volunteering_events.json'), JSON.stringify(generateVolunteeringEvents(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'study_room_bookings.json'), JSON.stringify(generateStudyRoomBookings(), null, 2));
}

function main() {
    console.log("Starting Social & Community Data Enrichment (V5)...");

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

    console.log(`\nSuccess! Enriched ${count} students with 5 new Social files.`);
}

main();
