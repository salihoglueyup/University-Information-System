import {
    Home, BookOpen, Calendar, GraduationCap, FileText,
    Settings, User, Search, Mail, ClipboardList, CreditCard,
    Map, Info, Briefcase, FileCheck, Globe, Monitor,
    Award, Clock, Layout, ShieldCheck, Users, BarChart2,
    Database, PenTool,
    FileBarChart, Archive
} from 'lucide-react';

export const roleNavigation = {
    student: [
        {
            title: "Genel",
            items: [
                { icon: Home, label: "Anasayfa", path: "/dashboard" },
                { icon: Mail, label: "E-Posta", path: "/dashboard/emails" },
                { icon: Settings, label: "Hesap Ayarları", path: "/dashboard/settings" },
                { icon: ShieldCheck, label: "Yardım ve Destek", path: "/dashboard/support" },
                { icon: User, label: "Dijital Kimlik Kartı", path: "/dashboard/digital-id" }
            ]
        },
        {
            title: "Akademik",
            items: [
                { icon: BookOpen, label: "Yazıldığım Dersler", path: "/dashboard/enrolled-courses" },
                { icon: Calendar, label: "Ders Programım", path: "/dashboard/schedule" },
                { icon: Monitor, label: "UZEM – Moodle", path: "/dashboard/moodle" },
                { icon: BookOpen, label: "Bölüm Ders Programı", path: "/dashboard/department-schedule" },
                { icon: User, label: "Devamsızlık Çizelgem", path: "/dashboard/attendance" },
                { icon: FileText, label: "Ders Notlarım", path: "/dashboard/grades" },
                { icon: ClipboardList, label: "Ödevlerim", path: "/dashboard/assignments" },
                { icon: BookOpen, label: "Bölüm Derslerim", path: "/dashboard/department-courses" },
                { icon: Globe, label: "Online Derslerim", path: "/dashboard/online-courses" },
                { icon: FileCheck, label: "Transkript", path: "/dashboard/transcript" },
                { icon: Monitor, label: "Ders Ön Koşulları", path: "/dashboard/prerequisites" },
                { icon: BookOpen, label: "Eğitim Bilgi Sistemi", path: "/dashboard/education-info" },
                { icon: Calendar, label: "Akademik Takvim", path: "/dashboard/academic-calendar" },
                { icon: Info, label: "Bilgi Merkezi", path: "/dashboard/info-center" }
            ]
        },
        {
            title: "Sınavlar",
            items: [
                { icon: Monitor, label: "UZEM Sınavları", path: "/dashboard/uzem-exams" },
                { icon: FileCheck, label: "Muafiyet Sınavı Başvuru", path: "/dashboard/exemption-exam" },
                { icon: Globe, label: "2. Yabancı Dil Sınavı", path: "/dashboard/language-exam" },
                { icon: Monitor, label: "Elektronik Sınav Sis.", path: "/dashboard/electronic-exams" },
                { icon: FileText, label: "Tek Ders Sınavı", path: "/dashboard/single-course-exam" },
                { icon: Calendar, label: "Sınav Programım", path: "/dashboard/exam-schedule" },
                { icon: Award, label: "Sınav Sonuçlarım", path: "/dashboard/exam-results" }
            ]
        },
        {
            title: "Kariyer",
            items: [
                { icon: Briefcase, label: "Kariyer Merkezi", path: "/dashboard/career" },
                { icon: ClipboardList, label: "Staj Bilgilerim", path: "/dashboard/internship" },
                { icon: Search, label: "İş / Staj İlanları", path: "/dashboard/job-postings" },
                { icon: Clock, label: "Kısmi Zamanlı Çalışma", path: "/dashboard/part-time-work" },
                { icon: FileText, label: "Online CV Formu", path: "/dashboard/cv-form" },
                { icon: Award, label: "SEM Eğitimleri", path: "/dashboard/sem-courses" },
                { icon: User, label: "Mezunlar Platformu", path: "/dashboard/alumni" },
                { icon: Briefcase, label: "Yerinde Uygulama (YUM)", path: "/dashboard/yum" },
            ]
        },
        {
            title: "Belgeler & Formlar",
            items: [
                { icon: ClipboardList, label: "Anketler & Formlar", path: "/dashboard/surveys" },
                { icon: FileText, label: "Form ve Belgeler", path: "/dashboard/documents" },
                { icon: FileCheck, label: "Sözleşme Oluşturma", path: "/dashboard/contracts" },
                { icon: ShieldCheck, label: "KVKK Aydınlatma", path: "/dashboard/kvkk" }
            ]
        },
        {
            title: "Kampüs Yaşamı",
            items: [
                { icon: Monitor, label: "Yemekhane Menüsü", path: "/dashboard/dining-menu" },
                { icon: BookOpen, label: "Kütüphane", path: "/dashboard/library" },
                { icon: Map, label: "Ring Seferleri", path: "/dashboard/shuttle-schedule" },
                { icon: Award, label: "Sosyal Karne", path: "/dashboard/social-transcript" },
                { icon: Award, label: "Öğrenci Kulüpleri", path: "/dashboard/student-clubs" },
                { icon: Briefcase, label: "Sağlık Merkezi", path: "/dashboard/health-center" },
                { icon: Calendar, label: "Etkinlik Takvimi", path: "/dashboard/events" },
                { icon: Award, label: "Spor Tesisleri", path: "/dashboard/sports" },
                { icon: Monitor, label: "IAÜ Radyo / TV", path: "/dashboard/radio-tv" },
                { icon: Info, label: "Kayıp Eşya", path: "/dashboard/lost-found" },
                { icon: Mail, label: "Öneri & Şikayet", path: "/dashboard/suggestions" },
                { icon: Home, label: "Yurt İşlemleri", path: "/dashboard/dormitory" },
                { icon: Map, label: "Sanal Tur", path: "/dashboard/virtual-tour" }
            ]
        },
        {
            title: "İdari & Finans",
            items: [
                { icon: User, label: "Kayıt Bilgisi", path: "/dashboard/registration-info" },
                { icon: BookOpen, label: "Ders Kayıt İşlemleri", path: "/dashboard/course-registration" },
                { icon: CreditCard, label: "Finans ve Cüzdan", path: "/dashboard/payments" },
                { icon: Award, label: "Burs ve İndirimlerim", path: "/dashboard/scholarships" },
                { icon: GraduationCap, label: "Mezuniyet İşlemleri", path: "/dashboard/graduation" },
                { icon: CreditCard, label: "Kütüphane Borçları", path: "/dashboard/library-fines" },
                { icon: ShieldCheck, label: "Kartlı Geçiş Logları", path: "/dashboard/access-logs" },
                { icon: Map, label: "Araç Pulu İşlemleri", path: "/dashboard/vehicle-sticker" },
                { icon: Globe, label: "Erasmus / Değişim", path: "/dashboard/erasmus" },
                { icon: FileCheck, label: "Sağlık Raporları", path: "/dashboard/health-reports" }
            ]
        }
    ],
    researchAssistant: [
        {
            title: "Genel",
            items: [
                { icon: Home, label: "Anasayfa", path: "/dashboard" },
                { icon: Mail, label: "E-Posta", path: "/dashboard/emails" },
                { icon: Calendar, label: "Randevu Takvimi", path: "/dashboard/appointments" },
                { icon: Settings, label: "Hesap Ayarları", path: "/dashboard/settings" },
            ]
        },
        {
            title: "Asistanlık",
            items: [
                { icon: ShieldCheck, label: "Gözetmenliklerim", path: "/dashboard/proctoring" },
                { icon: Monitor, label: "Laboratuvarlarım", path: "/dashboard/labs" },
                { icon: ClipboardList, label: "Bölüm Görevleri", path: "/dashboard/dept-tasks" },
            ]
        },
        {
            title: "Akademik",
            items: [
                { icon: BookOpen, label: "Ders Programı", path: "/dashboard/schedule" },
                { icon: FileCheck, label: "Sınav Programı", path: "/dashboard/exam-schedule" },
            ]
        },
        {
            title: "Akademik Destek",
            items: [
                { icon: GraduationCap, label: "Tez/Proje Asistanlığı", path: "/dashboard/thesis-support" },
                { icon: PenTool, label: "Sınav Okuma Desteği", path: "/dashboard/grading-support" },
            ]
        },
        {
            title: "Kişisel Gelişim",
            items: [
                { icon: Award, label: "Akademik Takip", path: "/dashboard/academic-progress" },
                { icon: FileCheck, label: "Eğitimler", path: "/dashboard/trainings" },
            ]
        },
        {
            title: "İdari",
            items: [
                { icon: FileText, label: "İzin İşlemleri", path: "/dashboard/leave-management" },
            ]
        },
        {
            title: "Araçlar",
            items: [
                { icon: Database, label: "Kütüphane Veritabanları", path: "/dashboard/library-db" },
                { icon: Calendar, label: "Oda Rezervasyonu", path: "/dashboard/room-booking" }
            ]
        }
    ],
    instructor: [
        {
            title: "Genel",
            items: [
                { icon: Home, label: "Anasayfa", path: "/dashboard" },
                { icon: Mail, label: "E-Posta", path: "/dashboard/emails" },
                { icon: Calendar, label: "Randevu Takvimi", path: "/dashboard/appointments" },
                { icon: Settings, label: "Hesap Ayarları", path: "/dashboard/settings" },
            ]
        },
        {
            title: "Akademik",
            items: [
                { icon: BookOpen, label: "Verilen Dersler", path: "/dashboard/teaching-courses" },
                { icon: Calendar, label: "Ders Programı", path: "/dashboard/schedule" },
                { icon: PenTool, label: "Not Girişi", path: "/dashboard/grading" },
            ]
        },
        {
            title: "Danışmanlık",
            items: [
                { icon: Users, label: "Öğrencilerim", path: "/dashboard/advisees" },
                { icon: GraduationCap, label: "Tez/Proje Yönetimi", path: "/dashboard/thesis" },
            ]
        },
        {
            title: "İdari",
            items: [
                { icon: FileText, label: "İzin İşlemleri", path: "/dashboard/leave-management" },
                { icon: Archive, label: "Belge Yönetimi", path: "/dashboard/documents" }
            ]
        },
        {
            title: "Araçlar",
            items: [
                { icon: Monitor, label: "UZEM – Moodle", path: "/dashboard/moodle" },
                { icon: Database, label: "Kütüphane Veritabanları", path: "/dashboard/library-db" },
                { icon: Calendar, label: "Oda Rezervasyonu", path: "/dashboard/room-booking" }
            ]
        }
    ],
    admin: [
        {
            title: "Genel",
            items: [
                { icon: Home, label: "Panel Anasayfa", path: "/dashboard" },
                { icon: Map, label: "Kampüs İkizi", path: "/dashboard/campus-map" },
                { icon: BarChart2, label: "Sistem Analitiği", path: "/dashboard/analytics" },
            ]
        },
        {
            title: "Yönetim",
            items: [
                { icon: Users, label: "Kullanıcı Yönetimi", path: "/dashboard/users" },
                { icon: BookOpen, label: "Akademik Kokpit", path: "/dashboard/academics" },
                { icon: Layout, label: "Bölüm / Fakülte", path: "/dashboard/departments" },
                { icon: Calendar, label: "Ders Atamaları", path: "/dashboard/course-assignments" },
            ]
        },
        {
            title: "Raporlama",
            items: [
                { icon: FileBarChart, label: "Akademik Raporlar", path: "/dashboard/academic-reports" },
                { icon: ShieldCheck, label: "Sistem Logları", path: "/dashboard/logs" },
                { icon: CreditCard, label: "Mali Raporlar", path: "/dashboard/financial-reports" }
            ]
        },
        {
            title: "Sistem",
            items: [
                { icon: Settings, label: "Genel Ayarlar", path: "/dashboard/system-settings" },
                { icon: Database, label: "Veritabanı Yedekleme", path: "/dashboard/backup" },
                { icon: Mail, label: "Kurumsal Mesajlar", path: "/dashboard/emails" }
            ]
        }
    ]
};

// Research assistants (araştırma görevlisi) share the instructor (öğretim
// görevlisi) navigation until a dedicated menu is designed.
roleNavigation.researchAssistant = roleNavigation.instructor;
