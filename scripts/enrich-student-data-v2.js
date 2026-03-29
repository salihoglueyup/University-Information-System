const fs = require('fs');
const path = require('path');

const RECORDS_ROOT = path.join(__dirname, '../client/src/data/records/faculties');

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const randomBool = (prob = 0.5) => Math.random() < prob;

// --- Generators ---

function generateDegreeAudit() {
    return {
        totalCredits: { required: 120, completed: randomInt(60, 110) },
        gpa: parseFloat(randomFloat(2.0, 3.9)),
        categories: [
            { name: "Must Courses", required: 40, completed: randomInt(20, 40), status: "In Progress" },
            { name: "Electives", required: 15, completed: randomInt(5, 15), status: "In Progress" },
            { name: "Core Curriculum", required: 20, completed: 20, status: "Complete" }
        ],
        missingCourses: [
            `DERS${randomInt(300, 400)}`,
            `DERS${randomInt(400, 500)}`
        ]
    };
}

function generateMessages() {
    const messages = [];
    const contexts = [
        { sender: "Rectorate", subject: "Welcome to New Academic Year" },
        { sender: "Registrar", subject: "Course Registration Reminder" },
        { sender: "Library", subject: "Overdue Book Notice" },
        { sender: "Career Center", subject: "Internship Opportunities" },
        { sender: "Advisor", subject: "Meeting Request" }
    ];

    const count = randomInt(2, 5);
    for (let i = 0; i < count; i++) {
        const ctx = randomItem(contexts);
        messages.push({
            id: randomInt(1000, 9999),
            sender: ctx.sender,
            subject: ctx.subject,
            preview: "Lorem ipsum dolor sit amet...",
            date: `2026-0${randomInt(1, 3)}-${randomInt(10, 28)}`,
            read: randomBool(0.4)
        });
    }
    return { inbox: messages };
}

function generateSpending() {
    const history = [];
    let balance = parseFloat(randomFloat(50, 500));
    const locations = ["Main Cafeteria", "Starbucks", "Bookstore", "Vending Machine", "Copy Center"];

    for (let i = 0; i < randomInt(3, 8); i++) {
        const amount = parseFloat(randomFloat(10, 80));
        history.push({
            id: randomInt(10000, 99999),
            location: randomItem(locations),
            amount: -amount,
            date: `2026-02-${randomInt(1, 15)}`,
            type: "Purchase"
        });
    }
    // Add a top-up
    history.push({
        id: randomInt(10000, 99999),
        location: "Kiosk",
        amount: 200.0,
        date: "2026-02-01",
        type: "Top-up"
    });

    return { balance, history: history.reverse() };
}

function generateSurveys() {
    return {
        pending: [
            { id: 101, title: "Course Evaluation: ASC101", deadline: "2026-06-01", status: "Pending" },
            { id: 102, title: "Campus Services Satisfaction", deadline: "2026-05-15", status: "Pending" }
        ],
        completed: [
            { id: 99, title: "Fall Semester Feedback", date: "2025-12-20", status: "Submitted" }
        ]
    };
}

function generateAccessLogs() {
    const logs = [];
    const gates = ["Main Gate", "Dormitory A", "Library Turnstile", "Faculty Building B"];
    for (let i = 0; i < randomInt(5, 10); i++) {
        logs.push({
            location: randomItem(gates),
            time: `2026-02-${randomInt(10, 15)} ${randomInt(8, 20)}:${randomInt(10, 59)}`,
            type: randomBool() ? "Entry" : "Exit",
            status: "Allowed"
        });
    }
    return { logs };
}

function generateDisciplinary() {
    const hasRecord = randomBool(0.05); // 5% chance
    if (!hasRecord) {
        return { status: "Clean", history: [] };
    }
    return {
        status: "Probaton",
        history: [
            { date: "2025-11-05", reason: "Plagiarism in homework", penalty: "Warning", status: "Active" }
        ]
    };
}

function generateInternshipLogs() {
    const logs = [];
    for (let i = 0; i < randomInt(3, 7); i++) {
        logs.push({
            date: `2025-07-${randomInt(1, 30)}`,
            hours: 8,
            description: "Worked on frontend components and fixed bugs.",
            status: "Approved",
            supervisor: "Eng. John Doe"
        });
    }
    return { logs, totalHours: logs.length * 8 };
}

function generateScholarships() {
    const hasScholarship = randomBool(0.6);
    if (!hasScholarship) return { grants: [] };

    return {
        grants: [
            {
                name: randomItem(["OSYM Success Scholarship", "Foundation Grant", "Merit Scholarship"]),
                amount: randomItem(["100%", "50%", "25%"]),
                duration: "4 Years",
                status: "Active",
                conditions: ["GPA > 2.5", "No Disciplinary Record"]
            }
        ]
    };
}

function generateITAssets() {
    return {
        devices: [
            {
                mac: `00:1B:44:11:3A:${randomInt(10, 99)}`,
                type: randomItem(["Laptop", "Phone", "Tablet"]),
                os: randomItem(["Windows 11", "iOS 17", "Android 14"]),
                registered: "2024-09-15"
            }
        ],
        quota: {
            print: { total: 100, used: randomInt(5, 80) },
            cloudStorage: { total: "5GB", used: `${randomFloat(0.1, 4.5)}GB` }
        },
        software: [
            { name: "Office 365", license: "Active" },
            { name: "AutoCAD Student", license: "Active" }
        ]
    };
}


function enrichStudent(studentDir) {
    if (!fs.existsSync(studentDir)) return;

    fs.writeFileSync(path.join(studentDir, 'degree_audit.json'), JSON.stringify(generateDegreeAudit(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'messages.json'), JSON.stringify(generateMessages(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'spending.json'), JSON.stringify(generateSpending(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'surveys.json'), JSON.stringify(generateSurveys(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'access_logs.json'), JSON.stringify(generateAccessLogs(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'disciplinary.json'), JSON.stringify(generateDisciplinary(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'internship_logs.json'), JSON.stringify(generateInternshipLogs(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'scholarships_detailed.json'), JSON.stringify(generateScholarships(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'it_assets.json'), JSON.stringify(generateITAssets(), null, 2));
}

function main() {
    console.log("Starting Campus Life Data Enrichment (V2)...");

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

    console.log(`\nSuccess! Enriched ${count} students with 9 new data files.`);
}

main();
