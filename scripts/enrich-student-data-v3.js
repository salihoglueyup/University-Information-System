const fs = require('fs');
const path = require('path');

const RECORDS_ROOT = path.join(__dirname, '../client/src/data/records/faculties');

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const randomBool = (prob = 0.5) => Math.random() < prob;

// --- Generators ---

function generateAdvisingSessions() {
    const sessions = [];
    const topics = ["Course Registration", "Career Planning", "Internship Review", "Academic Performance", "Thesis Discussion"];

    for (let i = 0; i < randomInt(1, 4); i++) {
        sessions.push({
            date: `202${randomInt(4, 5)}-${randomInt(1, 12).toString().padStart(2, '0')}-${randomInt(1, 28).toString().padStart(2, '0')}`,
            type: randomItem(topics),
            notes: "Student is progressing well. Discussed future goals.",
            actionItems: randomBool() ? ["Update CV", "Apply for internship"] : [],
            advisor: "Dr. Advisor"
        });
    }
    return { sessions };
}

function generateCafeteriaDiet() {
    return {
        monthly: {
            calories: randomInt(30000, 60000),
            protein: randomInt(1000, 2000),
            carbs: randomInt(4000, 8000),
            fat: randomInt(1000, 2500)
        },
        preferences: randomBool(0.2) ? ["Vegetarian"] : randomBool(0.1) ? ["Vegan"] : ["None"],
        mostEaten: ["Chicken Menu", "Pasta", "Soup", "Salad"]
    };
}

function generateGymRecord() {
    const hasGym = randomBool(0.4);
    if (!hasGym) return { subscriptions: [], visits: [] };

    const visits = [];
    const facilities = ["Main Gym", "Swimming Pool", "Tennis Court"];

    for (let i = 0; i < randomInt(5, 20); i++) {
        visits.push({
            facility: randomItem(facilities),
            date: `2026-0${randomInt(1, 2)}-${randomInt(1, 28)}`,
            durationMinutes: randomInt(30, 120),
            caloriesBurned: randomInt(200, 800)
        });
    }

    return {
        subscriptions: ["Main Gym Access"],
        visits: visits.sort((a, b) => b.date.localeCompare(a.date))
    };
}

function generateSkillsMatrix() {
    const techSkills = [
        { skill: "Python", level: randomInt(1, 5) },
        { skill: "JavaScript", level: randomInt(1, 5) },
        { skill: "SQL", level: randomInt(1, 5) },
        { skill: "Git", level: randomInt(1, 5) }
    ];

    const softSkills = ["Communication", "Teamwork", "Problem Solving", "Leadership"];

    return {
        technical: techSkills.map(s => ({ ...s, verified: randomBool(0.3) })),
        soft: softSkills.filter(() => randomBool(0.7)),
        lastUpdated: "2026-01-15"
    };
}

function generateParkingViolations() {
    const hasCar = randomBool(0.3);
    if (!hasCar) return { vehicle: null, tickets: [] };

    const plate = `34 ${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))} ${randomInt(100, 999)}`;

    const hasTicket = randomBool(0.2); // 20% chance if they have a car
    const tickets = [];

    if (hasTicket) {
        tickets.push({
            date: `2025-${randomInt(10, 12)}-${randomInt(1, 28)}`,
            violation: randomItem(["Wrong Parking", "Speeding", "No Permit"]),
            fine: randomInt(50, 200),
            status: randomBool() ? "Paid" : "Unpaid"
        });
    }

    return {
        vehicle: plate,
        tickets: tickets
    };
}


function enrichStudent(studentDir) {
    if (!fs.existsSync(studentDir)) return;

    fs.writeFileSync(path.join(studentDir, 'advising_sessions.json'), JSON.stringify(generateAdvisingSessions(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'cafeteria_diet.json'), JSON.stringify(generateCafeteriaDiet(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'gym_record.json'), JSON.stringify(generateGymRecord(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'skills_matrix.json'), JSON.stringify(generateSkillsMatrix(), null, 2));
    fs.writeFileSync(path.join(studentDir, 'parking_violations.json'), JSON.stringify(generateParkingViolations(), null, 2));
}

function main() {
    console.log("Starting Lifestyle & Wellness Data Enrichment (V3)...");

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

    console.log(`\nSuccess! Enriched ${count} students with 5 new Lifestyle files.`);
}

main();
