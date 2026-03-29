# Ozellik Envanteri

Bu dokuman, frontend menusu kaynakli tum rol bazli modulleri ve temel sistem yeteneklerini listeler.

Kaynak dosya: `client/src/config/navigationConfig.jsx`

## Ozet

- Ogrenci: 61 menu ozelligi
- Arastirma Gorevlisi: 16 menu ozelligi
- Ogretim Uyesi: 14 menu ozelligi
- Admin: 13 menu ozelligi

## Feature Ownership ve Screenshot Takibi

Bu tablo, owner/team bilgisini grup seviyesinde takip eder.

| Rol | Grup | Owner | Team | Screenshot Klasoru |
| --- | --- | --- | --- | --- |
| Ogrenci | Genel | Product Owner - Portal | Frontend Platform | `docs/assets/screens/student/` |
| Ogrenci | Akademik | Product Owner - Akademik | Academic Systems | `docs/assets/screens/student/` |
| Ogrenci | Sinavlar | Product Owner - Sinav | Exam Systems | `docs/assets/screens/student/` |
| Ogrenci | Kariyer | Product Owner - Kariyer | Career Services | `docs/assets/screens/student/` |
| Ogrenci | Belgeler & Formlar | Product Owner - Ogrenci Isleri | Student Affairs | `docs/assets/screens/student/` |
| Ogrenci | Kampus Yasami | Product Owner - Kampus | Campus Services | `docs/assets/screens/student/` |
| Ogrenci | Idari & Finans | Product Owner - Finans | Finance and Registrar | `docs/assets/screens/student/` |
| Arastirma Gorevlisi | Genel | Product Owner - Akademik Portal | Frontend Platform | `docs/assets/screens/research-assistant/` |
| Arastirma Gorevlisi | Asistanlik | Product Owner - Fakulte | Academic Operations | `docs/assets/screens/research-assistant/` |
| Arastirma Gorevlisi | Akademik | Product Owner - Akademik | Academic Systems | `docs/assets/screens/research-assistant/` |
| Arastirma Gorevlisi | Akademik Destek | Product Owner - Akademik Destek | Academic Support | `docs/assets/screens/research-assistant/` |
| Arastirma Gorevlisi | Kisisel Gelisim | Product Owner - IK | HR and Learning | `docs/assets/screens/research-assistant/` |
| Arastirma Gorevlisi | Idari | Product Owner - IK | HR Operations | `docs/assets/screens/research-assistant/` |
| Arastirma Gorevlisi | Araclar | Product Owner - Platform | Platform Integrations | `docs/assets/screens/research-assistant/` |
| Ogretim Uyesi | Genel | Product Owner - Akademik Portal | Frontend Platform | `docs/assets/screens/instructor/` |
| Ogretim Uyesi | Akademik | Product Owner - Akademik | Academic Systems | `docs/assets/screens/instructor/` |
| Ogretim Uyesi | Danismanlik | Product Owner - Danismanlik | Academic Advisory | `docs/assets/screens/instructor/` |
| Ogretim Uyesi | Idari | Product Owner - Fakulte | Faculty Operations | `docs/assets/screens/instructor/` |
| Ogretim Uyesi | Araclar | Product Owner - Platform | Platform Integrations | `docs/assets/screens/instructor/` |
| Admin | Genel | Product Owner - Yonetim | Admin Console | `docs/assets/screens/admin/` |
| Admin | Yonetim | Product Owner - Yonetim | Administration | `docs/assets/screens/admin/` |
| Admin | Raporlama | Product Owner - BI | Analytics and Reporting | `docs/assets/screens/admin/` |
| Admin | Sistem | Product Owner - Platform | Platform Operations | `docs/assets/screens/admin/` |

## Screenshot Dosya Kurali

- Dosya adlari route tabanli olmalidir.
- Ornek: `/dashboard/grades` -> `dashboard_grades.png`
- Klasor referansi:
	- `docs/assets/screens/student/`
	- `docs/assets/screens/research-assistant/`
	- `docs/assets/screens/instructor/`
	- `docs/assets/screens/admin/`

## Ogrenci Modulleri

| Grup | Ozellik | Route |
| --- | --- | --- |
| Genel | Anasayfa | /dashboard |
| Genel | E-Posta | /dashboard/emails |
| Genel | Hesap Ayarlari | /dashboard/settings |
| Genel | Yardim ve Destek | /dashboard/support |
| Genel | Dijital Kimlik Karti | /dashboard/digital-id |
| Akademik | Yazildigim Dersler | /dashboard/enrolled-courses |
| Akademik | Ders Programim | /dashboard/schedule |
| Akademik | UZEM - Moodle | /dashboard/moodle |
| Akademik | Bolum Ders Programi | /dashboard/department-schedule |
| Akademik | Devamsizlik Cizelgem | /dashboard/attendance |
| Akademik | Ders Notlarim | /dashboard/grades |
| Akademik | Odevlerim | /dashboard/assignments |
| Akademik | Bolum Derslerim | /dashboard/department-courses |
| Akademik | Online Derslerim | /dashboard/online-courses |
| Akademik | Transkript | /dashboard/transcript |
| Akademik | Ders On Kosullari | /dashboard/prerequisites |
| Akademik | Egitim Bilgi Sistemi | /dashboard/education-info |
| Akademik | Akademik Takvim | /dashboard/academic-calendar |
| Akademik | Bilgi Merkezi | /dashboard/info-center |
| Sinavlar | UZEM Sinavlari | /dashboard/uzem-exams |
| Sinavlar | Muafiyet Sinavi Basvuru | /dashboard/exemption-exam |
| Sinavlar | 2. Yabanci Dil Sinavi | /dashboard/language-exam |
| Sinavlar | Elektronik Sinav Sis. | /dashboard/electronic-exams |
| Sinavlar | Tek Ders Sinavi | /dashboard/single-course-exam |
| Sinavlar | Sinav Programim | /dashboard/exam-schedule |
| Sinavlar | Sinav Sonuclarim | /dashboard/exam-results |
| Kariyer | Kariyer Merkezi | /dashboard/career |
| Kariyer | Staj Bilgilerim | /dashboard/internship |
| Kariyer | Is / Staj Ilanlari | /dashboard/job-postings |
| Kariyer | Kismi Zamanli Calisma | /dashboard/part-time-work |
| Kariyer | Online CV Formu | /dashboard/cv-form |
| Kariyer | SEM Egitimleri | /dashboard/sem-courses |
| Kariyer | Mezunlar Platformu | /dashboard/alumni |
| Kariyer | Yerinde Uygulama (YUM) | /dashboard/yum |
| Belgeler & Formlar | Anketler & Formlar | /dashboard/surveys |
| Belgeler & Formlar | Form ve Belgeler | /dashboard/documents |
| Belgeler & Formlar | Sozlesme Olusturma | /dashboard/contracts |
| Belgeler & Formlar | KVKK Aydinlatma | /dashboard/kvkk |
| Kampus Yasami | Yemekhane Menusu | /dashboard/dining-menu |
| Kampus Yasami | Kutuphane | /dashboard/library |
| Kampus Yasami | Ring Seferleri | /dashboard/shuttle-schedule |
| Kampus Yasami | Sosyal Karne | /dashboard/social-transcript |
| Kampus Yasami | Ogrenci Kulupleri | /dashboard/student-clubs |
| Kampus Yasami | Saglik Merkezi | /dashboard/health-center |
| Kampus Yasami | Etkinlik Takvimi | /dashboard/events |
| Kampus Yasami | Spor Tesisleri | /dashboard/sports |
| Kampus Yasami | IAU Radyo / TV | /dashboard/radio-tv |
| Kampus Yasami | Kayip Esya | /dashboard/lost-found |
| Kampus Yasami | Oneri & Sikayet | /dashboard/suggestions |
| Kampus Yasami | Yurt Islemleri | /dashboard/dormitory |
| Kampus Yasami | Sanal Tur | /dashboard/virtual-tour |
| Idari & Finans | Kayit Bilgisi | /dashboard/registration-info |
| Idari & Finans | Ders Kayit Islemleri | /dashboard/course-registration |
| Idari & Finans | Finans ve Cuzdan | /dashboard/payments |
| Idari & Finans | Burs ve Indirimlerim | /dashboard/scholarships |
| Idari & Finans | Mezuniyet Islemleri | /dashboard/graduation |
| Idari & Finans | Kutuphane Borclari | /dashboard/library-fines |
| Idari & Finans | Kartli Gecis Loglari | /dashboard/access-logs |
| Idari & Finans | Arac Pulu Islemleri | /dashboard/vehicle-sticker |
| Idari & Finans | Erasmus / Degisim | /dashboard/erasmus |
| Idari & Finans | Saglik Raporlari | /dashboard/health-reports |

## Arastirma Gorevlisi Modulleri

| Grup | Ozellik | Route |
| --- | --- | --- |
| Genel | Anasayfa | /dashboard |
| Genel | E-Posta | /dashboard/emails |
| Genel | Randevu Takvimi | /dashboard/appointments |
| Genel | Hesap Ayarlari | /dashboard/settings |
| Asistanlik | Gozetmenliklerim | /dashboard/proctoring |
| Asistanlik | Laboratuvarlarim | /dashboard/labs |
| Asistanlik | Bolum Gorevleri | /dashboard/dept-tasks |
| Akademik | Ders Programi | /dashboard/schedule |
| Akademik | Sinav Programi | /dashboard/exam-schedule |
| Akademik Destek | Tez/Proje Asistanligi | /dashboard/thesis-support |
| Akademik Destek | Sinav Okuma Destegi | /dashboard/grading-support |
| Kisisel Gelisim | Akademik Takip | /dashboard/academic-progress |
| Kisisel Gelisim | Egitimler | /dashboard/trainings |
| Idari | Izin Islemleri | /dashboard/leave-management |
| Araclar | Kutuphane Veritabanlari | /dashboard/library-db |
| Araclar | Oda Rezervasyonu | /dashboard/room-booking |

## Ogretim Uyesi Modulleri

| Grup | Ozellik | Route |
| --- | --- | --- |
| Genel | Anasayfa | /dashboard |
| Genel | E-Posta | /dashboard/emails |
| Genel | Randevu Takvimi | /dashboard/appointments |
| Genel | Hesap Ayarlari | /dashboard/settings |
| Akademik | Verilen Dersler | /dashboard/teaching-courses |
| Akademik | Ders Programi | /dashboard/schedule |
| Akademik | Not Girisi | /dashboard/grading |
| Danismanlik | Ogrencilerim | /dashboard/advisees |
| Danismanlik | Tez/Proje Yonetimi | /dashboard/thesis |
| Idari | Izin Islemleri | /dashboard/leave-management |
| Idari | Belge Yonetimi | /dashboard/documents |
| Araclar | UZEM - Moodle | /dashboard/moodle |
| Araclar | Kutuphane Veritabanlari | /dashboard/library-db |
| Araclar | Oda Rezervasyonu | /dashboard/room-booking |

## Admin Modulleri

| Grup | Ozellik | Route |
| --- | --- | --- |
| Genel | Panel Anasayfa | /dashboard |
| Genel | Kampus Ikizi | /dashboard/campus-map |
| Genel | Sistem Analitigi | /dashboard/analytics |
| Yonetim | Kullanici Yonetimi | /dashboard/users |
| Yonetim | Akademik Kokpit | /dashboard/academics |
| Yonetim | Bolum / Fakulte | /dashboard/departments |
| Yonetim | Ders Atamalari | /dashboard/course-assignments |
| Raporlama | Akademik Raporlar | /dashboard/academic-reports |
| Raporlama | Sistem Loglari | /dashboard/logs |
| Raporlama | Mali Raporlar | /dashboard/financial-reports |
| Sistem | Genel Ayarlar | /dashboard/system-settings |
| Sistem | Veritabani Yedekleme | /dashboard/backup |
| Sistem | Kurumsal Mesajlar | /dashboard/emails |

## Sistem Geneli Teknik Ozellikler

- JWT tabanli kimlik dogrulama
- CSRF korumasi (`/api/csrf-token` + yazma isteklerinde token)
- Redis destekli rate limiting (hazir degilse memory fallback)
- Socket.io ile gercek zamanli bildirimler
- RabbitMQ consumer ile asenkron bildirim akislar
- MeiliSearch tabanli arama altyapisi
- Swagger tabanli API dokumantasyonu (`/api-docs`)
- Docker tabanli dev/prod calisma dosyalari
