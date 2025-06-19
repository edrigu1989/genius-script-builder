// APIS DE REDES SOCIALES CONSOLIDADAS - TODAS EN UNA FUNCIÓN
import { APIClient, RateLimiter, SocialMediaAPIError, formatSocialData } from './utils/apiClient.js';

const rateLimiter = new RateLimiter(300, 60 * 1000);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await rateLimiter.checkLimit();

    const { platform, action } = req.method === 'GET' ? req.query : req.body;

    if (!platform) {
      return res.status(400).json({
        error: 'Platform requerido',
        message: 'Debes especificar: instagram, facebook, youtube, o twitter'
      });
    }

    switch (platform) {
      case 'instagram':
        return await handleInstagram(req, res, action);
      
      case 'facebook':
        return await handleFacebook(req, res, action);
      
      case 'youtube':
        return await handleYouTube(req, res, action);
      
      case 'twitter':
        return await handleTwitter(req, res, action);
      
      default:
        return res.status(400).json({
          error: 'Platform no válido',
          message: 'Platforms disponibles: instagram, facebook, youtube, twitter'
        });
    }

  } catch (error) {
    console.error('Error en APIs sociales:', error);
    
    if (error instanceof SocialMediaAPIError) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
        platform: platform
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
}

// MANEJO DE INSTAGRAM
async function handleInstagram(req, res, action) {
  const { access_token, user_id } = req.body;

  if (!access_token) {
    return res.status(400).json({
      error: 'Access token requerido',
      message: 'Debes proporcionar access_token de Instagram'
    });
  }

  const apiClient = new APIClient('https://graph.instagram.com', {
    'Authorization': `Bearer ${access_token}`
  });

  switch (action) {
    case 'profile':
      return await getInstagramProfile(apiClient, access_token, res);
    
    case 'media':
      return await getInstagramMedia(apiClient, access_token, res);
    
    case 'insights':
      return await getInstagramInsights(apiClient, access_token, res);
    
    default:
      return res.status(400).json({
        error: 'Acción no válida para Instagram',
        message: 'Acciones disponibles: profile, media, insights'
      });
  }
}

// MANEJO DE FACEBOOK
async function handleFacebook(req, res, action) {
  const { access_token, page_id } = req.body;

  if (!access_token) {
    return res.status(400).json({
      error: 'Access token requerido',
      message: 'Debes proporcionar access_token de Facebook'
    });
  }

  const apiClient = new APIClient('https://graph.facebook.com/v18.0', {
    'Authorization': `Bearer ${access_token}`
  });

  switch (action) {
    case 'pages':
      return await getFacebookPages(apiClient, access_token, res);
    
    case 'page_info':
      return await getFacebookPageInfo(apiClient, access_token, page_id, res);
    
    case 'user_info':
      return await getFacebookUserInfo(apiClient, access_token, res);
    
    default:
      return res.status(400).json({
        error: 'Acción no válida para Facebook',
        message: 'Acciones disponibles: pages, page_info, user_info'
      });
  }
}

// MANEJO DE YOUTUBE
async function handleYouTube(req, res, action) {
  const { channel_id, video_id, query } = req.body;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Configuración incompleta',
      message: 'YOUTUBE_API_KEY es requerido'
    });
  }

  const apiClient = new APIClient('https://www.googleapis.com/youtube/v3');

  switch (action) {
    case 'channel_info':
      return await getYouTubeChannelInfo(apiClient, apiKey, channel_id, res);
    
    case 'channel_videos':
      return await getYouTubeChannelVideos(apiClient, apiKey, channel_id, res);
    
    case 'video_info':
      return await getYouTubeVideoInfo(apiClient, apiKey, video_id, res);
    
    case 'trending_videos':
      return await getYouTubeTrendingVideos(apiClient, apiKey, res);
    
    default:
      return res.status(400).json({
        error: 'Acción no válida para YouTube',
        message: 'Acciones disponibles: channel_info, channel_videos, video_info, trending_videos'
      });
  }
}

// MANEJO DE TWITTER
async function handleTwitter(req, res, action) {
  const { username, user_id, tweet_id, query } = req.body;
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    return res.status(500).json({
      error: 'Configuración incompleta',
      message: 'TWITTER_BEARER_TOKEN es requerido'
    });
  }

  const apiClient = new APIClient('https://api.twitter.com/2', {
    'Authorization': `Bearer ${bearerToken}`
  });

  switch (action) {
    case 'user_info':
      return await getTwitterUserInfo(apiClient, username, user_id, res);
    
    case 'user_tweets':
      return await getTwitterUserTweets(apiClient, username, user_id, res);
    
    case 'tweet_info':
      return await getTwitterTweetInfo(apiClient, tweet_id, res);
    
    case 'search_tweets':
      return await searchTwitterTweets(apiClient, query, res);
    
    default:
      return res.status(400).json({
        error: 'Acción no válida para Twitter',
        message: 'Acciones disponibles: user_info, user_tweets, tweet_info, search_tweets'
      });
  }
}

// FUNCIONES DE INSTAGRAM
async function getInstagramProfile(apiClient, accessToken, res) {
  try {
    const data = await apiClient.get('/me', {
      fields: 'id,username,account_type,media_count',
      access_token: accessToken
    });

    return res.status(200).json({
      success: true,
      data: formatSocialData.instagram(data),
      platform: 'instagram',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo perfil de Instagram', 'instagram', 400, error);
  }
}

async function getInstagramMedia(apiClient, accessToken, res) {
  try {
    const data = await apiClient.get('/me/media', {
      fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp',
      access_token: accessToken
    });

    return res.status(200).json({
      success: true,
      data: data.data || [],
      platform: 'instagram',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo media de Instagram', 'instagram', 400, error);
  }
}

async function getInstagramInsights(apiClient, accessToken, res) {
  try {
    const data = await apiClient.get('/me/insights', {
      metric: 'impressions,reach,profile_views',
      period: 'day',
      access_token: accessToken
    });

    return res.status(200).json({
      success: true,
      data: data.data || [],
      platform: 'instagram',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo insights de Instagram', 'instagram', 400, error);
  }
}

// FUNCIONES DE FACEBOOK
async function getFacebookPages(apiClient, accessToken, res) {
  try {
    const data = await apiClient.get('/me/accounts', {
      access_token: accessToken
    });

    return res.status(200).json({
      success: true,
      data: data.data || [],
      platform: 'facebook',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo páginas de Facebook', 'facebook', 400, error);
  }
}

async function getFacebookPageInfo(apiClient, accessToken, pageId, res) {
  if (!pageId) {
    return res.status(400).json({
      error: 'Page ID requerido',
      message: 'Debes proporcionar page_id'
    });
  }

  try {
    const data = await apiClient.get(`/${pageId}`, {
      fields: 'id,name,category,fan_count,talking_about_count',
      access_token: accessToken
    });

    return res.status(200).json({
      success: true,
      data: formatSocialData.facebook(data),
      platform: 'facebook',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo info de página de Facebook', 'facebook', 400, error);
  }
}

async function getFacebookUserInfo(apiClient, accessToken, res) {
  try {
    const data = await apiClient.get('/me', {
      fields: 'id,name,email',
      access_token: accessToken
    });

    return res.status(200).json({
      success: true,
      data: data,
      platform: 'facebook',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo info de usuario de Facebook', 'facebook', 400, error);
  }
}

// FUNCIONES DE YOUTUBE
async function getYouTubeChannelInfo(apiClient, apiKey, channelId, res) {
  if (!channelId) {
    return res.status(400).json({
      error: 'Channel ID requerido',
      message: 'Debes proporcionar channel_id'
    });
  }

  try {
    const data = await apiClient.get('/channels', {
      part: 'snippet,statistics',
      id: channelId,
      key: apiKey
    });

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({
        error: 'Canal no encontrado',
        message: 'No se encontró un canal con ese ID'
      });
    }

    return res.status(200).json({
      success: true,
      data: formatSocialData.youtube(data.items[0]),
      platform: 'youtube',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo canal de YouTube', 'youtube', 400, error);
  }
}

async function getYouTubeChannelVideos(apiClient, apiKey, channelId, res) {
  if (!channelId) {
    return res.status(400).json({
      error: 'Channel ID requerido',
      message: 'Debes proporcionar channel_id'
    });
  }

  try {
    const data = await apiClient.get('/search', {
      part: 'snippet',
      channelId: channelId,
      type: 'video',
      order: 'date',
      maxResults: 25,
      key: apiKey
    });

    return res.status(200).json({
      success: true,
      data: data.items || [],
      platform: 'youtube',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo videos de YouTube', 'youtube', 400, error);
  }
}

async function getYouTubeVideoInfo(apiClient, apiKey, videoId, res) {
  if (!videoId) {
    return res.status(400).json({
      error: 'Video ID requerido',
      message: 'Debes proporcionar video_id'
    });
  }

  try {
    const data = await apiClient.get('/videos', {
      part: 'snippet,statistics',
      id: videoId,
      key: apiKey
    });

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({
        error: 'Video no encontrado',
        message: 'No se encontró un video con ese ID'
      });
    }

    return res.status(200).json({
      success: true,
      data: data.items[0],
      platform: 'youtube',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo video de YouTube', 'youtube', 400, error);
  }
}

async function getYouTubeTrendingVideos(apiClient, apiKey, res) {
  try {
    const data = await apiClient.get('/videos', {
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode: 'US',
      maxResults: 25,
      key: apiKey
    });

    return res.status(200).json({
      success: true,
      data: data.items || [],
      platform: 'youtube',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo videos trending de YouTube', 'youtube', 400, error);
  }
}

// FUNCIONES DE TWITTER
async function getTwitterUserInfo(apiClient, username, userId, res) {
  if (!username && !userId) {
    return res.status(400).json({
      error: 'Username o User ID requerido',
      message: 'Debes proporcionar username o user_id'
    });
  }

  try {
    let endpoint = '/users/by/username/' + username;
    if (userId) {
      endpoint = '/users/' + userId;
    }

    const data = await apiClient.get(endpoint, {
      'user.fields': 'id,name,username,description,public_metrics,verified'
    });

    if (!data.data) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró un usuario con ese username o ID'
      });
    }

    return res.status(200).json({
      success: true,
      data: formatSocialData.twitter(data.data),
      platform: 'twitter',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo usuario de Twitter', 'twitter', 400, error);
  }
}

async function getTwitterUserTweets(apiClient, username, userId, res) {
  if (!username && !userId) {
    return res.status(400).json({
      error: 'Username o User ID requerido',
      message: 'Debes proporcionar username o user_id'
    });
  }

  try {
    let finalUserId = userId;
    if (!finalUserId && username) {
      const userResponse = await apiClient.get('/users/by/username/' + username);
      if (!userResponse.data) {
        return res.status(404).json({
          error: 'Usuario no encontrado',
          message: 'No se encontró un usuario con ese username'
        });
      }
      finalUserId = userResponse.data.id;
    }

    const data = await apiClient.get(`/users/${finalUserId}/tweets`, {
      'tweet.fields': 'id,text,created_at,public_metrics',
      max_results: 25
    });

    return res.status(200).json({
      success: true,
      data: data.data || [],
      platform: 'twitter',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo tweets de Twitter', 'twitter', 400, error);
  }
}

async function getTwitterTweetInfo(apiClient, tweetId, res) {
  if (!tweetId) {
    return res.status(400).json({
      error: 'Tweet ID requerido',
      message: 'Debes proporcionar tweet_id'
    });
  }

  try {
    const data = await apiClient.get(`/tweets/${tweetId}`, {
      'tweet.fields': 'id,text,created_at,author_id,public_metrics',
      expansions: 'author_id',
      'user.fields': 'id,name,username'
    });

    if (!data.data) {
      return res.status(404).json({
        error: 'Tweet no encontrado',
        message: 'No se encontró un tweet con ese ID'
      });
    }

    return res.status(200).json({
      success: true,
      data: data.data,
      includes: data.includes,
      platform: 'twitter',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error obteniendo tweet de Twitter', 'twitter', 400, error);
  }
}

async function searchTwitterTweets(apiClient, query, res) {
  if (!query) {
    return res.status(400).json({
      error: 'Query requerido',
      message: 'Debes proporcionar query para búsqueda'
    });
  }

  try {
    const data = await apiClient.get('/tweets/search/recent', {
      query: query,
      'tweet.fields': 'id,text,created_at,author_id,public_metrics',
      expansions: 'author_id',
      'user.fields': 'id,name,username',
      max_results: 25
    });

    return res.status(200).json({
      success: true,
      data: data.data || [],
      includes: data.includes,
      platform: 'twitter',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new SocialMediaAPIError('Error buscando tweets en Twitter', 'twitter', 400, error);
  }
}

