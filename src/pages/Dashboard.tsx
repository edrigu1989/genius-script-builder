import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import createAnalytics from '../lib/realTimeAnalytics';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Zap,
  BarChart3,
  PlusCircle,
  Eye,
  Heart,
  MessageCircle,
  Share,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Sparkles,
  Brain,
  Video,
  Settings,
  Link
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentScripts, setRecentScripts] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Inicializar analytics de forma segura
      const analyticsService = createAnalytics(user.id);
      await analyticsService.initialize();
      const dashboardData = await analyticsService.getUnifiedAnalytics();
      setAnalytics(dashboardData);

      // Cargar scripts recientes
      await loadRecentScripts();
      
      // Cargar conexiones
      await loadConnections();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentScripts = async () => {
    try {
      // Simular scripts recientes
      const mockScripts = [
        {
          id: 1,
          title: "Post para Instagram - Estrategias de Marketing",
          platform: "Instagram",
          status: "Publicado",
          engagement: 4.2,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          title: "Thread de Twitter - Tips de Productividad",
          platform: "Twitter",
          status: "Borrador",
          engagement: 0,
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          title: "Video Script - Tutorial de Ventas",
          platform: "YouTube",
          status: "Programado",
          engagement: 0,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setRecentScripts(mockScripts);
    } catch (error) {
      console.error('Error loading recent scripts:', error);
    }
  };

  const loadConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading connections:', error);
      setConnections([]);
    }
  };

  // Funciones de navegación corregidas
  const handleNavigateToAnalytics = () => {
    navigate('/analytics');
  };

  const handleNavigateToScripts = () => {
    navigate('/my-scripts');
  };

  const handleNavigateToGenerator = () => {
    navigate('/script-generator');
  };

  const handleNavigateToConnections = () => {
    navigate('/platform-connections');
  };

  const handleNavigateToVideoAnalysis = () => {
    navigate('/video-analysis');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Publicado':
        return 'bg-green-100 text-green-800';
      case 'Programado':
        return 'bg-blue-100 text-blue-800';
      case 'Borrador':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Instagram':
        return 'text-pink-600';
      case 'Twitter':
        return 'text-blue-400';
      case 'YouTube':
        return 'text-red-600';
      case 'LinkedIn':
        return 'text-blue-700';
      case 'Facebook':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bienvenido de vuelta, {user?.email?.split('@')[0] || 'Usuario'}</p>
          </div>
          <Button 
            onClick={handleNavigateToGenerator}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear Script
          </Button>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scripts Creados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.metrics?.totalPosts || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-600 ml-1">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.metrics?.avgEngagement || 0}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+8.2%</span>
                <span className="text-gray-600 ml-1">vs semana anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plataformas Conectadas</p>
                  <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">
                  {connections.length > 0 ? 'Todas activas' : 'Conecta tus redes'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analytics?.metrics?.totalRevenue?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+24%</span>
                <span className="text-gray-600 ml-1">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scripts Recientes y Acciones Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scripts Recientes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Scripts Recientes</CardTitle>
                  <CardDescription>Tus últimos contenidos generados</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNavigateToScripts}
                >
                  Ver Todos
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentScripts.map((script) => (
                    <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{script.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`text-sm ${getPlatformColor(script.platform)}`}>
                            {script.platform}
                          </span>
                          <Badge className={getStatusColor(script.status)} variant="secondary">
                            {script.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(script.created_at)}
                          </span>
                        </div>
                      </div>
                      {script.status === 'Publicado' && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {script.engagement}% engagement
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {recentScripts.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay scripts aún</h3>
                      <p className="text-gray-600 mb-4">Crea tu primer script para comenzar</p>
                      <Button onClick={handleNavigateToGenerator}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Crear Primer Script
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Rápidas */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Herramientas más utilizadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleNavigateToGenerator}
                >
                  <Brain className="h-4 w-4 mr-3" />
                  Generar Script con IA
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleNavigateToVideoAnalysis}
                >
                  <Video className="h-4 w-4 mr-3" />
                  Analizar Video
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleNavigateToAnalytics}
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Ver Analytics
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleNavigateToConnections}
                >
                  <Link className="h-4 w-4 mr-3" />
                  Conectar Redes Sociales
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleNavigateToScripts}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Mis Scripts
                </Button>
              </CardContent>
            </Card>

            {/* Progreso del Mes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Progreso del Mes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Scripts Creados</span>
                    <span>{recentScripts.length}/20</span>
                  </div>
                  <Progress value={(recentScripts.length / 20) * 100} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Plataformas Conectadas</span>
                    <span>{connections.length}/6</span>
                  </div>
                  <Progress value={(connections.length / 6) * 100} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Engagement Objetivo</span>
                    <span>4.2%/5.0%</span>
                  </div>
                  <Progress value={84} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tendencias y Insights */}
        {analytics?.trends && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Tendencias e Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.trends.engagement?.current || 0}%
                  </p>
                  <p className="text-sm text-gray-600">Engagement Promedio</p>
                  <div className="flex items-center justify-center mt-1">
                    {analytics.trends.engagement?.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ml-1 ${
                      analytics.trends.engagement?.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(analytics.trends.engagement?.change || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.trends.followers?.current?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-600">Seguidores Totales</p>
                  <div className="flex items-center justify-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 ml-1">
                      +{Math.floor(analytics.trends.followers?.change || 0)}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="h-8 w-8 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analytics.trends.revenue?.current?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-gray-600">Revenue del Mes</p>
                  <div className="flex items-center justify-center mt-1">
                    {analytics.trends.revenue?.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ml-1 ${
                      analytics.trends.revenue?.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(analytics.trends.revenue?.change || 0).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
