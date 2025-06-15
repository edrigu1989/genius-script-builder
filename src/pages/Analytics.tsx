import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RealTimeAnalytics } from '../lib/realTimeAnalytics';
import { SocialMediaAnalytics } from '../lib/socialMediaService';
import DashboardLayout from '../components/DashboardLayout';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Eye, 
  Heart, 
  Share2, 
  BarChart3,
  Download,
  RefreshCw,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realTimeAnalytics, setRealTimeAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Initialize real-time analytics
  useEffect(() => {
    if (user) {
      const rtAnalytics = new RealTimeAnalytics(user.id);
      setRealTimeAnalytics(rtAnalytics);
      initializeAnalytics(rtAnalytics);
    }
  }, [user]);

  const initializeAnalytics = async (rtAnalytics) => {
    try {
      setLoading(true);
      
      // Initialize analytics
      await rtAnalytics.initialize();
      
      // Get performance dashboard
      const dashboardData = await rtAnalytics.getPerformanceDashboard('30d');
      setDashboard(dashboardData);
      
      // Subscribe to real-time updates
      const unsubscribe = rtAnalytics.subscribe('all', (data) => {
        console.log('Real-time analytics update:', data);
        setLastUpdated(new Date());
      });

      // Subscribe to metrics updates
      rtAnalytics.subscribe('metrics_updated', (metrics) => {
        setDashboard(prev => ({
          ...prev,
          overview: {
            ...prev?.overview,
            ...metrics
          }
        }));
      });

      setLastUpdated(new Date());
      
      // Cleanup subscription on unmount
      return () => unsubscribe();
      
    } catch (err) {
      console.error('Error initializing analytics:', err);
      setError('Error cargando analytics');
      
      // Load fallback data
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    // Fallback dashboard data
    setDashboard({
      overview: {
        scripts_generated: 45,
        content_published: 38,
        total_engagement: 12500,
        roi_percentage: 156.7
      },
      revenue: {
        total_revenue: 2850,
        total_investment: 1820,
        profit: 1030,
        break_even_point: 15
      },
      platforms: {
        facebook: { engagement_rate: 4.2, followers: 2500 },
        instagram: { engagement_rate: 6.8, followers: 1800 },
        linkedin: { engagement_rate: 3.1, followers: 950 },
        twitter: { engagement_rate: 2.9, followers: 1200 }
      },
      trends: {
        scripts_growth: 23.5,
        engagement_growth: 18.2,
        revenue_growth: 34.1,
        roi_trend: 'increasing'
      },
      predictions: {
        next_month_scripts: 52,
        next_month_revenue: 3200,
        projected_roi: 175.3,
        break_even_date: 'Already profitable'
      },
      recommendations: [
        {
          type: 'content',
          priority: 'high',
          title: 'Optimizar horarios de publicación',
          description: 'Publicar entre 10:00-12:00 AM para mejor engagement',
          action: 'Programar contenido'
        },
        {
          type: 'platforms',
          priority: 'medium',
          title: 'Expandir a TikTok',
          description: 'Gran potencial para audiencia joven',
          action: 'Conectar TikTok'
        }
      ]
    });
  };

  // Refresh analytics data
  const refreshAnalytics = async () => {
    if (!realTimeAnalytics) return;
    
    try {
      setLoading(true);
      const dashboardData = await realTimeAnalytics.getPerformanceDashboard('30d');
      setDashboard(dashboardData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error refreshing analytics:', err);
      setError('Error actualizando datos');
    } finally {
      setLoading(false);
    }
  };

  // Generate report
  const generateReport = async () => {
    if (!realTimeAnalytics) return;
    
    try {
      const report = await realTimeAnalytics.generateReport('30d');
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Error generando reporte');
    }
  };

  // Datos de ejemplo para demostración
  const sampleMetrics = [
    { platform: 'Facebook', engagement: 4500, reach: 12000, clicks: 890 },
    { platform: 'Instagram', engagement: 3200, reach: 8500, clicks: 650 },
    { platform: 'LinkedIn', engagement: 1800, reach: 5200, clicks: 420 },
    { platform: 'Twitter', engagement: 2100, reach: 6800, clicks: 380 },
    { platform: 'TikTok', engagement: 5600, reach: 15000, clicks: 1200 }
  ];

  const performanceData = [
    { month: 'Ene', scripts: 12, engagement: 3400 },
    { month: 'Feb', scripts: 15, engagement: 4200 },
    { month: 'Mar', scripts: 18, engagement: 5100 },
    { month: 'Abr', scripts: 22, engagement: 6300 },
    { month: 'May', scripts: 28, engagement: 7800 },
    { month: 'Jun', scripts: 35, engagement: 9200 }
  ];

  const aiModelData = [
    { name: 'Redes Sociales', value: 45, color: '#8884d8' },
    { name: 'Email Marketing', value: 30, color: '#82ca9d' },
    { name: 'Landing Pages', value: 25, color: '#ffc658' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Avanzados</h1>
          <p className="text-gray-600 mt-2">Métricas detalladas de rendimiento y insights de IA</p>
        </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Total</CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17,200</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alcance Total</CardTitle>
            <span className="text-2xl">🎯</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47,500</div>
            <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks Totales</CardTitle>
            <span className="text-2xl">👆</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,540</div>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Promedio</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340%</div>
            <p className="text-xs text-muted-foreground">+22% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Por Plataforma</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="ai-models">Tipos de Contenido</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Plataforma</CardTitle>
              <CardDescription>Comparación de métricas entre plataformas sociales</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sampleMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="engagement" fill="#8884d8" name="Engagement" />
                  <Bar dataKey="reach" fill="#82ca9d" name="Alcance" />
                  <Bar dataKey="clicks" fill="#ffc658" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolución del Rendimiento</CardTitle>
              <CardDescription>Scripts generados vs engagement obtenido</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="scripts" stroke="#8884d8" name="Scripts" />
                  <Line type="monotone" dataKey="engagement" stroke="#82ca9d" name="Engagement" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Tipo de Contenido</CardTitle>
              <CardDescription>Distribución de uso entre diferentes tipos de scripts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={aiModelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {aiModelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Insights de Audiencia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Mejor horario de publicación</h4>
                  <p className="text-blue-700">Martes y jueves entre 7-9 PM obtienen 40% más engagement</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Contenido más efectivo</h4>
                  <p className="text-green-700">Posts con preguntas directas generan 65% más interacción</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Tendencia emergente</h4>
                  <p className="text-purple-700">Videos cortos están superando a imágenes estáticas en 3:1</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Recomendaciones Inteligentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900">Optimización de contenido</h4>
                  <p className="text-orange-700">Usar más emojis en LinkedIn aumenta engagement 25%</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-900">Oportunidad de crecimiento</h4>
                  <p className="text-red-700">TikTok muestra potencial 300% mayor que otras plataformas</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-indigo-900">Estrategia recomendada</h4>
                  <p className="text-indigo-700">Enfócate en contenido visual para maximizar engagement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  );
};

export default Analytics;

