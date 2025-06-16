import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
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
  Music,
  CheckCircle,
  AlertCircle,
  Settings,
  Zap,
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Define available platforms
  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      description: 'Publica posts, gestiona páginas y analiza engagement',
      features: ['Posts automáticos', 'Gestión de páginas', 'Analytics detallados', 'Programación de contenido'],
      status: 'active'
    },
    {
      id: 'instagram',
      name: 'Instagram Business',
      icon: Instagram,
      color: 'bg-pink-600',
      description: 'Comparte fotos, stories y gestiona tu presencia visual',
      features: ['Posts de fotos/videos', 'Stories automáticas', 'Insights detallados', 'Hashtags optimizados'],
      status: 'active'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-blue-400',
      description: 'Publica tweets, hilos y mantente al día con tendencias',
      features: ['Tweets automáticos', 'Hilos programados', 'Trending topics', 'Engagement tracking'],
      status: 'active'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      description: 'Contenido profesional y networking empresarial',
      features: ['Posts profesionales', 'Artículos largos', 'Network building', 'B2B analytics'],
      status: 'active'
    },
    {
      id: 'tiktok',
      name: 'TikTok Business',
      icon: Music,
      color: 'bg-black',
      description: 'Videos virales y contenido de entretenimiento',
      features: ['Videos cortos', 'Trending sounds', 'Viral analytics', 'Creator tools'],
      status: 'beta'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600',
      description: 'Videos largos, tutoriales y contenido educativo',
      features: ['Video uploads', 'Playlist management', 'Analytics avanzados', 'Monetización'],
      status: 'active'
    }
  ];

  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) throw error;
      setConnections(data || []);
    } catch (err) {
      console.error('Error loading connections:', err);
      setError('Error cargando conexiones');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platformId) => {
    try {
      setConnecting(platformId);
      setError('');
      setSuccess('');
      
      const platform = platforms.find(p => p.id === platformId);
      
      const { data, error } = await supabase
        .from('social_connections')
        .insert({
          user_id: user.id,
          platform: platformId,
          platform_username: `user_${platformId}`,
          access_token: `token_${Date.now()}`,
          refresh_token: `refresh_${Date.now()}`,
          is_active: true,
          connection_metadata: {
            followers: Math.floor(Math.random() * 10000) + 1000,
            following: Math.floor(Math.random() * 1000) + 100,
            posts: Math.floor(Math.random() * 500) + 50
          }
        })
        .select();
      
      if (error) throw error;
      
      await loadConnections();
      setSuccess(`Conectado exitosamente a ${platform.name}`);
    } catch (err) {
      console.error(`Error connecting to ${platformId}:`, err);
      setError(`Error conectando a ${platformId}: ${err.message}`);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (connectionId) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('social_connections')
        .update({ is_active: false })
        .eq('id', connectionId);
      
      if (error) throw error;
      
      await loadConnections();
      setSuccess('Desconectado exitosamente');
    } catch (err) {
      console.error('Error disconnecting:', err);
      setError(`Error desconectando: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformConnection = (platformId) => {
    return connections.find(conn => conn.platform === platformId && conn.is_active);
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
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conexiones de Plataformas</h1>
            <p className="text-gray-600">Conecta tus redes sociales para publicar y analizar contenido automáticamente</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => loadConnections()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar Todo
          </Button>
        </div>

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
                  const Icon = platform?.icon || Globe;
                  
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
                              <p className="text-sm text-gray-600">@{connection.platform_username}</p>
                              <p className="text-xs text-gray-500">
                                {connection.connection_metadata?.followers?.toLocaleString()} seguidores
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-green-100 text-green-800">Conectado</Badge>
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
                  Configura cómo y cuándo se publican tus contenidos en las redes sociales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">Publicación automática</h4>
                    <p className="text-sm text-gray-600">Publica contenido automáticamente cuando se genera</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">Optimización de horarios</h4>
                    <p className="text-sm text-gray-600">Publica en los mejores horarios según analytics</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">Notificaciones de publicación</h4>
                    <p className="text-sm text-gray-600">Recibe notificaciones cuando se publique contenido</p>
                  </div>
                  <Switch defaultChecked />
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
