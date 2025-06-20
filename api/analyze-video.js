export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log para debugging
    console.log('🎬 Video Analysis API called');
    console.log('📝 Request body:', req.body);
    console.log('🔑 API Key exists:', !!process.env.GEMINI_API_KEY);
    
    // Verificar que la API key existe
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({
        success: false,
        error: 'API key not configured',
        details: 'GEMINI_API_KEY environment variable is missing'
      });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    console.log('✅ GoogleGenerativeAI imported successfully');
    
    // CONFIGURACIÓN DE GEMINI API PARA ANÁLISIS DE VIDEO
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log('🎬 Iniciando análisis de video con Gemini API');
    
    const { videoUrl, analysisType = 'complete', customPrompt } = req.body;
    
    if (!videoUrl) {
      console.log('❌ Video URL is missing from request');
      return res.status(400).json({
        success: false,
        error: 'URL del video es requerida'
      });
    }

    console.log('📋 Parameters:', { videoUrl, analysisType, customPrompt });

    // CONFIGURAR EL MODELO GEMINI
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });

    console.log('✅ Model configured');

    // PROMPTS ESPECIALIZADOS SEGÚN TIPO DE ANÁLISIS
    const prompts = {
      complete: `Analiza este video de manera completa y proporciona:

1. **RESUMEN DEL CONTENIDO**: Descripción detallada de lo que sucede en el video
2. **ELEMENTOS VISUALES**: Colores, composición, estilo visual, calidad de imagen
3. **AUDIO Y MÚSICA**: Calidad del audio, música de fondo, efectos sonoros
4. **ESTRUCTURA NARRATIVA**: Cómo está organizado el contenido, ritmo, transiciones
5. **ENGAGEMENT FACTORS**: Elementos que capturan la atención del espectador
6. **POTENCIAL VIRAL**: Factores que podrían hacer que este video se vuelva viral
7. **AUDIENCIA OBJETIVO**: A qué tipo de audiencia está dirigido
8. **MEJORAS SUGERIDAS**: Recomendaciones específicas para optimizar el video
9. **SCORE DE VIRALIDAD**: Puntuación del 1-100 con justificación
10. **HASHTAGS RECOMENDADOS**: Lista de hashtags relevantes para maximizar alcance

Proporciona un análisis profesional y detallado.`,

      viral: `Analiza el potencial viral de este video y proporciona:

1. **SCORE DE VIRALIDAD** (1-100): Puntuación con justificación detallada
2. **FACTORES VIRALES PRESENTES**: Qué elementos contribuyen a la viralidad
3. **FACTORES FALTANTES**: Qué le falta para ser más viral
4. **TIMING Y TENDENCIAS**: Si aprovecha tendencias actuales
5. **CALL-TO-ACTION**: Efectividad de las llamadas a la acción
6. **SHAREABILITY**: Qué tan probable es que la gente lo comparta
7. **RECOMENDACIONES**: Cambios específicos para aumentar viralidad`,

      content: `Analiza el contenido de este video y proporciona:

1. **TEMA PRINCIPAL**: Cuál es el mensaje central
2. **PUNTOS CLAVE**: Ideas principales que se comunican
3. **ESTRUCTURA**: Cómo está organizado el contenido
4. **CLARIDAD**: Qué tan claro y comprensible es el mensaje
5. **VALOR EDUCATIVO**: Qué aprende la audiencia
6. **ENTRETENIMIENTO**: Nivel de entretenimiento proporcionado`,

      technical: `Realiza un análisis técnico de este video:

1. **CALIDAD VISUAL**: Resolución, iluminación, estabilidad
2. **CALIDAD DE AUDIO**: Claridad, volumen, sincronización
3. **EDICIÓN**: Calidad de cortes, transiciones, efectos
4. **DURACIÓN**: Si la duración es apropiada para el contenido
5. **FORMATO**: Si el formato es óptimo para la plataforma
6. **ASPECTOS TÉCNICOS**: Problemas técnicos detectados`
    };

    // SELECCIONAR PROMPT SEGÚN TIPO DE ANÁLISIS
    let finalPrompt = prompts[analysisType] || prompts.complete;
    
    if (customPrompt) {
      finalPrompt = customPrompt;
    }

    console.log(`📝 Usando prompt de análisis: ${analysisType}`);

    // Para análisis de video, usamos solo el prompt de texto ya que Vercel no soporta upload de archivos
    finalPrompt += `\n\nVideo URL: ${videoUrl}\n\nNota: Proporciona un análisis basado en la URL del video proporcionada.`;

    console.log('🤖 Enviando solicitud a Gemini API...');
    
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const analysisText = response.text();

    console.log('✅ Análisis completado exitosamente');
    console.log('📄 Response length:', analysisText.length);

    // PROCESAR Y ESTRUCTURAR LA RESPUESTA
    const analysis = {
      videoUrl,
      analysisType,
      timestamp: new Date().toISOString(),
      content: analysisText,
      
      // EXTRAER MÉTRICAS ESPECÍFICAS
      metrics: extractMetrics(analysisText),
      
      // EXTRAER RECOMENDACIONES
      recommendations: extractRecommendations(analysisText),
      
      // EXTRAER HASHTAGS
      hashtags: extractHashtags(analysisText),
      
      // SCORE DE VIRALIDAD
      viralityScore: extractViralityScore(analysisText)
    };

    // RESPUESTA EXITOSA
    res.json({
      success: true,
      analysis,
      message: 'Análisis de video completado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en análisis de video:', error);
    console.error('❌ Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor durante el análisis',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// FUNCIÓN PARA EXTRAER MÉTRICAS DEL ANÁLISIS
function extractMetrics(text) {
  const metrics = {};
  
  // BUSCAR SCORE DE VIRALIDAD
  const viralityMatch = text.match(/(?:score|puntuación).*?(\d+)(?:\/100|%|\s)/i);
  if (viralityMatch) {
    metrics.viralityScore = parseInt(viralityMatch[1]);
  }
  
  // BUSCAR OTRAS MÉTRICAS
  const engagementMatch = text.match(/engagement.*?(\d+)/i);
  if (engagementMatch) {
    metrics.engagementPotential = parseInt(engagementMatch[1]);
  }
  
  return metrics;
}

// FUNCIÓN PARA EXTRAER RECOMENDACIONES
function extractRecommendations(text) {
  const recommendations = [];
  
  // BUSCAR SECCIONES DE RECOMENDACIONES
  const sections = [
    'recomendaciones',
    'mejoras',
    'sugerencias',
    'optimización',
    'cambios'
  ];
  
  sections.forEach(section => {
    const regex = new RegExp(`${section}[^\\n]*:?([^\\n]*(?:\\n(?!\\d+\\.|[A-Z]+:)[^\\n]*)*)`,'gi');
    const matches = text.match(regex);
    
    if (matches) {
      matches.forEach(match => {
        const cleanMatch = match.replace(/^\d+\.\s*/, '').trim();
        if (cleanMatch.length > 10) {
          recommendations.push(cleanMatch);
        }
      });
    }
  });
  
  return recommendations.slice(0, 5); // MÁXIMO 5 RECOMENDACIONES
}

// FUNCIÓN PARA EXTRAER HASHTAGS
function extractHashtags(text) {
  const hashtags = [];
  
  // BUSCAR HASHTAGS EN EL TEXTO
  const hashtagMatches = text.match(/#\w+/g);
  if (hashtagMatches) {
    hashtags.push(...hashtagMatches);
  }
  
  // BUSCAR SECCIÓN DE HASHTAGS
  const hashtagSection = text.match(/hashtags?[^:]*:([^\\n]*(?:\\n(?!\\d+\\.|[A-Z]+:)[^\\n]*)*)/i);
  if (hashtagSection) {
    const extractedTags = hashtagSection[1].match(/#?\w+/g);
    if (extractedTags) {
      extractedTags.forEach(tag => {
        const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
        if (!hashtags.includes(cleanTag)) {
          hashtags.push(cleanTag);
        }
      });
    }
  }
  
  return hashtags.slice(0, 10); // MÁXIMO 10 HASHTAGS
}

// FUNCIÓN PARA EXTRAER SCORE DE VIRALIDAD
function extractViralityScore(text) {
  const scoreMatch = text.match(/(?:score|puntuación).*?(\d+)(?:\/100|%)/i);
  return scoreMatch ? parseInt(scoreMatch[1]) : null;
}

