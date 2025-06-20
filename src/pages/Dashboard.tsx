import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
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
  ArrowUpRight,
  Target,
  Brain,
  Video,
  Link
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recentScripts] = useState([
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
    }
  ]);
  const [connections] = useState([]);

  const handleNavigateToGenerator = () => {
    navigate('/script-generator');
  };

  const handleNavigateToVideoAnalysis = () => {
    navigate('/video-analysis');
  };

  const handleNavigateToAnalytics = () => {
    navigate('/analytics');
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t('dashboard.welcome_back')}, {user?.email?.split('@')[0] || t('dashboard.user')}</p>
          </div>
          <Button 
            onClick={handleNavigateToGenerator}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('dashboard.create_script')}
          </Button>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.scripts_created')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.avg_engagement')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0%</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+8.2%</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">vs semana anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.connected_platforms')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">6</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Todas activas</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.total_revenue')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$0</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+24%</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scripts Recientes y Acciones Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scripts Recientes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">{t('dashboard.recent_scripts')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {t('dashboard.recent_scripts_desc')}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                {t('dashboard.view_all')}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScripts.map((script) => (
                  <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{script.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-blue-600">{script.platform}</span>
                        <Badge variant="secondary">{script.status}</Badge>
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
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">{t('dashboard.quick_actions')}</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">{t('dashboard.quick_actions_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleNavigateToGenerator}
              >
                <Brain className="h-4 w-4 mr-3" />
                {t('dashboard.generate_script_ai')}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleNavigateToVideoAnalysis}
              >
                <Video className="h-4 w-4 mr-3" />
                {t('dashboard.analyze_video')}
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
              >
                <Link className="h-4 w-4 mr-3" />
                Conectar Redes Sociales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progreso del Mes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Target className="h-5 w-5 mr-2" />
              {t('dashboard.monthly_progress')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">{t('dashboard.scripts_created')}</span>
                <span className="text-gray-900 dark:text-white">{recentScripts.length}/20</span>
              </div>
              <Progress value={(recentScripts.length / 20) * 100} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">{t('dashboard.connected_platforms')}</span>
                <span className="text-gray-900 dark:text-white">{connections.length}/6</span>
              </div>
              <Progress value={(connections.length / 6) * 100} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">{t('dashboard.engagement_goal')}</span>
                <span className="text-gray-900 dark:text-white">4.2%/5.0%</span>
              </div>
              <Progress value={84} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

