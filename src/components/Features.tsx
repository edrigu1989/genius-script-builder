
import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '🤖',
      title: 'Multi-IA Avanzada',
      description: 'Acceso a OpenAI GPT-4, Claude, Gemini y más modelos de IA para generar contenido variado y de alta calidad.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: '⚡',
      title: 'Generación Instantánea',
      description: 'Crea scripts profesionales en menos de 30 segundos. Optimiza tu tiempo y aumenta tu productividad.',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: '🎨',
      title: 'Personalización de Marca',
      description: 'Entrena la IA con el tono y estilo de tu marca para mantener consistencia en todas tus comunicaciones.',
      gradient: 'from-green-500 to-blue-600'
    },
    {
      icon: '📊',
      title: 'Analytics Avanzados',
      description: 'Métricas detalladas de rendimiento, ROI y efectividad de tus scripts con reportes en tiempo real.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: '✅',
      title: 'Control de Calidad',
      description: 'Sistema de revisión automática y manual para garantizar la calidad y precisión de cada script generado.',
      gradient: 'from-teal-500 to-green-600'
    },
    {
      icon: '🔄',
      title: 'Disponibilidad 24/7',
      description: 'Plataforma siempre disponible con soporte técnico continuo y actualizaciones automáticas.',
      gradient: 'from-indigo-500 to-blue-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            🚀 Características Principales
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Todo lo que Necesitas para
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Dominar el Marketing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Herramientas profesionales diseñadas para agencias que buscan eficiencia, 
            calidad y resultados excepcionales en sus campañas de marketing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
              <div className="absolute inset-0.5 bg-white rounded-2xl -z-10"></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl">
            Probar Todas las Características
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
