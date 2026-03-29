# Sık Sorulan Sorular (FAQ)

## 📚 Temel Sorular

### S: UBIS ne?
**C:** UBIS (Üniversite Bilgi Sistemi), üniversite akademik ve idari işlemlerini dijitalleştiren, modern teknolojilerle geliştirilmiş kapsamlı bir web uygulamasıdır. Öğrenciler ders kaydı, not görüntüleme, sınav takvimi ve finansal takip yapabilir. Akademisyenler not girişi, danışmanlık ve tezleri yönetebilir.

### S: UBIS'i kullanmak için neler gerekli?
**C:** 
- Modern bir web tarayıcısı (Chrome, Firefox, Edge, Safari)
- İnternet bağlantısı
- Geçerli bir üniversite e-postası (giriş için)

Herhangi bir yazılım kurulumuna gerek yok.

### S: UBIS'e nasıl giriş yaparım?
**C:** 
1. https://ubis.example.com adresine git
2. E-posta ve şifreni gir
3. Rol türüne göre entsprechend dashboard'a yönlendirileceksin

Şifreni unuttuysan "Şifremi Unuttum" linkine tıkla.

### S: Rol nedir? Farklı roller ne demek?
**C:** Sistemde 4 farklı rol vardır:

| Rol | Erişim | Işlevler |
| --- | --- | --- |
| **Öğrenci** | Kendi bilgileri | Ders kaydı, not görüntüleme, belge isteme |
| **Araştırma Görevlisi (TA)** | Öğrenci + mentoring | Tez danışmanlık, advising, lab yönetimi |
| **Öğretim Üyesi** | Kurs ve notları | Not girişi, assignment yönetimi, sınav oluşturma |
| **Admin** | Sistem geneli | Kullanıcı yönetimi, raporlar, sistem ayarları |

---

## 🔐 Güvenlik ve Gizlilik

### S: Şifrelerim güvende mi?
**C:** Evet. Parolalar:
- **Hashed** (bcrypt algoritmasıyla)
- **Asla plaintext** olarak kaydedilmez
- **HTTPS** üzerinden iletilir
- Sunucuda hash olarak tutulur (original parola asla görülmez)

### S: Kişisel verilerim kimlerin erişebileceği?
**C:** 
- Sadece **resmî üniversite personeli** ve **sizin** erişebilir
- KVKK'ya uygun veri koruması uygulanır
- Veri satışı ya da üçüncü tarafa aktarımı yapılmaz
- UBIS'in [Gizlilik Politikası](PRIVACY.md)'na bakabilirsin

### S: 2 Faktörlü Kimlik Doğrulama (2FA) nedir?
**C:** Ekstra güvenlik katmanı. Şifresini girdikten sonra cep telefonuna gelen kodu da girmek gerekir. Henüz optional'dır ama etkinleştirilebilir.

### S: Oturumuma timeout oluyor mu?
**C:** Evet. Güvenlik için:
- **İstatistik olmayan sayfalar**: 24 saat
- **Finansal işlemler**: 30 dakika
- Timeout'a girdiysen tekrar giriş yap

---

## 📱 Teknik Sorular

### S: UBIS mobil cihazlarda çalışır mı?
**C:** Evet! UBIS **responsive design** ile tasarlandı:
- Tablet'lerde tam fonksiyon
- Cep telefonunda (iphone, Android) tam fonksiyon
- **PWA** (Progressive Web App) desteği → ekranda kısayol oluşturabilirsin

### S: Hangi tarayıcılar destekleniyor?
**C:** 
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Eski tarayıcılar kullanıyorsan güncelleştir.

### S: UBIS'i offline kullanabilir miyim?
**C:** Kısmen. PWA özelliği sayesinde:
- Son ziyaret ettiğin sayfalar cache'lenmiş
- Bazı temel işlemler çalışır (okuma)
- Veri gönderimi offline'da çalışmaz - bağlantı gerekir

### S: UBIS'in API'sine erişebilir miyim?
**C:** Evet! [API_MODULES.md](API_MODULES.md) dokümantasyona bakabilirsin. API KEY almak için tech-team@example.com iletişim kur.

---

## 🛠️ Teknik Sorunlar

### S: "Connection Refused" hatası alıyorum
**C:** 
1. İnternet bağlantınızı kontrol et
2. Tarayıcı konsolunda (F12) hata mesajını oku
3. UBIS'in ayakta olup olmadığını kontrol et: https://ubis.example.com/health
4. VPN varsa kapat/aç
5. Hala sorun varsa **bug report** açtır

### S: Sayfa çok yavaş yükleniyor
**C:**
- Sayfayı **yenile** (F5 ya da Ctrl+R)
- **Cache temizle** (Ctrl+Shift+Delete)
- **Kullanmadığın browser tablarını** kapat
- **Başka bir tarayıcı** dene
- Admin panelinden [sistem sağlık](https://ubis.example.com/admin/health) kontrol et

### S: Dosya yüklemesi başarısız
**C:**
- Dosya boyutu limit'i aşıyor mı? (Max 50MB)
- Dosya formatı destekleniyor mu? (PDF, DOCX, PNG, JPG)
- İnternet bağlantısı kararlı mı?
- Dosya ismi Türkçe karakterler içeriyor mu? → ASCII harflere çevir

### S: Not ve sınav notları görünmüyor
**C:**
1. Browser cache'sini temizle
2. Sayfayı yenile
3. Not giriş tarihi geçti mi? (Akademik takvime bak)
4. Hala görünmüyorsa sistem admin'e bildir

---

## ✏️ Akademik İşlemler

### S: Ders kaydını ne zaman yapabilirim?
**C:** Akademik takvime göre **kayıt dönemleri** belirlenir. Genellikle:
- **Bahar (Şubat)**: Bahar dersleri kaydı
- **Güz (Ağustos)**: Güz dersleri kaydı
- **Yaz (Haziran)**: Yaz okulu kaydı

Akademik Takvim sayfasında tarihler görebilirsin.

### S: Ders almıştım ama sisteme kayıtlı değil
**C:**
1. Kayıt dönemi henüz kapatılmış mı?
2. Akademik takvim kontrol et
3. E-devlet sistemiyle sinkronizasyon sorunu varsa 24 saat bekle
4. Hala sorun varsa Student Services'e gönder

### S: Notu yanlış girildi, nasıl düzeltebilirim?
**C:**
- **Öğrenci olarak**: Direkt düzeltemezsin. İlgili öğretim üyesinin düzeltmesi gerek
- **Öğretim üyesi olarak**: Dashboard'da "Edit Grade" tıkla
- Hata varsa resmî şikâyet (appeal) işlemi başlat

### S: Transkript ne zaman hazır olur?
**C:** 
- Semesterin bitiş tarihinden sonra **5 iş günü**
- GPA otomatik hesaplanır
- PDF indir veya resmî belge iste

### S: Double Major (Çift Alanı) takibi nasıl yapılır?
**C:** Double Major işle henüz UBIS'de tam entegre değil. Manual olarak Student Services'e danış.

---

## 💰 Ödeme ve Finans

### S: Harç borçlum var mı?
**C:** 
1. Dashboard'un "Finans" bölümüne git
2. "My Outstanding Balances" bölümünü kontrol et
3. Borç varsa öde (kredi kartı, banka transferi)

Ödeme yapmazsan sınav yapamaz ve belge alamazsın.

### S: Ödeme işlemini başlattım ama tamamlanmadı
**C:**
- Banka onayında mı? → Banka ile iletişim kur
- System'de görenmiyor? → 24 saat gecikme normal
- Hala sorun varsa Finance office'e gönder

### S: Burrs veya burslu miyim?
**C:** 
1. Dashboard'da "Scholarship & Support" bölümüne gidiyorum
2. Burs durumunu ve miktarını görebilirsin
3. Yeni burs başvurgusu yap (başvuru dönemi açık ise)

---

## 👥 İletişim ve Destek

### S: Sorun yaşayıp, kime bildireceğim?
**C:** 
- **Teknik Sorun**: tech-support@ubis.local
- **Akademik Sorun**: student-services@ubis.local
- **Kütüphane**: library@ubis.local
- **Yurt vb Kampüs**: campus.life@ubis.local

---

## 🚀 Geliştirici Soruları

### S: UBIS'i fork'layıp kendi üniversitelerim için kullanabilir miyim?
**C:** Evet! UBIS açık kaynak, **GNU GPLv3** lisansı altında. [LICENSE](../LICENSE) dosyasına bakabilirsin. Derlemeler ve katkılar hoş karşılanır!

### S: Yeni feature eklemek istiyorum, prosedür nedir?
**C:** 
1. [CONTRIBUTING.md](../CONTRIBUTING.md) dokümantasyonunu oku
2. Issue açtır (feature request)
3. Discussion'da fikirleş
4. PR (Pull Request) gönder
5. Code review'dan sonra merge edilir

### S: UBIS test'lerini nasıl çalıştırabilirim?
**C:** 
```bash
cd server
npm test

cd ../client
npm run test
```

### S: Dokümantasyon önerim var
**C:** 
1. GitHub issue açtır
2. Ya da direkt `docs/` klasöra PR gönder
3. Tüm katkılar değerli!

---

## 🎓 Eğitim Materyalleri

### S: UBIS'teki öğrenme modülleri nedir?
**C:** 
- **Ders İçeriği**: UZEM/Moodle entegrasyonu
- **Kütüphane E-kaynakları**: Veritabanı ve e-dergi erişimi
- **Kurs Önerileri**: Kariyer yolu planlaması

---

## 📊 Raporlar ve Analytics

### S: Öğrenci başarısı raporlarını nasıl görebilirim?
**C:** 
- **Öğrenci olarak**: Kendi transcript'ini görebilirsin
- **Akademisyen olarak**: Dashboard'da class analytics
- **Admin olarak**: Advanced reports (Institutionly-wide analytics)

---

## 🔗 Kaynaklar

- 📖 Tüm Dokümantasyon: [docs/](.)
- 🔗 API Belgeleri: [docs/API_MODULES.md](API_MODULES.md)
- 🚀 Kurulum: [docs/SETUP_GUIDE.md](SETUP_GUIDE.md)
- 🏗️ Mimari: [docs/ARCHITECTURE_DEEP_DIVE.md](ARCHITECTURE_DEEP_DIVE.md)
- 🎯 Kaynakça: [docs/CONTRIBUTING.md](../CONTRIBUTING.md)

---

## Sorunun Cevabı Burada Yoksa?

- 💬 [GitHub Discussions](https://github.com/yourusername/ubis/discussions) - Soru sor
- 🐛 [Bug Report](https://github.com/yourusername/ubis/issues/new/choose) - Hata rapor et
- 📧 Email: support@ubis.local

**Sorun buldum ve fikrim var!** → GitHub issue aç 🚀
