import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import API handlers
import generateScripts from './api/generate-scripts.js';
import analyzeVideoUrl from './api/analyze-video-url.js';
import uploadUrl from './api/upload-url.js';
import saveScript from './api/save-script.js';
import getScripts from './api/get-scripts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.post('/api/generate-scripts', (req, res) => generateScripts(req, res));
app.post('/api/analyze-video-url', (req, res) => analyzeVideoUrl(req, res));
app.post('/api/upload-url', (req, res) => uploadUrl(req, res));
app.post('/api/save-script', (req, res) => saveScript(req, res));
app.get('/api/get-scripts', (req, res) => getScripts(req, res));

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

