# Dokumantasyon Sureci

Bu dosya, proje dokumanlarinin nasil guncellenecegini standartlastirir.

## Ne Zaman Guncelleme Yapilir

- Yeni ekran/ozellik eklendiginde: `FEATURES.md`
- Yeni endpoint eklendiginde: `API_MODULES.md`
- Altyapi veya klasor yapisi degistiginde: `ARCHITECTURE.md` ve/veya `DEPLOYMENT.md`
- Surum kapanisinda: `RELEASE_NOTES.md`
- Bilinen bug olustugunda: `KNOWN_ISSUES.md`

## PR Checklist (Dokuman)

- [ ] Ozellik degisikligi varsa ilgili route/ekran dokumani guncellendi.
- [ ] Gerekliyse ekran goruntusu `docs/assets/screens/*` altina eklendi.
- [ ] API degisikligi varsa request/response ornekleri kontrol edildi.
- [ ] Release notes `Unreleased` bolumu guncellendi.
- [ ] Bilinen issue acildiysa `KNOWN_ISSUES.md` kaydi eklendi.

## Yazim Standarti

- Basliklar ve tablolar tutarli olsun.
- Kisa ve eylem odakli ifadeler kullanin.
- Teknik terimlerde dosya/yol adlarini birebir yazin.
- Gereksiz uzun paragraflardan kacinin.
