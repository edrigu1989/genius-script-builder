import { useTranslation } from 'react-i18next';

// Hook personalizado para traducciones con fallback
export const useTranslationWithFallback = () => {
  const { t, i18n } = useTranslation();

  const tWithFallback = (key, options = {}) => {
    try {
      const translation = t(key, options);
      
      // Si la traducción es igual a la clave, significa que no se encontró
      if (translation === key) {
        console.warn(`Missing translation for key: ${key} in language: ${i18n.language}`);
        
        // Intentar con idioma de fallback
        const fallbackTranslation = t(key, { ...options, lng: 'es' });
        
        if (fallbackTranslation !== key) {
          return fallbackTranslation;
        }
        
        // Si tampoco existe en el fallback, devolver una versión humanizada de la clave
        return humanizeKey(key);
      }
      
      return translation;
    } catch (error) {
      console.error(`Error translating key: ${key}`, error);
      return humanizeKey(key);
    }
  };

  return { t: tWithFallback, i18n };
};

// Función para humanizar claves de traducción
const humanizeKey = (key) => {
  if (!key) return '';
  
  // Remover prefijos comunes
  const cleanKey = key.replace(/^(nav|dashboard|script_generator|video_analysis|analytics|auth|common)\./, '');
  
  // Convertir snake_case y camelCase a palabras separadas
  const words = cleanKey
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return words;
};

// Componente wrapper para texto con fallback automático
export const TranslatedText = ({ tKey, fallback, className = '', ...props }) => {
  const { t } = useTranslationWithFallback();
  
  const text = t(tKey) || fallback || humanizeKey(tKey);
  
  return (
    <span className={className} {...props}>
      {text}
    </span>
  );
};

// Hook para verificar si una traducción existe
export const useTranslationExists = () => {
  const { i18n } = useTranslation();
  
  const exists = (key, lng = null) => {
    const language = lng || i18n.language;
    const translation = i18n.getResource(language, 'translation', key);
    return translation !== undefined && translation !== key;
  };
  
  return { exists };
};

export default useTranslationWithFallback;

