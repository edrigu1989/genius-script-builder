import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { 
  Video, 
  PenTool, 
  TrendingUp, 
  Zap, 
  Brain,
  Target,
  Upload,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Si el usuario está logueado, mostrar dashboard dual
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('home.title')}
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Opciones Principales */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* PREDICTOR */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transform hover:scale-105"
                  onClick={() => navigate('/video-analysis')}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  🔮 {t('home.video_predictor')}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                  {t('home.video_predictor_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('home.virality_score')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('home.platform_prediction')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('home.optimization_suggestions')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('home.realtime_analysis')}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t dark:border-gray-700">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl">
                    <Upload className="w-5 h-5 mr-2" />
                    {t('home.analyze_video')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* GENERADOR */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-500 dark:hover:border-purple-400 cursor-pointer transform hover:scale-105"
                  onClick={() => navigate('/script-generator')}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <PenTool className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  ✨ {t('home.script_generator')}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                  {t('home.script_generator_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('home.updated_ai')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('home.current_trends')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('home.platform_optimized')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">{t('home.performance_prediction')}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t dark:border-gray-700">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('home.generate_script')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.precision')}</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.updated')}</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.platforms')}</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">5+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{t('home.models')}</div>
            </div>
          </div>

          {/* Acceso rápido al dashboard */}
          <div className="text-center">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-8 py-3 rounded-xl font-semibold"
            >
              {t('nav.dashboard')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Si no está logueado, mostrar landing page
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;

