import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { platformConnections, unifiedMetrics, userPreferences, platformInsights } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Facebook, 
  Youtube, 
  Linkedin, 
  Twitter,
  Instagram,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3
} from 'lucide-react';

const PlatformConnections = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-500',
      description: t('platforms.facebook.description', 'Connect your Facebook pages for engagement analytics'),
      benefits: [
        t('platforms.facebook.benefit1', 'Page insights and post performance'),
        t('platforms.facebook.benefit2', 'Audience demographics'),
        t('platforms.facebook.benefit3', 'Best posting times')
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: t('platforms.instagram.description', 'Track your Instagram business account metrics'),
      benefits: [
        t('platforms.instagram.benefit1', 'Story and post analytics'),
        t('platforms.instagram.benefit2', 'Hashtag performance'),
        t('platforms.instagram.benefit3', 'Follower growth tracking')
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-500',
      description: t('platforms.youtube.description', 'Analyze your YouTube channel performance'),
      benefits: [
        t('platforms.youtube.benefit1', 'Video analytics and watch time'),
        t('platforms.youtube.benefit2', 'Subscriber growth'),
        t('platforms.youtube.benefit3', 'Revenue tracking')
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-600',
      description: t('platforms.linkedin.description', 'Professional network insights and company page analytics'),
      benefits: [
        t('platforms.linkedin.benefit1', 'Professional audience insights'),
        t('platforms.linkedin.benefit2', 'Company page performance'),
        t('platforms.linkedin.benefit3', 'Industry benchmarks')
      ]
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black',
      description: t('platforms.twitter.description', 'Track tweet performance and audience engagement'),
      benefits: [
        t('platforms.twitter.benefit1', 'Tweet analytics and impressions'),
        t('platforms.twitter.benefit2', 'Follower demographics'),
        t('platforms.twitter.benefit3', 'Trending topics insights')
      ]
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: TrendingUp,
      color: 'bg-black',
      description: t('platforms.tiktok.description', 'Analyze your TikTok content performance'),
      benefits: [
        t('platforms.tiktok.benefit1', 'Video views and engagement'),
        t('platforms.tiktok.benefit2', 'Trending sounds and effects'),
        t('platforms.tiktok.benefit3', 'Audience demographics')
      ]
    }
  ];

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar conexiones existentes
      const connectionsData = await platformConnections.getByClient(user.id);
      setConnections(connectionsData);

      // Cargar métricas unificadas
      const metricsData = await unifiedMetrics.getAggregated(user.id);
      setMetrics(metricsData);

      // Cargar insights
      const insightsData = await platformInsights.getByClient(user.id);
      setInsights(insightsData);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platformId: string) => {
    try {
      // Simular conexión OAuth (en producción sería un popup real)
      const tokenData = {
        access_token: `${platformId}_token_${Date.now()}`,
        refresh_token: `${platformId}_refresh_${Date.now()}`,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        user_id: `${platformId}_user_${Date.now()}`,
        username: `user_${platformId}`,
        scopes: ['read', 'analytics'],
        metadata: { connected_at: new Date().toISOString() },
        ip: '127.0.0.1',
        user_agent: navigator.userAgent
      };

      await platformConnections.create(user.id, platformId, tokenData);
      
      // Recargar datos
      await loadData();

      // Crear insight de bienvenida
      await platformInsights.create({
        client_id: user.id,
        platform: platformId,
        insight_type: 'welcome',
        insight_category: 'setup',
        title: t('insights.welcome.title', `Welcome to ${platformId} analytics!`),
        description: t('insights.welcome.description', `Your ${platformId} account is now connected. We'll start analyzing your content performance and provide personalized recommendations.`),
        action_items: [
          t('insights.welcome.action1', 'Publish your first optimized content'),
          t('insights.welcome.action2', 'Check back in 24 hours for insights')
        ],
        confidence_score: 10.0,
        estimated_impact: 'high'
      });

    } catch (error) {
      console.error('Error connecting platform:', error);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      await platformConnections.disconnect(connectionId);
      await loadData();
    } catch (error) {
      console.error('Error disconnecting platform:', error);
    }
  };

  const getConnectionStatus = (platformId: string) => {
    return connections.find(conn => conn.platform === platformId && conn.is_active);
  };

  const connectedCount = connections.filter(conn => conn.is_active).length;
  const progressPercentage = (connectedCount / platforms.length) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('connections.title', 'Platform Connections')}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('connections.subtitle', 'Connect your social media accounts to get real-time analytics and AI-powered insights for better content performance.')}
        </p>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t('connections.progress', 'Progress')}</span>
            <span>{connectedCount}/{platforms.length} {t('connections.connected', 'connected')}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Incentive Alert */}
      {connectedCount < 3 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {t('connections.incentive', 'Connect 3 or more platforms to unlock cross-platform analytics and advanced AI insights!')}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platforms">{t('connections.tabs.platforms', 'Platforms')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('connections.tabs.analytics', 'Analytics')}</TabsTrigger>
          <TabsTrigger value="insights">{t('connections.tabs.insights', 'Insights')}</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const connection = getConnectionStatus(platform.id);
              const Icon = platform.icon;
              
              return (
                <Card key={platform.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{platform.name}</CardTitle>
                          {connection && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t('connections.status.connected', 'Connected')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {platform.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">
                        {t('connections.benefits', 'Benefits:')}
                      </h4>
                      <ul className="space-y-1">
                        {platform.benefits.map((benefit, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {connection ? (
                      <div className="space-y-3">
                        <div className="text-xs text-gray-500">
                          {t('connections.connectedAs', 'Connected as')}: @{connection.platform_username}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDisconnect(connection.id)}
                          >
                            {t('connections.disconnect', 'Disconnect')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 border-blue-200"
                          >
                            {t('connections.viewAnalytics', 'View Analytics')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleConnect(platform.id)}
                        className="w-full"
                        style={{ backgroundColor: platform.color.includes('gradient') ? undefined : platform.color.replace('bg-', '') }}
                      >
                        {t('connections.connect', 'Connect')} {platform.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {connectedCount === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('analytics.noConnections.title', 'No Analytics Available')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('analytics.noConnections.description', 'Connect at least one platform to start seeing your analytics here.')}
                </p>
                <Button onClick={() => document.querySelector('[value="platforms"]')?.click()}>
                  {t('analytics.noConnections.action', 'Connect Platforms')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {t('analytics.totalPosts', 'Total Posts')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.total_posts || 0}</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% {t('analytics.fromLastMonth', 'from last month')}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {t('analytics.totalViews', 'Total Views')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(metrics?.total_views || 0).toLocaleString()}</div>
                  <div className="flex items-center text-xs text-green-600">
                    <Eye className="h-3 w-3 mr-1" />
                    +8% {t('analytics.fromLastMonth', 'from last month')}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {t('analytics.avgEngagement', 'Avg. Engagement')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(metrics?.avg_engagement_rate || 0).toFixed(1)}%</div>
                  <div className="flex items-center text-xs text-green-600">
                    <Heart className="h-3 w-3 mr-1" />
                    +15% {t('analytics.fromLastMonth', 'from last month')}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {t('analytics.bestPlatform', 'Best Platform')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.best_performing_platform || 'N/A'}</div>
                  <div className="flex items-center text-xs text-blue-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {t('analytics.topPerformer', 'Top performer')}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('insights.noInsights.title', 'No Insights Yet')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('insights.noInsights.description', 'Connect platforms and publish content to start receiving AI-powered insights.')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {insight.platform}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {insight.insight_category}
                          </Badge>
                          {insight.estimated_impact && (
                            <Badge 
                              variant={insight.estimated_impact === 'high' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {insight.estimated_impact} impact
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {new Date(insight.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{insight.description}</p>
                    
                    {insight.action_items && insight.action_items.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-700">
                          {t('insights.actionItems', 'Action Items:')}
                        </h4>
                        <ul className="space-y-1">
                          {insight.action_items.map((item: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        {t('insights.confidence', 'Confidence')}: {insight.confidence_score}/10
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => platformInsights.markImplemented(insight.id)}
                      >
                        {t('insights.markImplemented', 'Mark as Implemented')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformConnections;

