import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  ExternalLink,
  Calendar,
  Target,
  Zap,
  Users,
  Globe,
  ArrowUp,
  ArrowDown,
  Activity,
  DollarSign,
  FileText,
  PlayCircle,
  CheckCircle
} from 'lucide-react';

const ScriptPerformance = () => {
  const { user } = useAuth();
  const [selectedScript, setSelectedScript] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');

  // Datos de ejemplo para scripts con métricas
  const scriptsWithMetrics = [
    {
      id: 1,
      title: "Lanzamiento Producto Tech",
      type: "Redes Sociales",
      platform: "Instagram",
      created_at: "2024-06-10",
      published_at: "2024-06-11T15:30:00Z",
      status: "published",
      ai_model: "OpenAI",
      content: "🚀 ¡Revoluciona tu marketing con nuestro nuevo producto! Diseñado especialmente para agencias que buscan resultados extraordinarios...",
      metrics: {
        impressions: 45230,
        reach: 32150,
        engagement: 3420,
        likes: 2890,
        comments: 340,
        shares: 190,
        clicks: 1250,
        saves: 680,
        engagement_rate: 10.6,
        click_rate: 3.9,
        conversion_rate: 2.3,
        revenue: 4580,
        cost: 150,
        roi: 2953
      }
    },
    {
      id: 2,
      title: "Newsletter Semanal",
      type: "Email Marketing",
      platform: "Email",
      created_at: "2024-06-08",
      published_at: "2024-06-09T09:00:00Z",
      status: "published",
      ai_model: "Claude",
      content: "Estimados suscriptores, esta semana traemos las últimas tendencias en marketing digital que están transformando la industria...",
      metrics: {
        impressions: 15420,
        reach: 14890,
        engagement: 1890,
        likes: 0,
        comments: 0,
        shares: 45,
        clicks: 1845,
        saves: 0,
        engagement_rate: 12.7,
        click_rate: 12.4,
        conversion_rate: 8.9,
        revenue: 2340,
        cost: 80,
        roi: 2825
      }
    },
    {
      id: 3,
      title: "Campaña Black Friday",
      type: "Publicidad",
      platform: "Facebook",
      created_at: "2024-06-05",
      published_at: "2024-06-06T12:00:00Z",
      status: "published",
      ai_model: "Gemini",
      content: "¡Black Friday está aquí! Descuentos increíbles que no puedes dejar pasar. Solo por tiempo limitado...",
      metrics: {
        impressions: 89450,
        reach: 67230,
        engagement: 8940,
        likes: 6780,
        comments: 1240,
        shares: 920,
        clicks: 4560,
        saves: 1200,
        engagement_rate: 13.3,
        click_rate: 6.8,
        conversion_rate: 4.2,
        revenue: 12450,
        cost: 890,
        roi: 1299
      }
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES').format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rendimiento de Scripts</h1>
            <p className="text-gray-600">Analiza el impacto y ROI de tus scripts publicados</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={timeRange === '7d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('7d')}
              size="sm"
            >
              7 días
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('30d')}
              size="sm"
            >
              30 días
            </Button>
            <Button 
              variant={timeRange === '90d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('90d')}
              size="sm"
            >
              90 días
            </Button>
          </div>
        </div>

        {/* Métricas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scripts Publicados</p>
                  <p className="text-2xl font-bold text-gray-900">35</p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 ml-1">+12% vs mes anterior</span>
                  </div>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Total</p>
                  <p className="text-2xl font-bold text-gray-900">14.2K</p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 ml-1">+8.5% vs mes anterior</span>
                  </div>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(19370)}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 ml-1">+23% vs mes anterior</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">1,892%</p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 ml-1">+156% vs mes anterior</span>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scripts con Métricas */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Scripts Publicados</h2>
          {scriptsWithMetrics.map((script) => (
            <Card key={script.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{script.title}</h3>
                      <Badge variant="outline">{script.type}</Badge>
                      <Badge variant="outline">{script.platform}</Badge>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Publicado
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {script.content}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Publicado: {new Date(script.published_at).toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Modelo: {script.ai_model}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedScript(selectedScript === script.id ? null : script.id)}
                  >
                    {selectedScript === script.id ? 'Ocultar' : 'Ver Detalles'}
                  </Button>
                </div>

                {/* Métricas Principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Impresiones</p>
                    <p className="font-semibold">{formatNumber(script.metrics.impressions)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Alcance</p>
                    <p className="font-semibold">{formatNumber(script.metrics.reach)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Engagement</p>
                    <p className="font-semibold">{formatNumber(script.metrics.engagement)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Clicks</p>
                    <p className="font-semibold">{formatNumber(script.metrics.clicks)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Eng. Rate</p>
                    <p className="font-semibold text-green-600">{script.metrics.engagement_rate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">CTR</p>
                    <p className="font-semibold text-blue-600">{script.metrics.click_rate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="font-semibold text-green-600">{formatCurrency(script.metrics.revenue)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">ROI</p>
                    <p className="font-semibold text-purple-600">{script.metrics.roi}%</p>
                  </div>
                </div>

                {/* Detalles Expandidos */}
                {selectedScript === script.id && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-4">Análisis Detallado</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Engagement Breakdown</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Likes:</span>
                            <span className="font-semibold">{formatNumber(script.metrics.likes)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Comentarios:</span>
                            <span className="font-semibold">{formatNumber(script.metrics.comments)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Compartidos:</span>
                            <span className="font-semibold">{formatNumber(script.metrics.shares)}</span>
                          </div>
                          {script.metrics.saves > 0 && (
                            <div className="flex justify-between">
                              <span>Guardados:</span>
                              <span className="font-semibold">{formatNumber(script.metrics.saves)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Conversiones</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Tasa de Conversión:</span>
                            <span className="font-semibold text-green-600">{script.metrics.conversion_rate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Costo:</span>
                            <span className="font-semibold">{formatCurrency(script.metrics.cost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Revenue:</span>
                            <span className="font-semibold text-green-600">{formatCurrency(script.metrics.revenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ROI:</span>
                            <span className="font-semibold text-purple-600">{script.metrics.roi}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Acciones</h5>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver en Plataforma
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Análisis Completo
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Crear Similar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScriptPerformance;

