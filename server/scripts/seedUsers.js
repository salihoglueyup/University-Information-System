/**
 * Seeds one account per role/title so every persona can log in.
 * Idempotent: re-running upserts each user and resets its password to the
 * known dev value below. Run inside the server container:
 *   docker exec ubis_server node scripts/seedUsers.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/ubis';

// [username, password, fullName, email, role, academicTitle, faculty, department]
const ACCOUNTS = [
    // Student
    ['ogrenci', 'Ogrenci123!', 'Eyüp Zal', 'ogrenci@aydin.edu.tr', 'student', '', 'Mühendislik Fakültesi', 'Yazılım Mühendisliği'],

    // Academics
    ['arsgor', 'ArsGor123!', 'Arş. Gör. Ayşe Kaya', 'arsgor@aydin.edu.tr', 'academic', 'RES_ASST', 'Mühendislik Fakültesi', 'Yazılım Mühendisliği'],
    ['ogrgor', 'OgrGor123!', 'Öğr. Gör. Mehmet Demir', 'ogrgor@aydin.edu.tr', 'academic', 'OGR_GOR', 'Mühendislik Fakültesi', 'Bilgisayar Mühendisliği'],

    // Administrative units (all role=admin)
    ['admin', 'Admin123!', 'Sistem Yöneticisi', 'admin@aydin.edu.tr', 'admin', '', 'Rektörlük', 'Bilgi İşlem'],
    ['ogrenciisleri', 'Admin123!', 'Öğrenci İşleri Daire Başkanlığı', 'ogrenciisleri@aydin.edu.tr', 'admin', '', 'İdari Birimler', 'Öğrenci İşleri'],
    ['maliisler', 'Admin123!', 'Strateji ve Mali İşler', 'maliisler@aydin.edu.tr', 'admin', '', 'İdari Birimler', 'Mali İşler'],
    ['bidb', 'Admin123!', 'Bilgi İşlem Daire Başkanlığı', 'bidb@aydin.edu.tr', 'admin', '', 'İdari Birimler', 'Bilgi İşlem'],
    ['kutuphane', 'Admin123!', 'Kütüphane ve Dokümantasyon Daire Başkanlığı', 'kutuphane@aydin.edu.tr', 'admin', '', 'İdari Birimler', 'Kütüphane']
];

async function seed() {
    await mongoose.connect(MONGO_URL);
    console.log(`Connected to ${MONGO_URL}`);

    for (const [username, password, fullName, email, role, academicTitle, faculty, department] of ACCOUNTS) {
        const hashed = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { username },
            { $set: { password: hashed, fullName, email, role, academicTitle, faculty, department } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`  ✓ ${role.padEnd(9)} ${academicTitle.padEnd(8)} ${username} / ${password}`);
    }

    console.log('\nSeed complete. Login at http://localhost:5173 with any of the above.');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
