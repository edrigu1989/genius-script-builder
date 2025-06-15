import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.features": "Features",
      "nav.pricing": "Pricing",
      "nav.login": "Login",
      "nav.dashboard": "Dashboard",
      "nav.generator": "Generator",
      "nav.analytics": "Analytics",
      "nav.admin": "Admin",
      "nav.wordpress": "WordPress Generator",
      "nav.logout": "Logout",

      // Landing Page
      "hero.title": "Generate Viral Content with AI",
      "hero.subtitle": "Create scripts that convert with our exclusive AI specialists. Connect your social media and watch your engagement soar.",
      "hero.cta": "Start Free Trial",
      "hero.cta.secondary": "Watch Demo",

      // AI Models
      "ai.scriptmaster.name": "ScriptMaster Pro",
      "ai.scriptmaster.description": "The viral content and persuasive copy specialist",
      "ai.scriptmaster.perfect": "Perfect for:",
      "ai.scriptmaster.feature1": "Posts that generate engagement",
      "ai.scriptmaster.feature2": "Converting copy",
      "ai.scriptmaster.feature3": "Creative and original content",
      "ai.scriptmaster.feature4": "Adaptation to different tones",
      "ai.scriptmaster.stats": "94% success rate, +40% engagement",

      "ai.analyticsbrain.name": "AnalyticsBrain",
      "ai.analyticsbrain.description": "The data-driven content strategist",
      "ai.analyticsbrain.perfect": "Perfect for:",
      "ai.analyticsbrain.feature1": "Scripts with solid structure",
      "ai.analyticsbrain.feature2": "Educational and professional content",
      "ai.analyticsbrain.feature3": "Audience analysis",
      "ai.analyticsbrain.feature4": "Long-term strategies",
      "ai.analyticsbrain.stats": "92% strategic accuracy, +60% B2B conversion",

      "ai.trendhunter.name": "TrendHunter AI",
      "ai.trendhunter.description": "The viral trends and content detector",
      "ai.trendhunter.perfect": "Perfect for:",
      "ai.trendhunter.feature1": "Content that follows trends",
      "ai.trendhunter.feature2": "Scripts for Gen Z and Millennials",
      "ai.trendhunter.feature3": "Platform-specific adaptation",
      "ai.trendhunter.feature4": "Multimedia content",
      "ai.trendhunter.stats": "89% trend detection, +70% virality",

      // Platform Connections
      "connections.title": "Connect Your Platforms",
      "connections.subtitle": "Connect your social media for automatic analytics and improve your scripts with AI",
      "connections.facebook.title": "Facebook + Instagram",
      "connections.facebook.benefit1": "Post and story analytics",
      "connections.facebook.benefit2": "Engagement metrics",
      "connections.facebook.benefit3": "Audience data",
      "connections.youtube.title": "YouTube",
      "connections.youtube.benefit1": "Video analytics",
      "connections.youtube.benefit2": "Watch time",
      "connections.youtube.benefit3": "Subscriber growth",
      "connections.connect": "Connect in 1 click",
      "connections.status.connected": "Connected",
      "connections.status.disconnected": "Not connected",
      "connections.progress": "{{count}} of {{total}} platforms connected",
      "connections.unlock3": "Connect 3+ platforms to unlock cross-analysis",
      "connections.unlockAll": "Connect all to get premium AI insights",

      // Dashboard
      "dashboard.welcome": "Welcome to MarketingGenius",
      "dashboard.scripts.title": "Scripts this month",
      "dashboard.engagement.title": "Average engagement",
      "dashboard.platform.title": "Best platform",
      "dashboard.quickActions": "Quick Actions",
      "dashboard.generateScript": "Generate Script",
      "dashboard.viewAnalytics": "View Analytics",
      "dashboard.connectPlatforms": "Connect Platforms",
      "dashboard.recentScripts": "Recent Scripts",
      "dashboard.aiInsights": "AI Insights",

      // Common
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.view": "View",
      "common.copy": "Copy",
      "common.download": "Download",
      "common.success": "Success",
      "common.error": "Error",
      "common.warning": "Warning",
      "common.info": "Information"
    }
  },
  es: {
    translation: {
      // Navigation
      "nav.home": "Inicio",
      "nav.features": "Características",
      "nav.pricing": "Precios",
      "nav.login": "Iniciar Sesión",
      "nav.dashboard": "Panel",
      "nav.generator": "Generador",
      "nav.analytics": "Analytics",
      "nav.admin": "Admin",
      "nav.wordpress": "Generador WordPress",
      "nav.logout": "Cerrar Sesión",

      // Landing Page
      "hero.title": "Genera Contenido Viral con IA",
      "hero.subtitle": "Crea scripts que convierten con nuestros especialistas IA exclusivos. Conecta tus redes sociales y observa cómo se dispara tu engagement.",
      "hero.cta": "Comenzar Prueba Gratis",
      "hero.cta.secondary": "Ver Demo",

      // AI Models
      "ai.scriptmaster.name": "ScriptMaster Pro",
      "ai.scriptmaster.description": "El especialista en contenido viral y copy persuasivo",
      "ai.scriptmaster.perfect": "Perfecto para:",
      "ai.scriptmaster.feature1": "Posts que generan engagement",
      "ai.scriptmaster.feature2": "Copy que convierte",
      "ai.scriptmaster.feature3": "Contenido creativo y original",
      "ai.scriptmaster.feature4": "Adaptación a diferentes tonos",
      "ai.scriptmaster.stats": "94% tasa de éxito, +40% engagement",

      "ai.analyticsbrain.name": "AnalyticsBrain",
      "ai.analyticsbrain.description": "El estratega de contenido basado en datos",
      "ai.analyticsbrain.perfect": "Perfecto para:",
      "ai.analyticsbrain.feature1": "Scripts con estructura sólida",
      "ai.analyticsbrain.feature2": "Contenido educativo y profesional",
      "ai.analyticsbrain.feature3": "Análisis de audiencia",
      "ai.analyticsbrain.feature4": "Estrategias de largo plazo",
      "ai.analyticsbrain.stats": "92% precisión estratégica, +60% conversión B2B",

      "ai.trendhunter.name": "TrendHunter AI",
      "ai.trendhunter.description": "El detector de tendencias virales y contenido",
      "ai.trendhunter.perfect": "Perfecto para:",
      "ai.trendhunter.feature1": "Contenido que sigue tendencias",
      "ai.trendhunter.feature2": "Scripts para Gen Z y Millennials",
      "ai.trendhunter.feature3": "Adaptación específica por plataforma",
      "ai.trendhunter.feature4": "Contenido multimedia",
      "ai.trendhunter.stats": "89% detección de trends, +70% viralidad",

      // Platform Connections
      "connections.title": "Conecta Tus Plataformas",
      "connections.subtitle": "Conecta tus redes sociales para obtener analytics automáticos y mejorar tus scripts con IA",
      "connections.facebook.title": "Facebook + Instagram",
      "connections.facebook.benefit1": "Analytics de posts e historias",
      "connections.facebook.benefit2": "Métricas de engagement",
      "connections.facebook.benefit3": "Datos de audiencia",
      "connections.youtube.title": "YouTube",
      "connections.youtube.benefit1": "Analytics de videos",
      "connections.youtube.benefit2": "Tiempo de visualización",
      "connections.youtube.benefit3": "Crecimiento de suscriptores",
      "connections.connect": "Conectar en 1 clic",
      "connections.status.connected": "Conectado",
      "connections.status.disconnected": "No conectado",
      "connections.progress": "{{count}} de {{total}} plataformas conectadas",
      "connections.unlock3": "Conecta 3+ plataformas para desbloquear análisis cruzado",
      "connections.unlockAll": "Conecta todas para obtener insights de IA premium",

      // Dashboard
      "dashboard.welcome": "Bienvenido a MarketingGenius",
      "dashboard.scripts.title": "Scripts este mes",
      "dashboard.engagement.title": "Engagement promedio",
      "dashboard.platform.title": "Mejor plataforma",
      "dashboard.quickActions": "Acciones Rápidas",
      "dashboard.generateScript": "Generar Script",
      "dashboard.viewAnalytics": "Ver Analytics",
      "dashboard.connectPlatforms": "Conectar Plataformas",
      "dashboard.recentScripts": "Scripts Recientes",
      "dashboard.aiInsights": "Insights de IA",

      // Common
      "common.loading": "Cargando...",
      "common.save": "Guardar",
      "common.cancel": "Cancelar",
      "common.delete": "Eliminar",
      "common.edit": "Editar",
      "common.view": "Ver",
      "common.copy": "Copiar",
      "common.download": "Descargar",
      "common.success": "Éxito",
      "common.error": "Error",
      "common.warning": "Advertencia",
      "common.info": "Información"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
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

