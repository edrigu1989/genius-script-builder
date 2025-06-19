// TWITTER API V2 - ENDPOINT PRINCIPAL
import { APIClient, RateLimiter, SocialMediaAPIError, formatSocialData } from '../utils/apiClient.js';

// Rate limiter: 300 requests por 15 minutos (1200 por hora)
const rateLimiter = new RateLimiter(300, 15 * 60 * 1000);

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

    const { action, username, user_id, tweet_id, query } = req.method === 'GET' ? req.query : req.body;
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
        return await getUserInfo(apiClient, username, user_id, res);
      
      case 'user_tweets':
        return await getUserTweets(apiClient, username, user_id, res);
      
      case 'tweet_info':
        return await getTweetInfo(apiClient, tweet_id, res);
      
      case 'search_tweets':
        return await searchTweets(apiClient, query, res);
      
      case 'trending_topics':
        return await getTrendingTopics(apiClient, res);
      
      default:
        return res.status(400).json({
          error: 'Acción no válida',
          message: 'Acciones disponibles: user_info, user_tweets, tweet_info, search_tweets, trending_topics'
        });
    }

  } catch (error) {
    console.error('Error en Twitter API:', error);
    
    if (error instanceof SocialMediaAPIError) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
        platform: 'twitter'
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar la solicitud de Twitter'
    });
  }
}

// OBTENER INFORMACIÓN DE UN USUARIO
async function getUserInfo(apiClient, username, userId, res) {
  if (!username && !userId) {
    return res.status(400).json({
      error: 'Username o User ID requerido',
      message: 'Debes proporcionar el username o user_id'
    });
  }

  try {
    let endpoint = '/users/by/username/' + username;
    if (userId) {
      endpoint = '/users/' + userId;
    }

    const userFields = 'id,name,username,description,profile_image_url,public_metrics,verified,location,url,created_at';
    
    const data = await apiClient.get(endpoint, {
      'user.fields': userFields
    });

    if (!data.data) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró un usuario con ese username o ID'
      });
    }

    const formattedData = formatSocialData.twitter(data.data);

    return res.status(200).json({
      success: true,
      data: {
        ...formattedData,
        location: data.data.location,
        createdAt: data.data.created_at,
        followersCount: data.data.public_metrics.followers_count,
        followingCount: data.data.public_metrics.following_count,
        tweetCount: data.data.public_metrics.tweet_count,
        listedCount: data.data.public_metrics.listed_count
      },
      platform: 'twitter',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener información del usuario de Twitter',
      'twitter',
      400,
      error
    );
  }
}

// OBTENER TWEETS DE UN USUARIO
async function getUserTweets(apiClient, username, userId, res) {
  if (!username && !userId) {
    return res.status(400).json({
      error: 'Username o User ID requerido',
      message: 'Debes proporcionar el username o user_id'
    });
  }

  try {
    // Si tenemos username, primero obtener el user_id
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

    const tweetFields = 'id,text,created_at,author_id,public_metrics,context_annotations,entities,referenced_tweets';
    const expansions = 'author_id,referenced_tweets.id';
    const userFields = 'id,name,username,profile_image_url';

    const data = await apiClient.get(`/users/${finalUserId}/tweets`, {
      'tweet.fields': tweetFields,
      expansions: expansions,
      'user.fields': userFields,
      max_results: 25
    });

    if (!data.data) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No se encontraron tweets para este usuario',
        platform: 'twitter',
        timestamp: new Date().toISOString()
      });
    }

    const formattedTweets = data.data.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      createdAt: tweet.created_at,
      authorId: tweet.author_id,
      retweetCount: tweet.public_metrics.retweet_count,
      likeCount: tweet.public_metrics.like_count,
      replyCount: tweet.public_metrics.reply_count,
      quoteCount: tweet.public_metrics.quote_count,
      contextAnnotations: tweet.context_annotations || [],
      entities: tweet.entities || {},
      referencedTweets: tweet.referenced_tweets || [],
      platform: 'twitter'
    }));

    return res.status(200).json({
      success: true,
      data: formattedTweets,
      includes: data.includes,
      pagination: {
        nextToken: data.meta?.next_token,
        previousToken: data.meta?.previous_token
      },
      platform: 'twitter',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener tweets del usuario de Twitter',
      'twitter',
      400,
      error
    );
  }
}

// OBTENER INFORMACIÓN DE UN TWEET ESPECÍFICO
async function getTweetInfo(apiClient, tweetId, res) {
  if (!tweetId) {
    return res.status(400).json({
      error: 'Tweet ID requerido',
      message: 'Debes proporcionar el ID del tweet'
    });
  }

  try {
    const tweetFields = 'id,text,created_at,author_id,public_metrics,context_annotations,entities,referenced_tweets,reply_settings,source';
    const expansions = 'author_id,referenced_tweets.id';
    const userFields = 'id,name,username,profile_image_url,verified';

    const data = await apiClient.get(`/tweets/${tweetId}`, {
      'tweet.fields': tweetFields,
      expansions: expansions,
      'user.fields': userFields
    });

    if (!data.data) {
      return res.status(404).json({
        error: 'Tweet no encontrado',
        message: 'No se encontró un tweet con ese ID'
      });
    }

    const tweet = data.data;
    const author = data.includes?.users?.find(user => user.id === tweet.author_id);

    const formattedTweet = {
      id: tweet.id,
      text: tweet.text,
      createdAt: tweet.created_at,
      authorId: tweet.author_id,
      author: author ? {
        id: author.id,
        name: author.name,
        username: author.username,
        profileImageUrl: author.profile_image_url,
        verified: author.verified
      } : null,
      retweetCount: tweet.public_metrics.retweet_count,
      likeCount: tweet.public_metrics.like_count,
      replyCount: tweet.public_metrics.reply_count,
      quoteCount: tweet.public_metrics.quote_count,
      contextAnnotations: tweet.context_annotations || [],
      entities: tweet.entities || {},
      referencedTweets: tweet.referenced_tweets || [],
      replySettings: tweet.reply_settings,
      source: tweet.source,
      platform: 'twitter'
    };

    return res.status(200).json({
      success: true,
      data: formattedTweet,
      platform: 'twitter',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener información del tweet de Twitter',
      'twitter',
      400,
      error
    );
  }
}

// BUSCAR TWEETS
async function searchTweets(apiClient, query, res) {
  if (!query) {
    return res.status(400).json({
      error: 'Query requerido',
      message: 'Debes proporcionar un término de búsqueda'
    });
  }

  try {
    const tweetFields = 'id,text,created_at,author_id,public_metrics,context_annotations';
    const expansions = 'author_id';
    const userFields = 'id,name,username,profile_image_url';

    const data = await apiClient.get('/tweets/search/recent', {
      query: query,
      'tweet.fields': tweetFields,
      expansions: expansions,
      'user.fields': userFields,
      max_results: 25
    });

    if (!data.data) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No se encontraron tweets para esta búsqueda',
        platform: 'twitter',
        timestamp: new Date().toISOString()
      });
    }

    const formattedTweets = data.data.map(tweet => {
      const author = data.includes?.users?.find(user => user.id === tweet.author_id);
      
      return {
        id: tweet.id,
        text: tweet.text,
        createdAt: tweet.created_at,
        authorId: tweet.author_id,
        author: author ? {
          id: author.id,
          name: author.name,
          username: author.username,
          profileImageUrl: author.profile_image_url
        } : null,
        retweetCount: tweet.public_metrics.retweet_count,
        likeCount: tweet.public_metrics.like_count,
        replyCount: tweet.public_metrics.reply_count,
        quoteCount: tweet.public_metrics.quote_count,
        contextAnnotations: tweet.context_annotations || [],
        platform: 'twitter'
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedTweets,
      pagination: {
        nextToken: data.meta?.next_token
      },
      platform: 'twitter',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al buscar tweets en Twitter',
      'twitter',
      400,
      error
    );
  }
}

// OBTENER TRENDING TOPICS (Requiere API v1.1 - implementación básica)
async function getTrendingTopics(apiClient, res) {
  try {
    // Nota: Los trending topics requieren Twitter API v1.1
    // Esta es una implementación simulada para mantener consistencia
    return res.status(501).json({
      error: 'Funcionalidad no implementada',
      message: 'Los trending topics requieren Twitter API v1.1. Usa search_tweets para buscar temas populares.',
      platform: 'twitter',
      suggestion: 'Usa action=search_tweets con términos populares como query'
    });

  } catch (error) {
    throw new SocialMediaAPIError(
      'Error al obtener trending topics de Twitter',
      'twitter',
      400,
      error
    );
  }
}

