# IAU KAMPUS BILGI SISTEMI (UBIS) 🎓

![UBIS Banner](https://img.shields.io/badge/Status-Development-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-LTS-green?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue?style=for-the-badge)](LICENSE)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-222222?style=for-the-badge&logo=githubactions)

IAU UBIS, üniversite akademik ve idari süreçlerini dijitalleştiren, modern teknolojilerle donatılmış kapsamlı bir kampüs bilgi sistemidir.

## 🚀 Öne Çıkan Özellikler

### 📚 Akademik Yönetim

- **Ders & Müfredat**: Ders kayıtları, müfredat takibi ve ders içerikleri yönetimi.
- **Not Sistemi**: Vize/Final girişleri, transkript görüntüleme ve akademik gelişim takibi.
- **Tez & Proje**: Tez kanban tahtası, milestone takibi ve danışman yönetimi.
- **Sınav Sistemi**: Elektronik sınavlar, sınav takvimleri ve mazeret sınav yönetimi.

### 💳 Finansal & İdari Hizmetler

- **Ödeme Sistemi**: Harç takibi, banka hesapları ve finansal raporlama.
- **Dijital Kimlik**: QR tabanlı giriş-çıkış kontrolü ve dijital öğrenci kartı.
- **İnsan Kaynakları**: Akademik personel CV yönetimi, izin talepleri ve yayın takibi.

### 🏫 Kampüs Yaşamı

- **Kampüs Haritası**: İnteraktif harita ve bina konumları.
- **Öğrenci Kulüpleri**: Etkinlik yönetimi ve kulüp başvuruları.
- **Merkezi Hizmetler**: Yemek menüsü, kütüphane sistemi, yurt yönetimi ve servis saatleri.

## 🛠️ Teknoloji Yığını

### Frontend

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Veri Görselleştirme**: [Recharts](https://recharts.org/)
- **Harita**: [Leaflet](https://leafletjs.com/)
- **Editör**: [Tiptap](https://tiptap.dev/)

### Backend

- **Ortam**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Veritabanı**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Konteynerizasyon**: [Docker](https://www.docker.com/)

## 🏁 Başlangıç

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki iki yöntemden birini seçebilirsiniz.

### 1. Tek Tıkla Başlat (Önerilen)

Windows kullanıcıları için kök dizindeki script'i çalıştırmanız yeterlidir:

```bash
proje-baslat.bat
```

Bu script bağımlılıkları kontrol eder, eksikleri yükler ve hem backend hem frontend servislerini başlatarak tarayıcınızı açar.

### 2. Docker ile Başlat

Sisteminizde Docker ve Docker Compose yüklü ise:

Development ortamı (önerilen):

```bash
cp docker/.env.example docker/.env
docker compose -f docker/docker-compose.yml up --build
```

Not: 5000 portu doluysa docker/.env dosyasında SERVER_PORT=5001 yapabilirsiniz.

Production benzeri ortam:

```bash
cp docker/.env.production.example docker/.env.production
docker compose --env-file docker/.env.production -f docker/docker-compose.prod.yml up --build -d
```

### 3. Manuel Kurulum

**Backend:**

```bash
cd server
npm install
npm run dev
```

**Frontend:**

```bash
cd client
npm install
npm run dev
```

## 📁 Proje Yapısı

```text
ubis/
├── client/           # React frontend uygulaması
│   ├── src/
│   │   ├── components/   # UI bileşenleri
│   │   ├── pages/        # Sayfa bileşenleri (Dashboard, Akademik, vb.)
│   │   └── data/         # Statik veriler ve kayıtlar
├── server/           # Node.js backend uygulaması
│   ├── models/       # MongoDB şemaları
│   └── routes/       # API rotaları
├── docker/
│   ├── docker-compose.yml            # Development compose
│   ├── docker-compose.prod.yml       # Production compose
│   └── *.Dockerfile                 # Docker image tanımları
├── docs/             # Teknik ve islevsel dokumantasyon
└── proje-baslat.bat   # Otomatik başlatma script'i
```

## 📘 Dokumantasyon

Detayli dokumantasyon dosyalari `docs/` altinda tutulur:

- **[docs/README.md](docs/README.md)** (dokumantasyon dizini)
- **[docs/FEATURES.md](docs/FEATURES.md)** (rol bazli tum ozellikler + ownership matrix)
- **[docs/API_MODULES.md](docs/API_MODULES.md)** ⭐ (backend API alanlari + **error response templates**)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** (mimari ve klasor yapisi)
- **[docs/ARCHITECTURE_DEEP_DIVE.md](docs/ARCHITECTURE_DEEP_DIVE.md)** (katmanli detayli mimari)
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** (dev/prod calistirma rehberi)
- **[docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)** (gelistirme ortami kurulum adimlari)
- **[docs/FAQ.md](docs/FAQ.md)** (sik sorulan sorular)
- **[docs/RELEASE_NOTES.md](docs/RELEASE_NOTES.md)** (surum bazli degisiklik kaydi)
- **[docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md)** (bilinen sorunlar ve gecici cozumler)
- **[docs/DOCS_PROCESS.md](docs/DOCS_PROCESS.md)** (dokuman guncelleme standardi)
- **[docs/SCREENSHOTS_GUIDE.md](docs/SCREENSHOTS_GUIDE.md)** 🎬 (ekran görüntüsü çekim ve dosyalama rehberi)
- **[docs/PERSONNEL_MAPPING_TEMPLATE.md](docs/PERSONNEL_MAPPING_TEMPLATE.md)** 👥 (ürün sahibi ve takım atama şablonu)

### API Error Responses
`API_MODULES.md` dosyasında HTTP 400, 401, 403, 404, 409, 422, 429, 500 hataları için eksiksiz yanıt örnekleri ve frontend çözüm patterns'ları bulunur.

### Ekran Görüntüleri
`SCREENSHOTS_GUIDE.md` ile rol bazlı 10 key screenshot'ın nereye ve nasıl çekileceği dokümante edilmişdir. Her role ait screenshot'lar `docs/assets/screens/{role}/` klasörüne yerleştirilir.

## 🤝 GitHub Proje Dosyalari

- **[CONTRIBUTING.md](CONTRIBUTING.md)** (katki rehberi)
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** (topluluk davranis kurallari)
- **[SECURITY.md](SECURITY.md)** (guvenlik bildirimi)
- **[SUPPORT.md](SUPPORT.md)** (destek kanallari)
- **[LICENSE](LICENSE)** (GNU GPLv3 lisansi)

GitHub templates ve otomasyon:

- **[.github/ISSUE_TEMPLATE/bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md)**
- **[.github/ISSUE_TEMPLATE/feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md)**
- **[.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)**
- **[.github/CODEOWNERS](.github/CODEOWNERS)**
- **[.github/workflows/ci.yml](.github/workflows/ci.yml)**

## 🔐 Güvenlik & Yapılandırma

`.env` dosyanızı oluşturmayı unutmayın. `server/.env` dosyasında veritabanı bağlantı bilgilerini tanımlayabilirsiniz:

```env
MONGO_URL=mongodb://localhost:27017/iau_ubis
PORT=5000
```

## ✅ Kod Kalite Akışı

### Frontend (client)

```bash
cd client
npm run lint
npm run lint:fix
npm run lint:ci
```

### Backend (server)

```bash
cd server
npm install
npm run lint
npm run lint:fix
npm run lint:ci
```

### Git Pre-commit Hook (Opsiyonel ama önerilir)

Projede [ .githooks/pre-commit ](.githooks/pre-commit) dosyası hazırdır. Etkinleştirmek için:

```bash
git config core.hooksPath .githooks
```

Bu hook commit öncesi client ve server için `lint:ci` çalıştırır.

---
Developed for IAU UBIS Project.
