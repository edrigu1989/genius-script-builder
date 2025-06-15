// Secure AI Service - Uses backend API routes instead of direct API calls
class SecureAIService {
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://genius-script-builder.vercel.app'
      : 'http://localhost:3000';
  }

  async generateWithOpenAI(prompt, options = {}) {
    try {
      console.log('Calling secure OpenAI API...');
      
      const response = await fetch(`${this.baseUrl}/api/openai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: options.model || 'gpt-4',
          max_tokens: options.max_tokens || 1000,
          temperature: options.temperature || 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'OpenAI generation failed');
      }

      return {
        content: data.content,
        usage: data.usage,
        model: data.model,
        timestamp: data.timestamp
      };

    } catch (error) {
      console.error('Secure OpenAI error:', error);
      throw error;
    }
  }

  async generateWithClaude(prompt, options = {}) {
    try {
      console.log('Calling secure Claude API...');
      
      const response = await fetch(`${this.baseUrl}/api/claude`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: options.model || 'claude-3-sonnet-20240229',
          max_tokens: options.max_tokens || 1000,
          temperature: options.temperature || 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Claude generation failed');
      }

      return {
        content: data.content,
        usage: data.usage,
        model: data.model,
        timestamp: data.timestamp
      };

    } catch (error) {
      console.error('Secure Claude error:', error);
      throw error;
    }
  }

  async generateScript(scriptData) {
    try {
      console.log('Generating script with secure AI service...');

      const { platform, contentType, targetAudience, productService, tone, duration, aiModel } = scriptData;

      // Create optimized prompt
      const prompt = this.createScriptPrompt({
        platform,
        contentType,
        targetAudience,
        productService,
        tone,
        duration
      });

      let result;
      
      // Use specified AI model or fallback
      if (aiModel === 'claude' || aiModel === 'claude-3-sonnet-20240229') {
        result = await this.generateWithClaude(prompt);
      } else {
        result = await this.generateWithOpenAI(prompt);
      }

      return {
        success: true,
        script: result.content,
        metadata: {
          platform,
          contentType,
          targetAudience,
          tone,
          duration,
          aiModel: result.model,
          usage: result.usage,
          generatedAt: result.timestamp
        }
      };

    } catch (error) {
      console.error('Script generation error:', error);
      
      // Return fallback script
      return {
        success: false,
        error: error.message,
        script: this.getFallbackScript(scriptData),
        metadata: {
          fallback: true,
          generatedAt: new Date().toISOString()
        }
      };
    }
  }

  async analyzeVideo(videoFile, options = {}) {
    try {
      console.log('Analyzing video with secure AI service...');
      
      const response = await fetch(`${this.baseUrl}/api/analyze-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoFile: {
            name: videoFile.name,
            size: videoFile.size,
            type: videoFile.type
          },
          platform: options.platform || 'general',
          targetAudience: options.targetAudience || 'general',
          industry: options.industry || 'general'
        })
      });

      if (!response.ok) {
        throw new Error(`Video analysis error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Video analysis failed');
      }

      return data;

    } catch (error) {
      console.error('Secure video analysis error:', error);
      throw error;
    }
  }

  createScriptPrompt({ platform, contentType, targetAudience, productService, tone, duration }) {
    return `Crea un script de marketing profesional con las siguientes especificaciones:

PLATAFORMA: ${platform}
TIPO DE CONTENIDO: ${contentType}
AUDIENCIA OBJETIVO: ${targetAudience}
PRODUCTO/SERVICIO: ${productService}
TONO: ${tone}
DURACIÓN: ${duration}

INSTRUCCIONES:
1. Crea un script atractivo y persuasivo
2. Incluye un hook poderoso en los primeros 3 segundos
3. Estructura clara: Introducción, Desarrollo, Call-to-Action
4. Adapta el lenguaje a la plataforma y audiencia
5. Incluye elementos específicos para ${platform}
6. Mantén el tono ${tone} durante todo el script
7. Optimiza para la duración de ${duration}

FORMATO DE RESPUESTA:
- Script completo listo para usar
- Incluye indicaciones de timing si es necesario
- Sugiere hashtags relevantes al final
- Proporciona tips de presentación

Genera un script profesional y efectivo que maximice el engagement y conversiones.`;
  }

  getFallbackScript(scriptData) {
    const { platform, productService, targetAudience } = scriptData;
    
    return `🎯 ¡Atención ${targetAudience}!

¿Sabías que ${productService} puede transformar completamente tu experiencia?

✨ En solo unos minutos descubrirás:
• Beneficios únicos que no encontrarás en otro lugar
• Resultados reales de personas como tú
• Una oportunidad especial que no querrás perder

👆 No dejes pasar esta oportunidad

💬 Comenta "MÁS INFO" y te enviaremos todos los detalles

#${platform} #Marketing #Oportunidad #${targetAudience.replace(/\s+/g, '')}

---
Script generado por MarketingGenius
Optimizado para ${platform}`;
  }
}

// Export singleton instance
export const secureAIService = new SecureAIService();

