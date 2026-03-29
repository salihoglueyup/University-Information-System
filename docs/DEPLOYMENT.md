# Calistirma ve Dagitim Rehberi

## 1) Development (Docker)

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

Notlar:

- Host backend portu `.env` ile degistirilebilir (`SERVER_PORT`).
- Vite dev server genelde `http://localhost:5173` uzerinden erisilir.

## 2) Production Benzeri Ortam (Docker)

Bu repoda aktif production compose dosyasi:

- `docker/docker-compose.prod.yml`

Calistirma:

```bash
docker compose -f docker/docker-compose.prod.yml up -d --build
```

Temiz yeniden baslatma:

```bash
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d --build
```

## 3) Hizli Kontroller

Container durumu:

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Server loglari:

```bash
docker logs ubis_server_prod --tail 200
```

Client loglari:

```bash
docker logs ubis_client_prod --tail 200
```

## 4) Lokal (Docker'siz)

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```
