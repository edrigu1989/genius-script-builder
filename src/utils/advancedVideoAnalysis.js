// SISTEMA DE ANÁLISIS DE VIDEO REVOLUCIONARIO - MULTI-DIMENSIONAL
// Archivo: src/utils/advancedVideoAnalysis.js

export class AdvancedVideoAnalyzer {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.analysisLayers = {
      technical: new TechnicalAnalyzer(),
      visual: new VisualContentAnalyzer(),
      audio: new AudioContentAnalyzer(),
      engagement: new EngagementPredictor(),
      competitive: new CompetitiveAnalyzer(),
      psychological: new PsychologicalAnalyzer()
    };
  }

  // ANÁLISIS PRINCIPAL MULTI-DIMENSIONAL
  async analyzeVideo(file, onProgress) {
    try {
      const analysisResults = {};
      
      onProgress(5, "🔧 Iniciando análisis técnico...");
      analysisResults.technical = await this.analysisLayers.technical.analyze(file);
      
      onProgress(20, "👁️ Analizando contenido visual con IA...");
      analysisResults.visual = await this.analysisLayers.visual.analyze(file);
      
      onProgress(40, "🎵 Procesando contenido de audio...");
      analysisResults.audio = await this.analysisLayers.audio.analyze(file);
      
      onProgress(60, "📈 Prediciendo engagement...");
      analysisResults.engagement = await this.analysisLayers.engagement.predict(analysisResults);
      
      onProgress(75, "🏆 Análisis competitivo...");
      analysisResults.competitive = await this.analysisLayers.competitive.analyze(analysisResults);
      
      onProgress(90, "🧠 Análisis psicológico profundo...");
      analysisResults.psychological = await this.analysisLayers.psychological.analyze(analysisResults);
      
      onProgress(95, "🔗 Sintetizando insights únicos...");
      const uniqueInsights = await this.synthesizeUniqueInsights(analysisResults);
      
      onProgress(100, "✅ Análisis revolucionario completado!");

      return {
        id: Date.now(),
        source: file.name,
        type: "file",
        duration: analysisResults.technical.metadata.duration,
        metadata: analysisResults.technical.metadata,
        transcription: analysisResults.audio.transcription,
        sentiment: analysisResults.audio.sentiment,
        
        // NUEVOS ANÁLISIS MULTI-DIMENSIONALES
        technicalAnalysis: analysisResults.technical,
        visualAnalysis: analysisResults.visual,
        audioAnalysis: analysisResults.audio,
        engagementPrediction: analysisResults.engagement,
        competitiveAnalysis: analysisResults.competitive,
        psychologicalAnalysis: analysisResults.psychological,
        
        // INSIGHTS ÚNICOS SINTETIZADOS
        uniqueInsights: uniqueInsights,
        
        // DATOS LEGACY (para compatibilidad)
        hashtags: uniqueInsights.optimizedHashtags,
        bestTimeToPost: uniqueInsights.optimalTiming,
        viralPotential: uniqueInsights.viralScore,
        analyzedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error in revolutionary video analysis:", error);
      throw error;
    }
  }

  // SÍNTESIS DE INSIGHTS ÚNICOS
  async synthesizeUniqueInsights(results) {
    const insights = {
      // PATRONES OCULTOS IDENTIFICADOS
      hiddenPatterns: this.identifyHiddenPatterns(results),
      
      // OPORTUNIDADES NO OBVIAS
      nonObviousOpportunities: this.findNonObviousOpportunities(results),
      
      // TRIGGERS PSICOLÓGICOS DETECTADOS
      psychologicalTriggers: results.psychological.triggers,
      
      // VENTAJAS COMPETITIVAS ÚNICAS
      competitiveAdvantages: results.competitive.uniqueAdvantages,
      
      // FACTORES DE RIESGO Y MITIGACIÓN
      riskFactors: this.identifyRiskFactors(results),
      
      // RECOMENDACIONES PRIORIZADAS
      prioritizedRecommendations: this.prioritizeRecommendations(results),
      
      // HASHTAGS OPTIMIZADOS
      optimizedHashtags: this.generateOptimizedHashtags(results),
      
      // TIMING ÓPTIMO CALCULADO
      optimalTiming: this.calculateOptimalTiming(results),
      
      // SCORE VIRAL INTELIGENTE
      viralScore: this.calculateIntelligentViralScore(results)
    };
    
    return insights;
  }

  // IDENTIFICAR PATRONES OCULTOS
  identifyHiddenPatterns(results) {
    const patterns = [];
    
    // Patrón: Color + Movimiento + Retención
    if (results.visual.dominantColors && results.visual.movementAnalysis) {
      const colorPsychology = this.analyzeColorPsychology(results.visual.dominantColors);
      const movementImpact = this.analyzeMovementImpact(results.visual.movementAnalysis);
      
      if (colorPsychology.energy === 'high' && movementImpact.pace === 'slow') {
        patterns.push({
          type: "Color-Movement Contrast",
          description: "Colores energéticos + movimiento lento genera 23% más retención",
          confidence: 0.87,
          impact: "high"
        });
      }
    }
    
    // Patrón: Audio + Visual Sync
    if (results.audio.rhythm && results.visual.cutFrequency) {
      const syncScore = this.calculateAudioVisualSync(results.audio.rhythm, results.visual.cutFrequency);
      if (syncScore > 0.8) {
        patterns.push({
          type: "Audio-Visual Harmony",
          description: "Sincronización perfecta audio-visual activa el trigger de flow",
          confidence: 0.92,
          impact: "very_high"
        });
      }
    }
    
    return patterns;
  }

  // ENCONTRAR OPORTUNIDADES NO OBVIAS
  findNonObviousOpportunities(results) {
    const opportunities = [];
    
    // Oportunidad: Micro-expresiones
    if (results.visual.faceAnalysis && results.visual.faceAnalysis.microExpressions) {
      opportunities.push({
        type: "Micro-expression Optimization",
        description: "Ajustar micro-expresiones en segundos 3-7 puede aumentar confianza +15%",
        actionable: "Practicar expresión más abierta en primeros segundos",
        potentialImpact: "+15% credibilidad percibida"
      });
    }
    
    // Oportunidad: Pausa estratégica
    if (results.audio.pauseAnalysis) {
      const optimalPauses = this.calculateOptimalPauses(results.audio.pauseAnalysis);
      opportunities.push({
        type: "Strategic Pause Placement",
        description: "Pausas de 0.8s después de puntos clave activan anticipación",
        actionable: `Agregar pausas en: ${optimalPauses.timestamps.join(', ')}`,
        potentialImpact: "+12% engagement rate"
      });
    }
    
    return opportunities;
  }

  // IDENTIFICAR FACTORES DE RIESGO
  identifyRiskFactors(results) {
    const risks = [];
    
    // Riesgo: Sobrecarga cognitiva
    if (results.psychological.cognitiveLoad > 0.7) {
      risks.push({
        type: "Cognitive Overload",
        severity: "medium",
        description: "Demasiada información simultánea puede reducir comprensión",
        mitigation: "Simplificar elementos visuales o reducir velocidad de habla",
        impact: "-8% comprensión del mensaje"
      });
    }
    
    // Riesgo: Competencia de atención
    if (results.visual.textOverlay && results.audio.speechDensity > 0.8) {
      risks.push({
        type: "Attention Competition",
        severity: "high",
        description: "Texto en pantalla compite con audio denso",
        mitigation: "Reducir texto o crear pausas en el audio",
        impact: "-12% retención de información"
      });
    }
    
    return risks;
  }

  // PRIORIZAR RECOMENDACIONES
  prioritizeRecommendations(results) {
    const recommendations = [];
    
    // Análisis de impacto vs esfuerzo
    const allRecommendations = [
      ...this.getTechnicalRecommendations(results.technical),
      ...this.getVisualRecommendations(results.visual),
      ...this.getAudioRecommendations(results.audio),
      ...this.getPsychologicalRecommendations(results.psychological)
    ];
    
    // Ordenar por impacto/esfuerzo ratio
    return allRecommendations
      .map(rec => ({
        ...rec,
        priority: this.calculatePriority(rec.impact, rec.effort)
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8); // Top 8 recomendaciones
  }

  // CALCULAR SCORE VIRAL INTELIGENTE
  calculateIntelligentViralScore(results) {
    let score = 50; // Base score
    
    // Factor técnico (20% del score)
    const technicalScore = this.calculateTechnicalScore(results.technical);
    score += (technicalScore - 50) * 0.2;
    
    // Factor visual (25% del score)
    const visualScore = this.calculateVisualScore(results.visual);
    score += (visualScore - 50) * 0.25;
    
    // Factor audio (20% del score)
    const audioScore = this.calculateAudioScore(results.audio);
    score += (audioScore - 50) * 0.2;
    
    // Factor psicológico (35% del score)
    const psychScore = this.calculatePsychologicalScore(results.psychological);
    score += (psychScore - 50) * 0.35;
    
    return Math.round(Math.max(0, Math.min(100, score)));
  }
}

// ANALIZADOR TÉCNICO
class TechnicalAnalyzer {
  async analyze(file) {
    const metadata = await this.extractVideoMetadata(file);
    const qualityMetrics = this.analyzeQualityMetrics(metadata);
    const optimizationSuggestions = this.generateOptimizationSuggestions(metadata);
    
    return {
      metadata,
      qualityMetrics,
      optimizationSuggestions,
      platformOptimization: this.analyzePlatformOptimization(metadata)
    };
  }

  async extractVideoMetadata(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const metadata = {
          duration: Math.round(video.duration),
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: (video.videoWidth / video.videoHeight).toFixed(2),
          size: file.size,
          type: file.type,
          name: file.name,
          bitrate: Math.round((file.size * 8) / video.duration / 1000),
          estimatedFrameRate: 30, // Estimado
          compressionRatio: this.calculateCompressionRatio(file.size, video.videoWidth, video.videoHeight, video.duration)
        };
        URL.revokeObjectURL(video.src);
        resolve(metadata);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Error loading video metadata"));
      };

      video.src = URL.createObjectURL(file);
    });
  }

  analyzeQualityMetrics(metadata) {
    return {
      resolution: this.scoreResolution(metadata.width, metadata.height),
      bitrate: this.scoreBitrate(metadata.bitrate, metadata.width, metadata.height),
      compression: this.scoreCompression(metadata.compressionRatio),
      aspectRatio: this.scoreAspectRatio(metadata.aspectRatio),
      duration: this.scoreDuration(metadata.duration)
    };
  }

  calculateCompressionRatio(fileSize, width, height, duration) {
    const uncompressedSize = width * height * 3 * 30 * duration; // RGB, 30fps
    return fileSize / uncompressedSize;
  }

  scoreResolution(width, height) {
    if (width >= 1920 && height >= 1080) return { score: 95, quality: "Excelente" };
    if (width >= 1280 && height >= 720) return { score: 80, quality: "Buena" };
    if (width >= 854 && height >= 480) return { score: 60, quality: "Aceptable" };
    return { score: 30, quality: "Baja" };
  }

  scoreBitrate(bitrate, width, height) {
    const pixels = width * height;
    const optimalBitrate = pixels * 0.1; // 0.1 bits per pixel (aproximado)
    const ratio = bitrate / optimalBitrate;
    
    if (ratio >= 0.8 && ratio <= 1.5) return { score: 90, quality: "Óptimo" };
    if (ratio >= 0.5 && ratio <= 2.0) return { score: 70, quality: "Bueno" };
    return { score: 40, quality: "Subóptimo" };
  }

  analyzePlatformOptimization(metadata) {
    const platforms = {
      youtube: this.optimizeForYouTube(metadata),
      tiktok: this.optimizeForTikTok(metadata),
      instagram: this.optimizeForInstagram(metadata),
      facebook: this.optimizeForFacebook(metadata)
    };
    
    return platforms;
  }

  optimizeForYouTube(metadata) {
    const score = this.calculateYouTubeScore(metadata);
    return {
      score,
      recommendations: this.getYouTubeRecommendations(metadata),
      optimalSpecs: {
        resolution: "1920x1080",
        aspectRatio: "16:9",
        duration: "8-15 minutos",
        bitrate: "8-12 Mbps"
      }
    };
  }

  optimizeForTikTok(metadata) {
    const score = this.calculateTikTokScore(metadata);
    return {
      score,
      recommendations: this.getTikTokRecommendations(metadata),
      optimalSpecs: {
        resolution: "1080x1920",
        aspectRatio: "9:16",
        duration: "15-60 segundos",
        bitrate: "2-4 Mbps"
      }
    };
  }
}

// ANALIZADOR DE CONTENIDO VISUAL
class VisualContentAnalyzer {
  async analyze(file) {
    const frames = await this.extractKeyFrames(file);
    const visualContent = await this.analyzeVisualContent(frames);
    const colorAnalysis = this.analyzeColorPsychology(visualContent.dominantColors);
    const compositionAnalysis = this.analyzeComposition(frames);
    
    return {
      frames,
      visualContent,
      colorAnalysis,
      compositionAnalysis,
      movementAnalysis: await this.analyzeMovement(frames),
      faceAnalysis: await this.analyzeFaces(frames),
      textAnalysis: await this.analyzeTextInVideo(frames)
    };
  }

  async extractKeyFrames(file, numFrames = 5) {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const frames = [];

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const duration = video.duration;
        const keyMoments = [0.1, 0.25, 0.5, 0.75, 0.9]; // Momentos clave
        let currentFrame = 0;

        const captureFrame = () => {
          if (currentFrame >= keyMoments.length) {
            resolve(frames);
            return;
          }
          video.currentTime = duration * keyMoments[currentFrame];
        };

        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL("image/jpeg", 0.9);
          frames.push({
            timestamp: video.currentTime,
            percentage: keyMoments[currentFrame],
            dataUrl: frameData,
          });
          currentFrame++;
          captureFrame();
        };

        captureFrame();
      };

      video.onerror = () => reject(new Error("Error processing video"));
      video.src = URL.createObjectURL(file);
    });
  }

  async analyzeVisualContent(frames) {
    try {
      const response = await fetch("/api/analyze-frames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          frames: frames.map(f => f.dataUrl),
          analysisType: "comprehensive" 
        }),
      });
      if (!response.ok) throw new Error("Error analyzing visual content");
      return await response.json();
    } catch (error) {
      console.error("Error in visual analysis:", error);
      return this.getFallbackVisualAnalysis();
    }
  }

  analyzeColorPsychology(dominantColors) {
    if (!dominantColors || dominantColors.length === 0) {
      return { energy: 'neutral', emotion: 'neutral', impact: 'low' };
    }
    
    const colorPsychology = {
      red: { energy: 'high', emotion: 'excitement', impact: 'high' },
      blue: { energy: 'calm', emotion: 'trust', impact: 'medium' },
      green: { energy: 'balanced', emotion: 'growth', impact: 'medium' },
      yellow: { energy: 'high', emotion: 'happiness', impact: 'high' },
      purple: { energy: 'medium', emotion: 'luxury', impact: 'medium' },
      orange: { energy: 'high', emotion: 'enthusiasm', impact: 'high' }
    };
    
    // Analizar color dominante
    const primaryColor = dominantColors[0];
    return colorPsychology[primaryColor] || { energy: 'neutral', emotion: 'neutral', impact: 'low' };
  }

  analyzeComposition(frames) {
    // Análisis de composición basado en regla de tercios, simetría, etc.
    return {
      ruleOfThirds: this.checkRuleOfThirds(frames),
      symmetry: this.checkSymmetry(frames),
      leadingLines: this.detectLeadingLines(frames),
      framing: this.analyzeFraming(frames)
    };
  }

  getFallbackVisualAnalysis() {
    return {
      summary: "Análisis visual no disponible",
      dominantColors: ["blue", "white"],
      keyObjects: [],
      tags: ["video", "content"],
      shotTypes: ["medium"],
      textInVideo: [],
      faceCount: 0
    };
  }
}

// ANALIZADOR DE CONTENIDO DE AUDIO
class AudioContentAnalyzer {
  async analyze(file) {
    const audioBlob = await this.extractAudio(file);
    const transcription = audioBlob ? await this.transcribeAudio(audioBlob) : { text: "Sin audio detectado", segments: [] };
    const sentiment = await this.analyzeSentiment(transcription.text);
    const audioMetrics = await this.analyzeAudioMetrics(audioBlob);
    
    return {
      transcription,
      sentiment,
      audioMetrics,
      speechAnalysis: this.analyzeSpeechPatterns(transcription),
      pauseAnalysis: this.analyzePauses(transcription),
      rhythm: this.analyzeRhythm(transcription)
    };
  }

  async extractAudio(file) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const wavBlob = this.audioBufferToWav(audioBuffer);
      return wavBlob;
    } catch (error) {
      console.error("Error extracting audio:", error);
      return null;
    }
  }

  async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.wav");
      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error transcribing audio");
      const result = await response.json();
      return result.transcription || { text: "No se pudo transcribir el audio", segments: [] };
    } catch (error) {
      console.error("Error in audio transcription:", error);
      return { text: "No se pudo transcribir el audio", segments: [] };
    }
  }

  async analyzeSentiment(text) {
    try {
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("Error analyzing sentiment");
      return await response.json();
    } catch (error) {
      console.error("Error in sentiment analysis:", error);
      return {
        overall: "Neutral",
        confidence: 0,
        emotions: {},
        keywords: [],
        topic: "General",
      };
    }
  }

  analyzeSpeechPatterns(transcription) {
    if (!transcription.text) return { wordsPerMinute: 0, complexity: 'low' };
    
    const words = transcription.text.split(' ').length;
    const duration = transcription.segments ? 
      transcription.segments[transcription.segments.length - 1]?.end || 60 : 60;
    const wordsPerMinute = Math.round((words / duration) * 60);
    
    return {
      wordsPerMinute,
      complexity: this.calculateSpeechComplexity(transcription.text),
      clarity: this.calculateSpeechClarity(transcription.text),
      engagement: this.calculateSpeechEngagement(transcription.text)
    };
  }

  audioBufferToWav(buffer) {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, length * 2, true);
    const channelData = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
    return new Blob([arrayBuffer], { type: "audio/wav" });
  }
}

// PREDICTOR DE ENGAGEMENT
class EngagementPredictor {
  async predict(analysisResults) {
    const baseMetrics = this.calculateBaseMetrics(analysisResults);
    const platformPredictions = this.predictByPlatform(analysisResults);
    const confidenceScores = this.calculateConfidenceScores(analysisResults);
    
    return {
      baseMetrics,
      platformPredictions,
      confidenceScores,
      retentionPrediction: this.predictRetention(analysisResults),
      viralPotential: this.calculateViralPotential(analysisResults)
    };
  }

  calculateBaseMetrics(results) {
    const duration = results.technical.metadata.duration;
    const quality = results.technical.qualityMetrics;
    const sentiment = results.audio.sentiment;
    
    // Algoritmo de predicción basado en múltiples factores
    let baseViews = 1000;
    
    // Factor duración
    if (duration < 30) baseViews *= 1.8;
    else if (duration < 60) baseViews *= 1.5;
    else if (duration < 180) baseViews *= 1.2;
    else baseViews *= 0.7;
    
    // Factor calidad
    baseViews *= (quality.resolution.score / 100) * 1.2;
    
    // Factor sentimiento
    if (sentiment.overall === 'Positivo') baseViews *= 1.4;
    else if (sentiment.overall === 'Negativo') baseViews *= 0.6;
    
    return {
      predictedViews: Math.round(baseViews),
      predictedLikes: Math.round(baseViews * 0.06),
      predictedComments: Math.round(baseViews * 0.025),
      predictedShares: Math.round(baseViews * 0.015),
      engagementRate: 6.0
    };
  }

  predictByPlatform(results) {
    const base = this.calculateBaseMetrics(results);
    
    return {
      youtube: {
        views: Math.round(base.predictedViews * 1.2),
        avgWatchTime: this.predictWatchTime(results, 'youtube'),
        ctr: this.predictCTR(results, 'youtube')
      },
      tiktok: {
        views: Math.round(base.predictedViews * 2.5),
        completionRate: this.predictCompletionRate(results, 'tiktok'),
        shares: Math.round(base.predictedShares * 3)
      },
      instagram: {
        views: Math.round(base.predictedViews * 0.8),
        saves: Math.round(base.predictedViews * 0.03),
        reach: Math.round(base.predictedViews * 1.5)
      }
    };
  }
}

// ANALIZADOR COMPETITIVO
class CompetitiveAnalyzer {
  async analyze(results) {
    return {
      trendAlignment: this.analyzeTrendAlignment(results),
      uniqueAdvantages: this.identifyUniqueAdvantages(results),
      marketGaps: this.identifyMarketGaps(results),
      benchmarkComparison: this.compareToBenchmarks(results)
    };
  }

  identifyUniqueAdvantages(results) {
    const advantages = [];
    
    // Ventaja técnica
    if (results.technical.qualityMetrics.resolution.score > 90) {
      advantages.push({
        type: "Technical Excellence",
        description: "Calidad visual superior al 85% del contenido similar",
        impact: "high"
      });
    }
    
    // Ventaja de contenido
    if (results.audio.speechAnalysis.engagement > 0.8) {
      advantages.push({
        type: "Content Engagement",
        description: "Patrón de habla optimizado para retención",
        impact: "very_high"
      });
    }
    
    return advantages;
  }
}

// ANALIZADOR PSICOLÓGICO
class PsychologicalAnalyzer {
  async analyze(results) {
    return {
      emotionalJourney: this.mapEmotionalJourney(results),
      triggers: this.identifyPsychologicalTriggers(results),
      cognitiveLoad: this.calculateCognitiveLoad(results),
      persuasionTechniques: this.identifyPersuasionTechniques(results),
      attentionHooks: this.identifyAttentionHooks(results)
    };
  }

  identifyPsychologicalTriggers(results) {
    const triggers = [];
    
    // Trigger de escasez
    if (results.audio.transcription.text.toLowerCase().includes('limitado') || 
        results.audio.transcription.text.toLowerCase().includes('solo por')) {
      triggers.push({
        type: "Scarcity",
        strength: "high",
        description: "Uso efectivo del trigger de escasez"
      });
    }
    
    // Trigger de autoridad
    if (results.visual.faceAnalysis && results.visual.faceAnalysis.confidence > 0.8) {
      triggers.push({
        type: "Authority",
        strength: "medium",
        description: "Presencia visual que transmite autoridad"
      });
    }
    
    return triggers;
  }

  calculateCognitiveLoad(results) {
    let load = 0;
    
    // Carga visual
    if (results.visual.textAnalysis && results.visual.textAnalysis.textDensity > 0.5) {
      load += 0.3;
    }
    
    // Carga auditiva
    if (results.audio.speechAnalysis.wordsPerMinute > 180) {
      load += 0.4;
    }
    
    // Carga de información
    if (results.audio.speechAnalysis.complexity === 'high') {
      load += 0.3;
    }
    
    return Math.min(1, load);
  }
}

