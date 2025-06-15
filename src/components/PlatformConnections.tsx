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

const PlatformConnections: React.FC = () => {
  const { t } = useTranslation();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [connectedCount, setConnectedCount] = useState(0);

  useEffect(() => {
    initializePlatforms();
    checkConnections();
  }, [t]);

  const initializePlatforms = () => {
    const platformList: Platform[] = [
      {
        id: 'meta',
        name: t('connections.facebook.title'),
        icon: '📘📷',
        benefits: [
          t('connections.facebook.benefit1'),
          t('connections.facebook.benefit2'),
          t('connections.facebook.benefit3')
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
        name: 'TikTok',
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
      },
      {
        id: 'analytics',
        name: 'Google Analytics',
        icon: '📊',
        benefits: [
          'Web traffic',
          'Conversions',
          'User behavior'
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

      const { data: connections } = await supabase
        .from('platform_connections')
        .select('platform')
        .eq('client_id', user.id)
        .eq('is_active', true);

      if (connections) {
        const connectedPlatforms = connections.map(c => c.platform);
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
    switch (platformId) {
      case 'meta':
        await connectFacebook();
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
      case 'analytics':
        await connectGoogleAnalytics();
        break;
      default:
        console.log(`Connection for ${platformId} not implemented yet`);
    }
  };

  const connectFacebook = async () => {
    // Initialize Facebook SDK if not already done
    if (!window.FB) {
      await loadFacebookSDK();
    }

    window.FB.login((response: any) => {
      if (response.authResponse) {
        savePlatformConnection('meta', response.authResponse);
        updatePlatformStatus('meta', true);
        showSuccessMessage('Facebook + Instagram connected successfully! ✅');
      } else {
        console.error('Facebook login failed');
      }
    }, { 
      scope: 'instagram_basic,pages_read_engagement,instagram_manage_insights,pages_show_list' 
    });
  };

  const connectYouTube = async () => {
    // YouTube connection via Google OAuth
    if (!window.gapi) {
      await loadGoogleAPI();
    }

    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID
      }).then(() => {
        const authInstance = window.gapi.auth2.getAuthInstance();
        authInstance.signIn({
          scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly'
        }).then((user: any) => {
          const authResponse = user.getAuthResponse();
          savePlatformConnection('youtube', authResponse);
          updatePlatformStatus('youtube', true);
          showSuccessMessage('YouTube connected successfully! ✅');
        });
      });
    });
  };

  const connectLinkedIn = async () => {
    const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    const scope = 'r_organization_social,rw_organization_admin';
    
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const connectTikTok = async () => {
    // TikTok OAuth implementation
    console.log('TikTok connection - Coming soon!');
    // Placeholder for TikTok implementation
  };

  const connectTwitter = async () => {
    // Twitter OAuth implementation
    console.log('Twitter connection - Coming soon!');
    // Placeholder for Twitter implementation
  };

  const connectGoogleAnalytics = async () => {
    // Google Analytics connection
    console.log('Google Analytics connection - Coming soon!');
    // Placeholder for GA implementation
  };

  const loadFacebookSDK = (): Promise<void> => {
    return new Promise((resolve) => {
      if (document.getElementById('facebook-jssdk')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.onload = () => {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        resolve();
      };
      document.body.appendChild(script);
    });
  };

  const loadGoogleAPI = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const savePlatformConnection = async (platform: string, authData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('platform_connections')
        .insert({
          client_id: user.id,
          platform: platform,
          access_token: authData.access_token,
          refresh_token: authData.refresh_token || null,
          token_expires_at: authData.expires_in ? 
            new Date(Date.now() + authData.expires_in * 1000) : null,
          platform_user_id: authData.userID || authData.user_id,
          connected_at: new Date(),
          is_active: true
        });

      if (error) {
        console.error('Error saving connection:', error);
      }
    } catch (error) {
      console.error('Error in savePlatformConnection:', error);
    }
  };

  const updatePlatformStatus = (platformId: string, isConnected: boolean) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, isConnected } : p
    ));
    if (isConnected) {
      setConnectedCount(prev => prev + 1);
    }
  };

  const showSuccessMessage = (message: string) => {
    // You can implement a toast notification here
    alert(message);
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
                
                <Button 
                  onClick={() => connectPlatform(platform.id)}
                  disabled={platform.isConnected}
                  className="w-full"
                  variant={platform.isConnected ? "outline" : "default"}
                >
                  {platform.isConnected ? '✅ Connected' : `🔗 ${t('connections.connect')}`}
                </Button>
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
              {t('connections.progress', { count: connectedCount, total: platforms.length })}
            </p>
            
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span>🎯</span>
                <strong>{t('connections.unlock3')}</strong>
              </p>
              <p className="flex items-center gap-2">
                <span>🚀</span>
                <strong>{t('connections.unlockAll')}</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h4 className="font-semibold mb-2">Your privacy is important</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✅ We only read performance metrics</li>
                <li>✅ We NEVER post content for you</li>
                <li>✅ You can disconnect anytime</li>
                <li>✅ Data is encrypted and secure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformConnections;

