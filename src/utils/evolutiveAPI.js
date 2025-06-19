// UTILIDAD PARA CONECTAR FRONTEND CON APIS EVOLUTIVAS
// Maneja todas las llamadas a las APIs consolidadas

class EvolutiveAPIClient {
  constructor() {
    this.baseURL = '/api';
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  // ANÁLISIS DE VIDEO
  async analyzeVideo(videoFile, platform = 'tiktok') {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('platform', platform);
    formData.append('action', 'analyze_video');

    return this.makeRequest('/video-analysis', {
      method: 'POST',
      body: formData
    });
  }

  // GENERAR SCRIPT
  async generateScript(params) {
    const payload = {
      action: 'generate_script',
      platform: params.platform || 'tiktok',
      topic: params.topic,
      style: params.style || 'casual',
      target_audience: params.target_audience || '',
      duration: params.duration || '30'
    };

    return this.makeRequest('/script-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  }

  // OBTENER CONOCIMIENTO ACTUALIZADO
  async getKnowledgeUpdate(platform) {
    return this.makeRequest('/knowledge-base', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'get_trends',
        platform
      })
    });
  }

  // PREDECIR ENGAGEMENT
  async predictEngagement(content, platform) {
    return this.makeRequest('/video-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'predict_engagement',
        content,
        platform
      })
    });
  }

  // OPTIMIZAR SCRIPT
  async optimizeScript(script, platform, feedback = {}) {
    return this.makeRequest('/script-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'optimize_script',
        script,
        platform,
        feedback
      })
    });
  }

  // ENVIAR FEEDBACK PARA APRENDIZAJE
  async sendFeedback(scriptId, actualResults) {
    return this.makeRequest('/knowledge-base', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'update_knowledge',
        script_id: scriptId,
        results: actualResults
      })
    });
  }

  // OBTENER TENDENCIAS ACTUALES
  async getCurrentTrends(platform) {
    return this.makeRequest('/knowledge-base', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'get_current_trends',
        platform
      })
    });
  }

  // MÉTODO PRINCIPAL PARA HACER REQUESTS
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          success: true,
          data,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        console.error(`Intento ${attempt} falló:`, error);
        
        if (attempt === this.retryAttempts) {
          return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
          };
        }

        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  // UTILIDADES PARA MANEJO DE ARCHIVOS
  validateVideoFile(file) {
    const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Formato de video no soportado. Use MP4, MOV, AVI o WebM.');
    }

    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 100MB.');
    }

    return true;
  }

  // FORMATEAR RESPUESTAS PARA EL FRONTEND
  formatAnalysisResult(rawResult) {
    return {
      overall_score: rawResult.overall_score || 0,
      platform_predictions: rawResult.platform_predictions || {},
      technical_analysis: rawResult.technical_analysis || {},
      visual_analysis: rawResult.visual_analysis || {},
      audio_analysis: rawResult.audio_analysis || {},
      content_insights: rawResult.content_insights || {},
      optimization_suggestions: rawResult.optimization_suggestions || [],
      unique_insights: rawResult.unique_insights || [],
      risk_factors: rawResult.risk_factors || []
    };
  }

  formatScriptResult(rawResult) {
    return {
      script: {
        hook: rawResult.script?.hook || '',
        body: rawResult.script?.body || [],
        cta: rawResult.script?.cta || '',
        hashtags: rawResult.script?.hashtags || []
      },
      predictions: {
        viral_score: rawResult.predictions?.viral_score || 0,
        estimated_views: rawResult.predictions?.estimated_views || 0,
        engagement_rate: rawResult.predictions?.engagement_rate || 0,
        completion_rate: rawResult.predictions?.completion_rate || 0,
        best_time: rawResult.predictions?.best_time || '',
        confidence: rawResult.predictions?.confidence || 0
      },
      optimization_tips: rawResult.optimization_tips || [],
      trending_elements: rawResult.trending_elements || [],
      knowledge_insights: rawResult.knowledge_insights || []
    };
  }

  // MANEJO DE ERRORES ESPECÍFICOS
  handleAPIError(error) {
    const errorMessages = {
      'RATE_LIMIT_EXCEEDED': 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.',
      'INVALID_FILE_FORMAT': 'Formato de archivo no válido.',
      'FILE_TOO_LARGE': 'El archivo es demasiado grande.',
      'MISSING_PARAMETERS': 'Faltan parámetros requeridos.',
      'API_KEY_INVALID': 'Clave de API inválida.',
      'SERVICE_UNAVAILABLE': 'Servicio temporalmente no disponible.'
    };

    return errorMessages[error.code] || error.message || 'Error desconocido';
  }

  // CACHE SIMPLE PARA OPTIMIZAR REQUESTS
  cache = new Map();
  
  getCacheKey(endpoint, params) {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  setCache(key, data, ttl = 300000) { // 5 minutos por defecto
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }
}

// INSTANCIA GLOBAL
const apiClient = new EvolutiveAPIClient();

// FUNCIONES DE CONVENIENCIA PARA EL FRONTEND
export const videoAnalysis = {
  analyze: (file, platform) => apiClient.analyzeVideo(file, platform),
  predict: (content, platform) => apiClient.predictEngagement(content, platform)
};

export const scriptGeneration = {
  generate: (params) => apiClient.generateScript(params),
  optimize: (script, platform, feedback) => apiClient.optimizeScript(script, platform, feedback)
};

export const knowledgeBase = {
  getTrends: (platform) => apiClient.getCurrentTrends(platform),
  sendFeedback: (scriptId, results) => apiClient.sendFeedback(scriptId, results),
  getUpdate: (platform) => apiClient.getKnowledgeUpdate(platform)
};

export default apiClient;

