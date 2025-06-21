import { IncomingForm } from 'formidable';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuración de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb', // Límite estricto
    sizeLimit: '10mb',     // Límite adicional
  },
};

// Función para análisis con Gemini usando solo metadata del archivo
async function analyzeVideoWithGemini(fileName, fileSize, duration = null) {
  console.log('🧠 Iniciando análisis con Gemini...');
  
  const prompt = `Actúa como un experto en viralización de videos para redes sociales.

Analiza este video basándote en la información disponible:
- Nombre del archivo: "${fileName}"
- Tamaño del archivo: ${(fileSize / 1024 / 1024).toFixed(2)}MB
- Duración estimada: ${duration ? `${duration} segundos` : 'No disponible'}

Genera un análisis profesional en formato JSON con esta estructura exacta:

{
  "summary": "Resumen del análisis basado en el nombre y características del archivo",
  "strengths": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3"],
  "improvements": ["Mejora 1", "Mejora 2", "Mejora 3"],
  "viral_score": 75,
  "engagement_prediction": "Alto",
  "platform_recommendations": {
    "tiktok": "Recomendación específica para TikTok",
    "instagram": "Recomendación específica para Instagram",
    "youtube": "Recomendación específica para YouTube"
  },
  "hashtags": ["#viral", "#trending", "#content"],
  "best_posting_time": "19:00-21:00",
  "target_audience": "Audiencia objetivo basada en el contenido"
}

Responde SOLO con el JSON, sin texto adicional.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Intentar parsear como JSON
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.log('Error parsing JSON, returning structured response');
      return {
        summary: `Análisis del video: ${fileName}`,
        strengths: ["Contenido potencialmente viral", "Tamaño optimizado", "Formato adecuado"],
        improvements: ["Optimizar duración", "Mejorar engagement", "Ajustar para plataforma"],
        viral_score: 70,
        engagement_prediction: "Medio-Alto",
        platform_recommendations: {
          tiktok: "Ideal para contenido corto y dinámico",
          instagram: "Perfecto para stories y reels",
          youtube: "Adecuado para contenido más largo"
        },
        hashtags: ["#viral", "#content", "#social"],
        best_posting_time: "19:00-21:00",
        target_audience: "Audiencia general de redes sociales"
      };
    }
  } catch (error) {
    console.error('Error con Gemini:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📥 Iniciando análisis de video...');

    // Verificar API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'API key not configured' 
      });
    }

    // Configurar formidable con límites estrictos
    const form = new IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB máximo
      maxFields: 10,
      maxFieldsSize: 2 * 1024 * 1024, // 2MB para campos
      allowEmptyFiles: false,
      minFileSize: 1024, // Mínimo 1KB
    });

    // Parsear el formulario
    const [fields, files] = await form.parse(req);
    
    console.log('📋 Campos recibidos:', Object.keys(fields));
    console.log('📁 Archivos recibidos:', Object.keys(files));

    // Verificar si hay archivo
    const videoFile = files.video?.[0] || files.file?.[0];
    
    if (!videoFile) {
      return res.status(400).json({
        success: false,
        error: 'No se encontró archivo de video'
      });
    }

    // Validaciones adicionales
    const fileName = videoFile.originalFilename || 'video_sin_nombre';
    const fileSize = videoFile.size;
    const mimeType = videoFile.mimetype || '';

    console.log(`📊 Archivo: ${fileName}, Tamaño: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);

    // Verificar tamaño
    if (fileSize > 10 * 1024 * 1024) {
      return res.status(413).json({
        success: false,
        error: 'Archivo demasiado grande. Máximo 10MB permitido.'
      });
    }

    // Verificar tipo de archivo
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.some(type => mimeType.includes(type.split('/')[1]))) {
      return res.status(400).json({
        success: false,
        error: 'Tipo de archivo no soportado. Use MP4, MOV, AVI o WebM.'
      });
    }

    // Realizar análisis con Gemini
    console.log('🤖 Analizando con Gemini...');
    const analysisResult = await analyzeVideoWithGemini(fileName, fileSize);

    // Limpiar archivo temporal
    try {
      if (videoFile.filepath && fs.existsSync(videoFile.filepath)) {
        fs.unlinkSync(videoFile.filepath);
        console.log('🗑️ Archivo temporal eliminado');
      }
    } catch (cleanupError) {
      console.warn('⚠️ Error limpiando archivo temporal:', cleanupError.message);
    }

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      analysis: analysisResult,
      metadata: {
        fileName,
        fileSize: `${(fileSize / 1024 / 1024).toFixed(2)}MB`,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error en análisis:', error);
    
    // Manejar errores específicos
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'Archivo demasiado grande. Máximo 10MB permitido.'
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Formato de archivo no válido.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor. Intente con un archivo más pequeño.'
    });
  }
}

