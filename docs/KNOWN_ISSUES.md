# Known Issues

Bu dosya, bilinen problemleri gecici cozumleriyle takip eder.

## Acik Konular

| ID | Baslik | Etki | Gecici Cozum | Kalici Cozum Durumu |
| --- | --- | --- | --- | --- |
| KI-001 | Development compose bazen rebuild sirasinda uzun sure aliyor | Orta | `docker compose ... up -d --build` yerine hedef servis bazli build yapin | Inceleniyor |
| KI-002 | Buyuk frontend chunk uyarilari (`vite build`) | Dusuk/Orta | Dynamic import parcalamasi adim adim uygulanabilir | Planlandi |
| KI-003 | Dokuman ekran goruntulerinin bir kismi henuz eklenmedi | Dusuk | `docs/assets/screens/*` altina route bazli ekran goruntusu ekleyin | Devam ediyor |

## Kapatilan Konular

| ID | Baslik | Cozum Ozeti | Kapanis Tarihi |
| --- | --- | --- | --- |
| KI-000 | Production compose dosya adi karmasasi | Standart dosya adi olarak `docker-compose.prod.yml` kullanildi | 2026-03-29 |

## Issue Ekleme Kurali

1. ID formati `KI-###` kullanin.
2. Etki alanini net yazin (Dusuk, Orta, Yuksek).
3. Gecici cozum yazmadan issue eklemeyin.
4. Kapanan issue satirlarini silmeyin; `Kapatilan Konular` bolumune tasiyin.
