# UBIS — Üniversite Bilgi Sistemi

İstanbul Aydın Üniversitesi için geliştirilmiş kapsamlı Öğrenci Bilgi Sistemi.

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 19, Vite, TailwindCSS, Zustand, Socket.io-client |
| Backend | Express 5, Mongoose 9, MongoDB 7 |
| Kimlik Doğrulama | JWT, bcrypt, CSRF (csrf-csrf), Google OAuth |
| Gerçek Zamanlı | Socket.io, RabbitMQ |
| Arama | MeiliSearch |
| Önbellek | Redis |
| İzleme | Prometheus, Grafana, Winston |
| Test | Jest, Supertest (server), Cypress (client) |
| Dağıtım | Docker, Kubernetes, GitHub Actions CI |

## Hızlı Başlangıç

### Gereksinimler

- Node.js 20+
- MongoDB 7+
- Redis 7+
- RabbitMQ 3+ (isteğe bağlı)
- MeiliSearch 1.6+ (isteğe bağlı)

### Docker ile Çalıştırma (Önerilen)

```bash
cd docker
cp .env.example .env        # Ortam değişkenlerini düzenleyin
docker compose up -d
```

Uygulama: http://localhost:5173 | API: http://localhost:5000 | Swagger: http://localhost:5000/api-docs

### Manuel Kurulum

```bash
# Server
cd server
cp .env.example .env        # Ortam değişkenlerini düzenleyin
npm install
npm run dev

# Client (ayrı terminalde)
cd client
npm install
npm run dev
```

## Testler

```bash
cd server
npm test          # Jest testleri (58 test)
```

```bash
cd client
npx cypress open  # E2E testler
```

## Proje Yapısı

```
├── client/          # React SPA (85+ sayfa)
├── server/          # Express API (23 controller, 21 model)
├── docker/          # Docker Compose (dev, prod, monitoring)
├── k8s/             # Kubernetes manifests
├── scripts/         # Veri oluşturma scriptleri
└── .github/         # CI/CD pipeline
```

## API Dokümantasyonu

Swagger UI: `http://localhost:5000/api-docs`

## Lisans

GPL-3.0-or-later
