import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones
import esTranslation from '../locales/es/translation.json';
import enTranslation from '../locales/en/translation.json';

const resources = {
  es: {
    translation: esTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false, // Cambiar a true para debugging
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    // Configuración para mejor manejo de claves faltantes
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.warn(`Missing translation key: ${key} for language: ${lng}`);
      return key; // Devolver la clave como fallback
    },

    // Configuración para recargar traducciones
    load: 'languageOnly',
    cleanCode: true,
    
    // Configuración de namespace
    defaultNS: 'translation',
    ns: ['translation'],
  });

// Exponer i18n globalmente para debugging
if (typeof window !== 'undefined') {
  window.i18n = i18n;
}

// Función helper para cambiar idioma con recarga
export const changeLanguageWithReload = async (languageCode) => {
  try {
    await i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    
    // Pequeño delay para asegurar que el cambio se procese
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export default i18n;

