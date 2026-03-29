const fs = require('fs');
const path = require('path');

const CLIENT_SRC = path.join(__dirname, '../client/src');
const RECORDS_ROOT = path.join(CLIENT_SRC, 'data/records/faculties');
const CAMPUS_ROOT = path.join(CLIENT_SRC, 'data/records/campus');
const METADATA_ROOT = path.join(CLIENT_SRC, 'data/records/metadata');

// Ensure metadata directory exists
if (!fs.existsSync(METADATA_ROOT)) fs.mkdirSync(METADATA_ROOT, { recursive: true });

function generateStudentIndex() {
    console.log("Generating Student Index...");
    const students = [];

    if (!fs.existsSync(RECORDS_ROOT)) return;

    const faculties = fs.readdirSync(RECORDS_ROOT).filter(f => fs.statSync(path.join(RECORDS_ROOT, f)).isDirectory());

    faculties.forEach(faculty => {
        if (faculty === 'metadata') return;
        const facultyPath = path.join(RECORDS_ROOT, faculty);
        const programs = fs.readdirSync(facultyPath).filter(f => fs.statSync(path.join(facultyPath, f)).isDirectory());

        programs.forEach(program => {
            const studentsPath = path.join(facultyPath, program, 'students');
            if (fs.existsSync(studentsPath)) {
                const studentIds = fs.readdirSync(studentsPath).filter(f => fs.statSync(path.join(studentsPath, f)).isDirectory());

                studentIds.forEach(id => {
                    // Optimized: Read only profile.json for index
                    try {
                        const profilePath = path.join(studentsPath, id, 'profile.json');
                        const academicPath = path.join(studentsPath, id, 'academic.json');

                        let profile = {};
                        let academic = {};

                        if (fs.existsSync(profilePath)) {
                            profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
                        }
                        if (fs.existsSync(academicPath)) {
                            academic = JSON.parse(fs.readFileSync(academicPath, 'utf8'));
                        }

                        students.push({
                            id: id,
                            name: profile.fullName || "Unknown",
                            faculty: faculty,
                            department: program,
                            gpa: academic.gpa || 0,
                            semester: academic.semester || 1,
                            status: profile.status || "Active",
                            email: profile.email
                        });
                    } catch (err) {
                        console.error(`Error reading ${id}:`, err.message);
                    }
                });
            }
        });
    });

    fs.writeFileSync(path.join(METADATA_ROOT, 'students-index.json'), JSON.stringify(students, null, 2));
    console.log(`Indexed ${students.length} students.`);
}

function generateRoomIndex() {
    console.log("Generating Room Index...");
    const rooms = [];
    const LOCATIONS_ROOT = path.join(CAMPUS_ROOT, 'locations');

    if (!fs.existsSync(LOCATIONS_ROOT)) return;

    const blocks = fs.readdirSync(LOCATIONS_ROOT).filter(f => fs.statSync(path.join(LOCATIONS_ROOT, f)).isDirectory());

    blocks.forEach(block => {
        const blockPath = path.join(LOCATIONS_ROOT, block);
        const floors = fs.readdirSync(blockPath).filter(f => f.startsWith('floor-'));

        floors.forEach(floor => {
            const floorPath = path.join(blockPath, floor);
            const roomFiles = fs.readdirSync(floorPath).filter(f => f.endsWith('.json'));

            roomFiles.forEach(file => {
                try {
                    const data = JSON.parse(fs.readFileSync(path.join(floorPath, file), 'utf8'));
                    rooms.push({
                        id: data.id,
                        name: data.name,
                        type: data.type,
                        subtype: data.subtype,
                        capacity: data.capacity,
                        block: block,
                        floor: floor,
                        features: data.features
                    });
                } catch (err) {
                    console.error(`Error reading room ${file}:`, err.message);
                }
            });
        });
    });

    // Save to metadata/rooms-index.json
    // We might need to ensure campus/metadata exists too, using the main metadata folder for simplicity?
    // Actually let's put it in the main metadata folder for easy access
    fs.writeFileSync(path.join(METADATA_ROOT, 'rooms-index.json'), JSON.stringify(rooms, null, 2));
    console.log(`Indexed ${rooms.length} rooms.`);
}

function main() {
    console.log("Starting Master Index Generation...");
    generateStudentIndex();
    generateRoomIndex();
    console.log("Master Index Generation Complete.");
}

main();
