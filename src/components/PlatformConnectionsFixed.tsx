// SOLUCIÓN ESPECÍFICA PARA TU APLICACIÓN
// Archivo: src/components/PlatformConnectionsFixed.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabase';

interface Platform {
  id: string;
  name: string;
  icon: string;
  benefits: string[];
  isConnected: boolean;
  connectUrl?: string;
}

const PlatformConnectionsFixed: React.FC = () => {
  const { t } = useTranslation();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [connectedCount, setConnectedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePlatforms();
    checkConnections();
  }, [t]);

  const initializePlatforms = () => {
    const platformList: Platform[] = [
      {
        id: 'facebook',
        name: t('connections.facebook.title'),
        icon: '📘',
        benefits: [
          t('connections.facebook.benefit1'),
          t('connections.facebook.benefit2'),
          t('connections.facebook.benefit3')
        ],
        isConnected: false
      },
      {
        id: 'instagram',
        name: 'Instagram Business',
        icon: '📷',
        benefits: [
          'Stories analytics',
          'Post insights',
          'Audience data'
        ],
        isConnected: false
      },
      {
        id: 'youtube',
        name: t('connections.youtube.title'),
        icon: '📺',
        benefits: [
          t('connections.youtube.benefit1'),
          t('connections.youtube.benefit2'),
          t('connections.youtube.benefit3')
        ],
        isConnected: false
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: '💼',
        benefits: [
          'Professional analytics',
          'B2B engagement',
          'Business reach'
        ],
        isConnected: false
      },
      {
        id: 'tiktok',
        name: 'TikTok Business',
        icon: '🎵',
        benefits: [
          'Video analytics',
          'Virality metrics',
          'Gen Z trends'
        ],
        isConnected: false
      },
      {
        id: 'twitter',
        name: 'Twitter / X',
        icon: '🐦',
        benefits: [
          'Tweet analytics',
          'Impressions and engagement',
          'Real-time trends'
        ],
        isConnected: false
      }
    ];
    
    setPlatforms(platformList);
  };

  const checkConnections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // CORREGIDO: Usar social_connections en lugar de platform_connections
      const { data: connections, error } = await supabase
        .from('social_connections')
        .select('provider')
        .eq('user_id', user.id); // CORREGIDO: usar user_id

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
      switch (platformId) {
        case 'facebook':
          await connectFacebook();
          break;
        case 'instagram':
          await connectInstagram();
          break;
        case 'youtube':
          await connectYouTube();
          break;
        case 'linkedin':
          await connectLinkedIn();
          break;
        case 'tiktok':
          await connectTikTok();
          break;
        case 'twitter':
          await connectTwitter();
          break;
        default:
          console.log(`Connection for ${platformId} not implemented yet`);
      }
    } catch (error) {
      console.error(`Error connecting ${platformId}:`, error);
      alert(`Error conectando ${platformId}. Por favor intenta de nuevo.`);
    } finally {
      setLoading(false);
    }
  };

  // CORREGIDO: Funciones de conexión que abren OAuth correctamente
  const connectFacebook = async () => {
    const clientId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (!clientId) {
      alert('Facebook App ID no configurado. Configura VITE_FACEBOOK_APP_ID en las variables de entorno.');
      return;
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = 'pages_manage_posts,pages_read_engagement,instagram_basic,instagram_manage_insights';
    
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=facebook`;
    
    // Abrir en ventana popup
    const popup = window.open(facebookAuthUrl, 'facebook-auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
    
    // Escuchar cuando se cierre la ventana
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Recargar conexiones después de cerrar popup
        setTimeout(() => checkConnections(), 1000);
      }
    }, 1000);
  };

  const connectInstagram = async () => {
    // Instagram Business usa la misma API que Facebook
    await connectFacebook();
  };

  const connectYouTube = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      alert('Google Client ID no configurado. Configura VITE_GOOGLE_CLIENT_ID en las variables de entorno.');
      return;
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly';
    
    const youtubeAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&state=youtube`;
    
    const popup = window.open(youtubeAuthUrl, 'youtube-auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
    
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        setTimeout(() => checkConnections(), 1000);
      }
    }, 1000);
  };

  const connectLinkedIn = async () => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    if (!clientId) {
      alert('LinkedIn Client ID no configurado. Configura VITE_LINKEDIN_CLIENT_ID en las variables de entorno.');
      return;
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = 'r_organization_social,rw_organization_admin';
    
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=linkedin`;
    
    const popup = window.open(linkedinAuthUrl, 'linkedin-auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
    
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        setTimeout(() => checkConnections(), 1000);
      }
    }, 1000);
  };

  const connectTikTok = async () => {
    const clientId = import.meta.env.VITE_TIKTOK_CLIENT_ID;
    if (!clientId) {
      alert('TikTok Client ID no configurado. Configura VITE_TIKTOK_CLIENT_ID en las variables de entorno.');
      return;
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = 'user.info.basic,video.list';
    
    const tiktokAuthUrl = `https://www.tiktok.com/auth/authorize/?client_key=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}&state=tiktok`;
    
    const popup = window.open(tiktokAuthUrl, 'tiktok-auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
    
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        setTimeout(() => checkConnections(), 1000);
      }
    }, 1000);
  };

  const connectTwitter = async () => {
    const clientId = import.meta.env.VITE_TWITTER_CLIENT_ID;
    if (!clientId) {
      alert('Twitter Client ID no configurado. Configura VITE_TWITTER_CLIENT_ID en las variables de entorno.');
      return;
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = 'tweet.read,tweet.write,users.read,offline.access';
    
    const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=twitter&code_challenge=challenge&code_challenge_method=plain`;
    
    const popup = window.open(twitterAuthUrl, 'twitter-auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
    
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        setTimeout(() => checkConnections(), 1000);
      }
    }, 1000);
  };

  const disconnectPlatform = async (platformId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
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

      // Actualizar UI
      setPlatforms(prev => prev.map(p => 
        p.id === platformId ? { ...p, isConnected: false } : p
      ));
      setConnectedCount(prev => prev - 1);
      
      alert(`${platformId} desconectado exitosamente`);
    } catch (error) {
      console.error('Error disconnecting platform:', error);
    }
  };

  const progressPercentage = (connectedCount / platforms.length) * 100;

  return (
    <div className="platform-connections p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{t('connections.title')}</h2>
        <p className="text-gray-600">{t('connections.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {platforms.map((platform) => (
          <Card key={platform.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                </div>
                <Badge 
                  variant={platform.isConnected ? "default" : "secondary"}
                  className={platform.isConnected ? "bg-green-500" : ""}
                >
                  {platform.isConnected ? t('connections.status.connected') : t('connections.status.disconnected')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  {platform.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✅</span>
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
                    {loading ? '⏳ Conectando...' : 
                     platform.isConnected ? '✅ Conectado' : `🔗 ${t('connections.connect')}`}
                  </Button>
                  
                  {platform.isConnected && (
                    <Button 
                      onClick={() => disconnectPlatform(platform.id)}
                      variant="destructive"
                      size="sm"
                    >
                      ❌
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📈 {t('Your connection progress')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-600">
              {connectedCount} de {platforms.length} plataformas conectadas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h4 className="font-semibold mb-2">Tu privacidad es importante</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✅ Solo leemos métricas de rendimiento</li>
                <li>✅ NUNCA publicamos contenido por ti</li>
                <li>✅ Puedes desconectar en cualquier momento</li>
                <li>✅ Los datos están encriptados y seguros</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformConnectionsFixed;

