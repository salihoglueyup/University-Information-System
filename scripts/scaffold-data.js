
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../src/data/records');

const academicUnits = [
    {
        name: "Tıp Fakültesi",
        departments: ["Tıp", "Tıp (İngilizce)"]
    },
    {
        name: "Hukuk Fakültesi",
        departments: ["Hukuk"]
    },
    {
        name: "Spor Bilimleri Fakültesi",
        departments: ["Beden Eğitimi ve Spor Öğretmenliği", "Spor Yöneticiliği", "Antrenörlük Eğitimi", "Rekreasyon"]
    },
    {
        name: "Diş Hekimliği Fakültesi",
        departments: ["Diş Hekimliği", "Diş Hekimliği (İngilizce)"]
    },
    {
        name: "Güzel Sanatlar Fakültesi",
        departments: ["Çizgi Film ve Animasyon", "Drama ve Oyunculuk", "Dijital Oyun Tasarımı", "Dijital Oyun Tasarımı (İngilizce)", "Gastronomi ve Mutfak Sanatları", "Grafik Tasarımı", "Tekstil ve Moda Tasarımı"]
    },
    {
        name: "Mühendislik Fakültesi",
        departments: ["Bilgisayar Mühendisliği (İng.)", "Elektrik-Elektronik Mühendisliği", "Endüstri Mühendisliği (İng.)", "Havacılık ve Uzay Mühendisliği (İng.)", "İnşaat Mühendisliği", "İnşaat Mühendisliği (İng.)", "Makine Mühendisliği", "Makine Mühendisliği (İng.)", "Yapay Zeka ve Veri Mühendisliği (İng.)", "Yazılım Mühendisliği (İng.)"]
    },
    {
        name: "Eczacılık Fakültesi",
        departments: ["Eczacılık", "Eczacılık (İngilizce)"]
    },
    {
        name: "İktisadi ve İdari Bilimler Fakültesi",
        departments: ["Ekonomi ve Finans", "Ekonomi ve Finans (İng.)", "Havacılık Yönetimi (İng.)", "İşletme", "İşletme (İng.)", "Kamu Yönetimi", "Muhasebe ve Finans Yönetimi", "Muhasebe ve Finans Yönetimi (İng.)", "Siyaset Bilimi ve Uluslararası İlişkiler", "Siyaset Bilimi ve Uluslararası İlişkiler (İng.)", "Uluslararası Ticaret (İng.)"]
    },
    {
        name: "Sağlık Bilimleri Fakültesi",
        departments: ["Beslenme ve Diyetetik", "Beslenme ve Diyetetik (İngilizce)", "Çocuk Gelişimi", "Ebelik", "Fizyoterapi ve Rehabilitasyon", "Fizyoterapi ve Rehabilitasyon (İngilizce)", "Hemşirelik", "Odyoloji", "Sağlık Yönetimi", "Sosyal Hizmet"]
    },
    {
        name: "Eğitim Fakültesi",
        departments: ["Arapça Öğretmenliği", "İlköğretim Matematik Öğretmenliği", "İngilizce Öğretmenliği", "Okul Öncesi Öğretmenliği", "Özel Eğitim Öğretmenliği", "Rehberlik ve Psikolojik Danışmanlık", "Sınıf Öğretmenliği", "Türkçe Öğretmenliği"]
    },
    {
        name: "İletişim Fakültesi",
        departments: ["Gazetecilik", "Görsel İletişim Tasarımı", "Halkla İletişim ve Tanıtım", "Radyo, Televizyon ve Sinema", "Radyo, Televizyon ve Sinema (İngilizce)", "Reklamcılık", "Televizyon Haberciliği ve Programcılığı", "Yeni Medya ve İletişim"]
    },
    {
        name: "Uygulamalı Bilimler Fakültesi",
        departments: ["Havacılık Elektrik ve Elektroniği (İngilizce)", "Yönetim Bilişim Sistemleri", "Yönetim Bilişim Sistemleri (İngilizce)", "Yazılım Geliştirme (İngilizce)", "Pilotaj"]
    },
    {
        name: "Fen-Edebiyat Fakültesi",
        departments: ["Arapça Mütercim-Tercümanlık", "İngiliz Dili ve Edebiyatı", "İngilizce Mütercim-Tercümanlık", "Moleküler Biyoloji ve Genetik (İngilizce)", "Psikoloji", "Psikoloji (İngilizce)", "Rusça Mütercim-Tercümanlık", "Sosyoloji", "Tarih", "Türk Dili ve Edebiyatı"]
    },
    {
        name: "Mimarlık ve Tasarım Fakültesi",
        departments: ["Endüstriyel Tasarım", "İç Mimarlık", "Mimarlık", "Mimarlık (İngilizce)"]
    },
    {
        name: "Anadolu Bil Meslek Yüksekokulu",
        type: "2-Year",
        departments: ["Aşçılık", "Bankacılık ve Sigortacılık", "Bilgisayar Destekli Tasarım ve Animasyon", "Bilgisayar Programcılığı", "Bilgisayar Programcılığı (İngilizce)", "Biyomedikal Cihaz Teknolojisi", "Çocuk Gelişimi", "Dış Ticaret", "Dış Ticaret (İngilizce)", "Elektrik", "Elektronik Teknolojisi", "Gıda Teknolojisi", "Grafik Tasarımı", "Hava Lojistiği", "Halkla İlişkiler ve Tanıtım", "İnsan Kaynakları Yönetimi", "İnsansız Hava Aracı Teknolojisi ve Operatörlüğü", "İnşaat Teknolojisi", "İnternet ve Ağ Teknolojileri (İngilizce)", "İş Sağlığı ve Güvenliği", "İşletme Yönetimi", "İşletme Yönetimi (İngilizce)", "Kuyumculuk ve Takı Tasarımı", "Lojistik", "Mahkeme Büro Hizmetleri", "Makine", "Mimari Restorasyon", "Moda Tasarımı", "Muhasebe ve Vergi Uygulamaları", "Otomotiv Teknolojisi", "Pazarlama", "Radyo ve Televizyon Programcılığı", "Saç Bakımı ve Güzellik Hizmetleri", "Siber Güvenlik", "Sivil Hava Ulaştırma İşletmeciliği (İngilizce)", "Sivil Havacılık Kabin Hizmetleri", "Turizm Rehberliği", "Turizm ve Otel İşletmeciliği", "Uçak Teknolojisi", "Uçuş Harekat Yöneticiliği", "Uygulamalı İngilizce ve Çevirmenlik", "Uygulamalı İspanyolca ve Çevirmenlik"]
    },
    {
        name: "Sağlık Hizmetleri Meslek Yüksekokulu",
        type: "2-Year",
        departments: ["Ağız ve Diş Sağlığı", "Ameliyathane Hizmetleri", "Anestezi", "Diş Protez Teknolojisi", "Diyaliz", "Eczane Hizmetleri", "Elektronörofizyoloji", "Fizyoterapi", "İlk ve Acil Yardım", "Odyometri", "Optisyenlik", "Ortopedik Protez ve Ortez", "Pataloji Laboratuvar Teknikleri", "Radyoterapi", "Sosyal Hizmetler", "Tıbbi Dökümantasyon ve Sekreterlik", "Tıbbi Görüntüleme Teknikleri", "Tıbbi Laboratuvar Teknikleri"]
    }
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Ensure directories exist
function ensureDirectoryExistence(filePath) {
    if (fs.existsSync(filePath)) {
        return true;
    }
    fs.mkdirSync(filePath, { recursive: true });
}

// Main Scaffold Function
async function scaffold() {
    console.log("🚀 Starting Data Scaffolding...");

    // 1. Create Metadata Directory
    const metadataDir = path.join(rootDir, 'metadata');
    ensureDirectoryExistence(metadataDir);

    const facultiesMetadata = [];
    const departmentsMetadata = [];

    let deptGlobalId = 1;

    // 2. Iterate Units
    academicUnits.forEach((unit, index) => {
        const facultySlug = slugify(unit.name);
        const facultyId = `FAC-${index + 1}`;

        facultiesMetadata.push({
            id: facultyId,
            name: unit.name,
            slug: facultySlug,
            type: unit.type || "Faculty"
        });

        const facultyDir = path.join(rootDir, 'faculties', facultySlug);
        ensureDirectoryExistence(facultyDir);

        // 3. Iterate Departments
        unit.departments.forEach((deptName) => {
            const deptSlug = slugify(deptName);
            const deptId = `DEPT-${deptGlobalId++}`;

            departmentsMetadata.push({
                id: deptId,
                facultyId: facultyId,
                name: deptName,
                slug: deptSlug
            });

            // Create Department Directory
            const deptDir = path.join(facultyDir, deptSlug);
            const studentsDir = path.join(deptDir, 'students');

            ensureDirectoryExistence(deptDir);
            ensureDirectoryExistence(studentsDir);

            // Create Curriculum Placeholder
            fs.writeFileSync(path.join(deptDir, 'curriculum.json'), JSON.stringify([], null, 2));
        });
    });

    // 4. Write Metadata Files
    fs.writeFileSync(path.join(metadataDir, 'faculties.json'), JSON.stringify(facultiesMetadata, null, 2));
    fs.writeFileSync(path.join(metadataDir, 'departments.json'), JSON.stringify(departmentsMetadata, null, 2));

    console.log("✅ Scaffolding Complete!");
    console.log(`- ${facultiesMetadata.length} Faculties/Schools created`);
    console.log(`- ${departmentsMetadata.length} Departments created`);
}

scaffold();
