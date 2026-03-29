const fs = require('fs');
const path = require('path');

const CAMPUS_ROOT = path.join(__dirname, '../client/src/data/records/campus');
const LOCATIONS_ROOT = path.join(CAMPUS_ROOT, 'locations');
const METADATA_ROOT = path.join(CAMPUS_ROOT, 'metadata');

// Helper to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomBool = (prob = 0.5) => Math.random() < prob;

// --- Definitions ---

const BUILDINGS = [
    { id: 'block-a-engineering', name: 'Block A (Engineering Faculty)', type: 'Academic', floors: 5, lat: 41.0, lng: 28.9 },
    { id: 'block-b-medical', name: 'Block B (Medical Faculty)', type: 'Academic', floors: 6, lat: 41.1, lng: 28.8 },
    { id: 'block-c-vocational', name: 'Block C (Vocational School)', type: 'Academic', floors: 4, lat: 41.2, lng: 28.7 },
    { id: 'library-main', name: 'Main Library', type: 'Facility', floors: 3, lat: 41.05, lng: 28.85 },
    { id: 'social-center', name: 'Student Social Center', type: 'Social', floors: 2, lat: 41.02, lng: 28.82 },
    { id: 'rectorate', name: 'Rectorate Building', type: 'Admin', floors: 3, lat: 41.01, lng: 28.81 }
];

const ROOM_TYPES = {
    'Academic': ['Lecture Hall', 'Classroom', 'Office', 'Laboratory', 'Common Area'],
    'Facility': ['Reading Hall', 'Study Room', 'Computer Area', 'Archive'],
    'Social': ['Cafeteria', 'Club Room', 'Game Hall', 'Cinema'],
    'Admin': ['Office', 'Meeting Room', 'Archive']
};

const LAB_TYPES = {
    'block-a-engineering': ['Computer Lab', 'Electronics Lab', 'Robotics Workshop', 'Physics Lab'],
    'block-b-medical': ['Anatomy Lab', 'Biochemistry Lab', 'Simulation Center', 'Microbiology Lab'],
    'block-c-vocational': ['Main Kitchen', 'Pastry Workshop', 'Service Bar', 'Demo Kitchen']
};

// --- Generators ---

function generateRoom(buildingId, floor, roomNum, type) {
    const roomId = `${buildingId}-F${floor}-${roomNum}`;

    let roomData = {
        id: roomId,
        name: `${type} ${floor}0${roomNum}`,
        type: type, // Base type
        capacity: randomInt(20, 100),
        features: ["Wi-Fi", "AC"],
        schedule: [] // Placeholder for schedule
    };

    // Customize by Type
    if (type === 'Lecture Hall') {
        roomData.capacity = randomInt(80, 200);
        roomData.features.push("Projector", "Smart Board", "Sound System");
    } else if (type === 'Classroom') {
        roomData.capacity = randomInt(30, 60);
        roomData.features.push("Projector", "Whiteboard");
    } else if (type === 'Office') {
        roomData.capacity = randomInt(1, 4);
        roomData.features.push("Phone", "Printer");
        roomData.occupants = []; // To be filled optionally
        roomData.hours = "09:00 - 17:00";
    } else if (type === 'Laboratory') {
        roomData.capacity = randomInt(15, 40);
        roomData.subtype = randomItem(LAB_TYPES[buildingId] || ['General Lab']);
        roomData.equipment = generateEquipment(roomData.subtype);
        roomData.safetyLevel = buildingId.includes('medical') ? "BSL-2" : "Low";
        if (buildingId.includes('medical')) roomData.hazards = ["Biohazard", "Chemicals"];
    } else if (type === 'Study Room') {
        roomData.capacity = randomInt(4, 8);
        roomData.features.push("Whiteboard", "Silence Policy");
        roomData.reservable = true;
    } else if (type === 'Cafeteria') {
        roomData.capacity = randomInt(100, 300);
        roomData.menu = "Standard Daily Menu";
        roomData.busyHours = ["12:00-13:30"];
    }

    return roomData;
}

function generateEquipment(subtype) {
    const equipment = [];
    if (subtype.includes('Computer')) {
        equipment.push({ name: "Workstation PC", count: randomInt(20, 40), specs: "i9, 32GB RAM, RTX 4060" });
        equipment.push({ name: "Smart Board", count: 1 });
    } else if (subtype.includes('Kitchen')) {
        equipment.push({ name: "Industrial Oven", count: randomInt(4, 8) });
        equipment.push({ name: "Prep Station", count: randomInt(10, 20) });
        equipment.push({ name: "Blast Chiller", count: 2 });
    } else if (subtype.includes('Anatomy')) {
        equipment.push({ name: "Dissection Table", count: randomInt(5, 10) });
        equipment.push({ name: "Skeleton Model", count: randomInt(2, 5) });
        equipment.push({ name: "Microscope", count: randomInt(10, 20) });
    } else if (subtype.includes('Robotics')) {
        equipment.push({ name: "3D Printer", count: randomInt(2, 5) });
        equipment.push({ name: "Soldering Station", count: randomInt(5, 10) });
    } else {
        equipment.push({ name: "General Equipment", count: randomInt(10, 50) });
    }
    return equipment;
}

function generateBuilding(building) {
    const buildingPath = path.join(LOCATIONS_ROOT, building.id);
    if (!fs.existsSync(buildingPath)) fs.mkdirSync(buildingPath, { recursive: true });

    // 1. Building Metadata
    fs.writeFileSync(path.join(buildingPath, 'metadata.json'), JSON.stringify(building, null, 2));

    // 2. Generate Floors
    for (let f = 1; f <= building.floors; f++) {
        const floorPath = path.join(buildingPath, `floor-${f}`);
        if (!fs.existsSync(floorPath)) fs.mkdirSync(floorPath);

        // Decide room mix based on building type
        let roomTypesForFloor = [];
        if (building.type === 'Academic') {
            roomTypesForFloor = ['Office', 'Classroom', 'Laboratory', 'Lecture Hall', 'Common Area'];
        } else {
            roomTypesForFloor = ROOM_TYPES[building.type];
        }

        // Generate 5-10 rooms per floor
        const numRooms = randomInt(5, 10);
        for (let r = 1; r <= numRooms; r++) {
            const type = randomItem(roomTypesForFloor);
            // Bias: Lab mainly on lower floors, Offices on higher
            if (type === 'Laboratory' && f > 2 && building.floors > 3) continue;

            const roomData = generateRoom(building.id, f, r, type);
            const filename = `${f}0${r}-${type.toLowerCase().replace(/\s+/g, '-')}.json`;

            fs.writeFileSync(path.join(floorPath, filename), JSON.stringify(roomData, null, 2));
        }
    }
}

function main() {
    console.log("Starting Campus Architecture Generation (Phase 21)...");

    if (!fs.existsSync(LOCATIONS_ROOT)) fs.mkdirSync(LOCATIONS_ROOT, { recursive: true });
    if (!fs.existsSync(METADATA_ROOT)) fs.mkdirSync(METADATA_ROOT, { recursive: true });

    // 1. Generate Master Buildings List
    fs.writeFileSync(path.join(METADATA_ROOT, 'buildings.json'), JSON.stringify(BUILDINGS, null, 2));

    // 2. Generate Each Building
    BUILDINGS.forEach(b => {
        console.log(`Building ${b.name}...`);
        generateBuilding(b);
    });

    console.log("\nSuccess! Campus architecture constructed.");
}

main();
