
import React from 'react';
import { CheckCircle } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$97',
      period: '/mes',
      description: 'Perfect para agencias pequeñas que están comenzando',
      features: [
        '50 scripts por mes',
        'Acceso a GPT-4 y Claude',
        'Templates básicos',
        'Analytics básicos',
        'Soporte por email',
        'Exportación PDF/DOCX'
      ],
      gradient: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      name: 'Professional',
      price: '$297',
      period: '/mes',
      description: 'La elección más popular para agencias en crecimiento',
      features: [
        '200 scripts por mes',
        'Todos los modelos de IA',
        'Personalización de marca',
        'Analytics avanzados',
        'Soporte prioritario',
        'A/B Testing',
        'Colaboración en equipo',
        'API access'
      ],
      gradient: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$597',
      period: '/mes',
      description: 'Solución completa para agencias grandes y corporativos',
      features: [
        'Scripts ilimitados',
        'Modelos de IA premium',
        'White-label completo',
        'Analytics predictivos',
        'Soporte 24/7 dedicado',
        'Integración CRM/ERP',
        'Gestión multi-cliente',
        'SLA garantizado',
        'Capacitación personalizada'
      ],
      gradient: 'from-green-500 to-green-600',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            💰 Planes y Precios
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Elige el Plan Perfecto
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              para tu Agencia
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Planes diseñados para crecer contigo. Desde startups hasta empresas, 
            tenemos la solución perfecta para tus necesidades de marketing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                plan.popular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                  🏆 Más Popular
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xl text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg`}
                >
                  {plan.name === 'Enterprise' ? 'Contactar Ventas' : 'Comenzar Ahora'}
                </button>

                {/* Money Back Guarantee */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  💰 Garantía de devolución de 30 días
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Preguntas sobre los precios?</h3>
          <p className="text-gray-600 mb-8">
            Nuestro equipo está aquí para ayudarte a elegir el plan perfecto para tu agencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
              Hablar con Ventas
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
              Probar Gratis 14 Días
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
