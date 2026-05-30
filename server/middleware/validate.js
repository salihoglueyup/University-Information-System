const { z, ZodError } = require('zod');

/**
 * Zod schemas for API endpoints.
 */
const schemas = {
    register: z.object({
        username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır").max(30, "Kullanıcı adı en fazla 30 karakter olabilir"),
        email: z.string().email("Geçerli bir e-posta adresi giriniz"),
        password: z.string().min(6, "Şifre en az 6 karakter olmalıdır").max(128, "Şifre en fazla 128 karakter olabilir"),
        fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır").max(100).optional(),
        faculty: z.string().optional(),
        department: z.string().optional()
    }),

    login: z.object({
        username: z.string().min(1, "Kullanıcı adı zorunludur"),
        password: z.string().min(1, "Şifre zorunludur")
    }),

    forgotPassword: z.object({
        email: z.string().email("Geçerli bir e-posta adresi giriniz")
    }),

    announcement: z.object({
        title: z.string().min(3).max(200),
        text: z.string().min(5),
        category: z.enum(['genel', 'fakulte', 'ders', 'events']).optional()
    }),

    evaluation: z.object({
        courseId: z.string().min(1),
        answers: z.record(z.string(), z.any()), // allows dynamic key-value pairs
        comment: z.string().max(1000).optional()
    }),

    healthReport: z.object({
        hospital: z.string().min(2, "Hastane/kurum adı en az 2 karakter olmalıdır").max(120),
        diagnosis: z.string().min(2, "Tanı en az 2 karakter olmalıdır").max(200),
        date: z.string().min(1, "Rapor tarihi zorunludur"),
        days: z.coerce.number().int("Gün sayısı tam sayı olmalıdır").min(1, "Gün sayısı en az 1 olmalıdır").max(60, "Gün sayısı en fazla 60 olabilir")
    }),

    lostFound: z.object({
        item: z.string().min(1, "Eşya adı gereklidir").max(120),
        type: z.enum(['found', 'lost']).optional(),
        category: z.string().max(60).optional(),
        location: z.string().max(120).optional(),
        description: z.string().max(1000).optional()
    }),

    leaveRequest: z.object({
        type: z.string().max(40).optional(),
        reason: z.string().max(500).optional(),
        startDate: z.string().min(1, "Başlangıç tarihi gereklidir"),
        endDate: z.string().min(1, "Bitiş tarihi gereklidir")
    }),

    supportTicket: z.object({
        subject: z.string().min(1, "Konu gereklidir").max(150),
        category: z.string().max(60).optional(),
        message: z.string().min(1, "Mesaj gereklidir").max(2000)
    }),

    scholarshipApply: z.object({
        name: z.string().min(1, "Burs adı gereklidir").max(120),
        type: z.string().max(40).optional(),
        amount: z.string().max(40).optional()
    }),

    vehicleApply: z.object({
        plate: z.string().min(5, "Geçerli bir plaka giriniz").max(15),
        model: z.string().min(2, "Marka/model gereklidir").max(60),
        owner: z.string().max(100).optional(),
        color: z.string().max(30).optional()
    }),

    appointmentCreate: z.object({
        student: z.string().min(1, "Öğrenci adı gereklidir").max(100),
        studentId: z.string().max(40).optional(),
        topic: z.string().min(1, "Konu gereklidir").max(200),
        date: z.string().min(1, "Tarih gereklidir"),
        time: z.string().min(1, "Saat gereklidir"),
        type: z.enum(['Online', 'Yüz Yüze']).optional()
    }),

    appointmentStatus: z.object({
        status: z.enum(['Bekliyor', 'Onaylandı', 'Reddedildi', 'Tamamlandı', 'İptal'])
    }),

    officeHour: z.object({
        day: z.string().min(1, "Gün gereklidir").max(20),
        time: z.string().min(1, "Saat gereklidir").max(40),
        location: z.string().max(80).optional()
    }),

    erasmusApply: z.object({
        year: z.string().min(1, "Dönem yılı gereklidir").max(20),
        term: z.string().max(20).optional(),
        score: z.coerce.number().min(0).max(100).optional()
    }),

    erasmusChoice: z.object({
        university: z.string().min(1, "Üniversite gereklidir").max(150),
        country: z.string().max(60).optional(),
        quota: z.coerce.number().int().min(0).max(1000).optional()
    }),

    contractStatus: z.object({
        status: z.enum(['Onay Bekliyor', 'Onaylandı'])
    }),

    publication: z.object({
        title: z.string().min(1, "Başlık gereklidir").max(300),
        journal: z.string().max(200).optional(),
        status: z.enum(['Yayınlandı', 'İncelemede', 'Hazırlanıyor']).optional()
    }),

    partTimeShift: z.object({
        date: z.string().min(1, "Tarih gereklidir").max(40),
        hours: z.string().max(40).optional(),
        total: z.coerce.number().min(0, "Saat 0'dan küçük olamaz").max(24, "Bir günde en fazla 24 saat girilebilir")
    }),

    healthAppointment: z.object({
        department: z.string().min(1, "Poliklinik gereklidir").max(80),
        doctor: z.string().max(100).optional(),
        date: z.string().min(1, "Tarih gereklidir").max(40),
        time: z.string().min(1, "Saat gereklidir").max(40)
    }),

    question: z.object({
        text: z.string().min(1, "Soru metni gereklidir").max(2000),
        course: z.string().max(40).optional(),
        topic: z.string().max(120).optional(),
        difficulty: z.enum(['Kolay', 'Orta', 'Zor']).optional(),
        type: z.string().max(60).optional()
    })
};

/**
 * Express middleware factory for request body validation using Zod.
 * @param {string} schemaName - Key of the schema in the schemas object.
 */
const validate = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return next(); // No schema found, skip validation
        }

        const result = schema.safeParse(req.body);
        if (!result.success) {
            const messages = result.error?.issues ? result.error.issues.map(err => err.message) : ['Geçersiz veri biçimi'];
            const err = new Error('Zod Validation Error');
            err.error = 'Zod Validation Error';
            err.messages = messages;
            err.statusCode = 400;
            return next(err);
        }

        req.body = result.data;
        next();
    };
};

module.exports = { validate, schemas };
