import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const SocialMediaAPIs = () => {
  const [activeTab, setActiveTab] = useState('instagram');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  
  // Estados para cada plataforma
  const [instagramToken, setInstagramToken] = useState('');
  const [facebookToken, setFacebookToken] = useState('');
  const [youtubeChannelId, setYoutubeChannelId] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');

  const handleAPICall = async (platform, action, params = {}) => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/social-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          action,
          ...params
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la API');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderInstagramTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            Instagram Basic Display API
          </CardTitle>
          <CardDescription>
            Obtén datos de perfiles, posts e insights de Instagram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="instagram-token">Access Token</Label>
            <Input
              id="instagram-token"
              type="password"
              placeholder="Tu Instagram access token"
              value={instagramToken}
              onChange={(e) => setInstagramToken(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => handleAPICall('instagram', 'profile', { access_token: instagramToken })}
              disabled={!instagramToken || loading}
            >
              Obtener Perfil
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleAPICall('instagram', 'media', { access_token: instagramToken })}
              disabled={!instagramToken || loading}
            >
              Obtener Posts
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleAPICall('instagram', 'insights', { access_token: instagramToken })}
              disabled={!instagramToken || loading}
            >
              Obtener Insights
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Necesitas configurar una app en Meta Developers y obtener un access token.
              <Button variant="link" className="p-0 h-auto" asChild>
                <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer">
                  Ir a Meta Developers <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );

  const renderFacebookTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-500" />
            Facebook Graph API
          </CardTitle>
          <CardDescription>
            Obtén datos de páginas, posts e insights de Facebook
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebook-token">Access Token</Label>
            <Input
              id="facebook-token"
              type="password"
              placeholder="Tu Facebook access token"
              value={facebookToken}
              onChange={(e) => setFacebookToken(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => handleAPICall('facebook', 'pages', { access_token: facebookToken })}
              disabled={!facebookToken || loading}
            >
              Obtener Páginas
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleAPICall('facebook', 'user_info', { access_token: facebookToken })}
              disabled={!facebookToken || loading}
            >
              Info Usuario
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Necesitas permisos de páginas para acceder a datos completos.
              <Button variant="link" className="p-0 h-auto" asChild>
                <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer">
                  Graph API Explorer <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );

  const renderYouTubeTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            YouTube Data API
          </CardTitle>
          <CardDescription>
            Obtén datos de canales, videos y estadísticas de YouTube
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="youtube-channel">Channel ID</Label>
            <Input
              id="youtube-channel"
              placeholder="UCxxxxxxxxxxxxxxxxxxxxxx"
              value={youtubeChannelId}
              onChange={(e) => setYoutubeChannelId(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => handleAPICall('youtube', 'channel_info', { channel_id: youtubeChannelId })}
              disabled={!youtubeChannelId || loading}
            >
              Info Canal
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleAPICall('youtube', 'channel_videos', { channel_id: youtubeChannelId })}
              disabled={!youtubeChannelId || loading}
            >
              Videos del Canal
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleAPICall('youtube', 'trending_videos')}
              disabled={loading}
            >
              Videos Trending
            </Button>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              YouTube API está configurada y lista para usar. No requiere autenticación para datos públicos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );

  const renderTwitterTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-blue-400" />
            Twitter API v2
          </CardTitle>
          <CardDescription>
            Obtén datos de usuarios, tweets y búsquedas de Twitter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="twitter-username">Username</Label>
            <Input
              id="twitter-username"
              placeholder="@username (sin @)"
              value={twitterUsername}
              onChange={(e) => setTwitterUsername(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => handleAPICall('twitter', 'user_info', { username: twitterUsername })}
              disabled={!twitterUsername || loading}
            >
              Info Usuario
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleAPICall('twitter', 'user_tweets', { username: twitterUsername })}
              disabled={!twitterUsername || loading}
            >
              Tweets del Usuario
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleAPICall('twitter', 'search_tweets', { query: '#marketing' })}
              disabled={loading}
            >
              Buscar #marketing
            </Button>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Twitter API está configurada y lista para usar datos públicos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Resultados de {results.platform}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(results.data) ? (
            <div className="space-y-4">
              {results.data.slice(0, 3).map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    {item.profilePicture && (
                      <img 
                        src={item.profilePicture} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name || item.title || item.username}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description || item.bio || item.text || item.caption}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        {item.followersCount && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {item.followersCount.toLocaleString()}
                          </span>
                        )}
                        {item.viewCount && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.viewCount.toLocaleString()}
                          </span>
                        )}
                        {item.likeCount && (
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {item.likeCount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {results.data.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  Y {results.data.length - 3} elementos más...
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(results.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-muted-foreground">
                      {typeof value === 'number' ? value.toLocaleString() : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Separator className="my-4" />
          <div className="text-xs text-muted-foreground">
            <Badge variant="outline">{results.platform}</Badge>
            <span className="ml-2">Actualizado: {new Date(results.timestamp).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">APIs de Redes Sociales</h1>
          <p className="text-muted-foreground">
            Conecta y obtén datos de Instagram, Facebook, YouTube y Twitter
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              Facebook
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              Twitter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instagram">{renderInstagramTab()}</TabsContent>
          <TabsContent value="facebook">{renderFacebookTab()}</TabsContent>
          <TabsContent value="youtube">{renderYouTubeTab()}</TabsContent>
          <TabsContent value="twitter">{renderTwitterTab()}</TabsContent>
        </Tabs>

        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Obteniendo datos...
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderResults()}
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaAPIs;

