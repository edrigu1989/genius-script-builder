
import React from 'react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
          🚀 ¡Únete a la Revolución del Marketing!
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Transforma tu Agencia
          <span className="bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent block">
            en 24 Horas
          </span>
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          Más de 2,500 agencias ya generan scripts profesionales en segundos. 
          No te quedes atrás en la revolución de la IA para marketing.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-xl">
            Comenzar Gratis Ahora
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
            Agendar Demo Personal
          </button>
        </div>

        {/* Trust Elements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-white font-semibold">Setup Instantáneo</div>
            <div className="text-blue-100 text-sm">Comenzar en 2 minutos</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-white font-semibold">100% Seguro</div>
            <div className="text-blue-100 text-sm">Encriptación empresarial</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-white font-semibold">Sin Compromiso</div>
            <div className="text-blue-100 text-sm">Cancela cuando quieras</div>
          </div>
        </div>

        {/* Final Trust Statement */}
        <div className="mt-12 text-center">
          <p className="text-blue-200 text-lg">
            💳 No se requiere tarjeta de crédito para el trial gratuito
          </p>
          <p className="text-blue-300 text-sm mt-2">
            Soporte 24/7 • Garantía de satisfacción • Configuración gratuita
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
