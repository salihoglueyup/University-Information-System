# Mimari ve Klasor Yapisi

## Genel Mimari

- Frontend: React 19 + Vite
- Backend: Node.js + Express 5
- Veritabani: MongoDB (Mongoose)
- Cache/Queue/Search: Redis, RabbitMQ, MeiliSearch
- Container: Docker Compose

## Calisma Akisi (Ust Seviye)

1. Kullanici frontend uzerinden giris yapar.
2. Frontend, JWT/CSRF ile backend API'lerine erisir.
3. Backend is kurallarini calistirir, MongoDB ile veri okur/yazar.
4. Gercek zamanli bildirimler Socket.io ve RabbitMQ ile dagitilir.
5. Arama akislari MeiliSearch ile hizlandirilir.

## Ana Dizinler

| Yol | Aciklama |
| --- | --- |
| `client/` | React uygulamasi |
| `client/src/pages/` | Dashboard ve alt sayfalar |
| `client/src/config/` | API ve navigasyon konfigurasyonu |
| `server/` | Express uygulamasi |
| `server/controllers/` | Domain kontrolorleri |
| `server/routes/` | API route modulleri |
| `server/models/` | Mongoose modelleri |
| `docker/` | Dockerfile ve compose dosyalari |
| `k8s/` | Kubernetes manifestleri |
| `scripts/` | Veri uretim/yardimci scriptler |
| `docs/` | Teknik ve islevsel dokumantasyon |

## Guvenlik Notlari

- CORS origin degeri `CLIENT_URL` ile kontrol edilir.
- CSRF korumasi `/api` altinda uygulanir.
- NoSQL injection icin sanitize middleware kullanilir.
- Rate limit Redis hazir degilse memory fallback ile devam eder.
