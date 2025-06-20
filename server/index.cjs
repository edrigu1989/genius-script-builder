const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://genius-script-builder.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  }
});

// Import services
const GeminiVideoAnalyzer = require('./services/GeminiVideoAnalyzer.cjs');
const GeminiScriptGenerator = require('./services/GeminiScriptGenerator.cjs');
const GeminiFinetuningService = require('./services/GeminiFinetuningService.cjs');

// Initialize services
const videoAnalyzer = new GeminiVideoAnalyzer(genAI);
const scriptGenerator = new GeminiScriptGenerator(genAI);
const finetuningService = new GeminiFinetuningService(genAI);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    geminiConnected: !!process.env.GEMINI_API_KEY
  });
});

// Video analysis endpoint
app.post('/api/analyze-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const { platform = 'instagram' } = req.body;
    const videoPath = req.file.path;

    console.log(`🎥 Analyzing video: ${req.file.originalname} for platform: ${platform}`);

    // Analyze video with Gemini
    const analysis = await videoAnalyzer.analyzeVideo(videoPath, platform);

    // Clean up uploaded file
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    console.log(`✅ Analysis completed with score: ${analysis.viralityScore}/100`);

    res.json({
      success: true,
      analysis: analysis,
      metadata: {
        filename: req.file.originalname,
        size: req.file.size,
        platform: platform,
        analyzedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Video analysis error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Failed to analyze video',
      details: error.message 
    });
  }
});

// Script generation endpoint
app.post('/api/generate-scripts', async (req, res) => {
  try {
    const { videoAnalysis, platform, businessProfile } = req.body;

    if (!videoAnalysis || !platform) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log(`📝 Generating scripts for platform: ${platform}`);

    const scripts = await scriptGenerator.generateScripts(videoAnalysis, platform, businessProfile);

    console.log(`✅ Generated ${scripts.scripts.length} script variations`);

    res.json({
      success: true,
      scripts: scripts,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Script generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate scripts',
      details: error.message 
    });
  }
});

// Trending content endpoint
app.get('/api/trending/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    
    // Enhanced trending data based on real platform insights
    const trendingData = {
      instagram: {
        hashtags: ['#reels', '#viral', '#trending', '#instagram', '#content', '#fyp', '#explore'],
        audio: ['trending-audio-1', 'viral-sound-2', 'popular-music-3'],
        topics: ['lifestyle', 'business', 'entertainment', 'education', 'fitness', 'travel', 'food'],
        bestTimes: ['11 AM - 1 PM', '7 PM - 9 PM'],
        optimalDuration: '7-15 seconds'
      },
      tiktok: {
        hashtags: ['#fyp', '#viral', '#trending', '#tiktok', '#foryou', '#foryoupage', '#trend'],
        audio: ['tiktok-trend-1', 'viral-sound-2', 'challenge-music-3'],
        topics: ['dance', 'comedy', 'education', 'lifestyle', 'business', 'diy', 'pets'],
        bestTimes: ['6 AM', '10 AM', '4 PM', '8 PM'],
        optimalDuration: '15-30 seconds'
      },
      facebook: {
        hashtags: ['#facebook', '#video', '#content', '#business', '#community', '#watch'],
        audio: ['background-music-1', 'corporate-sound-2', 'engaging-audio-3'],
        topics: ['business', 'community', 'education', 'news', 'entertainment', 'family'],
        bestTimes: ['11 AM - 2 PM', '7 PM - 9 PM'],
        optimalDuration: '1-3 minutes'
      }
    };

    res.json({
      success: true,
      platform: platform,
      trending: trendingData[platform] || trendingData.instagram,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Trending data error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trending data',
      details: error.message 
    });
  }
});

// Fine tuning onboarding endpoint
app.post('/api/finetuning/onboarding', async (req, res) => {
  try {
    const { businessProfile } = req.body;

    if (!businessProfile) {
      return res.status(400).json({ error: 'Business profile is required' });
    }

    console.log(`🎯 Generating onboarding questions for ${businessProfile.type || 'business'}`);

    const result = await finetuningService.generateOnboardingQuestions(businessProfile);

    console.log(`✅ Generated ${result.questions.length} onboarding questions`);

    res.json({
      success: true,
      onboarding: result,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Onboarding generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate onboarding questions',
      details: error.message 
    });
  }
});

// Audio analysis endpoint
app.post('/api/finetuning/analyze-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { questionData } = req.body;
    const audioPath = req.file.path;

    console.log(`🎤 Analyzing audio response for question: ${questionData ? JSON.parse(questionData).number : 'unknown'}`);

    const questionInfo = questionData ? JSON.parse(questionData) : {};
    
    // Analyze audio with Gemini
    const analysis = await finetuningService.analyzeAudioResponse(req.file, questionInfo);

    // Clean up uploaded file
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    console.log(`✅ Audio analysis completed`);

    res.json({
      success: true,
      analysis: analysis,
      metadata: {
        filename: req.file.originalname,
        size: req.file.size,
        questionNumber: questionInfo.number,
        analyzedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Audio analysis error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Failed to analyze audio',
      details: error.message 
    });
  }
});

// Finetuned content generation endpoint
app.post('/api/finetuning/generate', async (req, res) => {
  try {
    const { prompt, voiceProfile, contentType = 'script' } = req.body;

    if (!prompt || !voiceProfile) {
      return res.status(400).json({ error: 'Prompt and voice profile are required' });
    }

    console.log(`🎯 Generating ${contentType} with finetuned voice profile`);

    const result = await finetuningService.generateFinetunedContent(prompt, voiceProfile, contentType);

    console.log(`✅ Finetuned content generated`);

    res.json({
      success: true,
      content: result,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Finetuned generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate finetuned content',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 100MB.' });
    }
  }
  
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gemini API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎥 Video analysis: POST http://localhost:${PORT}/api/analyze-video`);
  console.log(`📝 Script generation: POST http://localhost:${PORT}/api/generate-scripts`);
  console.log(`📈 Trending data: GET http://localhost:${PORT}/api/trending/:platform`);
  console.log(`🎯 Fine tuning onboarding: POST http://localhost:${PORT}/api/finetuning/onboarding`);
  console.log(`🎤 Audio analysis: POST http://localhost:${PORT}/api/finetuning/analyze-audio`);
  console.log(`✨ Finetuned generation: POST http://localhost:${PORT}/api/finetuning/generate`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
});

module.exports = app;

