# Kurulum ve Geliştirme Ortamı Rehberi

Bu dokuman, UBIS'i yerel geliştirme ortamında kurmak ve çalıştırmak için adım adım talimatları içerir.

## Ön Koşullar

Aşağıdaki yazılımları bilgisayarınızda kurulu olmalıdır:

| Yazılım | Sürüm | İndirme Linki |
| --- | --- | --- |
| Node.js | 18+ | https://nodejs.org/ |
| npm | 9+ | Node.js ile birlikte geliyor |
| Docker | 24+ | https://docker.com/products/docker-desktop |
| Git | 2.40+ | https://git-scm.com/ |

### Windows Kullanıcıları İçin

**Optional**: WSL2 (Windows Subsystem for Linux) ile Linux ortamında çalıştırabilirsiniz:

```powershell
# WSL2'yi etkinleştir
wsl --install

# Linux dağıtımı kur (Ubuntu 22.04 önerilir)
wsl --install -d Ubuntu-22.04
```

---

## 1️⃣ Projeyi İndir

```bash
# GitHub'tan clone et
git clone https://github.com/yourusername/ubis.git
cd ubis

# Bağımlılıkları yükle
cd client
npm install

cd ../server
npm install

cd ../docker
# Docker Compose zaten yüklü, ek kurulum yok
```

---

## 2️⃣ Ortam Değişkenlerini Ayarla

### Server Ortamı (.env dosyası)

`server/.env` dosyasını oluştur:

```env
# Database
MONGO_URL=mongodb://mongo:27017/iau_ubis

# Server Port
PORT=5000
NODE_ENV=development

# JWT Secret (güvenlik için uzun rastgele string)
JWT_SECRET=your_super_secret_jwt_key_use_a_very_long_random_string_here_12345

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (Docker Compose'da cacheDir yoksa in-memory)
REDIS_URL=redis://redis:6379

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest

# MeiliSearch
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_API_KEY=your_meilisearch_api_key

# CSRF Protection
CSRF_SECRET=another_super_secret_csrf_key

# Logging (Optional)
LOG_LEVEL=debug
```

### Client Ortamı (.env dosyası)

`client/.env` dosyasını oluştur:

```env
# API Backend
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Environment
VITE_ENV=development

# Feature Flags (Optional)
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

---

## 3️⃣ Development Ortamını Başlat

### Seçenek A: Docker Compose ile (Önerilir)

```bash
cd docker

# Development compose dosyasını başlat
docker compose -f docker-compose.yml up -d

# Servislerin ayaklanmasını kontrol et (~30 saniye)
docker compose ps

# Backend loglarını görmek için
docker compose logs -f server

# Frontend loglarını görmek için (başka terminal)
docker compose logs -f client
```

**Kontrol**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/api-docs
- MeiliSearch: http://localhost:7700
- MongoExpress (DB UI): http://localhost:8081

### Seçenek B: Manuel Başlatma (Linux/Mac)

```bash
# Terminal 1: Backend
cd server
npm run dev  # nodemon ile auto-restart

# Terminal 2: Frontend
cd client
npm run dev  # Vite dev server

# Terminal 3: MongoDB (Docker container)
docker run -d --name mongo -p 27017:27017 mongo:latest

# Terminal 4: Redis (Docker container)
docker run -d --name redis -p 6379:6379 redis:latest

# Terminal 5: RabbitMQ (Docker container)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

---

## 4️⃣ Veri Tabanını Başlat (Seeding)

İlk kez çalıştırıyorsan, örnek veri yükleme (seeding):

```bash
cd server

# Temel veri yükle
npm run seed

# Veya gerçekçi öğrenci verisi yükle
npm run seed:real-data
```

**Kontrol**: MongoExpress (http://localhost:8081) adresine gidip `iau_ubis` database'sinde koleksiyonları görebilirsin.

---

## 5️⃣ Geliştirmeye Başla

### Frontend Geliştirme

```bash
cd client

# Development server başlat (port 3000)
npm run dev

# Veya Vite preview mode
npm run preview

# ESLint ile kod kalitesini kontrol et
npm run lint

# Otomatik düzeltme
npm run lint:fix

# Build (production test)
npm run build
```

### Backend Geliştirme

```bash
cd server

# Development server (nodemon ile auto-reload)
npm run dev

# Veya production build'i test et
npm run build
npm start

# Tests çalıştır
npm test
```

---

## 6️⃣ Yaygın Sorunlar ve Çözümleri

### Problem: "Connection refused" - MongoDB

```bash
# Docker container'ın çalışmasını kontrol et
docker ps | grep mongo

# Eğer çalışmıyorsa:
docker compose up -d mongo
```

### Problem: "Port zaten kullanımda"

```bash
# Port 5000'i kullanan process'i bul ve kapat
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Problem: npm paketleri yüklenmedi

```bash
# node_modules'ü sil ve yeniden yükle
rm -rf node_modules package-lock.json
npm install

# Veya cache'i temizle
npm cache clean --force
npm install
```

### Problem: Docker image'ları stale (eski)

```bash
# Yeni build yap
docker compose build --no-cache

# Sonra başlat
docker compose up -d
```

### Problem: MongoDB "permission denied"

Docker'da volume permissions sorunu:

```bash
# Linux'da:
sudo docker compose up -d

# Veya ownership'i düzelt
sudo chown -R $USER:$USER docker/data/
```

---

## 7️⃣ Debugging

### Browser DevTools

**Chrome/Edge**:
- F12 açılır → Console, Network, Components tabs kullan
- Network tab'de API requests' ve responses görebilirsin

### VS Code Debugger

**Backend debugging** (.vscode/launch.json):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/server/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

**Frontend debugging**:
- VS Code extension: "Debugger for Chrome" kur
- F5 ile başlat

### Logs Okuma

```bash
# Docker logs (last 50 lines)
docker compose logs --tail=50

# Real-time logs
docker compose logs -f

# Specific service logs
docker compose logs -f server
docker compose logs -f client
```

---

## 8️⃣ Production Benzeri Ortam

Gerçek production'a yakın test:

```bash
cd docker

# Production compose dosyasını kullan
docker compose -f docker-compose.prod.yml up -d

# Frontend http://localhost (nginx reverse proxy)
# Backend http://localhost/api
```

---

## 9️⃣ Clean Up

Tüm containers ve volumes'u temizle:

```bash
# Containers ve networks sil
docker compose down

# Volumes da sil (data kaybı!)
docker compose down -v

# Tüm UBIS images sil
docker rmi ubis-client ubis-server

# System cleanup
docker system prune -a
```

---

## 🔟 IDE Önerileri

### VS Code Extensions

```
- ESLint
- Prettier - Code formatter
- MongoDB for VS Code
- Docker
- REST Client (API testing)
- Tailwind CSS IntelliSense
- Thunder Client (Postman alternative)
```

### Ayarlar (settings.json)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Next Steps

1. ✅ Kurulum tamamlandı
2. → [FEATURES.md](FEATURES.md): Tüm özellikleri keşfet
3. → [API_MODULES.md](API_MODULES.md): Backend API'sını öğren
4. → [CONTRIBUTING.md](../CONTRIBUTING.md): Kod katkısı prosedürü

---

## Destek

Sorun yaşarsan:

- 📖 [GitHub Issues](https://github.com/yourusername/ubis/issues) - Zaten yapılmış soru var mı?
- 💬 [Discussions](https://github.com/yourusername/ubis/discussions) - Soru sor, fikirleş
- 📧 Email: tech-team@example.com
