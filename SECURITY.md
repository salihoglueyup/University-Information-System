# Security Policy

UBIS'de bir güvenlik sorunu (vulnerability) fark ederseniz, bunu sorumlu bir şekilde rapor etmeyi istiyoruz.

## 🔒 Güvenlik Sorunu Bildirme

**Lütfen güvenlik sorunlarını GitHub Issues'ta açmayın!** Bunun yerine aşağıdakileri yapın:

### Adım 1: Direktif Olarak Raporla

E-posta gönder: **security@ubis.local**

**Email İçeriği:**
```
Konu: Security Vulnerability Report - [Brief Description]

Merhaba,

Vulnerability tür: [SQL Injection / XSS / CSRF / Authentication / Other]

Etkilenen versiyon: v0.1.0

Boşluk Açıklaması:
[Detaylı açıklama ve PoC (Proof of Concept) kodu/adımları]

İmpact:
[Ne kadar ciddi? Veri sızıntısı? Sistem çökmesi? User data exposure?]

Reproduction:
1. Step 1
2. Step 2
3. Hata oluşur

Önerilen Düzeltme:
[Varsa]

---
Raporlayan: [Your Name/Handle]
İletişim: [Email/Discord]
```

### Adım 2: Bekle

- **24-48 saat**: İlk cevap alacaksın
- **7-14 gün**: Patch yayınlanacak (severity bağlı)
- **Yayınlama sonrası**: Public disclosure koordinasyonu

## ✅ Güvenlik Kapatma Prosedürü

1. **Private Patch**: Güvenlik düzeltmesi private branch'da yapılır
2. **Testing**: Security audit süreci
3. **Yayınlama**: GitHub Security Advisory yayınlanır
4. **Kredi**: Bulucunun adı teşekkür olarak yazılır
5. **CVE**: Eğer ciddi ise, CVE ID alınır

## 🛡️ Desteklenen Sürümler

| Versiyon | Supported | End of Life |
| --- | --- | --- |
| 1.x | ✅ | 2027-12-31 |
| 0.x | ⚠️ Limited | 2026-06-30 |

## 🔐 Temel Güvenlik Uygulamaları

UBIS şu güvenlik özellikleri ile gelir:

### Input Validation
- ✅ Zod schemas (backend)
- ✅ React Hook Form (frontend)

### Authentication
- ✅ JWT tokens (secure, HttpOnly cookies)
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting (login attempts)
- ✅ 2FA support (optional)

### Authorization
- ✅ Role-based access control (RBAC)
- ✅ Resource ownership checks
- ✅ Public/private endpoint separation

### CSRF Protection
- ✅ Double-submit cookies
- ✅ SameSite flag
- ✅ CSRF token validation

### Data Protection
- ✅ MongoDB injection prevention (mongoSanitize)
- ✅ XSS protection (Helmet)
- ✅ SQL injection (N/A - NoSQL)
- ✅ HTTPS only (production)

### API Security
- ✅ CORS properly configured
- ✅ Helmet.js headers
- ✅ Rate limiting
- ✅ Request size limits

---

## 🚨 Güvenlik Patch Yayınlama Taramaları

Güvenlik güncellemeleri şu şekilde yayınlanır:

```bash
# Security patch (e.g., v0.1.1)
npm version patch
# vs.
# Regular feature (e.g., v0.2.0)
npm version minor
```

Tüm users'lar **immediately** update etmelidir.

---

## 📋 Güvenlik Checklist

Eğer contribute ediyorsan, bu kontrolü yaparak gönder:

- [ ] Input validation eklendi
- [ ] Authentication/Authorization kontrol edildi
- [ ] SQL injection risk yok (NoSQL güvenli mi?)
- [ ] XSS vulnerability yok (user input sanitized mi?)
- [ ] CSRF protection var (forms'da token var mı?)
- [ ] Rate limiting uygulandı (gerekli mi?)
- [ ] Sensitive data hashed/encrypted mi?
- [ ] Error messages info leak yapmıyor mu?
- [ ] Dependencies up-to-date (npm audit clean)
- [ ] Tests yazıldı ve passed

---

## 🛠️ Dependency Security

```bash
# Check for known vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies safely
npm outdated
npm update
```

`package.json` içinde `dependencies` ve `devDependencies` düzenli olarak audit edilir.

---

## Responsible Disclosure Timeline

Bir vulnerability rapor edilirse:

| İçinde | Gerekirse |
| --- | --- |
| **T+0 gün** | Alındı confirmation |
| **T+3 gün** | İlk triage |
| **T+7 gün** | Fix başlandı |
| **T+14 gün** | Patch ready |
| **T+21 gün** | Public disclosure (varsa) |

---

## 🔗 Kaynaklar

- 🔐 [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- 📖 [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- 🛡️ [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- 💾 [CWE/SANS Top 25](https://cwe.mitre.org/top25/)

---

**Last Updated**: Mart 2026  
**Security Lead**: Security Team
