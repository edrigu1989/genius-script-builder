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
  
  res.json({
    success: true,
    signedUrl: `https://mock.com/${fileName}?signed=true`,
    publicUrl: `https://mock.com/${fileName}`
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

