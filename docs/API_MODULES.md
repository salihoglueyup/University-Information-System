# API Modul Haritasi

Bu dosya, backend API alanlarini, erisim seviyelerini ve pratik endpoint orneklerini listeler.

## Global Middleware Akisi

1. `cors`, `helmet`, `mongoSanitizeCompat`
2. `/api/` icin genel rate limit
3. `/api/auth` icin daha siki rate limit
4. `/api/csrf-token` ile CSRF token dagitimi
5. `/api` altina CSRF korumasi

## Prefix Bazli Moduller

| Prefix | Dosya | Erisim |
| --- | --- | --- |
| `/api/auth` | `server/routes/auth.js` | Acik (authLimiter + CSRF zinciri) |
| `/api/verifications` | `server/routes/verifications.js` | Acik |
| `/api/courses` | `server/routes/courses.js` | Acik + bazi yazma islemleri role bagli |
| `/api/announcements` | `server/routes/announcements.js` | Okuma acik, yazma role bagli |
| `/api/assignments` | `server/routes/assignments.js` | Okuma/yazma, submit token ile |
| `/api/academic-calendar` | `server/routes/academic-calendar.js` | `verifyToken` |
| `/api/schedule` | `server/routes/schedule.js` | `verifyToken` |
| `/api/grades` | `server/routes/grades.js` | `verifyToken` + yazmada role kontrolu |
| `/api/attendance` | `server/routes/attendance.js` | `verifyToken` |
| `/api/faculties` | `server/routes/faculties.js` | `verifyToken` |
| `/api/departments` | `server/routes/departments.js` | `verifyToken` |
| `/api/students` | `server/routes/students.js` | `verifyToken` + owner/staff kontrolu |
| `/api/users` | `server/routes/users.js` | `verifyToken` + admin odakli islemler |
| `/api/logs` | `server/routes/logs.js` | `verifyRole(['admin'])` |
| `/api/dormitory` | `server/routes/dormitory.js` | `verifyToken` |
| `/api/library` | `server/routes/library.js` | `verifyToken` |
| `/api/emails` | `server/routes/emails.js` | `verifyToken` |
| `/api/documents` | `server/routes/documents.js` | `verifyToken` |
| `/api/payments` | `server/routes/payments.js` | `verifyToken` |
| `/api/evaluations` | `server/routes/evaluations.js` | `verifyToken` |
| `/api/search` | `server/routes/search.js` | `verifyToken` |
| `/api/analytics` | `server/routes/analytics.js` | `verifyToken` + `verifyRole(['admin'])` |
| `/api/ai` | `server/routes/ai.js` | `verifyToken` |

## Endpoint Ornekleri (Module Bazli)

### Auth

| Method | Endpoint | Not |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Yeni kullanici kaydi |
| `POST` | `/api/auth/login` | Giris + JWT |
| `POST` | `/api/auth/forgot-password` | Sifre sifirlama akis baslatir |
| `POST` | `/api/auth/2fa/generate` | Token gerekli |
| `POST` | `/api/auth/2fa/verify` | Token gerekli |

### Students

| Method | Endpoint | Not |
| --- | --- | --- |
| `GET` | `/api/students` | `admin`/`academic` |
| `GET` | `/api/students/:id` | owner veya staff |
| `GET` | `/api/students/:id/360` | owner veya staff, cache etkin |

### Courses / Announcements / Assignments

| Method | Endpoint | Not |
| --- | --- | --- |
| `GET` | `/api/courses` | Tum dersler |
| `POST` | `/api/courses` | `admin`/`academic` |
| `GET` | `/api/announcements` | Duyurular |
| `POST` | `/api/announcements` | `admin`/`academic` |
| `GET` | `/api/assignments` | Odev listesi |
| `POST` | `/api/assignments/:id/submit` | token + file upload |

### Academic Data (Grades / Attendance / Schedule)

| Method | Endpoint | Not |
| --- | --- | --- |
| `GET` | `/api/grades` | Kullanici notlari |
| `POST` | `/api/grades` | `admin`/`academic` |
| `GET` | `/api/attendance` | Devamsizlik |
| `POST` | `/api/attendance` | Devamsizlik kaydi |
| `GET` | `/api/schedule` | Token gerekli |
| `POST` | `/api/schedule` | `admin`/`academic` |

### Documents / Payments / Emails

| Method | Endpoint | Not |
| --- | --- | --- |
| `GET` | `/api/documents` | Kullanici belgeleri |
| `POST` | `/api/documents/upload` | Multipart file upload |
| `GET` | `/api/payments` | Finans ozeti |
| `POST` | `/api/payments/pay-tuition` | Odeme islemi |
| `GET` | `/api/emails` | Kurumsal mesajlar |
| `POST` | `/api/emails/send` | Mesaj gonderimi |

### Analytics / Search / AI

| Method | Endpoint | Not |
| --- | --- | --- |
| `GET` | `/api/analytics` | Admin dashboard ozet |
| `GET` | `/api/analytics/gpa-distribution` | Fakulte bazli dagilim |
| `GET` | `/api/search` | Genel arama |
| `POST` | `/api/search/sync` | Sadece admin |
| `POST` | `/api/ai/ask` | AI asistan sorusu |

## Ornek Request/Response

### Giris Ornegi

```http
POST /api/auth/login
Content-Type: application/json

{
	"username": "ogrenci1",
	"password": "secret123"
}
```

```json
{
	"token": "<jwt>",
	"user": {
		"id": "...",
		"role": "student",
		"name": "Ogrenci"
	}
}
```

### Student 360 Ornegi

```http
GET /api/students/123/360
Authorization: Bearer <jwt>
```

```json
{
	"student": {
		"id": "123",
		"name": "Ogrenci",
		"department": "Bilgisayar Muhendisligi"
	},
	"gpaHistory": [],
	"totalCredits": 0
}
```

## Hata Yanit Sablonlari

Tum hata yanitlari asagidaki yapida doner. HTTP status code ve yanit body'si iciligi request bazinda degisir.

### 400 - Bad Request (Validation Error)

Istek verileri gecersiz. Validation hatasi veya gerekli alan eksik.

```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "ogrenci1"
}
```

```json
{
    "status": "fail",
    "message": "Invalid input data. password: Password alanı gereklidir.",
    "messages": [
        "password: Password alanı gereklidir."
    ]
}
```

**Genel Nedenler:**
- Gerekli alanlar eksik
- Zod/Mongoose validation basarısızlığı
- Yanlış veri tipi (string yerine number, vs.)

---

### 401 - Unauthorized (Token Error)

Kimlik doğrulama hatası. Token yok, geçersiz veya süresi dolmuş.

#### A) Token Eksik

```http
GET /api/students/123
(Authorization header yok)
```

```json
{
    "status": "fail",
    "message": "Unauthorized! Please log in to get access."
}
```

#### B) Token Geçersiz / Malformed

```http
GET /api/students/123
Authorization: Bearer invalid.token.here
```

```json
{
    "status": "fail",
    "message": "Invalid token. Please log in again!"
}
```

#### C) Token Süresi Dolmuş

```json
{
    "status": "fail",
    "message": "Your token has expired! Please log in again."
}
```

**Frontend Çözüm:**
- Tarayıcı localStorage'dan token sil
- Login sayfasına redirect yap
- `GET /api/csrf-token` ile yeni CSRF token al

---

### 403 - Forbidden (Permission/CSRF Error)

Yetkilendirme başarısız. CSRF koruması başarısız veya role yetersiz.

#### A) CSRF Token Hatası

```http
POST /api/grades
Authorization: Bearer <valid-jwt>
Content-Type: application/json
(x-csrf-token header yok veya geçersiz)

{
    "studentId": "123",
    "grade": "85"
}
```

```json
{
    "status": "fail",
    "message": "Invalid or missing CSRF token. Please refresh the page."
}
```

**Çözüm:**
- Sayfa yenile (F5)
- `GET /api/csrf-token` çağrı yap, yeni token al
- Request'i yeni tokenle tekrarla

#### B) Role Yetersizliği

```http
POST /api/users/assign-role
Authorization: Bearer <student-jwt>
Content-Type: application/json
x-csrf-token: <valid-csrf-token>

{
    "userId": "456",
    "role": "admin"
}
```

```json
{
    "status": "fail",
    "message": "You do not have permission to perform this action!"
}
```

**Nedenler:**
- Student rolü ile admin işlemi yapmaya çalışma
- verifyRole(['admin']) middleware başarısız

---

### 404 - Not Found

Kaynağa ulaşılamadı.

```http
GET /api/students/99999
Authorization: Bearer <jwt>
```

```json
{
    "status": "fail",
    "message": "No document found with that ID"
}
```

---

### 409 - Conflict (Duplicate)

MongoDB duplicate key constraint ihlali. Özünde 400 alındığında, username/email tekil değildir.

```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "existing@ubis.local",
    "username": "existing_user",
    "password": "secret123"
}
```

```json
{
    "status": "fail",
    "message": "Duplicate field value: 'existing@ubis.local'. Please use another value!"
}
```

---

### 422 - Unprocessable Entity (Business Logic Error)

İstek syntaktik olarak validi ama iş mantığı yanlış.

**Örnek:** Dönem sonu, not girmesi yapılamıyor.

```http
POST /api/grades
Authorization: Bearer <instructor-jwt>
x-csrf-token: <token>
Content-Type: application/json

{
    "studentId": "123",
    "courseId": "COMP101",
    "grade": "AA"
}
```

```json
{
    "status": "fail",
    "message": "Grading is not allowed after semester end date (2025-10-01). Current date: 2025-10-15"
}
```

**Genel Nedenler:**
- Akademik takvim kısıtlaması (not girme, kayıt gibi)
- Sıra/duruma(state) dayalı constraints
- İş mantığı validasyonu başarısız

---

### 429 - Too Many Requests (Rate Limit)

API rate limiti aşıldı. Çok hızlı istek gönderme.

```json
{
    "status": "fail",
    "message": "Too many login attempts from this IP, please try again in 15 minutes!"
}
```

**Genel Rate Limits:**
- `/api/auth/*`: Daha sıcı limit (15 dakikada 5 deneme)
- `/api/*`: Genel limit (dakikada 100 istek)

**Frontend Çözüm:**
- 15 dakika bekle veya IP değiştir (VPN)
- Production'da bu seyrek görülür

---

### 500 - Internal Server Error

Sunucu tarafı hata. Database bağlantı hatası, unknown exception, vb.

```json
{
    "status": "error",
    "message": "Something went very wrong!"
}
```

**Production mode'de** detaylı hata bilgisi leak edilmez.

**Development mode'de** tam stack trace döner:
```json
{
    "status": "error",
    "error": {...},
    "message": "Full error message here",
    "stack": "Full stack trace..."
}
```

---

## Error Handling Best Practices (Frontend)

### 1. Token Yenileme (Axios Interceptor)

```javascript
// client/src/api/axiosInstance.js
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401 && error.response?.data?.message?.includes('expired')) {
            // Token süresi dolmuş -> login sayfasına yönlendir
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

### 2. CSRF Token Yönetimi

```javascript
// İstek atmadan önce CSRF token al
const { data } = await axiosInstance.get('/api/csrf-token');
config.headers['x-csrf-token'] = data.csrfToken;

// 403 CSRF hatası gelirse, sayfa yenile
if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
    window.location.reload();
}
```

### 3. User-Friendly Error Messages

```javascript
const getUserFriendlyMessage = (error) => {
    const status = error.response?.status;
    const backendMsg = error.response?.data?.message;
    
    switch (status) {
        case 400:
            return '❌ Lütfen bilgileri kontrol edin.';
        case 401:
            return '🔐 Oturumunuz sona erdi. Tekrar giriş yapın.';
        case 403:
            return '🚫 Bu işlem için yetkiniz yok.';
        case 404:
            return '🔍 Kayıt bulunamadı.';
        case 422:
            return `⚠️ ${backendMsg}`;
        case 429:
            return '⏳ Çok hızlı istek gönderdıniz. Biraz bekleyin.';
        case 500:
            return '💥 Sunucu hatası. Lütfen admin ile iletişim kurun.';
        default:
            return '❓ Bilinmeyen hata oluştu.';
    }
};
```

---

## Diger Endpointler

- `/` : Saglik kontrolu (API ayakta mesaji)
- `/api-docs` : Swagger UI
- `/uploads/*` : `secureUploads` middleware ile korunan statik dosyalar
