import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUnifiedMetrics, getPlatformInsights } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';

const Analytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (user) {
        try {
          const [metricsData, insightsData] = await Promise.all([
            getUnifiedMetrics(user.id),
            getPlatformInsights(user.id)
          ]);
          setMetrics(metricsData || []);
          setInsights(insightsData || []);
        } catch (error) {
          console.error('Error loading analytics:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAnalytics();
  }, [user]);

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
    { name: 'ScriptMaster Pro', value: 45, color: '#8884d8' },
    { name: 'AnalyticsBrain', value: 30, color: '#82ca9d' },
    { name: 'TrendHunter AI', value: 25, color: '#ffc658' }
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
          <TabsTrigger value="ai-models">Modelos IA</TabsTrigger>
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
              <CardTitle>Uso de Modelos IA</CardTitle>
              <CardDescription>Distribución de uso entre ScriptMaster, AnalyticsBrain y TrendHunter</CardDescription>
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
                <CardTitle>🚀 Recomendaciones IA</CardTitle>
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
                  <h4 className="font-semibold text-indigo-900">Modelo recomendado</h4>
                  <p className="text-indigo-700">TrendHunter AI para contenido viral, AnalyticsBrain para B2B</p>
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

