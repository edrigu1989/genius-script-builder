import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes inline
app.post('/api/generate-scripts', async (req, res) => {
  try {
    console.log('📝 Generate scripts API called');
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const { topic, platform = 'TikTok', tone = 'Profesional', targetAudience = 'General' } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    const prompt = `Crea 2 scripts creativos para ${platform} sobre el tema: "${topic}" enfocados en ${targetAudience}. Usa un tono ${tone}. Responde SOLO con JSON válido sin markdown.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Fallback con datos estáticos
    return res.json({
      success: true,
      scripts: [
        {
          id: 1,
          hook: `¿Sabías que ${topic} puede cambiar tu vida?`,
          script: `Hoy te voy a contar todo sobre ${topic}. Es increíble cómo esto puede impactar en tu día a día. Te explico paso a paso lo que necesitas saber.`,
          cta: "¡Sígueme para más contenido como este!",
          hashtags: [`#${topic.replace(/\s+/g, '').toLowerCase()}`, "#viral", "#tips"],
          engagementScore: 78
        },
        {
          id: 2,
          hook: `La verdad sobre ${topic} que nadie te dice`,
          script: `Después de investigar mucho sobre ${topic}, descubrí algo que me sorprendió. Esto es lo que realmente funciona y lo que debes evitar.`,
          cta: "¿Qué opinas? ¡Déjamelo en los comentarios!",
          hashtags: [`#${topic.replace(/\s+/g, '').toLowerCase()}`, "#verdad", "#consejos"],
          engagementScore: 82
        }
      ],
      recommendations: [
        "Usa un lenguaje más directo y personal",
        "Agrega elementos visuales llamativos",
        "Incluye una pregunta al final para generar engagement"
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating scripts',
      details: error.message
    });
  }
});

app.post('/api/analyze-video-url', async (req, res) => {
  try {
    console.log('🎬 Analyze video API called');
    
    const { videoUrl, fileName, fileSize, mimeType } = req.body;

    if (!videoUrl || !fileName || !fileSize || !mimeType) {
      return res.status(400).json({ error: 'Faltan campos obligatorios en el body' });
    }

    // Análisis simulado basado en datos del archivo
    const analysis = {
      viral_score: Math.floor(Math.random() * 20) + 75, // 75-95
      engagement_prediction: "Alto",
      key_strengths: ["Tema relatable", "Conexión emocional", "Audiencia amplia"],
      key_improvements: ["Mejorar iluminación", "CTA más claro", "Optimizar inicio"],
      platform_scores: {
        tiktok: Math.floor(Math.random() * 15) + 80,
        instagram: Math.floor(Math.random() * 15) + 75,
        youtube: Math.floor(Math.random() * 15) + 70
      },
      best_platform: "tiktok",
      recommended_hashtags: ["#viral", "#trending", "#fyp"]
    };

    return res.status(200).json({
      success: true,
      analysis,
      metadata: {
        videoUrl,
        fileName,
        fileSize,
        mimeType,
        processedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Error en análisis:', error);
    return res.status(500).json({
      success: false,
      error: 'Error durante el análisis',
      details: error.message
    });
  }
});

app.post('/api/upload-url', async (req, res) => {
  try {
    console.log('📤 Upload URL API called');
    
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'Faltan datos: fileName o fileType' });
    }

    // Simular URL de subida
    const mockSignedUrl = `https://storage.googleapis.com/mock-bucket/${fileName}?signed=true`;
    const mockPublicUrl = `https://storage.googleapis.com/mock-bucket/${fileName}`;

    return res.status(200).json({
      success: true,
      signedUrl: mockSignedUrl,
      publicUrl: mockPublicUrl
    });
  } catch (err) {
    console.error('❌ Error generando signed URL:', err);
    return res.status(500).json({ success: false, error: 'Error interno al generar la URL' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Missing'}`);
});

