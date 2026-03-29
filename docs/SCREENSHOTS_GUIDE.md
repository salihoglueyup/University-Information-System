# Screenshot Çekim Rehberi

Bu dokuman, UBIS projesi için gerekli olan temel screenshot'ları ve çekme işlemlerini standartlaştırır.

## Çekim Standartları

- **Resolüsyon**: Browser view 1600px genişlik (responsive view)
- **Format**: PNG (lossless)
- **Adlandırma**: Route tabanli, örn: `/dashboard/grades` → `dashboard_grades.png`
- **Lokasyon**: `docs/assets/screens/{role}/` klasörüne yerleş
- **İçerik**: Real UBIS data ile gerçek ekran (fixture data olmadan)

## Öğrenci Rolü - 3 Key Screenshot (Toplam 3)

| # | Sayfa | Route | Dosya Adı | Sebep | Cherklist |
| --- | --- | --- | --- | --- | --- |
| 1 | Anasayfa / Dashboard | `/dashboard` | `dashboard_home.png` | Role landing page, ilk göruş | ☐ Sidebar visible ☐ Course stats loaded ☐ Announcements widget ☐ Schedule next week visible |
| 2 | Ders Notlarım | `/dashboard/grades` | `dashboard_grades.png` | Akademik bilgi, GPA display | ☐ Course table with grades ☐ Transcript calculations ☐ Semester averages ☐ GPA display |
| 3 | Ders Programım | `/dashboard/schedule` | `dashboard_schedule.png` | Temporal view, course locations | ☐ Weekly calendar grid ☐ Multiple courses visible ☐ Times/locations clear ☐ Responsive layout |

**Lokasyon**: `docs/assets/screens/student/`

## Araştırma Görevlisi Rolü - 2 Key Screenshot (Toplam 2)

| # | Sayfa | Route | Dosya Adı | Sebep | Checklist |
| --- | --- | --- | --- | --- | --- |
| 1 | Anasayfa | `/dashboard` | `dashboard_home.png` | TA-specific widgets, kapasite data | ☐ Faculty stats ☐ Advising queue ☐ Lab duties ☐ Announcement feed |
| 2 | Danışmanlık / Advising | `/dashboard/advising` | `dashboard_advising.png` | TA-specific academic role | ☐ Student list ☐ Advising notes/status ☐ Course recommendations ☐ Meeting scheduler |

**Lokasyon**: `docs/assets/screens/research-assistant/`

## Öğretim Üyesi Rolü - 2 Key Screenshot (Toplam 2)

| # | Sayfa | Route | Dosya Adı | Sebep | Checklist |
| --- | --- | --- | --- | --- | --- |
| 1 | Anasayfa | `/dashboard` | `dashboard_home.png` | Instructor widgets, teaching load | ☐ Course list ☐ Grading queue ☐ Student announcements ☐ Schedule |
| 2 | Notlandırma Sayfası | `/dashboard/grading` | `dashboard_grading.png` | Core instructor role | ☐ Student submission list ☐ Grade entry form ☐ Feedback interface ☐ Bulk actions |

**Lokasyon**: `docs/assets/screens/instructor/`

## Admin Rolü - 3 Key Screenshot (Toplam 3)

| # | Sayfa | Route | Dosya Adı | Sebep | Checklist |
| --- | --- | --- | --- | --- | --- |
| 1 | Admin Paneli / Dashboard | `/dashboard` | `dashboard_home.png` | System overview, health metrics | ☐ User count stats ☐ System load ☐ Recent activities ☐ Critical alerts |
| 2 | Kullanıcı Yönetimi | `/dashboard/users` | `dashboard_users.png` | RBAC management, permission view | ☐ User table with roles ☐ Filter/search ☐ Role assignment controls ☐ Status indicators |
| 3 | Raporlama / Analytics | `/dashboard/analytics` | `dashboard_analytics.png` | Data insights, business metrics | ☐ Chart/graph examples ☐ Date range selector ☐ Export options ☐ Drill-down capability |

**Lokasyon**: `docs/assets/screens/admin/`

## Çekim Prosedürü

### Ön-Çekim (Pre-capture)

1. Production compose başlat: `docker compose -f docker-compose.prod.yml up -d`
2. Dashboard'a giriş yap (relevant role account ile):
   - Öğrenci: `student@ubis.local` / `password123`
   - TA: `ta@ubis.local` / `password123`
   - Instructor: `instructor@ubis.local` / `password123`
   - Admin: `admin@ubis.local` / `password123`
3. Browser'ı 1600px genişliğe ayarla (F12 Developer Tools → Toggle device toolbar)

### Çekim Adımları

1. İlgili sayfaya navigasyon yap
2. Page tamamen yüklünü bekle (spinners kaybolsun)
3. Browser console'de error olmadığını doğrula (F12 → Console)
4. Screenshot al (Chrome: Ctrl+Shift+S → Capture node; Edge: Ctrl+Shift+S; Firefox: Shift+F2 → screenshot)
5. Dosyayı ilgili klasöre kaydet (dosya adı standardına uygun)

### Sonrasında (Post-capture)

1. Dosya boyutunu optimize et (`ImageMagick` veya `pngquant` ile):
   ```bash
   # Example: Compress PNG
   pngquant --quality 80-95 dashboard_grades.png -o dashboard_grades_opt.png
   ```
   
2. Git'e ekle:
   ```bash
   git add docs/assets/screens/*/dashboard_*.png
   git commit -m "docs: add role-based dashboard screenshots"
   ```

3. FEATURES.md'de screenshot path'ini güncelle (varsa)

## Alternatif: Placeholder-First Approach (Acil Durum)

Eğer gerçek screenshot çekmek mümkün değilse, aşağıdaki template'i kullanabilirsin:

```markdown
TODO: Screenshot gerekli - `/dashboard/grades` 
- Henüz deployed demo ortamında çekilmemiş
- Placeholder: [docs/assets/screens/student/dashboard_grades_placeholder.md](...)
```

## Screenshot Kontrolü

Ekle sonrasında, hızlı kontrol listesi:

```bash
# Dosya varlığını doğrula
ls -la docs/assets/screens/student/*.png
ls -la docs/assets/screens/research-assistant/*.png
ls -la docs/assets/screens/instructor/*.png
ls -la docs/assets/screens/admin/*.png

# Bayt boyutunu kontrol et (optimal: <100KB per image)
du -h docs/assets/screens/*/*.png
```

## Durum Takibi

### Tamamlandı ✅
- [ ] Student: `dashboard_home.png`
- [ ] Student: `dashboard_grades.png`
- [ ] Student: `dashboard_schedule.png`
- [ ] Research Assistant: `dashboard_home.png`
- [ ] Research Assistant: `dashboard_advising.png`
- [ ] Instructor: `dashboard_home.png`
- [ ] Instructor: `dashboard_grading.png`
- [ ] Admin: `dashboard_home.png`
- [ ] Admin: `dashboard_users.png`
- [ ] Admin: `dashboard_analytics.png`

**Toplam**: 10/10 screenshot

## Notlar

- Her role için `/dashboard` home page'i farklı widget'lar gösterir (AcademicDashboard vs StudentDashboard vs AdminDashboard)
- Screenshot timestamp'ı `.gitignore`'a eklenmemeli (versionlama için gerekli)
- Real data ile çekilmesi önemli - fixture/fake data görselleri misleading olabilir
