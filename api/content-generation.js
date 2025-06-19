// GENERACIÓN DE CONTENIDO CONSOLIDADO
const rateLimiter = {
  checkLimit: async () => true // Simulación simple
};

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
      case 'generate_script':
        return await generateScript(req, res);
      
      case 'transcribe_audio':
        return await transcribeAudio(req, res);
      
      default:
        return res.status(400).json({
          error: 'Acción no válida',
          message: 'Acciones disponibles: generate_script, transcribe_audio'
        });
    }

  } catch (error) {
    console.error('Error en generación de contenido:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
}

// GENERACIÓN DE SCRIPTS
async function generateScript(req, res) {
  const { 
    topic, 
    platform, 
    tone, 
    duration, 
    audience, 
    style,
    keywords,
    callToAction 
  } = req.body;

  if (!topic) {
    return res.status(400).json({
      error: 'Tema requerido',
      message: 'Debes proporcionar un topic para el script'
    });
  }

  try {
    const prompt = buildScriptPrompt({
      topic,
      platform: platform || 'general',
      tone: tone || 'profesional',
      duration: duration || 60,
      audience: audience || 'general',
      style: style || 'informativo',
      keywords: keywords || [],
      callToAction: callToAction || 'like y suscríbete'
    });

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'Eres un experto en marketing digital y creación de contenido para redes sociales. Creas scripts atractivos, optimizados para cada plataforma.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      throw new Error(data.error?.message || 'Error en OpenAI API');
    }

    const script = data.choices[0].message.content;

    // Análisis adicional del script generado
    const analysis = analyzeGeneratedScript(script, platform);

    return res.status(200).json({
      success: true,
      script: script,
      analysis: analysis,
      metadata: {
        topic,
        platform,
        tone,
        duration,
        estimatedWords: script.split(' ').length,
        estimatedReadingTime: Math.ceil(script.split(' ').length / 150) // 150 palabras por minuto
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error generando script',
      message: error.message
    });
  }
}

// TRANSCRIPCIÓN DE AUDIO
async function transcribeAudio(req, res) {
  const { audio_url, audio_data, language } = req.body;

  if (!audio_url && !audio_data) {
    return res.status(400).json({
      error: 'Audio requerido',
      message: 'Debes proporcionar audio_url o audio_data'
    });
  }

  try {
    // Preparar FormData para Whisper API
    const formData = new FormData();
    
    if (audio_url) {
      // Descargar audio desde URL
      const audioResponse = await fetch(audio_url);
      const audioBlob = await audioResponse.blob();
      formData.append('file', audioBlob, 'audio.mp3');
    } else {
      // Usar audio_data directamente
      const audioBlob = new Blob([Buffer.from(audio_data, 'base64')], { type: 'audio/mpeg' });
      formData.append('file', audioBlob, 'audio.mp3');
    }

    formData.append('model', 'whisper-1');
    if (language) {
      formData.append('language', language);
    }

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData
    });

    const transcriptionData = await transcriptionResponse.json();

    if (!transcriptionResponse.ok) {
      throw new Error(transcriptionData.error?.message || 'Error en transcripción');
    }

    // Análisis adicional del texto transcrito
    const analysis = analyzeTranscription(transcriptionData.text);

    return res.status(200).json({
      success: true,
      transcription: transcriptionData.text,
      analysis: analysis,
      metadata: {
        language: language || 'auto-detected',
        wordCount: transcriptionData.text.split(' ').length,
        estimatedDuration: estimateAudioDuration(transcriptionData.text)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error transcribiendo audio',
      message: error.message
    });
  }
}

// FUNCIONES AUXILIARES

function buildScriptPrompt(params) {
  const {
    topic,
    platform,
    tone,
    duration,
    audience,
    style,
    keywords,
    callToAction
  } = params;

  let prompt = `Crea un script para ${platform} sobre "${topic}" con las siguientes características:

PARÁMETROS:
- Duración: ${duration} segundos
- Tono: ${tone}
- Audiencia: ${audience}
- Estilo: ${style}
- Call to Action: ${callToAction}`;

  if (keywords && keywords.length > 0) {
    prompt += `\n- Palabras clave a incluir: ${keywords.join(', ')}`;
  }

  prompt += `\n\nREQUISITOS ESPECÍFICOS PARA ${platform.toUpperCase()}:`;

  switch (platform.toLowerCase()) {
    case 'tiktok':
      prompt += `
- Hook potente en los primeros 3 segundos
- Ritmo rápido y dinámico
- Tendencias actuales
- Formato vertical
- Música/sonidos populares`;
      break;
    
    case 'youtube':
      prompt += `
- Introducción clara (primeros 15 segundos)
- Estructura con puntos clave
- Momentos de retención
- SEO optimizado
- Thumbnail-friendly`;
      break;
    
    case 'instagram':
      prompt += `
- Visual-first approach
- Stories y Reels friendly
- Hashtags estratégicos
- Engagement directo
- Estética cuidada`;
      break;
    
    case 'facebook':
      prompt += `
- Storytelling emocional
- Contenido compartible
- Llamadas a la acción claras
- Formato nativo
- Community building`;
      break;
    
    default:
      prompt += `
- Adaptable a múltiples plataformas
- Contenido evergreen
- Engagement universal
- Valor agregado claro`;
  }

  prompt += `\n\nFORMATO DE SALIDA:
Proporciona el script con:
1. Hook/Apertura
2. Desarrollo del contenido
3. Call to Action
4. Hashtags sugeridos (si aplica)
5. Notas de producción`;

  return prompt;
}

function analyzeGeneratedScript(script, platform) {
  const words = script.split(' ').length;
  const sentences = script.split(/[.!?]+/).length - 1;
  const avgWordsPerSentence = Math.round(words / sentences);
  
  // Análisis específico por plataforma
  const platformAnalysis = analyzePlatformOptimization(script, platform);
  
  return {
    wordCount: words,
    sentenceCount: sentences,
    avgWordsPerSentence: avgWordsPerSentence,
    estimatedDuration: Math.ceil(words / 2.5), // ~2.5 palabras por segundo
    readabilityScore: calculateReadabilityScore(script),
    platformOptimization: platformAnalysis,
    suggestions: generateScriptSuggestions(script, platform)
  };
}

function analyzeTranscription(text) {
  const words = text.split(' ').length;
  const sentences = text.split(/[.!?]+/).length - 1;
  
  return {
    wordCount: words,
    sentenceCount: sentences,
    avgWordsPerSentence: Math.round(words / sentences),
    estimatedSpeakingRate: calculateSpeakingRate(text),
    clarity: assessTranscriptionClarity(text),
    keyTopics: extractKeyTopics(text)
  };
}

function analyzePlatformOptimization(script, platform) {
  const analysis = {
    score: 0,
    recommendations: []
  };

  switch (platform?.toLowerCase()) {
    case 'tiktok':
      if (script.toLowerCase().includes('hook') || script.split(' ').slice(0, 10).join(' ').length < 50) {
        analysis.score += 25;
      } else {
        analysis.recommendations.push('Agregar hook más fuerte en los primeros 10 palabras');
      }
      break;
    
    case 'youtube':
      if (script.includes('suscríbete') || script.includes('like')) {
        analysis.score += 20;
      } else {
        analysis.recommendations.push('Incluir call-to-action para suscripción');
      }
      break;
    
    case 'instagram':
      if (script.includes('#')) {
        analysis.score += 15;
      } else {
        analysis.recommendations.push('Agregar hashtags relevantes');
      }
      break;
  }

  return analysis;
}

function calculateReadabilityScore(text) {
  // Implementación simplificada del índice de legibilidad
  const words = text.split(' ').length;
  const sentences = text.split(/[.!?]+/).length - 1;
  const avgWordsPerSentence = words / sentences;
  
  // Score basado en longitud promedio de oraciones
  if (avgWordsPerSentence <= 15) return 'Excelente';
  if (avgWordsPerSentence <= 20) return 'Bueno';
  if (avgWordsPerSentence <= 25) return 'Regular';
  return 'Difícil';
}

function generateScriptSuggestions(script, platform) {
  const suggestions = [];
  
  if (script.length < 100) {
    suggestions.push('Considera expandir el contenido para mayor valor');
  }
  
  if (!script.includes('?')) {
    suggestions.push('Agregar preguntas para aumentar engagement');
  }
  
  if (platform === 'tiktok' && !script.toLowerCase().includes('trend')) {
    suggestions.push('Incorporar tendencias actuales de TikTok');
  }
  
  return suggestions;
}

function calculateSpeakingRate(text) {
  const words = text.split(' ').length;
  // Asumiendo duración promedio basada en palabras
  const estimatedMinutes = words / 150; // 150 palabras por minuto promedio
  return Math.round(words / estimatedMinutes);
}

function assessTranscriptionClarity(text) {
  // Análisis simple de claridad basado en repeticiones y muletillas
  const fillerWords = ['eh', 'um', 'uh', 'este', 'bueno', 'entonces'];
  const fillerCount = fillerWords.reduce((count, word) => {
    return count + (text.toLowerCase().match(new RegExp(word, 'g')) || []).length;
  }, 0);
  
  const totalWords = text.split(' ').length;
  const clarityScore = Math.max(0, 100 - (fillerCount / totalWords) * 100);
  
  return {
    score: Math.round(clarityScore),
    fillerWords: fillerCount,
    assessment: clarityScore > 80 ? 'Excelente' : clarityScore > 60 ? 'Buena' : 'Mejorable'
  };
}

function extractKeyTopics(text) {
  // Extracción simple de temas clave basada en frecuencia de palabras
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 4);
  
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

function estimateAudioDuration(text) {
  const words = text.split(' ').length;
  const estimatedSeconds = Math.round(words / 2.5); // ~2.5 palabras por segundo
  return `${Math.floor(estimatedSeconds / 60)}:${(estimatedSeconds % 60).toString().padStart(2, '0')}`;
}

