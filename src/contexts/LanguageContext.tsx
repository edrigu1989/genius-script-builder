
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const translations = {
    es: {
      // Header
      'header.features': 'Características',
      'header.pricing': 'Precios',
      'header.stats': 'Estadísticas',
      'header.login': 'Iniciar Sesión',
      'header.demo': 'Ver Demo',
      'header.start': 'Comenzar Gratis',
      
      // Hero
      'hero.badge': '🚀 Revoluciona tu Marketing con IA',
      'hero.title': 'Genera Scripts de Marketing',
      'hero.titleHighlight': 'en 30 Segundos',
      'hero.subtitle': 'Potencia tu agencia con nuestra IA avanzada. Genera scripts profesionales para redes sociales, emails, landing pages y más con la precisión de múltiples modelos de IA.',
      'hero.startFree': 'Comenzar Gratis',
      'hero.watchDemo': 'Ver Demo',
      'hero.feature1.title': 'Generación Instantánea',
      'hero.feature1.desc': 'Scripts en 30 segundos',
      'hero.feature2.title': 'Multi-IA',
      'hero.feature2.desc': 'OpenAI, Claude, Gemini',
      'hero.feature3.title': 'Analytics Avanzados',
      'hero.feature3.desc': 'Métricas en tiempo real',
      
      // Features
      'features.badge': '🚀 Características Principales',
      'features.title': 'Todo lo que Necesitas para',
      'features.titleHighlight': 'Dominar el Marketing',
      'features.subtitle': 'Herramientas profesionales diseñadas para agencias que buscan eficiencia, calidad y resultados excepcionales en sus campañas de marketing.',
      'features.multiAI.title': 'Multi-IA Avanzada',
      'features.multiAI.desc': 'Acceso a OpenAI GPT-4, Claude, Gemini y más modelos de IA para generar contenido variado y de alta calidad.',
      'features.instant.title': 'Generación Instantánea',
      'features.instant.desc': 'Crea scripts profesionales en menos de 30 segundos. Optimiza tu tiempo y aumenta tu productividad.',
      'features.brand.title': 'Personalización de Marca',
      'features.brand.desc': 'Entrena la IA con el tono y estilo de tu marca para mantener consistencia en todas tus comunicaciones.',
      'features.analytics.title': 'Analytics Avanzados',
      'features.analytics.desc': 'Métricas detalladas de rendimiento, ROI y efectividad de tus scripts con reportes en tiempo real.',
      'features.quality.title': 'Control de Calidad',
      'features.quality.desc': 'Sistema de revisión automática y manual para garantizar la calidad y precisión de cada script generado.',
      'features.availability.title': 'Disponibilidad 24/7',
      'features.availability.desc': 'Plataforma siempre disponible con soporte técnico continuo y actualizaciones automáticas.',
      'features.cta': 'Probar Todas las Características',
      
      // Stats
      'stats.badge': '📊 Números que Hablan',
      'stats.title': 'Resultados que',
      'stats.titleHighlight': 'Transforman Negocios',
      'stats.subtitle': 'Miles de agencias ya confían en Marketing Genius para revolucionar su proceso de creación de contenido y aumentar su productividad.',
      'stats.scripts': 'Scripts Generados',
      'stats.scriptsDesc': 'Mensualmente en nuestra plataforma',
      'stats.agencies': 'Agencias Activas',
      'stats.agenciesDesc': 'Confían en Marketing Genius',
      'stats.satisfaction': 'Tasa de Satisfacción',
      'stats.satisfactionDesc': 'De nuestros clientes premium',
      'stats.time': 'Tiempo Promedio',
      'stats.timeDesc': 'Para generar un script profesional',
      'stats.trustedBy': 'Empresas que confían en nosotros:',
      
      // Pricing
      'pricing.badge': '💰 Planes y Precios',
      'pricing.title': 'Elige el Plan Perfecto',
      'pricing.titleHighlight': 'para tu Agencia',
      'pricing.subtitle': 'Planes diseñados para crecer contigo. Desde startups hasta empresas, tenemos la solución perfecta para tus necesidades de marketing.',
      'pricing.popular': '🏆 Más Popular',
      'pricing.starter.name': 'Starter',
      'pricing.starter.desc': 'Perfect para agencias pequeñas que están comenzando',
      'pricing.professional.name': 'Professional',
      'pricing.professional.desc': 'La elección más popular para agencias en crecimiento',
      'pricing.enterprise.name': 'Enterprise',
      'pricing.enterprise.desc': 'Solución completa para agencias grandes y corporativos',
      'pricing.startNow': 'Comenzar Ahora',
      'pricing.contactSales': 'Contactar Ventas',
      'pricing.guarantee': '💰 Garantía de devolución de 30 días',
      'pricing.questions': '¿Preguntas sobre los precios?',
      'pricing.questionsDesc': 'Nuestro equipo está aquí para ayudarte a elegir el plan perfecto para tu agencia.',
      'pricing.talkSales': 'Hablar con Ventas',
      'pricing.freeTrial': 'Probar Gratis 14 Días',
      
      // CTA
      'cta.badge': '🚀 ¡Únete a la Revolución del Marketing!',
      'cta.title': 'Transforma tu Agencia',
      'cta.titleHighlight': 'en 24 Horas',
      'cta.subtitle': 'Más de 2,500 agencias ya generan scripts profesionales en segundos. No te quedes atrás en la revolución de la IA para marketing.',
      'cta.startNow': 'Comenzar Gratis Ahora',
      'cta.scheduleDemo': 'Agendar Demo Personal',
      'cta.instant': 'Setup Instantáneo',
      'cta.instantDesc': 'Comenzar en 2 minutos',
      'cta.secure': '100% Seguro',
      'cta.secureDesc': 'Encriptación empresarial',
      'cta.noCommitment': 'Sin Compromiso',
      'cta.noCommitmentDesc': 'Cancela cuando quieras',
      'cta.noCreditCard': '💳 No se requiere tarjeta de crédito para el trial gratuito',
      'cta.support': 'Soporte 24/7 • Garantía de satisfacción • Configuración gratuita',
      
      // Footer
      'footer.description': 'La plataforma de IA más avanzada para la generación de scripts de marketing. Transforma tu agencia con tecnología de vanguardia.',
      'footer.product': 'Producto',
      'footer.company': 'Empresa',
      'footer.copyright': '© 2024 Marketing Genius. Todos los derechos reservados.',
    },
    en: {
      // Header
      'header.features': 'Features',
      'header.pricing': 'Pricing',
      'header.stats': 'Statistics',
      'header.login': 'Sign In',
      'header.demo': 'Watch Demo',
      'header.start': 'Get Started Free',
      
      // Hero
      'hero.badge': '🚀 Revolutionize your Marketing with AI',
      'hero.title': 'Generate Marketing Scripts',
      'hero.titleHighlight': 'in 30 Seconds',
      'hero.subtitle': 'Power your agency with our advanced AI. Generate professional scripts for social media, emails, landing pages and more with the precision of multiple AI models.',
      'hero.startFree': 'Get Started Free',
      'hero.watchDemo': 'Watch Demo',
      'hero.feature1.title': 'Instant Generation',
      'hero.feature1.desc': 'Scripts in 30 seconds',
      'hero.feature2.title': 'Multi-AI',
      'hero.feature2.desc': 'OpenAI, Claude, Gemini',
      'hero.feature3.title': 'Advanced Analytics',
      'hero.feature3.desc': 'Real-time metrics',
      
      // Features
      'features.badge': '🚀 Key Features',
      'features.title': 'Everything You Need to',
      'features.titleHighlight': 'Master Marketing',
      'features.subtitle': 'Professional tools designed for agencies seeking efficiency, quality and exceptional results in their marketing campaigns.',
      'features.multiAI.title': 'Advanced Multi-AI',
      'features.multiAI.desc': 'Access to OpenAI GPT-4, Claude, Gemini and more AI models to generate varied and high-quality content.',
      'features.instant.title': 'Instant Generation',
      'features.instant.desc': 'Create professional scripts in less than 30 seconds. Optimize your time and increase your productivity.',
      'features.brand.title': 'Brand Personalization',
      'features.brand.desc': 'Train the AI with your brand tone and style to maintain consistency across all your communications.',
      'features.analytics.title': 'Advanced Analytics',
      'features.analytics.desc': 'Detailed performance metrics, ROI and effectiveness of your scripts with real-time reports.',
      'features.quality.title': 'Quality Control',
      'features.quality.desc': 'Automatic and manual review system to guarantee the quality and accuracy of each generated script.',
      'features.availability.title': '24/7 Availability',
      'features.availability.desc': 'Always available platform with continuous technical support and automatic updates.',
      'features.cta': 'Try All Features',
      
      // Stats
      'stats.badge': '📊 Numbers That Speak',
      'stats.title': 'Results that',
      'stats.titleHighlight': 'Transform Businesses',
      'stats.subtitle': 'Thousands of agencies already trust Marketing Genius to revolutionize their content creation process and increase their productivity.',
      'stats.scripts': 'Generated Scripts',
      'stats.scriptsDesc': 'Monthly on our platform',
      'stats.agencies': 'Active Agencies',
      'stats.agenciesDesc': 'Trust Marketing Genius',
      'stats.satisfaction': 'Satisfaction Rate',
      'stats.satisfactionDesc': 'From our premium clients',
      'stats.time': 'Average Time',
      'stats.timeDesc': 'To generate a professional script',
      'stats.trustedBy': 'Companies that trust us:',
      
      // Pricing
      'pricing.badge': '💰 Plans & Pricing',
      'pricing.title': 'Choose the Perfect Plan',
      'pricing.titleHighlight': 'for your Agency',
      'pricing.subtitle': 'Plans designed to grow with you. From startups to enterprises, we have the perfect solution for your marketing needs.',
      'pricing.popular': '🏆 Most Popular',
      'pricing.starter.name': 'Starter',
      'pricing.starter.desc': 'Perfect for small agencies just getting started',
      'pricing.professional.name': 'Professional',
      'pricing.professional.desc': 'The most popular choice for growing agencies',
      'pricing.enterprise.name': 'Enterprise',
      'pricing.enterprise.desc': 'Complete solution for large agencies and corporations',
      'pricing.startNow': 'Start Now',
      'pricing.contactSales': 'Contact Sales',
      'pricing.guarantee': '💰 30-day money back guarantee',
      'pricing.questions': 'Questions about pricing?',
      'pricing.questionsDesc': 'Our team is here to help you choose the perfect plan for your agency.',
      'pricing.talkSales': 'Talk to Sales',
      'pricing.freeTrial': 'Try Free for 14 Days',
      
      // CTA
      'cta.badge': '🚀 Join the Marketing Revolution!',
      'cta.title': 'Transform your Agency',
      'cta.titleHighlight': 'in 24 Hours',
      'cta.subtitle': 'Over 2,500 agencies already generate professional scripts in seconds. Don\'t get left behind in the AI marketing revolution.',
      'cta.startNow': 'Get Started Free Now',
      'cta.scheduleDemo': 'Schedule Personal Demo',
      'cta.instant': 'Instant Setup',
      'cta.instantDesc': 'Get started in 2 minutes',
      'cta.secure': '100% Secure',
      'cta.secureDesc': 'Enterprise encryption',
      'cta.noCommitment': 'No Commitment',
      'cta.noCommitmentDesc': 'Cancel anytime',
      'cta.noCreditCard': '💳 No credit card required for free trial',
      'cta.support': '24/7 Support • Satisfaction guarantee • Free setup',
      
      // Footer
      'footer.description': 'The most advanced AI platform for marketing script generation. Transform your agency with cutting-edge technology.',
      'footer.product': 'Product',
      'footer.company': 'Company',
      'footer.copyright': '© 2024 Marketing Genius. All rights reserved.',
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
