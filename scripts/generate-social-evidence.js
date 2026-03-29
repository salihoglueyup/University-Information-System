const fs = require('fs');
const path = require('path');

const RECORDS_ROOT = path.join(__dirname, '../client/src/data/records/faculties');

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to get random array item
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ACTIVITIES = [
    { category: "Sosyal Sorumluluk", name: "Kampüs Temizlik Günü", points: 20, filePrefix: "cleanup" },
    { category: "Sosyal Sorumluluk", name: "Barınak Ziyareti", points: 15, filePrefix: "shelter" },
    { category: "Sosyal Sorumluluk", name: "Fidan Dikme Etkinliği", points: 25, filePrefix: "planting" },
    { category: "Kültür & Sanat", name: "Tiyatro Gösterisi", points: 15, filePrefix: "theater" },
    { category: "Kültür & Sanat", name: "Resim Sergisi", points: 10, filePrefix: "art_exhibit" },
    { category: "Spor", name: "Voleybol Turnuvası", points: 20, filePrefix: "volleyball" },
    { category: "Spor", name: "Bahar Koşusu", points: 15, filePrefix: "run" },
    { category: "Akademik", name: "Bilim Şenliği", points: 30, filePrefix: "science_fair" },
    { category: "Akademik", name: "Hackathon Katılımı", points: 50, filePrefix: "hackathon" }
];

function generateEvidence(studentDir) {
    const evidenceDir = path.join(studentDir, 'evidence');
    if (!fs.existsSync(evidenceDir)) {
        fs.mkdirSync(evidenceDir, { recursive: true });
    }

    const socialTranscriptPath = path.join(studentDir, 'socialTranscript.json');
    if (!fs.existsSync(socialTranscriptPath)) {
        console.warn(`Skipping ${studentDir}: socialTranscript.json not found.`);
        return;
    }

    let socialData = JSON.parse(fs.readFileSync(socialTranscriptPath, 'utf8'));

    // Select 2-5 random activities
    const numActivities = randomInt(2, 5);
    const selectedActivities = [];
    let totalPoints = 0;

    for (let i = 0; i < numActivities; i++) {
        const actTemplate = randomItem(ACTIVITIES);
        const date = `202${randomInt(4, 5)}-${randomInt(1, 12).toString().padStart(2, '0')}-${randomInt(1, 28).toString().padStart(2, '0')}`;

        // Generate dummy evidence file
        const fileName = `${actTemplate.filePrefix}_${randomInt(100, 999)}.jpg`;
        const filePath = path.join(evidenceDir, fileName);

        // Create a dummy file (just a text file named .jpg)
        fs.writeFileSync(filePath, `Dummy image content for ${actTemplate.name}`);

        selectedActivities.push({
            id: randomInt(1000, 9999),
            category: actTemplate.category,
            name: actTemplate.name,
            date: date,
            points: actTemplate.points,
            status: "Onaylandı",
            evidence: [`/evidence/${fileName}`] // Relative path for UI
        });

        totalPoints += actTemplate.points;
    }

    // Update social transcript
    socialData.activities = selectedActivities;
    // socialData.totalPoints += totalPoints; // Use existing logic or override? Let's override for consistency
    socialData.totalPoints = totalPoints + (socialData.badges ? socialData.badges.length * 50 : 0); // rough calc

    const level = totalPoints > 400 ? "Diamond" : totalPoints > 300 ? "Platinum" : totalPoints > 200 ? "Gold" : totalPoints > 100 ? "Silver" : "Bronze";
    socialData.level = level;

    fs.writeFileSync(socialTranscriptPath, JSON.stringify(socialData, null, 2));
}

function main() {
    console.log("Starting Social Evidence Generation...");

    if (!fs.existsSync(RECORDS_ROOT)) {
        console.error("Records root not found at: " + RECORDS_ROOT);
        return;
    }

    const faculties = fs.readdirSync(RECORDS_ROOT).filter(f => fs.statSync(path.join(RECORDS_ROOT, f)).isDirectory());
    let processedStudents = 0;

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
                    generateEvidence(path.join(studentsPath, studentId));
                    processedStudents++;
                });
            }
        });
    });

    console.log(`\nSuccess! Generated evidence folders and updated transcripts for ${processedStudents} students.`);
}

main();
