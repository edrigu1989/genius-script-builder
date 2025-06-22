const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// API de scripts - versión súper simple
app.post('/api/generate-scripts', (req, res) => {
  console.log('📝 API de scripts llamada');
  console.log('Body recibido:', req.body);
  
  const { topic = 'tema por defecto' } = req.body;
  
  // Respuesta fija que siempre funciona
  res.json({
    success: true,
    scripts: [
      {
        id: 1,
        hook: `¿Sabías que ${topic} puede cambiar tu vida?`,
        script: `Hoy te voy a contar todo sobre ${topic}. Es increíble cómo esto puede impactar en tu día a día.`,
        cta: "¡Sígueme para más contenido!",
        hashtags: [`#${topic.replace(/\s+/g, '').toLowerCase()}`, "#viral"],
        engagementScore: 85
      },
      {
        id: 2,
        hook: `La verdad sobre ${topic} que nadie te dice`,
        script: `Después de investigar ${topic}, descubrí algo sorprendente que quiero compartir contigo.`,
        cta: "¿Qué opinas? ¡Comenta!",
        hashtags: [`#${topic.replace(/\s+/g, '').toLowerCase()}`, "#tips"],
        engagementScore: 88
      }
    ],
    recommendations: [
      "Usa un lenguaje más directo",
      "Agrega elementos visuales",
      "Incluye preguntas para engagement"
    ]
  });
});

// API de upload URL - versión simple
app.post('/api/upload-url', (req, res) => {
  console.log('📤 API upload-url llamada');
  console.log('Body recibido:', req.body);
  
  const { fileName = 'video.mp4' } = req.body;
  
  res.json({
    success: true,
    signedUrl: `https://mock-storage.com/${fileName}?signed=true`,
    publicUrl: `https://mock-storage.com/${fileName}`
  });
});

// API de análisis de video - versión simple
app.post('/api/analyze-video-url', (req, res) => {
  console.log('🎬 API analyze-video-url llamada');
  console.log('Body recibido:', req.body);
  
  res.json({
    success: true,
    analysis: {
      viral_score: 82,
      engagement_prediction: "Alto",
      key_strengths: ["Tema interesante", "Buena calidad", "Audiencia clara"],
      key_improvements: ["Mejorar audio", "Más dinamismo", "CTA más claro"],
      platform_scores: {
        tiktok: 85,
        instagram: 80,
        youtube: 78
      },
      best_platform: "tiktok",
      recommended_hashtags: ["#viral", "#trending", "#fyp"]
    }
  });
});

// Manejar todas las rutas de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

module.exports = app;

