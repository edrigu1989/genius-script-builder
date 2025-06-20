
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, DollarSign } from 'lucide-react';

const CTA = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToGenerator = () => {
    navigate('/login');
  };

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
          {t('cta.badge')}
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {t('cta.title')}
          <span className="bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent block">
            {t('cta.titleHighlight')}
          </span>
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('cta.subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            onClick={goToGenerator}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-xl"
          >
            {t('cta.startNow')}
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
            {t('cta.scheduleDemo')}
          </button>
        </div>

        {/* Trust Elements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-white font-semibold">{t('cta.instant')}</div>
            <div className="text-blue-100 text-sm">{t('cta.instantDesc')}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-white font-semibold">{t('cta.secure')}</div>
            <div className="text-blue-100 text-sm">{t('cta.secureDesc')}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-white font-semibold">{t('cta.noCommitment')}</div>
            <div className="text-blue-100 text-sm">{t('cta.noCommitmentDesc')}</div>
          </div>
        </div>

        {/* Final Trust Statement */}
        <div className="mt-12 text-center">
          <p className="text-blue-200 text-lg">
            {t('cta.noCreditCard')}
          </p>
          <p className="text-blue-300 text-sm mt-2">
            {t('cta.support')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
