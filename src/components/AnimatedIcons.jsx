// ICONOS ANIMADOS PARA GENIUS SCRIPT BUILDER
// Reemplazando emojis con iconos profesionales de Flaticon

export const AnimatedIcons = {
  // Iconos principales de la aplicación
  video: {
    url: 'https://cdn-icons-gif.flaticon.com/12320/12320312.gif',
    alt: 'Video Analysis',
    description: 'Análisis de video con IA'
  },
  
  script: {
    url: 'https://cdn-icons-gif.flaticon.com/6172/6172531.gif', 
    alt: 'Script Generation',
    description: 'Generación de scripts'
  },
  
  analytics: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074800.gif',
    alt: 'Analytics Dashboard', 
    description: 'Métricas y análisis'
  },
  
  brain: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074771.gif',
    alt: 'AI Intelligence',
    description: 'Inteligencia artificial'
  },
  
  rocket: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074832.gif',
    alt: 'Fast Generation',
    description: 'Generación rápida'
  },
  
  target: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074789.gif',
    alt: 'Targeting',
    description: 'Objetivos y metas'
  },
  
  lightbulb: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074773.gif',
    alt: 'Ideas',
    description: 'Ideas e insights'
  },
  
  chart: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074799.gif',
    alt: 'Charts',
    description: 'Gráficos y estadísticas'
  },
  
  checkmark: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074778.gif',
    alt: 'Success',
    description: 'Éxito y verificación'
  },
  
  clock: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074785.gif',
    alt: 'Time',
    description: 'Tiempo y velocidad'
  },
  
  // Iconos para plataformas sociales
  social: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074794.gif',
    alt: 'Social Media',
    description: 'Redes sociales'
  },
  
  engagement: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074776.gif',
    alt: 'Engagement',
    description: 'Engagement y interacción'
  },
  
  trending: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074798.gif',
    alt: 'Trending',
    description: 'Tendencias'
  },
  
  // Iconos para características
  multiAI: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074771.gif',
    alt: 'Multi AI',
    description: 'Múltiples modelos de IA'
  },
  
  instantGeneration: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074832.gif',
    alt: 'Instant Generation',
    description: 'Generación instantánea'
  },
  
  brandCustomization: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074789.gif',
    alt: 'Brand Customization',
    description: 'Personalización de marca'
  },
  
  advancedAnalytics: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074800.gif',
    alt: 'Advanced Analytics',
    description: 'Analytics avanzados'
  },
  
  qualityControl: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074778.gif',
    alt: 'Quality Control',
    description: 'Control de calidad'
  },
  
  availability: {
    url: 'https://cdn-icons-gif.flaticon.com/8074/8074785.gif',
    alt: '24/7 Availability',
    description: 'Disponibilidad 24/7'
  }
};

// Componente para mostrar iconos animados
export const AnimatedIcon = ({ 
  iconKey, 
  size = 'w-8 h-8', 
  className = '' 
}) => {
  const icon = AnimatedIcons[iconKey];
  
  if (!icon) {
    return <div className={`${size} ${className} bg-gray-200 rounded`}></div>;
  }
  
  return (
    <img 
      src={icon.url}
      alt={icon.alt}
      title={icon.description}
      className={`${size} ${className}`}
      loading="lazy"
    />
  );
};

export default AnimatedIcons;

