
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">MG</span>
              </div>
              <span className="ml-3 text-xl font-bold">Marketing Genius</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((social, index) => (
                <button
                  key={index}
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-sm">{social[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.product')}</h3>
            <ul className="space-y-3">
              {[
                t('footer.features'),
                t('footer.pricing'),
                t('footer.integrations'),
                t('footer.api'),
                t('footer.security'),
                t('footer.roadmap')
              ].map((link, index) => (
                <li key={index}>
                  <button className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              {[
                t('footer.about'),
                t('footer.careers'),
                t('footer.blog'),
                t('footer.press'),
                t('footer.contact'),
                t('footer.partners')
              ].map((link, index) => (
                <li key={index}>
                  <button className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright')}
            </div>
            <div className="flex space-x-6">
              {[
                t('footer.terms'),
                t('footer.privacy'),
                t('footer.cookies')
              ].map((link, index) => (
                <button
                  key={index}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
