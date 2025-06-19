// ANÁLISIS DE VIDEO CONSOLIDADO - TODAS LAS FUNCIONES EN UNA
import { APIClient, RateLimiter, SocialMediaAPIError } from './utils/apiClient.js';

const rateLimiter = new RateLimiter(100, 60 * 1000);

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

    const { action } = req.method === 'GET' ? req.query : req.body;

    switch (action) {
      case 'analyze_frames':
        return await analyzeFrames(req, res);
      
      case 'analyze_insights':
        return await analyzeInsights(req, res);
      
      case 'analyze_sentiment':
        return await analyzeSentiment(req, res);
      
      case 'analyze_video':
        return await analyzeVideo(req, res);
      
      case 'analyze_visual':
        return await analyzeVisual(req, res);
      
      case 'predict_engagement':
        return await predictEngagement(req, res);
      
      default:
        return res.status(400).json({
          error: 'Acción no válida',
          message: 'Acciones disponibles: analyze_frames, analyze_insights, analyze_sentiment, analyze_video, analyze_visual, predict_engagement'
        });
    }

  } catch (error) {
    console.error('Error en análisis de video:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
}

// ANÁLISIS DE FRAMES
async function analyzeFrames(req, res) {
  const { frames, prompt } = req.body;

  if (!frames || !Array.isArray(frames)) {
    return res.status(400).json({
      error: 'Frames requeridos',
      message: 'Debes proporcionar un array de frames (base64 o URLs)'
    });
  }

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt || 'Analiza estos frames de video y describe lo que ves en cada uno.'
              },
              ...frames.slice(0, 5).map(frame => ({
                type: 'image_url',
                image_url: {
                  url: frame.startsWith('data:') ? frame : `data:image/jpeg;base64,${frame}`
                }
              }))
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      throw new Error(data.error?.message || 'Error en OpenAI API');
    }

    return res.status(200).json({
      success: true,
      analysis: data.choices[0].message.content,
      framesAnalyzed: Math.min(frames.length, 5),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error analizando frames',
      message: error.message
    });
  }
}

// ANÁLISIS DE INSIGHTS
async function analyzeInsights(req, res) {
  const { videoData, metrics } = req.body;

  if (!videoData) {
    return res.status(400).json({
      error: 'Datos de video requeridos',
      message: 'Debes proporcionar videoData con métricas'
    });
  }

  try {
    const insights = {
      // Análisis de duración
      durationInsight: analyzeDuration(videoData.duration),
      
      // Análisis de engagement
      engagementRate: calculateEngagementRate(videoData),
      
      // Análisis de contenido
      contentAnalysis: analyzeContent(videoData),
      
      // Predicciones
      predictions: generatePredictions(videoData),
      
      // Recomendaciones
      recommendations: generateRecommendations(videoData)
    };

    return res.status(200).json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error generando insights',
      message: error.message
    });
  }
}

// ANÁLISIS DE SENTIMIENTOS
async function analyzeSentiment(req, res) {
  const { text, audio_url } = req.body;

  if (!text && !audio_url) {
    return res.status(400).json({
      error: 'Texto o audio requerido',
      message: 'Debes proporcionar text o audio_url'
    });
  }

  try {
    let textToAnalyze = text;

    // Si hay audio, transcribirlo primero
    if (audio_url && !text) {
      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: createFormData(audio_url)
      });

      const transcriptionData = await transcriptionResponse.json();
      textToAnalyze = transcriptionData.text;
    }

    // Analizar sentimiento
    const sentimentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Analiza el sentimiento del siguiente texto y proporciona un análisis detallado incluyendo: sentimiento general (positivo/negativo/neutral), emociones específicas, tono, y score de 0-100.'
          },
          {
            role: 'user',
            content: textToAnalyze
          }
        ],
        max_tokens: 500
      })
    });

    const sentimentData = await sentimentResponse.json();

    return res.status(200).json({
      success: true,
      text: textToAnalyze,
      sentiment: sentimentData.choices[0].message.content,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error analizando sentimiento',
      message: error.message
    });
  }
}

// ANÁLISIS GENERAL DE VIDEO
async function analyzeVideo(req, res) {
  const { video_url, video_data } = req.body;

  if (!video_url && !video_data) {
    return res.status(400).json({
      error: 'Video requerido',
      message: 'Debes proporcionar video_url o video_data'
    });
  }

  try {
    // Análisis completo del video
    const analysis = {
      technical: analyzeTechnicalAspects(video_data),
      content: await analyzeVideoContent(video_url),
      engagement: predictVideoEngagement(video_data),
      recommendations: generateVideoRecommendations(video_data)
    };

    return res.status(200).json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error analizando video',
      message: error.message
    });
  }
}

// ANÁLISIS VISUAL
async function analyzeVisual(req, res) {
  const { image_url, image_data } = req.body;

  if (!image_url && !image_data) {
    return res.status(400).json({
      error: 'Imagen requerida',
      message: 'Debes proporcionar image_url o image_data'
    });
  }

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analiza esta imagen y proporciona un análisis detallado de los elementos visuales, composición, colores, y su efectividad para marketing.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image_url || `data:image/jpeg;base64,${image_data}`
                }
              }
            ]
          }
        ],
        max_tokens: 800
      })
    });

    const data = await openaiResponse.json();

    return res.status(200).json({
      success: true,
      analysis: data.choices[0].message.content,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error analizando imagen',
      message: error.message
    });
  }
}

// PREDICCIÓN DE ENGAGEMENT
async function predictEngagement(req, res) {
  const { video_data, platform } = req.body;

  if (!video_data) {
    return res.status(400).json({
      error: 'Datos de video requeridos',
      message: 'Debes proporcionar video_data'
    });
  }

  try {
    const predictions = {
      youtube: predictYouTubeEngagement(video_data),
      tiktok: predictTikTokEngagement(video_data),
      instagram: predictInstagramEngagement(video_data),
      facebook: predictFacebookEngagement(video_data)
    };

    const selectedPrediction = platform ? predictions[platform] : predictions;

    return res.status(200).json({
      success: true,
      predictions: selectedPrediction,
      platform: platform || 'all',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error prediciendo engagement',
      message: error.message
    });
  }
}

// FUNCIONES AUXILIARES
function analyzeDuration(duration) {
  if (duration < 15) return { score: 85, message: 'Perfecto para TikTok e Instagram Reels' };
  if (duration < 60) return { score: 90, message: 'Excelente duración para redes sociales' };
  if (duration < 300) return { score: 75, message: 'Buena duración para YouTube' };
  return { score: 60, message: 'Considera dividir en videos más cortos' };
}

function calculateEngagementRate(videoData) {
  const { views, likes, comments, shares } = videoData;
  if (!views) return 0;
  return ((likes + comments + shares) / views) * 100;
}

function analyzeContent(videoData) {
  return {
    hasText: !!videoData.text,
    hasAudio: !!videoData.audio,
    hasSubtitles: !!videoData.subtitles,
    quality: videoData.quality || 'unknown'
  };
}

function generatePredictions(videoData) {
  return {
    views: Math.floor(Math.random() * 10000) + 1000,
    engagement: Math.floor(Math.random() * 10) + 2,
    viralPotential: Math.floor(Math.random() * 100)
  };
}

function generateRecommendations(videoData) {
  return [
    'Agregar subtítulos para mayor accesibilidad',
    'Optimizar thumbnail para mayor CTR',
    'Incluir call-to-action al final',
    'Usar hashtags relevantes'
  ];
}

function analyzeTechnicalAspects(videoData) {
  return {
    resolution: videoData.resolution || 'unknown',
    fps: videoData.fps || 'unknown',
    bitrate: videoData.bitrate || 'unknown',
    format: videoData.format || 'unknown'
  };
}

async function analyzeVideoContent(videoUrl) {
  // Simulación de análisis de contenido
  return {
    hasText: true,
    hasAudio: true,
    hasFaces: true,
    hasMovement: true
  };
}

function predictVideoEngagement(videoData) {
  return {
    estimatedViews: Math.floor(Math.random() * 50000) + 5000,
    estimatedLikes: Math.floor(Math.random() * 2000) + 200,
    estimatedComments: Math.floor(Math.random() * 100) + 10
  };
}

function generateVideoRecommendations(videoData) {
  return [
    'Optimizar para móvil',
    'Agregar música de fondo',
    'Mejorar iluminación',
    'Incluir elementos interactivos'
  ];
}

function predictYouTubeEngagement(videoData) {
  return { views: 15000, likes: 800, comments: 50, retention: '65%' };
}

function predictTikTokEngagement(videoData) {
  return { views: 25000, likes: 2500, shares: 150, completion: '78%' };
}

function predictInstagramEngagement(videoData) {
  return { views: 8000, likes: 600, comments: 30, saves: 45 };
}

function predictFacebookEngagement(videoData) {
  return { views: 12000, likes: 400, shares: 80, reactions: 120 };
}

function createFormData(audioUrl) {
  // Simulación de FormData para audio
  const formData = new FormData();
  formData.append('file', audioUrl);
  formData.append('model', 'whisper-1');
  return formData;
}

