import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
                Genius Script Builder 3.0
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Predice el éxito de tus videos y genera scripts virales con IA evolutiva
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
                  🔮 Video Predictor
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                  Analiza tus videos y predice su éxito antes de publicar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Score de viralidad 0-100</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Predicción por plataforma</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Sugerencias de optimización</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Análisis en tiempo real</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t dark:border-gray-700">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl">
                    <Upload className="w-5 h-5 mr-2" />
                    Analizar Video
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
                  ✨ Script Generator
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                  Genera scripts virales con IA evolutiva actualizada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">IA con conocimiento actualizado</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Basado en tendencias actuales</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Optimizado por plataforma</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Predicción de performance</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t dark:border-gray-700">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generar Script
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Precisión</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Actualizado</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Plataformas</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">∞</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Evolutivo</div>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Accesos Rápidos</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="hover:bg-blue-50 dark:hover:bg-blue-900"
              >
                📊 Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/analytics')}
                className="hover:bg-purple-50 dark:hover:bg-purple-900"
              >
                📈 Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no está logueado, mostrar landing page
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;

