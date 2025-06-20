
import React from 'react';
import { useTranslation } from 'react-i18next';

const Stats = () => {
  const { t } = useTranslation();

  const stats = [
    {
      number: '50,000+',
      label: t('stats.scripts'),
      description: t('stats.scriptsDesc'),
      icon: '📝'
    },
    {
      number: '2,500+',
      label: t('stats.agencies'),
      description: t('stats.agenciesDesc'),
      icon: '🏢'
    },
    {
      number: '95%',
      label: t('stats.satisfaction'),
      description: t('stats.satisfactionDesc'),
      icon: '⭐'
    },
    {
      number: '30 seg',
      label: t('stats.time'),
      description: t('stats.timeDesc'),
      icon: '⚡'
    }
  ];

  return (
    <section id="stats" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-4">
            {t('stats.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('stats.title')}
            <span className="bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent block">
              {t('stats.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('stats.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              
              {/* Number */}
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                {stat.number}
              </div>
              
              {/* Label */}
              <div className="text-lg font-semibold text-blue-100 mb-2">
                {stat.label}
              </div>
              
              {/* Description */}
              <div className="text-sm text-blue-200">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-blue-200 mb-8 text-lg">{t('stats.trustedBy')}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              'Microsoft Partner', 'Google Cloud', 'AWS', 'OpenAI Partner', 'Meta Business'
            ].map((company, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg text-white font-medium hover:bg-white/20 transition-all duration-300"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
