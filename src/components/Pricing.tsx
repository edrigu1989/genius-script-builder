import React from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const plans = [
    {
      name: t('pricing.starter.name'),
      price: '$97',
      period: t('pricing.period'),
      description: t('pricing.starter.desc'),
      features: [
        t('pricing.starter.feature1'),
        t('pricing.starter.feature2'),
        t('pricing.starter.feature3'),
        t('pricing.starter.feature4'),
        t('pricing.starter.feature5'),
        t('pricing.starter.feature6')
      ],
      cta: t('pricing.startNow'),
      popular: false
    },
    {
      name: t('pricing.professional.name'),
      price: '$297',
      period: t('pricing.period'),
      description: t('pricing.professional.desc'),
      features: [
        t('pricing.professional.feature1'),
        t('pricing.professional.feature2'),
        t('pricing.professional.feature3'),
        t('pricing.professional.feature4'),
        t('pricing.professional.feature5'),
        t('pricing.professional.feature6'),
        t('pricing.professional.feature7'),
        t('pricing.professional.feature8')
      ],
      cta: t('pricing.startNow'),
      popular: true
    },
    {
      name: t('pricing.enterprise.name'),
      price: 'Custom',
      period: '',
      description: t('pricing.enterprise.desc'),
      features: [
        t('pricing.enterprise.feature1'),
        t('pricing.enterprise.feature2'),
        t('pricing.enterprise.feature3'),
        t('pricing.enterprise.feature4'),
        t('pricing.enterprise.feature5'),
        t('pricing.enterprise.feature6'),
        t('pricing.enterprise.feature7'),
        t('pricing.enterprise.feature8'),
        t('pricing.enterprise.feature9')
      ],
      cta: t('pricing.contactSales'),
      popular: false
    }
  ];

  const handlePlanSelect = (planName: string) => {
    if (planName === 'Enterprise') {
      // Redirect to contact
      window.location.href = 'mailto:contact@geniusscriptbuilder.com';
    } else {
      navigate('/login');
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            {t('pricing.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('pricing.title')}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('pricing.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {t('pricing.popular')}
                  </div>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePlanSelect(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">{t('pricing.guarantee')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('pricing.questions')}
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              {t('pricing.freeTrial')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

