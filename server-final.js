import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API OK', timestamp: new Date().toISOString() });
});

// API generate-scripts
app.post('/api/generate-scripts', (req, res) => {
  const { topic = 'tema' } = req.body;
  
  res.json({
    success: true,
    scripts: [
      {
        id: 1,
        hook: `¿Sabías que ${topic} puede cambiar tu vida?`,
        script: `Todo sobre ${topic} explicado paso a paso.`,
        cta: "¡Sígueme para más!",
        hashtags: [`#${topic.replace(/\s+/g, '')}`, "#viral"],
        engagementScore: 85
      }
    ],
    recommendations: ["Usa lenguaje directo", "Agrega visuales"]
  });
});

// API upload-url
app.post('/api/upload-url', (req, res) => {
  const { fileName = 'video.mp4' } = req.body;
  
  // En lugar de devolver URLs mock que causan CORS, simular upload exitoso directamente
  res.json({
    success: true,
    message: 'Upload simulado exitosamente',
    signedUrl: 'MOCK_UPLOAD_SUCCESS',
    publicUrl: `https://storage.googleapis.com/genius-bucket/${fileName}`,
    uploadComplete: true // Indicar que el upload ya está "completo"
  });
});

// API analyze-video-url
app.post('/api/analyze-video-url', (req, res) => {
  res.json({
    success: true,
    analysis: {
      viral_score: 82,
      engagement_prediction: "Alto",
      key_strengths: ["Tema interesante"],
      key_improvements: ["Mejorar audio"],
      platform_scores: { tiktok: 85, instagram: 80 },
      best_platform: "tiktok",
      recommended_hashtags: ["#viral", "#fyp"]
    }
  });
});

// API save-script
app.post('/api/save-script', (req, res) => {
  console.log('💾 API save-script llamada');
  console.log('Body recibido:', req.body);
  
  const { script, platform, user_id } = req.body;
  
  // Simular guardado exitoso
  res.json({
    success: true,
    message: 'Script guardado exitosamente',
    script_id: Math.floor(Math.random() * 1000000),
    saved_at: new Date().toISOString()
  });
});

// API get-scripts
app.get('/api/get-scripts', (req, res) => {
  console.log('📋 API get-scripts llamada');
  
  // Simular lista de scripts guardados
  res.json({
    success: true,
    scripts: [
      {
        id: 1,
        title: "Script de Marketing Digital",
        platform: "TikTok",
        created_at: new Date(Date.now() - 24*60*60*1000).toISOString(),
        engagement_score: 85
      },
      {
        id: 2,
        title: "Script de Productividad",
        platform: "Instagram",
        created_at: new Date(Date.now() - 48*60*60*1000).toISOString(),
        engagement_score: 78
      }
    ]
  });
});

// Static files
app.use(express.static(path.join(__dirname, 'dist')));

// React Router fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});

export default app;

