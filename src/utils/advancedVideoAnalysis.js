// ANÁLISIS DE VIDEO AVANZADO - IMPLEMENTACIÓN MEJORADA
// Archivo: src/utils/advancedVideoAnalysis.js

export class AdvancedVideoAnalyzer {
  constructor() {
    this.canvas = null;
    this.context = null;
  }

  // Extraer metadatos reales del video
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
          // Nuevos metadatos
          frameRate: video.getVideoPlaybackQuality ? video.getVideoPlaybackQuality().totalVideoFrames / video.duration : 30, // Estimado
          bitrate: Math.round((file.size * 8) / video.duration / 1000), // kbps
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

  // Extraer frames del video para análisis visual
  async extractFrames(file, numFrames = 10) { // Aumentar número de frames
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const frames = [];

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const duration = video.duration;
        const interval = duration / numFrames;
        let currentFrame = 0;

        const captureFrame = () => {
          if (currentFrame >= numFrames) {
            resolve(frames);
            return;
          }
          video.currentTime = currentFrame * interval;
        };

        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL("image/jpeg", 0.85); // Mejorar calidad
          frames.push({
            timestamp: video.currentTime,
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

  // Extraer audio para transcripción
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

  // Convertir AudioBuffer a WAV
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

  // Analizar contenido visual con OpenAI Vision (más detallado)
  async analyzeVisualContent(frames) {
    try {
      const response = await fetch("/api/analyze-frames", { // Nuevo endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames: frames.map(f => f.dataUrl) }),
      });
      if (!response.ok) throw new Error("Error analyzing visual content");
      return await response.json();
    } catch (error) {
      console.error("Error in visual analysis:", error);
      return {
        summary: "No se pudo analizar el contenido visual",
        tags: [],
        keyObjects: [],
        dominantColors: [],
        shotTypes: [],
        textInVideo: [],
        celebrityDetection: [],
      };
    }
  }

  // Transcribir audio con OpenAI Whisper (con timestamps)
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

  // Análisis de sentimientos del texto (más profundo)
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
  
  // NUEVO: Análisis de insights profundos
  async analyzeDeepInsights(metadata, visualAnalysis, transcription, sentiment) {
    try {
      const response = await fetch("/api/analyze-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata,
          visualAnalysis,
          transcription: transcription.text,
          sentiment,
        }),
      });
      if (!response.ok) throw new Error("Error analyzing deep insights");
      return await response.json();
    } catch (error) {
      console.error("Error in deep insights analysis:", error);
      return {
        targetAudience: "General",
        contentPillars: [],
        emotionalJourney: [],
        keyMoments: [],
        callToActionEffectiveness: "N/A",
        brandSafety: "N/A",
      };
    }
  }

  // NUEVO: Predicción de engagement
  async predictEngagement(metadata, visualAnalysis, transcription, sentiment, deepInsights) {
    try {
      const response = await fetch("/api/predict-engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata,
          visualAnalysis,
          transcription: transcription.text,
          sentiment,
          deepInsights,
        }),
      });
      if (!response.ok) throw new Error("Error predicting engagement");
      return await response.json();
    } catch (error) {
      console.error("Error in engagement prediction:", error);
      return {
        predictedViews: 0,
        predictedLikes: 0,
        predictedComments: 0,
        predictedShares: 0,
        engagementRate: 0,
        retentionRate: 0,
        ctr: 0,
      };
    }
  }

  // Función principal de análisis
  async analyzeVideo(file, onProgress) {
    try {
      onProgress(5, "Extrayendo metadatos del video...");
      const metadata = await this.extractVideoMetadata(file);

      onProgress(15, "Capturando frames para análisis visual...");
      const frames = await this.extractFrames(file, 10);

      onProgress(25, "Extrayendo audio...");
      const audioBlob = await this.extractAudio(file);

      onProgress(35, "Analizando contenido visual...");
      const visualAnalysis = await this.analyzeVisualContent(frames);

      onProgress(50, "Transcribiendo audio...");
      const transcription = audioBlob ? await this.transcribeAudio(audioBlob) : { text: "Sin audio detectado", segments: [] };

      onProgress(65, "Analizando sentimientos...");
      const sentiment = await this.analyzeSentiment(transcription.text);
      
      onProgress(75, "Generando insights profundos...");
      const deepInsights = await this.analyzeDeepInsights(metadata, visualAnalysis, transcription, sentiment);
      
      onProgress(85, "Prediciendo engagement...");
      const engagementPrediction = await this.predictEngagement(metadata, visualAnalysis, transcription, sentiment, deepInsights);

      onProgress(100, "Análisis completado!");

      return {
        id: Date.now(),
        source: file.name,
        type: "file",
        duration: metadata.duration,
        metadata,
        transcription,
        sentiment,
        visualAnalysis,
        deepInsights,
        engagementPrediction,
        hashtags: this.generateHashtags(transcription.text, visualAnalysis),
        bestTimeToPost: this.calculateBestTime(deepInsights.targetAudience),
        analyzedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error in video analysis:", error);
      throw error;
    }
  }

  // Generar hashtags basados en contenido real
  generateHashtags(transcription, visualAnalysis) {
    const hashtags = new Set(["#Video", "#ContentMarketing"]);
    if (transcription.toLowerCase().includes("marketing")) hashtags.add("#MarketingDigital");
    if (transcription.toLowerCase().includes("negocio")) hashtags.add("#Emprendimiento");
    if (visualAnalysis.tags) visualAnalysis.tags.slice(0,3).forEach(tag => hashtags.add(`#${tag.replace(/\s+/g, \'\
')}`));
    if (visualAnalysis.keyObjects) visualAnalysis.keyObjects.slice(0,2).forEach(obj => hashtags.add(`#${obj.name.replace(/\s+/g, 
'')}`));
    return Array.from(hashtags).slice(0, 10);
  }

  // Calcular mejor momento para publicar (mejorado)
  calculateBestTime(targetAudience = "General") {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const times = ["9:00 AM", "1:00 PM", "5:00 PM", "8:00 PM"];
    let dayIndex = Math.floor(Math.random() * days.length);
    let timeIndex = Math.floor(Math.random() * times.length);

    if (targetAudience.toLowerCase().includes("profesional")) {
      dayIndex = Math.floor(Math.random() * 5); // Lunes a Viernes
      timeIndex = Math.random() > 0.5 ? 0 : 2; // 9am o 5pm
    } else if (targetAudience.toLowerCase().includes("joven")) {
      dayIndex = Math.floor(Math.random() * 2) + 5; // Sábado o Domingo
      timeIndex = Math.floor(Math.random() * 2) + 2; // 5pm o 8pm
    }
    return { day: days[dayIndex], time: times[timeIndex] };
  }
}


