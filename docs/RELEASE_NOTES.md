# Release Notes

Bu dosya, surum bazli degisiklik ozetlerini tutar.

## [Unreleased]

### Added

- Docs klasoru kuruldu ve temel dokumanlar eklendi (`FEATURES`, `API_MODULES`, `ARCHITECTURE`, `DEPLOYMENT`).
- Rol bazli ozellik envanteri ve ownership/screenshot matrisi eklendi.
- Dokuman gorselleri icin `docs/assets/screens/*` klasor yapisi olusturuldu.

### Changed

- Root `README.md` icinde production compose referansi `docker/docker-compose.prod.yml` olarak guncellendi.
- `docs/API_MODULES.md` endpoint ornekleri ve request/response bloklari ile genisletildi.

### Fixed

- Dokumanlar arasi dosya adlandirma tutarsizliklari duzeltildi.

## Surum Notu Sablonu

Yeni surum acarken bu yapıyı kopyalayin:

```md
## [vX.Y.Z] - YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Fixed
- ...

### Removed
- ...
```
