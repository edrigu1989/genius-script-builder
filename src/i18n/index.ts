import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../public/locales/en/translation.json';
import esTranslations from '../public/locales/es/translation.json';
import ptTranslations from '../public/locales/pt/translation.json';
import frTranslations from '../public/locales/fr/translation.json';
import deTranslations from '../public/locales/de/translation.json';
import itTranslations from '../public/locales/it/translation.json';
import jaTranslations from '../public/locales/ja/translation.json';
import koTranslations from '../public/locales/ko/translation.json';
import zhTranslations from '../public/locales/zh/translation.json';

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  pt: { translation: ptTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  it: { translation: itTranslations },
  ja: { translation: jaTranslations },
  ko: { translation: koTranslations },
  zh: { translation: zhTranslations }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Spanish as default
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;

