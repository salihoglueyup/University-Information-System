/**
 * PHASE 1: Foundation Data Generation
 * Generates Faculty and Department records for UBIS
 * 
 * Turkish University Structure:
 * - Fakülteler (Faculties)
 * - Her Fakültes'in altında Bölümler (Departments)
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Models
const Faculty = require('./models/Faculty');
const Department = require('./models/Department');

// ============= DATA POOLS =============

const FACULTIES = [
    {
        id: 'FK001',
        name: 'Mühendislik Fakültesi',
        slug: 'engineering',
        type: 'Fakülte'
    },
    {
        id: 'FK002',
        name: 'Fen Edebiyat Fakültesi',
        slug: 'arts-sciences',
        type: 'Fakülte'
    },
    {
        id: 'FK003',
        name: 'Tıp Fakültesi',
        slug: 'medicine',
        type: 'Fakülte'
    },
    {
        id: 'FK004',
        name: 'Hukuk Fakültesi',
        slug: 'law',
        type: 'Fakülte'
    },
    {
        id: 'FK005',
        name: 'İktisat ve İdari Bilimler Fakültesi',
        slug: 'economics-admin',
        type: 'Fakülte'
    },
    {
        id: 'FK006',
        name: 'Eğitim Fakültesi',
        slug: 'education',
        type: 'Fakülte'
    },
    {
        id: 'FK007',
        name: 'Mimarlık Fakültesi',
        slug: 'architecture',
        type: 'Fakülte'
    },
    {
        id: 'FK008',
        name: 'Spor Bilimleri Fakültesi',
        slug: 'sports-sciences',
        type: 'Fakülte'
    }
];

const DEPARTMENTS_BY_FACULTY = {
    'FK001': [
        { name: 'Yazılım Mühendisliği', slug: 'software-engineering' },
        { name: 'Bilgisayar Mühendisliği', slug: 'computer-engineering' },
        { name: 'Elektrik-Elektronik Mühendisliği', slug: 'electrical-engineering' },
        { name: 'Makine Mühendisliği', slug: 'mechanical-engineering' },
        { name: 'Harita Mühendisliği', slug: 'civil-engineering' },
        { name: 'Inşaat Mühendisliği', slug: 'construction-engineering' },
        { name: 'Uçak Mühendisliği', slug: 'aerospace-engineering' },
        { name: 'Kimya Mühendisliği', slug: 'chemical-engineering' }
    ],
    'FK002': [
        { name: 'Matematik', slug: 'mathematics' },
        { name: 'Fizik', slug: 'physics' },
        { name: 'Kimya', slug: 'chemistry' },
        { name: 'Biyoloji', slug: 'biology' },
        { name: 'Türk Dili ve Edebiyatı', slug: 'turkish-language' },
        { name: 'İngiliz Dili ve Edebiyatı', slug: 'english-language' },
        { name: 'Tarih', slug: 'history' },
        { name: 'Coğrafya', slug: 'geography' },
        { name: 'Felsefe', slug: 'philosophy' },
        { name: 'Sosyoloji', slug: 'sociology' }
    ],
    'FK003': [
        { name: 'Tıbbi Eğitim', slug: 'medical-education' },
        { name: 'Dahiliye', slug: 'internal-medicine' },
        { name: 'Cerrahiye', slug: 'surgery' },
        { name: 'Kadın Hastalıkları ve Doğum', slug: 'obstetrics' },
        { name: 'Çocuk Sağlığı ve Hastalıkları', slug: 'pediatrics' },
        { name: 'Psikiyatri', slug: 'psychiatry' }
    ],
    'FK004': [
        { name: 'Anayasa Hukuku', slug: 'constitutional-law' },
        { name: 'Medeni Hukuk', slug: 'civil-law' },
        { name: 'Ticaret Hukuku', slug: 'commercial-law' },
        { name: 'Ceza Hukuku', slug: 'criminal-law' },
        { name: 'İdare Hukuku', slug: 'administrative-law' },
        { name: 'Milletlerarası Hukuk', slug: 'international-law' }
    ],
    'FK005': [
        { name: 'İktisat', slug: 'economics' },
        { name: 'İşletme', slug: 'business-administration' },
        { name: 'Muhasebe', slug: 'accounting' },
        { name: 'Kamu Yönetimi', slug: 'public-administration' },
        { name: 'Turizm Yönetimi', slug: 'tourism-management' },
        { name: 'İstatistik', slug: 'statistics' }
    ],
    'FK006': [
        { name: 'Eğitim Bilimleri', slug: 'educational-sciences' },
        { name: 'Matematik Öğretmenliği', slug: 'mathematics-teaching' },
        { name: 'Fen Bilgisi Öğretmenliği', slug: 'science-teaching' },
        { name: 'Türkçe Öğretmenliği', slug: 'turkish-teaching' },
        { name: 'İngilizce Öğretmenliği', slug: 'english-teaching' },
        { name: 'Rehberlik ve Psikolojik Danışmanlık', slug: 'counseling' }
    ],
    'FK007': [
        { name: 'Mimarılık', slug: 'architecture' },
        { name: 'Şehircilik', slug: 'urban-planning' },
        { name: 'İç Mimarlık', slug: 'interior-design' },
        { name: 'Peyzaj Mimarılığı', slug: 'landscape-architecture' }
    ],
    'FK008': [
        { name: 'Beden Eğitimi ve Spor Öğretmenliği', slug: 'pe-teaching' },
        { name: 'Spor Yönetimi', slug: 'sports-management' },
        { name: 'Antrenörlük Eğitimi', slug: 'coach-training' },
        { name: 'Spor Hekimliği', slug: 'sports-medicine' }
    ]
};

// ============= HELPER FUNCTIONS =============

/**
 * Generate Department ID from faculty and index
 * Format: DEPT001, DEPT002, etc.
 */
function generateDepartmentId(facultyIndex, deptIndex) {
    const combined = facultyIndex * 100 + deptIndex;
    return `DEPT${combined.toString().padStart(3, '0')}`;
}

/**
 * Create slug from Turkish name
 */
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ============= MAIN SCRIPT =============

async function generateFoundationData() {
    try {
        // Connect to MongoDB
        const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/ubis';
        await mongoose.connect(mongoUrl);
        console.log('✓ Connected to MongoDB');

        // Clear existing data (Optional - comment out if you want to preserve)
        // await Faculty.deleteMany({});
        // await Department.deleteMany({});
        // console.log('✓ Cleared existing Faculty and Department records');

        // ===== CREATE FACULTIES =====
        console.log('\n📚 Creating Faculty records...');
        const createdFaculties = [];
        
        for (const faculty of FACULTIES) {
            const existing = await Faculty.findOne({ id: faculty.id });
            if (!existing) {
                const newFaculty = await Faculty.create({
                    id: faculty.id,
                    name: faculty.name,
                    slug: faculty.slug,
                    type: faculty.type
                });
                createdFaculties.push(newFaculty);
                console.log(`  ✓ Created: ${faculty.name} (${faculty.id})`);
            } else {
                console.log(`  ℹ Skipped: ${faculty.name} (already exists)`);
                createdFaculties.push(existing);
            }
        }

        console.log(`\n✓ Faculty records: ${createdFaculties.length}/${FACULTIES.length}`);

        // ===== CREATE DEPARTMENTS =====
        console.log('\n🏢 Creating Department records...');
        let totalDeptCreated = 0;
        let totalDeptSkipped = 0;

        for (let fIdx = 0; fIdx < FACULTIES.length; fIdx++) {
            const faculty = FACULTIES[fIdx];
            const departments = DEPARTMENTS_BY_FACULTY[faculty.id] || [];

            console.log(`\n  📍 ${faculty.name}:`);

            for (let dIdx = 0; dIdx < departments.length; dIdx++) {
                const dept = departments[dIdx];
                const deptId = generateDepartmentId(fIdx, dIdx);

                const existing = await Department.findOne({ id: deptId });
                if (!existing) {
                    const newDept = await Department.create({
                        id: deptId,
                        facultyId: faculty.id,
                        name: dept.name,
                        slug: dept.slug
                    });
                    console.log(`    ✓ ${dept.name} (${deptId})`);
                    totalDeptCreated++;
                } else {
                    totalDeptSkipped++;
                }
            }
        }

        console.log(`\n✓ Department records: ${totalDeptCreated} created, ${totalDeptSkipped} skipped`);

        // ===== VERIFICATION =====
        console.log('\n🔍 Verification:');
        const facultyCount = await Faculty.countDocuments();
        const departmentCount = await Department.countDocuments();

        console.log(`  Faculty Count: ${facultyCount}`);
        console.log(`  Department Count: ${departmentCount}`);

        // ===== SUMMARY =====
        console.log('\n' + '='.repeat(60));
        console.log('FOUNDATION DATA GENERATION COMPLETE');
        console.log('='.repeat(60));
        console.log(`✅ Faculties: ${facultyCount}`);
        console.log(`✅ Departments: ${departmentCount}`);
        console.log(`✅ Total Foundation Records: ${facultyCount + departmentCount}`);
        console.log('='.repeat(60));

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run script
generateFoundationData();
