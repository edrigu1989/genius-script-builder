// INSTAGRAM BASIC DISPLAY API - ENDPOINT PRINCIPAL
import { APIClient, RateLimiter, SocialMediaAPIError, formatSocialData } from '../utils/apiClient.js';

// Rate limiter: 200 requests por hora
const rateLimiter = new RateLimiter(200, 60 * 60 * 1000);

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

    const { action, access_token } = req.method === 'GET' ? req.query : req.body;

    if (!access_token) {
      return res.status(400).json({
        error: 'Access token requerido',
        message: 'Debes proporcionar un access_token válido de Instagram'
      });
    }

    const apiClient = new APIClient('https://graph.instagram.com');

    switch (action) {
      case 'profile':
        return await getProfile(apiClient, access_token, res);
      
      case 'media':
        return await getMedia(apiClient, access_token, res);
      
      case 'insights':
        return await getInsights(apiClient, access_token, res);
      
      default:
        return res.status(400).json({
          error: 'Acción no válida',
          message: 'Acciones disponibles: profile, media, insights'
        });
    }

  } catch (error) {
    console.error('Error en Instagram API:', error);
    
    if (error instanceof SocialMediaAPIError) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
        platform: 'instagram'
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar la solicitud de Instagram'
    });
  }
}

// OBTENER PERFIL DE USUARIO
async function getProfile(apiClient, accessToken, res) {
  try {
    const fields = 'id,username,account_type,media_count,followers_count,follows_count,profile_picture_url,website,biography';
    
    const data = await apiClient.get('/me', {
      fields,
      access_token: accessToken
    });

    const formattedData = formatSocialData.instagram(data);

    return res.status(200).json({
      success: true,
      data: formattedData,
      platform: 'instagram',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener perfil de Instagram',
      'instagram',
      400,
      error
    );
  }
}

// OBTENER MEDIA (POSTS)
async function getMedia(apiClient, accessToken, res) {
  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count';
    
    const data = await apiClient.get('/me/media', {
      fields,
      access_token: accessToken,
      limit: 25
    });

    const formattedMedia = data.data.map(post => ({
      id: post.id,
      caption: post.caption || '',
      mediaType: post.media_type,
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url,
      permalink: post.permalink,
      timestamp: post.timestamp,
      likeCount: post.like_count || 0,
      commentsCount: post.comments_count || 0,
      platform: 'instagram'
    }));

    return res.status(200).json({
      success: true,
      data: formattedMedia,
      pagination: {
        next: data.paging?.next,
        previous: data.paging?.previous
      },
      platform: 'instagram',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener media de Instagram',
      'instagram',
      400,
      error
    );
  }
}

// OBTENER INSIGHTS (MÉTRICAS)
async function getInsights(apiClient, accessToken, res) {
  try {
    // Primero obtener el perfil para verificar que es una cuenta business
    const profile = await apiClient.get('/me', {
      fields: 'account_type',
      access_token: accessToken
    });

    if (profile.account_type !== 'BUSINESS') {
      return res.status(400).json({
        error: 'Cuenta no compatible',
        message: 'Los insights solo están disponibles para cuentas de Instagram Business'
      });
    }

    // Obtener insights del perfil
    const metrics = 'impressions,reach,profile_views,website_clicks';
    const period = 'day';
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const until = new Date().toISOString().split('T')[0];

    const insights = await apiClient.get('/me/insights', {
      metric: metrics,
      period,
      since,
      until,
      access_token: accessToken
    });

    const formattedInsights = {
      profileViews: insights.data.find(m => m.name === 'profile_views')?.values?.[0]?.value || 0,
      impressions: insights.data.find(m => m.name === 'impressions')?.values?.[0]?.value || 0,
      reach: insights.data.find(m => m.name === 'reach')?.values?.[0]?.value || 0,
      websiteClicks: insights.data.find(m => m.name === 'website_clicks')?.values?.[0]?.value || 0,
      period: `${since} to ${until}`,
      platform: 'instagram'
    };

    return res.status(200).json({
      success: true,
      data: formattedInsights,
      platform: 'instagram',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener insights de Instagram',
      'instagram',
      400,
      error
    );
  }
}

