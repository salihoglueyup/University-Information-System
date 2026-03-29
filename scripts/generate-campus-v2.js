const fs = require('fs');
const path = require('path');

const CAMPUS_ROOT = path.join(__dirname, '../client/src/data/records/campus');
const LOCATIONS_ROOT = path.join(CAMPUS_ROOT, 'locations');
const METADATA_ROOT = path.join(CAMPUS_ROOT, 'metadata');

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomBool = (prob = 0.5) => Math.random() < prob;

// --- Config ---

const BLOCKS = [
    { id: 'block-a', name: 'Block A (Engineering & Architecture)', type: 'Academic', floors: 7, startFloor: 0 },
    { id: 'block-b', name: 'Block B (Business & Law)', type: 'Academic', floors: 6, startFloor: 0 },
    { id: 'block-c', name: 'Block C (Arts & Sciences)', type: 'Academic', floors: 5, startFloor: 0 },
    { id: 'block-d', name: 'Block D (Education)', type: 'Academic', floors: 5, startFloor: 0 },
    { id: 'block-e', name: 'Block E (Foreign Languages)', type: 'Academic', floors: 4, startFloor: 0 },
    { id: 'block-f', name: 'Block F (Administrative)', type: 'Admin', floors: 4, startFloor: 0 },
    { id: 'block-g', name: 'Block G (Library & Conference Center)', type: 'Facility', floors: 3, startFloor: 0 },
    { id: 'block-h', name: 'Block H (Sports Complex)', type: 'Facility', floors: 2, startFloor: 0 },
    { id: 'block-t', name: 'Block T (Technology & Medical Labs)', type: 'Lab', floors: 8, startFloor: -1 }, // Tip & Teknoloji
    { id: 'block-v', name: 'Block V (Vocational School)', type: 'Academic', floors: 4, startFloor: 0 }
];

const SPECIALTY_MAP = {
    'block-a': ['Architecture Studio', 'Computer Lab', 'Physics Lab'],
    'block-t': ['Anatomy Lab', 'Microbiology Lab', 'Simulation Center', 'Pathology Lab', 'Genetics Lab'],
    'block-v': ['Kitchen Workshop', 'Pastry Workshop', 'Service Bar', 'Automotive Lab'],
    'block-c': ['Art Studio', 'Music Room', 'Editing Suite'],
    'block-e': ['Language Lab', 'Translation Booth']
};

const COMMON_ROOMS = ['Classroom', 'Lecture Hall', 'Seminar Room', 'Study Area'];

// --- Generators ---

function generateRoom(block, floor, roomNum) {
    // Determine Type
    let type = 'Classroom';
    let subtype = null;
    let equipment = [];
    let capacity = randomInt(30, 60);

    // Logic for floor usage
    if (block.type === 'Admin' || (floor >= block.floors - 1 && block.type === 'Academic')) {
        // Top floors or Admin block are Offices
        type = 'Office';
        capacity = randomInt(1, 4);
    } else if (block.type === 'Lab' || (floor <= 1 && block.type === 'Academic')) {
        // Lower floors or Lab block are Labs/Specialty
        if (SPECIALTY_MAP[block.id]) {
            type = 'Laboratory';
            subtype = randomItem(SPECIALTY_MAP[block.id]);
        } else {
            type = 'Computer Lab';
        }
    } else if (roomNum % 10 === 0) {
        // Ends in 0 -> Large Lecture Hall
        type = 'Lecture Hall';
        capacity = randomInt(100, 250);
    } else if (roomNum % 5 === 0) {
        type = 'Common Area'; // Canteen, Lounge
        capacity = randomInt(50, 100);
    }

    // Equipment Generation
    if (type === 'Laboratory') {
        if (subtype && subtype.includes('Anatomy')) equipment = [{ name: 'Cadaver Tank', count: 2 }, { name: 'Microscope', count: 20 }];
        else if (subtype && subtype.includes('Kitchen')) equipment = [{ name: 'Industrial Oven', count: 6 }, { name: 'Station', count: 20 }];
        else equipment = [{ name: 'Specialized Gear', count: 10 }];
    } else if (type === 'Office') {
        equipment = [{ name: 'Desk', count: capacity }, { name: 'PC', count: capacity }, { name: 'Phone', count: 1 }];
    } else if (type === 'Classroom') {
        equipment = [{ name: 'Smart Board', count: 1 }, { name: 'Projector', count: 1 }];
    }

    const floorPrefix = floor < 0 ? `B${Math.abs(floor)}` : floor === 0 ? 'G' : `${floor}`;
    const id = `${block.id}-${floorPrefix}-${roomNum}`;
    const name = type === 'Office' ?
        `Office ${floorPrefix}0${roomNum}` :
        (subtype ? `${subtype} ${floorPrefix}0${roomNum}` : `${type} ${floorPrefix}0${roomNum}`);

    return {
        id,
        name,
        type,
        subtype,
        capacity,
        equipment,
        schedule: []
    };
}

function generateBlock(block) {
    const blockPath = path.join(LOCATIONS_ROOT, block.id);
    if (!fs.existsSync(blockPath)) fs.mkdirSync(blockPath, { recursive: true });

    // Metadata
    fs.writeFileSync(path.join(blockPath, 'metadata.json'), JSON.stringify(block, null, 2));

    // Floors
    for (let f = block.startFloor; f < block.startFloor + block.floors; f++) {
        const floorName = f < 0 ? `floor-B${Math.abs(f)}` : f === 0 ? 'floor-G' : `floor-${f}`;
        const floorPath = path.join(blockPath, floorName);
        if (!fs.existsSync(floorPath)) fs.mkdirSync(floorPath);

        // Rooms per floor
        const roomsPerFloor = randomInt(20, 30);
        for (let r = 1; r <= roomsPerFloor; r++) {
            const roomData = generateRoom(block, f, r);
            const fileName = `${r}-${roomData.type.toLowerCase().replace(/\s+/g, '-')}.json`;
            fs.writeFileSync(path.join(floorPath, fileName), JSON.stringify(roomData, null, 2));
        }
    }
}

function main() {
    console.log("Starting Extensive Campus Generation (Phase 22 - Blocks A-V)...");

    if (!fs.existsSync(LOCATIONS_ROOT)) fs.mkdirSync(LOCATIONS_ROOT, { recursive: true });
    if (!fs.existsSync(METADATA_ROOT)) fs.mkdirSync(METADATA_ROOT, { recursive: true });

    // Master List
    fs.writeFileSync(path.join(METADATA_ROOT, 'blocks.json'), JSON.stringify(BLOCKS, null, 2));

    BLOCKS.forEach(b => {
        console.log(`Building ${b.name}...`);
        generateBlock(b);
    });

    console.log("\nSuccess! Generated 10 blocks with hundreds of rooms.");
}

main();
