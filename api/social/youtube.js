// YOUTUBE DATA API - ENDPOINT PRINCIPAL
import { APIClient, RateLimiter, SocialMediaAPIError, formatSocialData } from '../utils/apiClient.js';

// Rate limiter: 10,000 requests por día (aprox 416 por hora)
const rateLimiter = new RateLimiter(400, 60 * 60 * 1000);

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

    const { action, channel_id, video_id, query } = req.method === 'GET' ? req.query : req.body;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Configuración incompleta',
        message: 'YOUTUBE_API_KEY es requerido'
      });
    }

    const apiClient = new APIClient('https://www.googleapis.com/youtube/v3', {
      'Authorization': `Bearer ${apiKey}`
    });

    switch (action) {
      case 'channel_info':
        return await getChannelInfo(apiClient, apiKey, channel_id, res);
      
      case 'channel_videos':
        return await getChannelVideos(apiClient, apiKey, channel_id, res);
      
      case 'video_info':
        return await getVideoInfo(apiClient, apiKey, video_id, res);
      
      case 'search_channels':
        return await searchChannels(apiClient, apiKey, query, res);
      
      case 'trending_videos':
        return await getTrendingVideos(apiClient, apiKey, res);
      
      default:
        return res.status(400).json({
          error: 'Acción no válida',
          message: 'Acciones disponibles: channel_info, channel_videos, video_info, search_channels, trending_videos'
        });
    }

  } catch (error) {
    console.error('Error en YouTube API:', error);
    
    if (error instanceof SocialMediaAPIError) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
        platform: 'youtube'
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar la solicitud de YouTube'
    });
  }
}

// OBTENER INFORMACIÓN DE UN CANAL
async function getChannelInfo(apiClient, apiKey, channelId, res) {
  if (!channelId) {
    return res.status(400).json({
      error: 'Channel ID requerido',
      message: 'Debes proporcionar el ID del canal'
    });
  }

  try {
    const data = await apiClient.get('/channels', {
      part: 'snippet,statistics,brandingSettings',
      id: channelId,
      key: apiKey
    });

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({
        error: 'Canal no encontrado',
        message: 'No se encontró un canal con ese ID'
      });
    }

    const channel = data.items[0];
    const formattedData = formatSocialData.youtube(channel);

    return res.status(200).json({
      success: true,
      data: {
        ...formattedData,
        country: channel.snippet.country,
        defaultLanguage: channel.snippet.defaultLanguage,
        keywords: channel.brandingSettings?.channel?.keywords,
        bannerImageUrl: channel.brandingSettings?.image?.bannerExternalUrl
      },
      platform: 'youtube',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener información del canal de YouTube',
      'youtube',
      400,
      error
    );
  }
}

// OBTENER VIDEOS DE UN CANAL
async function getChannelVideos(apiClient, apiKey, channelId, res) {
  if (!channelId) {
    return res.status(400).json({
      error: 'Channel ID requerido',
      message: 'Debes proporcionar el ID del canal'
    });
  }

  try {
    // Primero obtener el playlist ID de uploads
    const channelData = await apiClient.get('/channels', {
      part: 'contentDetails',
      id: channelId,
      key: apiKey
    });

    if (!channelData.items || channelData.items.length === 0) {
      return res.status(404).json({
        error: 'Canal no encontrado',
        message: 'No se encontró un canal con ese ID'
      });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Obtener videos del playlist de uploads
    const videosData = await apiClient.get('/playlistItems', {
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 25,
      key: apiKey
    });

    // Obtener estadísticas de los videos
    const videoIds = videosData.items.map(item => item.snippet.resourceId.videoId).join(',');
    
    const statsData = await apiClient.get('/videos', {
      part: 'statistics,contentDetails',
      id: videoIds,
      key: apiKey
    });

    const formattedVideos = videosData.items.map(video => {
      const stats = statsData.items.find(s => s.id === video.snippet.resourceId.videoId);
      
      return {
        id: video.snippet.resourceId.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnails: video.snippet.thumbnails,
        channelTitle: video.snippet.channelTitle,
        viewCount: stats?.statistics?.viewCount || 0,
        likeCount: stats?.statistics?.likeCount || 0,
        commentCount: stats?.statistics?.commentCount || 0,
        duration: stats?.contentDetails?.duration,
        platform: 'youtube'
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedVideos,
      pagination: {
        nextPageToken: videosData.nextPageToken,
        prevPageToken: videosData.prevPageToken
      },
      platform: 'youtube',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener videos del canal de YouTube',
      'youtube',
      400,
      error
    );
  }
}

// OBTENER INFORMACIÓN DE UN VIDEO ESPECÍFICO
async function getVideoInfo(apiClient, apiKey, videoId, res) {
  if (!videoId) {
    return res.status(400).json({
      error: 'Video ID requerido',
      message: 'Debes proporcionar el ID del video'
    });
  }

  try {
    const data = await apiClient.get('/videos', {
      part: 'snippet,statistics,contentDetails,status',
      id: videoId,
      key: apiKey
    });

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({
        error: 'Video no encontrado',
        message: 'No se encontró un video con ese ID'
      });
    }

    const video = data.items[0];

    const formattedVideo = {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      thumbnails: video.snippet.thumbnails,
      tags: video.snippet.tags || [],
      categoryId: video.snippet.categoryId,
      defaultLanguage: video.snippet.defaultLanguage,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      commentCount: video.statistics.commentCount,
      duration: video.contentDetails.duration,
      definition: video.contentDetails.definition,
      caption: video.contentDetails.caption,
      licensedContent: video.contentDetails.licensedContent,
      privacyStatus: video.status.privacyStatus,
      uploadStatus: video.status.uploadStatus,
      platform: 'youtube'
    };

    return res.status(200).json({
      success: true,
      data: formattedVideo,
      platform: 'youtube',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener información del video de YouTube',
      'youtube',
      400,
      error
    );
  }
}

// BUSCAR CANALES
async function searchChannels(apiClient, apiKey, query, res) {
  if (!query) {
    return res.status(400).json({
      error: 'Query requerido',
      message: 'Debes proporcionar un término de búsqueda'
    });
  }

  try {
    const data = await apiClient.get('/search', {
      part: 'snippet',
      q: query,
      type: 'channel',
      maxResults: 25,
      key: apiKey
    });

    const formattedChannels = data.items.map(channel => ({
      id: channel.id.channelId,
      title: channel.snippet.title,
      description: channel.snippet.description,
      publishedAt: channel.snippet.publishedAt,
      thumbnails: channel.snippet.thumbnails,
      platform: 'youtube'
    }));

    return res.status(200).json({
      success: true,
      data: formattedChannels,
      pagination: {
        nextPageToken: data.nextPageToken,
        prevPageToken: data.prevPageToken
      },
      platform: 'youtube',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al buscar canales en YouTube',
      'youtube',
      400,
      error
    );
  }
}

// OBTENER VIDEOS TRENDING
async function getTrendingVideos(apiClient, apiKey, res) {
  try {
    const data = await apiClient.get('/videos', {
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode: 'US',
      maxResults: 25,
      key: apiKey
    });

    const formattedVideos = data.items.map(video => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      thumbnails: video.snippet.thumbnails,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      commentCount: video.statistics.commentCount,
      platform: 'youtube'
    }));

    return res.status(200).json({
      success: true,
      data: formattedVideos,
      platform: 'youtube',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener videos trending de YouTube',
      'youtube',
      400,
      error
    );
  }
}

