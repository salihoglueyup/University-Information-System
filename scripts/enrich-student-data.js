const fs = require('fs');
const path = require('path');

const RECORDS_ROOT = path.join(__dirname, '../client/src/data/records/faculties');

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

// Grades and weights
const GRADES = {
    "AA": 4.0, "BA": 3.5, "BB": 3.0, "CB": 2.5, "CC": 2.0, "DC": 1.5, "DD": 1.0, "FF": 0.0
};
const LETTERS = Object.keys(GRADES);

// Semester names
const SEMESTERS = [
    "2021-2022 Güz", "2021-2022 Bahar",
    "2022-2023 Güz", "2022-2023 Bahar",
    "2023-2024 Güz", "2023-2024 Bahar",
    "2024-2025 Güz", "2024-2025 Bahar",
    "2025-2026 Güz"
];

// Mock Course List (if we can't find real ones easily, used as fallback)
const MOCK_COURSES = [
    { code: "TRK101", name: "Türk Dili I", credit: 2 },
    { code: "ATA101", name: "Atatürk İlkeleri I", credit: 2 },
    { code: "ING101", name: "Yabancı Dil I", credit: 3 },
    { code: "MAT101", name: "Matematik I", credit: 4 },
    { code: "FIZ101", name: "Fizik I", credit: 4 },
    { code: "KIM101", name: "Kimya I", credit: 4 }
];

function generateTranscript(studentId, startYear) {
    const transcript = {
        semesters: [],
        cumulativeGPA: 0,
        totalCredits: 0
    };

    let totalPoints = 0;

    // Determine how many semesters passed based on ID/Year (simplified)
    // Assuming current is 2025-2026 Spring
    const startYearInt = parseInt("20" + studentId.substring(1, 3)); // e.g. B21 -> 2021

    // Filter semesters starting from student's start year
    const validSemesters = SEMESTERS.filter(s => parseInt(s.substring(0, 4)) >= startYearInt);

    // Process all PAST semesters (excluding current: 2025-2026 Bahar)
    const pastSemesters = validSemesters.slice(0, validSemesters.length - 1);

    pastSemesters.forEach(term => {
        const numCourses = randomInt(4, 6);
        const termCourses = [];
        let termPoints = 0;
        let termCredits = 0;

        for (let i = 0; i < numCourses; i++) {
            const course = randomItem(MOCK_COURSES); //Ideally pick from program courses
            const letter = randomItem(["AA", "AA", "BA", "BB", "BB", "CB", "CC", "DC", "FF"]); // Bias towards good grades
            const points = GRADES[letter];

            termCourses.push({
                code: `${course.code.substring(0, 3)}${randomInt(100, 499)}`, // Randomize code slightly
                name: course.name,
                credit: course.credit,
                grade: letter,
                points: points
            });

            termPoints += points * course.credit;
            termCredits += course.credit;
        }

        const gpa = termCredits > 0 ? (termPoints / termCredits).toFixed(2) : 0;

        transcript.semesters.push({
            term: term,
            gpa: parseFloat(gpa),
            courses: termCourses
        });

        totalPoints += termPoints;
        transcript.totalCredits += termCredits;
    });

    transcript.cumulativeGPA = transcript.totalCredits > 0 ? parseFloat((totalPoints / transcript.totalCredits).toFixed(2)) : 0;
    return transcript;
}

function generateCurrentGrades() {
    // Current Term: 2025-2026 Bahar
    const courses = [];
    const numCourses = 5;

    for (let i = 0; i < numCourses; i++) {
        const midterm = randomInt(40, 100);
        const hasFinal = false; // Current semester usually doesn't have final yet
        const assignments = [
            { name: "Ödev 1", score: randomInt(60, 100) },
            { name: "Quiz 1", score: randomInt(50, 100) }
        ];

        // Weighted Average (Midterm 40%, Homework 10%)
        const average = (midterm * 0.4) + (assignments[0].score * 0.05) + (assignments[1].score * 0.05);

        courses.push({
            code: `DERS${randomInt(200, 499)}`,
            name: `Bahar Dönemi Dersi ${i + 1}`,
            midterm: { score: midterm, weight: 40 },
            final: { score: null, weight: 50 }, // Not happened
            assignments: assignments,
            average: parseFloat(average.toFixed(2)),
            letter: "-" // Not finalized
        });
    }

    return {
        currentTerm: "2025-2026 Bahar",
        courses: courses
    };
}

function generateAttendance() {
    const courses = [];
    for (let i = 0; i < 5; i++) {
        const absent = randomInt(0, 5);
        const details = [];
        for (let j = 0; j < absent; j++) {
            details.push({
                date: `2026-0${randomInt(2, 4)}-${randomInt(10, 28)}`,
                hours: randomInt(1, 3),
                status: "Yok"
            });
        }
        courses.push({
            code: `DERS${200 + i}`,
            absentHours: absent * 2, // Approx
            limit: 14, // 28 hours total? usually %30 of total. say 14 hours limit.
            details: details
        });
    }
    return { courses };
}

function generateExamCalendar() {
    const exams = [];
    for (let i = 0; i < 5; i++) {
        exams.push({
            course: `DERS${200 + i}`,
            name: "Vize",
            date: `2026-04-${randomInt(10, 20)}`,
            time: `${randomInt(9, 16)}:00`,
            location: `Derslik ${randomInt(101, 305)}`
        });
    }
    return { exams };
}


function enrichStudent(studentDir, studentId) {
    if (!fs.existsSync(studentDir)) return;

    // 1. Transcript
    fs.writeFileSync(path.join(studentDir, 'transcript.json'), JSON.stringify(generateTranscript(studentId, 2021), null, 2));

    // 2. Grades (Current Term)
    fs.writeFileSync(path.join(studentDir, 'grades.json'), JSON.stringify(generateCurrentGrades(), null, 2));

    // 3. Attendance
    fs.writeFileSync(path.join(studentDir, 'attendance.json'), JSON.stringify(generateAttendance(), null, 2));

    // 4. Exam Calendar
    fs.writeFileSync(path.join(studentDir, 'exam_calendar.json'), JSON.stringify(generateExamCalendar(), null, 2));
}

function main() {
    console.log("Starting Student Data Enrichment...");

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
                    enrichStudent(path.join(studentsPath, studentId), studentId);
                    count++;
                });
            }
        });
    });

    console.log(`\nSuccess! Enriched ${count} students with Transcript, Grades, Attendance, and Exams.`);
}

main();
