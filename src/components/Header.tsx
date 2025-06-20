import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleGeneratorClick = () => {
    navigate('/script-generator');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">MG</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">Marketing Genius</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.features', 'Features')}
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.pricing', 'Pricing')}
            </button>
            <button
              onClick={() => scrollToSection('stats')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.stats', 'Stats')}
            </button>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <button 
              onClick={handleAuthClick}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {t('nav.login', 'Sign In')}
            </button>
            <button 
              onClick={handleGeneratorClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {t('nav.demo', 'Watch Demo')}
            </button>
            <button 
              onClick={handleAuthClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {t('nav.start', 'Start Free')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                {t('nav.features', 'Features')}
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                {t('nav.pricing', 'Pricing')}
              </button>
              <button
                onClick={() => scrollToSection('stats')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
              >
                {t('nav.stats', 'Stats')}
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <div className="flex justify-center pb-2">
                  <LanguageSelector />
                </div>
                <button 
                  onClick={handleAuthClick}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
                >
                  {t('nav.login', 'Sign In')}
                </button>
                <button 
                  onClick={handleGeneratorClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-center"
                >
                  {t('nav.demo', 'Watch Demo')}
                </button>
                <button 
                  onClick={handleAuthClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 text-center"
                >
                  {t('nav.start', 'Start Free')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

