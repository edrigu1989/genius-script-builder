// ANÁLISIS REAL DE VIDEO - IMPLEMENTACIÓN MEJORADA
// Archivo: src/utils/videoAnalysis.js

export class RealVideoAnalyzer {
  constructor() {
    this.canvas = null;
    this.context = null;
  }

  // Extraer metadatos reales del video
  async extractVideoMetadata(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const metadata = {
          duration: Math.round(video.duration), // Duración real en segundos
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: (video.videoWidth / video.videoHeight).toFixed(2),
          size: file.size,
          type: file.type,
          name: file.name
        };
        
        URL.revokeObjectURL(video.src);
        resolve(metadata);
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Error loading video metadata'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  }

  // Extraer frames del video para análisis visual
  async extractFrames(file, numFrames = 5) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
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
          const frameData = canvas.toDataURL('image/jpeg', 0.8);
          frames.push({
            timestamp: video.currentTime,
            dataUrl: frameData
          });
          
          currentFrame++;
          captureFrame();
        };
        
        captureFrame();
      };
      
      video.onerror = () => reject(new Error('Error processing video'));
      video.src = URL.createObjectURL(file);
    });
  }

  // Extraer audio para transcripción
  async extractAudio(file) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Convertir a WAV para enviar a API de transcripción
      const wavBlob = this.audioBufferToWav(audioBuffer);
      return wavBlob;
    } catch (error) {
      console.error('Error extracting audio:', error);
      return null;
    }
  }

  // Convertir AudioBuffer a WAV
  audioBufferToWav(buffer) {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Audio data
    const channelData = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  // Analizar contenido visual con OpenAI Vision
  async analyzeVisualContent(frames) {
    try {
      const response = await fetch('/api/analyze-visual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frames: frames.map(frame => frame.dataUrl)
        })
      });
      
      if (!response.ok) {
        throw new Error('Error analyzing visual content');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in visual analysis:', error);
      return {
        description: 'No se pudo analizar el contenido visual',
        objects: [],
        scenes: [],
        emotions: []
      };
    }
  }

  // Transcribir audio con OpenAI Whisper
  async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');
      
      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error transcribing audio');
      }
      
      const result = await response.json();
      return result.transcription || 'No se pudo transcribir el audio';
    } catch (error) {
      console.error('Error in audio transcription:', error);
      return 'No se pudo transcribir el audio';
    }
  }

  // Análisis de sentimientos del texto
  async analyzeSentiment(text) {
    try {
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        throw new Error('Error analyzing sentiment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      return {
        overall: 'Neutral',
        confidence: 0,
        emotions: {}
      };
    }
  }

  // Generar insights basados en contenido real
  generateInsights(metadata, visualAnalysis, transcription, sentiment) {
    const insights = [];
    
    // Insights basados en duración
    if (metadata.duration < 30) {
      insights.push('Video corto ideal para TikTok e Instagram Reels');
    } else if (metadata.duration < 60) {
      insights.push('Duración perfecta para redes sociales');
    } else if (metadata.duration > 300) {
      insights.push('Video largo, considera dividirlo en segmentos más cortos');
    }
    
    // Insights basados en aspecto
    const aspectRatio = parseFloat(metadata.aspectRatio);
    if (aspectRatio > 1.5) {
      insights.push('Formato horizontal ideal para YouTube y Facebook');
    } else if (aspectRatio < 0.8) {
      insights.push('Formato vertical perfecto para TikTok e Instagram Stories');
    }
    
    // Insights basados en contenido visual
    if (visualAnalysis.objects && visualAnalysis.objects.length > 0) {
      insights.push(`Se detectaron ${visualAnalysis.objects.length} elementos visuales clave`);
    }
    
    // Insights basados en transcripción
    if (transcription && transcription.length > 100) {
      insights.push('Contenido rico en información, ideal para engagement');
    }
    
    // Insights basados en sentimiento
    if (sentiment.overall === 'Positivo') {
      insights.push('Tono positivo que puede generar buena respuesta de la audiencia');
    }
    
    return insights;
  }

  // Generar recomendaciones específicas
  generateRecommendations(metadata, visualAnalysis, transcription, sentiment) {
    const recommendations = [];
    
    // Recomendaciones técnicas
    if (metadata.width < 1280) {
      recommendations.push('Considera grabar en mayor resolución para mejor calidad');
    }
    
    if (metadata.duration > 180) {
      recommendations.push('Agrega capítulos o timestamps para videos largos');
    }
    
    // Recomendaciones de contenido
    if (transcription && transcription.length < 50) {
      recommendations.push('Agrega más contenido hablado para mejor engagement');
    }
    
    if (sentiment.confidence < 0.7) {
      recommendations.push('Considera un tono más definido en tu mensaje');
    }
    
    // Recomendaciones de optimización
    recommendations.push('Agrega subtítulos para mayor accesibilidad');
    recommendations.push('Optimiza la miniatura con elementos visuales llamativos');
    
    return recommendations;
  }

  // Función principal de análisis
  async analyzeVideo(file, onProgress) {
    try {
      onProgress(10, 'Extrayendo metadatos del video...');
      const metadata = await this.extractVideoMetadata(file);
      
      onProgress(25, 'Capturando frames para análisis visual...');
      const frames = await this.extractFrames(file, 3);
      
      onProgress(40, 'Extrayendo audio...');
      const audioBlob = await this.extractAudio(file);
      
      onProgress(55, 'Analizando contenido visual...');
      const visualAnalysis = await this.analyzeVisualContent(frames);
      
      onProgress(70, 'Transcribiendo audio...');
      const transcription = audioBlob ? await this.transcribeAudio(audioBlob) : 'Sin audio detectado';
      
      onProgress(85, 'Analizando sentimientos...');
      const sentiment = await this.analyzeSentiment(transcription);
      
      onProgress(95, 'Generando insights...');
      const insights = this.generateInsights(metadata, visualAnalysis, transcription, sentiment);
      const recommendations = this.generateRecommendations(metadata, visualAnalysis, transcription, sentiment);
      
      onProgress(100, 'Análisis completado!');
      
      return {
        id: Date.now(),
        source: file.name,
        type: 'file',
        duration: metadata.duration, // Duración real
        metadata,
        transcription,
        sentiment,
        visualAnalysis,
        insights,
        recommendations,
        hashtags: this.generateHashtags(transcription, visualAnalysis),
        bestTimeToPost: this.calculateBestTime(),
        viralPotential: this.calculateViralPotential(metadata, sentiment, visualAnalysis),
        analyzedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error in video analysis:', error);
      throw error;
    }
  }

  // Generar hashtags basados en contenido real
  generateHashtags(transcription, visualAnalysis) {
    const hashtags = ['#Video', '#Content'];
    
    // Hashtags basados en transcripción
    if (transcription.toLowerCase().includes('marketing')) {
      hashtags.push('#Marketing', '#DigitalMarketing');
    }
    if (transcription.toLowerCase().includes('negocio')) {
      hashtags.push('#Business', '#Emprendimiento');
    }
    
    // Hashtags basados en objetos detectados
    if (visualAnalysis.objects) {
      visualAnalysis.objects.forEach(obj => {
        if (obj.confidence > 0.8) {
          hashtags.push(`#${obj.name}`);
        }
      });
    }
    
    return hashtags.slice(0, 8); // Máximo 8 hashtags
  }

  // Calcular mejor momento para publicar
  calculateBestTime() {
    // En una implementación real, esto se basaría en datos de audiencia
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const times = ['9:00 AM', '12:00 PM', '6:00 PM', '8:00 PM'];
    
    return {
      day: days[Math.floor(Math.random() * days.length)],
      time: times[Math.floor(Math.random() * times.length)]
    };
  }

  // Calcular potencial viral basado en contenido real
  calculateViralPotential(metadata, sentiment, visualAnalysis) {
    let score = 50; // Base score
    
    // Factores positivos
    if (metadata.duration >= 15 && metadata.duration <= 60) score += 20;
    if (sentiment.overall === 'Positivo') score += 15;
    if (sentiment.confidence > 0.8) score += 10;
    if (visualAnalysis.objects && visualAnalysis.objects.length > 2) score += 10;
    
    // Factores negativos
    if (metadata.duration > 300) score -= 20;
    if (sentiment.overall === 'Negativo') score -= 15;
    
    return Math.max(1, Math.min(100, score));
  }
}

