import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
  tr: {
    translation: {
      "dashboard_title": "Hoş Geldiniz",
      "announcements": "Duyurular",
      "assignments": "Ödevler",
      "schedule": "Ders Programı",
      "logout": "Çıkış Yap"
    }
  },
  en: {
    translation: {
      "dashboard_title": "Welcome",
      "announcements": "Announcements",
      "assignments": "Assignments",
      "schedule": "Schedule",
      "logout": "Logout"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
