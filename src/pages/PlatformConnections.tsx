import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SocialMediaManager } from '../lib/socialMediaService';
import { platformConnections } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Settings,
  Zap,
  Shield,
  Globe,
  Users,
  BarChart3,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

const PlatformConnectionsPage = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [socialManager, setSocialManager] = useState(null);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize Social Media Manager
  useEffect(() => {
    if (user) {
      const manager = new SocialMediaManager(user.id);
      setSocialManager(manager);
      initializeConnections(manager);
    }
  }, [user]);

  const initializeConnections = async (manager) => {
    try {
      setLoading(true);
      await manager.initialize();
      
      // Get all platform statuses
      const statuses = await manager.getAllConnectionStatuses();
      setConnectionStatuses(statuses);
      
      // Get available platforms
      const platforms = manager.getAvailablePlatforms();
      setConnections(platforms);
      
    } catch (err) {
      console.error('Error initializing connections:', err);
      setError('Error cargando conexiones');
    } finally {
      setLoading(false);
    }
  };

  // Handle platform connection
  const handleConnect = async (platformId) => {
    if (!socialManager) return;
    
    try {
      setConnecting(platformId);
      setError('');
      setSuccess('');
      
      await socialManager.connections.initiateConnection(platformId);
      
      // Refresh connection statuses
      const statuses = await socialManager.getAllConnectionStatuses();
      setConnectionStatuses(statuses);
      
      setSuccess(`Conectado exitosamente a ${platformId}`);
    } catch (err) {
      console.error(`Error connecting to ${platformId}:`, err);
      setError(`Error conectando a ${platformId}: ${err.message}`);
    } finally {
      setConnecting(null);
    }
  };

  // Handle platform disconnection
  const handleDisconnect = async (platformId) => {
    if (!socialManager) return;
    
    try {
      setLoading(true);
      await socialManager.connections.disconnect(platformId);
      
      // Refresh connection statuses
      const statuses = await socialManager.getAllConnectionStatuses();
      setConnectionStatuses(statuses);
      
      setSuccess(`Desconectado de ${platformId}`);
    } catch (err) {
      console.error(`Error disconnecting from ${platformId}:`, err);
      setError(`Error desconectando de ${platformId}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get platform configuration
  const getPlatformConfig = (platformId) => {
    const configs = {
      facebook: {
        name: 'Facebook',
        icon: Facebook,
        color: 'bg-blue-600',
        description: 'Publica posts, gestiona páginas y analiza engagement',
        features: ['Posts automáticos', 'Gestión de páginas', 'Analytics detallados', 'Programación de contenido']
      },
      instagram: {
        name: 'Instagram Business',
        icon: Instagram,
        color: 'bg-pink-600',
        description: 'Comparte fotos, stories y gestiona tu presencia visual',
        features: ['Posts de fotos/videos', 'Stories automáticas', 'Insights detallados', 'Hashtags optimizados']
      },
      twitter: {
        name: 'Twitter/X',
        icon: Twitter,
        color: 'bg-blue-400',
        description: 'Publica tweets, hilos y mantente al día con tendencias',
        features: ['Tweets automáticos', 'Hilos programados', 'Trending topics', 'Engagement tracking']
      },
      linkedin: {
        name: 'LinkedIn',
        icon: Linkedin,
        color: 'bg-blue-700',
        description: 'Contenido profesional y networking empresarial',
        features: ['Posts profesionales', 'Artículos largos', 'Network building', 'B2B analytics']
      },
      tiktok: {
        name: 'TikTok Business',
        icon: Music,
        color: 'bg-black',
        description: 'Videos virales y contenido de entretenimiento',
        features: ['Videos cortos', 'Trending sounds', 'Viral analytics', 'Creator tools']
      },
      youtube: {
        name: 'YouTube',
        icon: Youtube,
        color: 'bg-red-600',
        description: 'Videos largos, tutoriales y contenido educativo',
        features: ['Video uploads', 'Playlist management', 'Analytics avanzados', 'Monetización']
      }
    };
    
    return configs[platformId] || {
      name: platformId,
      icon: Globe,
      color: 'bg-gray-600',
      description: 'Plataforma de redes sociales',
      features: []
    };
  };

  // Configuración de plataformas disponibles
  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      description: 'Publica posts, gestiona páginas y analiza engagement',
      features: ['Posts automáticos', 'Gestión de páginas', 'Analytics detallados', 'Programación de contenido'],
      scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
      status: 'available'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Publica fotos, stories y reels con analytics completos',
      features: ['Posts e historias', 'Reels automáticos', 'Hashtags inteligentes', 'Métricas de engagement'],
      scopes: ['instagram_basic', 'instagram_content_publish'],
      status: 'available'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black',
      description: 'Tweets automáticos y análisis de tendencias',
      features: ['Tweets programados', 'Hilos automáticos', 'Análisis de hashtags', 'Métricas en tiempo real'],
      scopes: ['tweet.read', 'tweet.write', 'users.read'],
      status: 'available'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      description: 'Contenido profesional y networking empresarial',
      features: ['Posts profesionales', 'Artículos largos', 'Networking B2B', 'Analytics corporativos'],
      scopes: ['w_member_social', 'r_liteprofile'],
      status: 'available'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Globe, // Usamos Globe como placeholder
      color: 'bg-black',
      description: 'Videos virales y contenido para Gen Z',
      features: ['Videos cortos', 'Trends automáticos', 'Música trending', 'Analytics de viralidad'],
      scopes: ['video.upload', 'user.info.basic'],
      status: 'beta'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600',
      description: 'Videos largos, shorts y gestión de canal',
      features: ['Subida de videos', 'YouTube Shorts', 'Descripciones IA', 'Analytics de canal'],
      scopes: ['youtube.upload', 'youtube.readonly'],
      status: 'available'
    }
  ];

  useEffect(() => {
    loadConnections();
  }, [user]);

  const loadConnections = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Simular conexiones existentes
      const mockConnections = [
        {
          id: '1',
          platform: 'facebook',
          platform_username: '@marketinggenius',
          platform_user_id: '123456789',
          is_active: true,
          created_at: '2024-06-10T10:00:00Z',
          last_sync: '2024-06-15T08:30:00Z',
          connection_metadata: {
            page_name: 'Marketing Genius',
            followers: 15420,
            page_id: 'mg_page_123'
          }
        },
        {
          id: '2',
          platform: 'instagram',
          platform_username: '@marketinggenius_official',
          platform_user_id: '987654321',
          is_active: true,
          created_at: '2024-06-12T14:20:00Z',
          last_sync: '2024-06-15T09:15:00Z',
          connection_metadata: {
            account_type: 'business',
            followers: 8750,
            posts: 156
          }
        }
      ];
      
      setConnections(mockConnections);
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platformId) => {
    setConnecting(platformId);
    
    try {
      // Simular proceso de OAuth
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // En una implementación real, aquí se abriría la ventana de OAuth
      const authUrl = getOAuthUrl(platformId);
      
      // Simular conexión exitosa
      const newConnection = {
        id: Date.now().toString(),
        platform: platformId,
        platform_username: `@user_${platformId}`,
        platform_user_id: `user_${Date.now()}`,
        is_active: true,
        created_at: new Date().toISOString(),
        last_sync: new Date().toISOString(),
        connection_metadata: {
          followers: Math.floor(Math.random() * 10000) + 1000,
          account_type: 'business'
        }
      };
      
      setConnections(prev => [...prev, newConnection]);
      
    } catch (error) {
      console.error('Error connecting platform:', error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (connectionId) => {
    try {
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    } catch (error) {
      console.error('Error disconnecting platform:', error);
    }
  };

  const getOAuthUrl = (platformId) => {
    const baseUrls = {
      facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
      instagram: 'https://api.instagram.com/oauth/authorize',
      twitter: 'https://twitter.com/i/oauth2/authorize',
      linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
      tiktok: 'https://www.tiktok.com/auth/authorize/',
      youtube: 'https://accounts.google.com/oauth2/v2/auth'
    };
    
    return baseUrls[platformId] || '#';
  };

  const getPlatformConnection = (platformId) => {
    return connections.find(conn => conn.platform === platformId && conn.is_active);
  };

  const getPlatformIcon = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.icon : Globe;
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
            <h1 className="text-3xl font-bold text-gray-900">Conexiones de Plataformas</h1>
            <p className="text-gray-600">Conecta tus redes sociales para publicar y analizar contenido automáticamente</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar Todo
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conectadas</p>
                  <p className="text-2xl font-bold text-gray-900">{connections.filter(c => c.is_active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Seguidores Totales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {connections.reduce((acc, conn) => acc + (conn.connection_metadata?.followers || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Posts Publicados</p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">4.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="platforms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="platforms">Plataformas Disponibles</TabsTrigger>
            <TabsTrigger value="connected">Cuentas Conectadas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const connection = getPlatformConnection(platform.id);
                const isConnected = !!connection;
                
                return (
                  <Card key={platform.id} className={`relative overflow-hidden ${isConnected ? 'ring-2 ring-green-500' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{platform.name}</CardTitle>
                            {platform.status === 'beta' && (
                              <Badge variant="outline" className="text-xs">Beta</Badge>
                            )}
                          </div>
                        </div>
                        {isConnected && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <CardDescription>{platform.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Características:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {platform.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {isConnected ? (
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-800">
                                  Conectado como {connection.platform_username}
                                </p>
                                <p className="text-xs text-green-600">
                                  {connection.connection_metadata?.followers?.toLocaleString()} seguidores
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Activo</Badge>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Settings className="h-4 w-4 mr-1" />
                              Configurar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDisconnect(connection.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => handleConnect(platform.id)}
                          disabled={connecting === platform.id}
                        >
                          {connecting === platform.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Conectando...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Conectar {platform.name}
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="connected" className="space-y-6">
            {connections.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay cuentas conectadas</h3>
                  <p className="text-gray-600 mb-4">
                    Conecta tus redes sociales para comenzar a publicar contenido automáticamente
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Conectar Primera Cuenta
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {connections.map((connection) => {
                  const platform = platforms.find(p => p.id === connection.platform);
                  const Icon = getPlatformIcon(connection.platform);
                  
                  return (
                    <Card key={connection.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${platform?.color || 'bg-gray-600'} text-white`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{platform?.name || connection.platform}</h3>
                              <p className="text-gray-600">{connection.platform_username}</p>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span>{connection.connection_metadata?.followers?.toLocaleString()} seguidores</span>
                                <span>•</span>
                                <span>Conectado {new Date(connection.created_at).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>Última sync: {new Date(connection.last_sync).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge className={connection.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {connection.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              Configurar
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver Perfil
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDisconnect(connection.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Desconectar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Publicación</CardTitle>
                <CardDescription>
                  Personaliza cómo y cuándo se publican tus scripts en las redes sociales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Publicación automática</h4>
                    <p className="text-sm text-gray-600">Publica scripts aprobados automáticamente</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Optimización de horarios</h4>
                    <p className="text-sm text-gray-600">Publica en los mejores horarios para tu audiencia</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Hashtags automáticos</h4>
                    <p className="text-sm text-gray-600">Agrega hashtags relevantes automáticamente</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Notificaciones de publicación</h4>
                    <p className="text-sm text-gray-600">Recibe alertas cuando se publique contenido</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seguridad y Privacidad</CardTitle>
                <CardDescription>
                  Gestiona los permisos y la seguridad de tus conexiones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Todas las conexiones están encriptadas y se almacenan de forma segura. 
                    Puedes revocar el acceso en cualquier momento.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renovar todos los tokens de acceso
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Desconectar todas las cuentas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PlatformConnectionsPage;

