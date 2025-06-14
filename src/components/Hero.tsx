
import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 opacity-90"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 animate-fade-in">
            🚀 Revoluciona tu Marketing con IA
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            Genera Scripts de Marketing
            <span className="bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent block">
              en 30 Segundos
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Potencia tu agencia con nuestra IA avanzada. Genera scripts profesionales para 
            redes sociales, emails, landing pages y más con la precisión de múltiples modelos de IA.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-xl">
              Comenzar Gratis
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
              Ver Demo
            </button>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
            {[
              { icon: '⚡', title: 'Generación Instantánea', desc: 'Scripts en 30 segundos' },
              { icon: '🎯', title: 'Multi-IA', desc: 'OpenAI, Claude, Gemini' },
              { icon: '📊', title: 'Analytics Avanzados', desc: 'Métricas en tiempo real' }
            ].map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-blue-100">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={scrollToFeatures}
            className="inline-flex items-center text-white hover:text-yellow-400 transition-colors duration-200 animate-bounce"
          >
            <ArrowDown size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
