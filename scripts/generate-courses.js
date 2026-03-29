const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../client/src/data/records');
const coursesDir = path.join(rootDir, 'courses');

// Ensure directories exist
if (!fs.existsSync(coursesDir)) {
    fs.mkdirSync(coursesDir, { recursive: true });
}

// --- DATA POOLS ---
const coursePrefixes = ["YZM", "BIL", "MAT", "FIZ", "KIM", "TAR", "TUR", "ING", "ISL", "EKO"];

const courses = [
    { code: "YZM101", name: "Introduction to Software Engineering", ects: 5, credits: 3, type: "Core" },
    { code: "YZM102", name: "Algorithms and Programming I", ects: 6, credits: 4, type: "Core" },
    { code: "YZM201", name: "Data Structures", ects: 6, credits: 4, type: "Core" },
    { code: "YZM205", name: "Database Management Systems", ects: 5, credits: 3, type: "Core" },
    { code: "YZM302", name: "Operating Systems", ects: 5, credits: 3, type: "Core" },
    { code: "YZM305", name: "Web Application Development", ects: 5, credits: 3, type: "Elective" },
    { code: "YZM401", name: "Artificial Intelligence", ects: 6, credits: 3, type: "Elective" },
    { code: "BIL101", name: "Introduction to Computer Eng.", ects: 5, credits: 3, type: "Core" },
    { code: "MAT101", name: "Calculus I", ects: 5, credits: 4, type: "Core" },
    { code: "MAT102", name: "Calculus II", ects: 5, credits: 4, type: "Core" },
    { code: "FIZ101", name: "Physics I", ects: 4, credits: 3, type: "Core" },
    { code: "ING101", name: "Academic English I", ects: 2, credits: 2, type: "Core" },
    { code: "TUR101", name: "Turkish Language I", ects: 2, credits: 2, type: "Core" }
];

const syllabusWeeks = [
    "Introduction & Overview",
    "Fundamental Concepts",
    "Analysis Methods",
    "Design Principles",
    "Implementation Strategies",
    "Testing & Validation",
    "Midterm Review",
    "Midterm Exam",
    "Advanced Topics I",
    "Advanced Topics II",
    "Case Studies",
    "Project Work",
    "Emerging Trends",
    "Final Review"
];

const learningOutcomes = [
    "Understand the core principles of the subject.",
    "Apply theoretical knowledge to practical problems.",
    "Analyze complex systems and structures.",
    "Demonstrate proficiency in relevant tools and technologies.",
    "Collaborate effectively in team settings."
];

// --- HELPERS ---
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomInstructor() {
    // In a real app we would pick from existing staff. 
    // For now returning a placeholder ID that matches our pattern or a specific known one.
    return "AC-171000";
}

// --- GENERATORS ---

function generateMetadata(course) {
    return {
        code: course.code,
        name: course.name,
        instructorId: getRandomInstructor(),
        credits: course.credits,
        ects: course.ects,
        type: course.type,
        department: "Computer Engineering", // Simplified
        description: `This course covers the foundations of ${course.name}, preparing students for advanced topics in the field.`,
        schedule: [
            { day: "Monday", time: "09:00 - 12:00", location: "D-201" },
            { day: "Wednesday", time: "14:00 - 16:00", location: "Lab-3" }
        ]
    };
}

function generateSyllabus() {
    return {
        learningOutcomes: learningOutcomes,
        assessmentMethods: [
            { type: "Midterm", weight: 30 },
            { type: "Project", weight: 20 },
            { type: "Final", weight: 50 }
        ],
        weeks: syllabusWeeks.map((topic, index) => ({
            week: index + 1,
            topic: topic,
            outcomes: "Students will learn about " + topic.toLowerCase(),
            materials: "Chapter " + (index + 1),
            readings: `Reading material for ${topic}`
        }))
    };
}

function generateResources(courseCode) {
    return {
        categories: [
            {
                id: "lectures",
                name: "Lecture Notes",
                files: [
                    { id: "f1", name: "Week 1 - Intro.pdf", type: "pdf", size: "2.5MB", date: "2025-09-20", url: "#" },
                    { id: "f2", name: "Week 2 - Concepts.pptx", type: "pptx", size: "15MB", date: "2025-09-27", url: "#" }
                ]
            },
            {
                id: "readings",
                name: "Reading Materials",
                files: [
                    { id: "f3", name: "Research Paper 2024.pdf", type: "pdf", size: "1.2MB", date: "2025-10-05", url: "#" }
                ]
            },
            {
                id: "assignments",
                name: "Assignments",
                files: [
                    { id: "f4", name: "Project Guidelines.docx", type: "docx", size: "500KB", date: "2025-11-01", url: "#" }
                ]
            }
        ]
    };
}

function generateAssignments() {
    return {
        items: [
            { id: "midterm", title: "Midterm Exam", type: "Exam", dueDate: "2025-11-15", weight: 30, status: "Active" },
            { id: "hw1", title: "Homework 1", type: "Homework", dueDate: "2025-10-20", weight: 10, status: "Completed" },
            { id: "proj1", title: "Term Project", type: "Project", dueDate: "2025-12-25", weight: 20, status: "Pending" }
        ]
    };
}

function generateStudents() {
    // Mock enrolled students
    const students = [];
    for (let i = 0; i < 25; i++) {
        students.push({
            id: `B21${randomInt(10, 99)}00${randomInt(10, 99)}`,
            name: "Student " + (i + 1), // In real app, fetch from student DB
            status: "Enrolled",
            midterm: randomInt(40, 100),
            final: null,
            project: randomInt(50, 100)
        });
    }
    return { roster: students };
}

// --- MAIN ---

console.log("🚀 Starting Course Data Generation...");

courses.forEach(course => {
    const coursePath = path.join(coursesDir, course.code);

    if (!fs.existsSync(coursePath)) {
        fs.mkdirSync(coursePath);
    }

    fs.writeFileSync(path.join(coursePath, 'metadata.json'), JSON.stringify(generateMetadata(course), null, 2));
    fs.writeFileSync(path.join(coursePath, 'syllabus.json'), JSON.stringify(generateSyllabus(), null, 2));
    fs.writeFileSync(path.join(coursePath, 'resources.json'), JSON.stringify(generateResources(course.code), null, 2));
    fs.writeFileSync(path.join(coursePath, 'assignments.json'), JSON.stringify(generateAssignments(), null, 2));
    fs.writeFileSync(path.join(coursePath, 'students.json'), JSON.stringify(generateStudents(), null, 2));

    console.log(`✅ Generated ${course.code}`);
});

console.log("✨ All courses generated successfully!");
