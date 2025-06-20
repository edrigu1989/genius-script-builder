// UTILIDAD PARA CONECTAR FRONTEND CON API DE GEMINI
// Maneja todas las llamadas a la API de Gemini de forma optimizada

class GeminiAPIClient {
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

    return this.makeRequest('/analyze-video', {
      method: 'POST',
      body: formData
    });
  }

  // GENERAR SCRIPT CON GEMINI
  async generateScript(params) {
    const payload = {
      videoAnalysis: {
        viralityScore: params.viralityScore || 75,
        insights: params.insights || [`Contenido sobre ${params.topic}`],
        recommendations: params.recommendations || ['Usar hook fuerte', 'Incluir CTA claro']
      },
      platform: params.platform || 'tiktok',
      businessProfile: {
        type: params.businessType || 'General',
        audience: params.target_audience || 'General audience',
        voice: params.style || 'casual',
        industry: params.industry || 'Content Creation'
      }
    };

    return this.makeRequest('/generate-scripts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  }

  // PREDECIR ENGAGEMENT CON GEMINI
  async predictEngagement(content, platform) {
    return this.makeRequest('/analyze-video', {
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
}

// INSTANCIA GLOBAL
const geminiClient = new GeminiAPIClient();

// FUNCIONES DE CONVENIENCIA PARA EL FRONTEND
export const videoAnalysis = {
  analyze: (file, platform) => geminiClient.analyzeVideo(file, platform),
  predict: (content, platform) => geminiClient.predictEngagement(content, platform)
};

export const scriptGeneration = {
  generate: (params) => geminiClient.generateScript(params)
};

export default geminiClient;

