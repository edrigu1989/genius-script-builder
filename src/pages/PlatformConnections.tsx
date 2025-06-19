import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { supabase } from '../lib/supabase';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Twitter,
  Globe,
  CheckCircle,
  XCircle,
  Shield,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  benefits: string[];
  isConnected: boolean;
}

export default function PlatformConnections() {
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [connectedCount, setConnectedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePlatforms();
    if (user) {
      checkConnections();
    }
  }, [user]);

  const initializePlatforms = () => {
    const platformList: Platform[] = [
      {
        id: 'facebook',
        name: 'Facebook',
        icon: Facebook,
        color: 'bg-blue-600',
        benefits: [
          'Métricas de páginas y posts',
          'Análisis de audiencia',
          'Insights de engagement'
        ],
        isConnected: false
      },
      {
        id: 'instagram',
        name: 'Instagram Business',
        icon: Instagram,
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        benefits: [
          'Analytics de Stories e IGTV',
          'Métricas de Reels',
          'Datos de audiencia'
        ],
        isConnected: false
      },
      {
        id: 'youtube',
        name: 'YouTube',
        icon: Youtube,
        color: 'bg-red-600',
        benefits: [
          'Analytics de videos',
          'Métricas de retención',
          'Datos de suscriptores'
        ],
        isConnected: false
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Linkedin,
        color: 'bg-blue-700',
        benefits: [
          'Analytics profesionales',
          'Engagement B2B',
          'Alcance empresarial'
        ],
        isConnected: false
      },
      {
        id: 'twitter',
        name: 'Twitter / X',
        icon: Twitter,
        color: 'bg-black',
        benefits: [
          'Analytics de tweets',
          'Impresiones y engagement',
          'Tendencias en tiempo real'
        ],
        isConnected: false
      },
      {
        id: 'tiktok',
        name: 'TikTok Business',
        icon: Globe,
        color: 'bg-black',
        benefits: [
          'Analytics de videos',
          'Métricas de viralidad',
          'Tendencias Gen Z'
        ],
        isConnected: false
      }
    ];
    
    setPlatforms(platformList);
  };

  const checkConnections = async () => {
    try {
      if (!user) return;

      const { data: connections, error } = await supabase
        .from('social_connections')
        .select('provider')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error checking connections:', error);
        return;
      }

      if (connections) {
        const connectedPlatforms = connections.map(c => c.provider);
        setPlatforms(prev => prev.map(p => ({
          ...p,
          isConnected: connectedPlatforms.includes(p.id)
        })));
        setConnectedCount(connections.length);
      }
    } catch (error) {
      console.error('Error checking connections:', error);
    }
  };

  const connectPlatform = async (platformId: string) => {
    setLoading(true);
    try {
      // Implementar conexión real usando las nuevas APIs consolidadas
      switch (platformId) {
        case 'instagram':
          await connectInstagram();
          break;
        case 'facebook':
          await connectFacebook();
          break;
        case 'youtube':
          await connectYouTube();
          break;
        case 'twitter':
          await connectTwitter();
          break;
        case 'tiktok':
          await connectTikTok();
          break;
        default:
          alert(`Conectando ${platformId}... Esta funcionalidad estará disponible pronto.`);
      }
    } catch (error) {
      console.error(`Error connecting ${platformId}:`, error);
      alert(`Error conectando ${platformId}. Por favor intenta de nuevo.`);
    } finally {
      setLoading(false);
    }
  };

  const connectInstagram = async () => {
    // Redirigir a OAuth de Instagram
    const clientId = process.env.REACT_APP_INSTAGRAM_CLIENT_ID || 'demo_client_id';
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/instagram/callback');
    const scope = 'user_profile,user_media';
    
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    
    // Por ahora, mostrar instrucciones
    alert(`Para conectar Instagram:
1. Ve a Meta Developers (developers.facebook.com)
2. Crea una app con Instagram Basic Display
3. Configura las variables de entorno
4. Luego podrás conectar automáticamente

Por ahora, puedes probar las APIs en la sección "APIs Sociales"`);
  };

  const connectFacebook = async () => {
    alert(`Para conectar Facebook:
1. Usa la misma app de Meta Developers que Instagram
2. Habilita Facebook Login
3. Configura las variables de entorno
4. Luego podrás conectar automáticamente

Por ahora, puedes probar las APIs en la sección "APIs Sociales"`);
  };

  const connectYouTube = async () => {
    // YouTube no requiere OAuth para datos públicos
    try {
      const response = await fetch('/api/social-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: 'youtube',
          action: 'trending_videos'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('¡YouTube conectado exitosamente! Puedes acceder a datos públicos.');
        setPlatforms(prev => prev.map(p => 
          p.id === 'youtube' ? { ...p, isConnected: true } : p
        ));
        setConnectedCount(prev => prev + 1);
      } else {
        throw new Error(data.error || 'Error conectando YouTube');
      }
    } catch (error) {
      throw error;
    }
  };

  const connectTwitter = async () => {
    // Twitter no requiere OAuth para datos públicos
    try {
      const response = await fetch('/api/social-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: 'twitter',
          action: 'search_tweets',
          query: '#marketing'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('¡Twitter conectado exitosamente! Puedes acceder a datos públicos.');
        setPlatforms(prev => prev.map(p => 
          p.id === 'twitter' ? { ...p, isConnected: true } : p
        ));
        setConnectedCount(prev => prev + 1);
      } else {
        throw new Error(data.error || 'Error conectando Twitter');
      }
    } catch (error) {
      throw error;
    }
  };

  const connectTikTok = async () => {
    alert(`TikTok requiere partnership especial. 
Por ahora, puedes usar datos públicos a través de agregadores de terceros.
Esta funcionalidad estará disponible pronto.`);
  };

  const disconnectPlatform = async (platformId: string) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from('social_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', platformId);

      if (error) {
        console.error('Error disconnecting:', error);
        return;
      }

      setPlatforms(prev => prev.map(p => 
        p.id === platformId ? { ...p, isConnected: false } : p
      ));
      setConnectedCount(prev => prev - 1);
      
      alert(`${platformId} desconectado exitosamente`);
    } catch (error) {
      console.error('Error disconnecting platform:', error);
    }
  };

  const progressPercentage = platforms.length > 0 ? (connectedCount / platforms.length) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Conexiones de Plataformas</h1>
          <p className="text-gray-600 mt-2">
            Conecta tus redes sociales para obtener analytics unificados y generar scripts optimizados
          </p>
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Progreso de Conexiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{connectedCount} de {platforms.length} plataformas conectadas</span>
                <span>{Math.round(progressPercentage)}% completado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <Card key={platform.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                    </div>
                    <Badge 
                      variant={platform.isConnected ? "default" : "secondary"}
                      className={platform.isConnected ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {platform.isConnected ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Conectado</>
                      ) : (
                        <><XCircle className="h-3 w-3 mr-1" /> Desconectado</>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {platform.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => connectPlatform(platform.id)}
                        disabled={platform.isConnected || loading}
                        className="flex-1"
                        variant={platform.isConnected ? "outline" : "default"}
                      >
                        {loading ? 'Conectando...' : 
                         platform.isConnected ? 'Conectado' : 'Conectar'}
                      </Button>
                      
                      {platform.isConnected && (
                        <Button 
                          onClick={() => disconnectPlatform(platform.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Beneficios de Conectar Plataformas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Analytics Unificados</h4>
                  <p className="text-sm text-gray-600">
                    Ve todas tus métricas en un solo lugar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Scripts Optimizados</h4>
                  <p className="text-sm text-gray-600">
                    IA entrenada con tus datos reales
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Insights Profundos</h4>
                  <p className="text-sm text-gray-600">
                    Descubre qué funciona mejor
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold">100% Seguro</h4>
                  <p className="text-sm text-gray-600">
                    Solo lectura, nunca publicamos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold mb-2 text-green-800">Tu privacidad es nuestra prioridad</h4>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>✅ Solo leemos métricas de rendimiento</li>
                  <li>✅ NUNCA publicamos contenido por ti</li>
                  <li>✅ Puedes desconectar en cualquier momento</li>
                  <li>✅ Los datos están encriptados y seguros</li>
                  <li>✅ Cumplimos con GDPR y regulaciones de privacidad</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

