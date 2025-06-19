// FACEBOOK GRAPH API - ENDPOINT PRINCIPAL
import { APIClient, RateLimiter, SocialMediaAPIError, formatSocialData } from '../utils/apiClient.js';

// Rate limiter: 200 requests por hora por defecto
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

    const { action, access_token, page_id } = req.method === 'GET' ? req.query : req.body;

    if (!access_token) {
      return res.status(400).json({
        error: 'Access token requerido',
        message: 'Debes proporcionar un access_token válido de Facebook'
      });
    }

    const apiClient = new APIClient('https://graph.facebook.com/v18.0');

    switch (action) {
      case 'pages':
        return await getPages(apiClient, access_token, res);
      
      case 'page_info':
        return await getPageInfo(apiClient, access_token, page_id, res);
      
      case 'page_posts':
        return await getPagePosts(apiClient, access_token, page_id, res);
      
      case 'page_insights':
        return await getPageInsights(apiClient, access_token, page_id, res);
      
      case 'user_info':
        return await getUserInfo(apiClient, access_token, res);
      
      default:
        return res.status(400).json({
          error: 'Acción no válida',
          message: 'Acciones disponibles: pages, page_info, page_posts, page_insights, user_info'
        });
    }

  } catch (error) {
    console.error('Error en Facebook API:', error);
    
    if (error instanceof SocialMediaAPIError) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
        platform: 'facebook'
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar la solicitud de Facebook'
    });
  }
}

// OBTENER PÁGINAS DEL USUARIO
async function getPages(apiClient, accessToken, res) {
  try {
    const fields = 'id,name,category,about,website,fan_count,talking_about_count,picture,access_token';
    
    const data = await apiClient.get('/me/accounts', {
      fields,
      access_token: accessToken
    });

    const formattedPages = data.data.map(page => ({
      id: page.id,
      name: page.name,
      category: page.category,
      about: page.about,
      website: page.website,
      fanCount: page.fan_count,
      talkingAboutCount: page.talking_about_count,
      picture: page.picture?.data?.url,
      accessToken: page.access_token,
      platform: 'facebook'
    }));

    return res.status(200).json({
      success: true,
      data: formattedPages,
      platform: 'facebook',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener páginas de Facebook',
      'facebook',
      400,
      error
    );
  }
}

// OBTENER INFORMACIÓN DE UNA PÁGINA ESPECÍFICA
async function getPageInfo(apiClient, accessToken, pageId, res) {
  if (!pageId) {
    return res.status(400).json({
      error: 'Page ID requerido',
      message: 'Debes proporcionar el ID de la página'
    });
  }

  try {
    const fields = 'id,name,category,about,website,fan_count,talking_about_count,picture,cover,location,phone,emails,hours,rating_count,overall_star_rating';
    
    const data = await apiClient.get(`/${pageId}`, {
      fields,
      access_token: accessToken
    });

    const formattedData = formatSocialData.facebook(data);

    return res.status(200).json({
      success: true,
      data: {
        ...formattedData,
        cover: data.cover?.source,
        location: data.location,
        phone: data.phone,
        emails: data.emails,
        hours: data.hours,
        ratingCount: data.rating_count,
        overallStarRating: data.overall_star_rating
      },
      platform: 'facebook',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener información de la página de Facebook',
      'facebook',
      400,
      error
    );
  }
}

// OBTENER POSTS DE UNA PÁGINA
async function getPagePosts(apiClient, accessToken, pageId, res) {
  if (!pageId) {
    return res.status(400).json({
      error: 'Page ID requerido',
      message: 'Debes proporcionar el ID de la página'
    });
  }

  try {
    const fields = 'id,message,story,created_time,type,status_type,link,picture,full_picture,permalink_url,shares,reactions.summary(true),comments.summary(true)';
    
    const data = await apiClient.get(`/${pageId}/posts`, {
      fields,
      access_token: accessToken,
      limit: 25
    });

    const formattedPosts = data.data.map(post => ({
      id: post.id,
      message: post.message || '',
      story: post.story || '',
      createdTime: post.created_time,
      type: post.type,
      statusType: post.status_type,
      link: post.link,
      picture: post.picture,
      fullPicture: post.full_picture,
      permalinkUrl: post.permalink_url,
      sharesCount: post.shares?.count || 0,
      reactionsCount: post.reactions?.summary?.total_count || 0,
      commentsCount: post.comments?.summary?.total_count || 0,
      platform: 'facebook'
    }));

    return res.status(200).json({
      success: true,
      data: formattedPosts,
      pagination: {
        next: data.paging?.next,
        previous: data.paging?.previous
      },
      platform: 'facebook',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener posts de la página de Facebook',
      'facebook',
      400,
      error
    );
  }
}

// OBTENER INSIGHTS DE UNA PÁGINA
async function getPageInsights(apiClient, accessToken, pageId, res) {
  if (!pageId) {
    return res.status(400).json({
      error: 'Page ID requerido',
      message: 'Debes proporcionar el ID de la página'
    });
  }

  try {
    const metrics = [
      'page_impressions',
      'page_impressions_unique',
      'page_reach',
      'page_engaged_users',
      'page_post_engagements',
      'page_fans',
      'page_fan_adds',
      'page_fan_removes'
    ];

    const period = 'day';
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const until = new Date().toISOString().split('T')[0];

    const insights = await apiClient.get(`/${pageId}/insights`, {
      metric: metrics.join(','),
      period,
      since,
      until,
      access_token: accessToken
    });

    const formattedInsights = {
      impressions: insights.data.find(m => m.name === 'page_impressions')?.values?.[0]?.value || 0,
      impressionsUnique: insights.data.find(m => m.name === 'page_impressions_unique')?.values?.[0]?.value || 0,
      reach: insights.data.find(m => m.name === 'page_reach')?.values?.[0]?.value || 0,
      engagedUsers: insights.data.find(m => m.name === 'page_engaged_users')?.values?.[0]?.value || 0,
      postEngagements: insights.data.find(m => m.name === 'page_post_engagements')?.values?.[0]?.value || 0,
      fans: insights.data.find(m => m.name === 'page_fans')?.values?.[0]?.value || 0,
      fanAdds: insights.data.find(m => m.name === 'page_fan_adds')?.values?.[0]?.value || 0,
      fanRemoves: insights.data.find(m => m.name === 'page_fan_removes')?.values?.[0]?.value || 0,
      period: `${since} to ${until}`,
      platform: 'facebook'
    };

    return res.status(200).json({
      success: true,
      data: formattedInsights,
      platform: 'facebook',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener insights de la página de Facebook',
      'facebook',
      400,
      error
    );
  }
}

// OBTENER INFORMACIÓN DEL USUARIO
async function getUserInfo(apiClient, accessToken, res) {
  try {
    const fields = 'id,name,email,picture';
    
    const data = await apiClient.get('/me', {
      fields,
      access_token: accessToken
    });

    return res.status(200).json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        picture: data.picture?.data?.url,
        platform: 'facebook'
      },
      platform: 'facebook',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener información del usuario de Facebook',
      'facebook',
      400,
      error
    );
  }
}

