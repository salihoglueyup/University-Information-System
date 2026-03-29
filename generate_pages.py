
import os

base_dir = "c:/Gelistirme/ubis/client/src/pages/dashboard"
os.makedirs(base_dir, exist_ok=True)

pages = [
    ("Emails", "E-Posta"),
    ("Settings", "Hesap Ayarları"),
    ("EnrolledCourses", "Yazıldığım Dersler"),
    ("Schedule", "Ders Programım"),
    ("DepartmentSchedule", "Bölüm Ders Programı"),
    ("Attendance", "Devamsızlık Çizelgem"),
    ("Grades", "Ders Notlarım"),
    ("Assignments", "Ödevlerim"),
    ("DepartmentCourses", "Bölüm Derslerim"),
    ("OnlineCourses", "Online Derslerim"),
    ("Transcript", "Transkript"),
    ("Prerequisites", "Ders Ön Koşulları"),
    ("UzemExams", "UZEM Sınavları"),
    ("ExemptionExam", "Muafiyet Sınavı Başvuru"),
    ("LanguageExam", "2. Yabancı Dil Sınavı"),
    ("ElectronicExams", "Elektronik Sınav Sistemi"),
    ("SingleCourseExam", "Tek Ders Sınavı"),
    ("ExamSchedule", "Sınav Programım"),
    ("ExamResults", "Sınav Sonuçlarım"),
    ("Surveys", "Anketler & Formlar"),
    ("Documents", "Form ve Belgeler"),
    ("Contracts", "Sözleşme Oluşturma"),
    ("CvForm", "Online CV Formu"),
    ("Kvkk", "KVKK Aydınlatma"),
    ("DiningMenu", "Yemekhane Menüsü"),
    ("Library", "Kütüphane"),
    ("ShuttleSchedule", "Ring Seferleri"),
    ("StudentClubs", "Öğrenci Kulüpleri"),
    ("HealthCenter", "Sağlık Merkezi"),
    ("Events", "Etkinlik Takvimi"),
    ("Sports", "Spor Tesisleri"),
    ("RadioTv", "IAÜ Radyo / TV"),
    ("Career", "Kariyer Merkezi"),
    ("LostFound", "Kayıp Eşya"),
    ("Suggestions", "Öneri & Şikayet"),
    ("RegistrationInfo", "Kayıt Bilgilerim"),
    ("Internship", "Staj Bilgilerim"),
    ("Yum", "Yerinde Uygulama (YUM)"),
    ("Finance", "Finans Bilgilerim"),
    ("Payment", "Online Ödeme Yap"),
    ("Scholarships", "Burs ve İndirimlerim"),
    ("BankAccounts", "Banka Hesap Bilgileri"),
    ("Dormitory", "Yurt Başvurusu / Ödeme"),
    ("PartTimeWork", "Kısmi Zamanlı Çalışma"),
    ("Graduation", "Mezuniyet İşlemleri"),
    ("AccessCard", "Kartlı Geçiş Sistemi"),
    ("Moodle", "UZEM – Moodle"),
    ("SocialTranscript", "Sosyal Karne"),
    ("EducationInfo", "Eğitim Bilgi Sistemi"),
    ("AcademicCalendar", "Akademik Takvim"),
    ("CampusMap", "Kampüs Haritası"),
    ("InfoCenter", "Bilgi Merkezi"),
    ("SemCourses", "SEM Online Eğitimleri")
]

template = """import React from 'react';
import { motion } from 'framer-motion';

export default function {component_name}() {{
    return (
        <motion.div
            initial={{{{ opacity: 0, y: 20 }}}}
            animate={{{{ opacity: 1, y: 0 }}}}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
            <h1 className="text-2xl font-bold text-slate-800 mb-4">{page_title}</h1>
            <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 text-lg">Bu sayfa yapım aşamasındadır.</p>
                <p className="text-slate-400 text-sm mt-2">Çok yakında hizmetinizde!</p>
            </div>
        </motion.div>
    );
}}
"""

for component_name, page_title in pages:
    file_path = os.path.join(base_dir, f"{component_name}.jsx")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(template.format(component_name=component_name, page_title=page_title))
    print(f"Created {file_path}")
