// AI Service - Secure integration with OpenAI and Claude
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false // Only for server-side usage
});

// Initialize Claude
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY,
});

// AI Models configuration
export const AI_MODELS = {
  OPENAI_GPT4: 'gpt-4-turbo-preview',
  OPENAI_GPT35: 'gpt-3.5-turbo',
  CLAUDE_OPUS: 'claude-3-opus-20240229',
  CLAUDE_SONNET: 'claude-3-sonnet-20240229',
  CLAUDE_HAIKU: 'claude-3-haiku-20240307'
};

// Content types for script generation
export const CONTENT_TYPES = {
  SOCIAL_MEDIA: 'social_media',
  EMAIL_MARKETING: 'email_marketing', 
  LANDING_PAGE: 'landing_page',
  BLOG_POST: 'blog_post',
  AD_COPY: 'ad_copy',
  VIDEO_SCRIPT: 'video_script',
  PRODUCT_DESCRIPTION: 'product_description'
};

// Tone options
export const TONE_OPTIONS = {
  PROFESSIONAL: 'professional',
  CASUAL: 'casual',
  FRIENDLY: 'friendly',
  AUTHORITATIVE: 'authoritative',
  CONVERSATIONAL: 'conversational',
  URGENT: 'urgent',
  INSPIRING: 'inspiring',
  HUMOROUS: 'humorous'
};

// Platform-specific configurations
export const PLATFORM_CONFIGS = {
  FACEBOOK: {
    maxLength: 2000,
    recommendedLength: 400,
    supportsHashtags: true,
    supportsEmojis: true
  },
  INSTAGRAM: {
    maxLength: 2200,
    recommendedLength: 300,
    supportsHashtags: true,
    supportsEmojis: true,
    maxHashtags: 30
  },
  TWITTER: {
    maxLength: 280,
    recommendedLength: 250,
    supportsHashtags: true,
    supportsEmojis: true
  },
  LINKEDIN: {
    maxLength: 3000,
    recommendedLength: 600,
    supportsHashtags: true,
    supportsEmojis: false,
    professional: true
  },
  TIKTOK: {
    maxLength: 2200,
    recommendedLength: 300,
    supportsHashtags: true,
    supportsEmojis: true,
    trendy: true
  },
  YOUTUBE: {
    maxLength: 5000,
    recommendedLength: 1000,
    supportsHashtags: true,
    supportsEmojis: true
  }
};

// Generate optimized prompts for different content types
export const generatePrompt = (params) => {
  const {
    contentType,
    topic,
    targetAudience,
    tone,
    platform,
    keywords,
    callToAction,
    brandVoice,
    additionalContext
  } = params;

  const platformConfig = PLATFORM_CONFIGS[platform?.toUpperCase()];
  const maxLength = platformConfig?.recommendedLength || 500;

  let basePrompt = `Actúa como un experto copywriter y especialista en marketing digital. 

TAREA: Crear un ${getContentTypeLabel(contentType)} profesional y efectivo.

DETALLES:
- Tema: ${topic}
- Audiencia objetivo: ${targetAudience}
- Tono: ${tone}
- Plataforma: ${platform}
- Palabras clave: ${keywords?.join(', ') || 'N/A'}
- Call to Action: ${callToAction || 'Generar engagement'}
- Voz de marca: ${brandVoice || 'Profesional y confiable'}

RESTRICCIONES:
- Longitud máxima recomendada: ${maxLength} caracteres
- ${platformConfig?.professional ? 'Mantener tono profesional' : 'Puede ser más casual'}
- ${platformConfig?.supportsHashtags ? 'Incluir hashtags relevantes' : 'No usar hashtags'}
- ${platformConfig?.supportsEmojis ? 'Usar emojis apropiados' : 'No usar emojis'}

CONTEXTO ADICIONAL:
${additionalContext || 'N/A'}

INSTRUCCIONES ESPECÍFICAS:
1. Crear contenido original y atractivo
2. Optimizar para la plataforma específica
3. Incluir elementos persuasivos
4. Asegurar coherencia con la voz de marca
5. Generar engagement y conversiones

FORMATO DE RESPUESTA:
Proporciona solo el contenido final, sin explicaciones adicionales.`;

  // Add specific instructions based on content type
  switch (contentType) {
    case CONTENT_TYPES.SOCIAL_MEDIA:
      basePrompt += `\n\nPara redes sociales, enfócate en:
- Hook inicial impactante
- Contenido visual y atractivo
- Hashtags estratégicos
- Call to action claro`;
      break;
      
    case CONTENT_TYPES.EMAIL_MARKETING:
      basePrompt += `\n\nPara email marketing, incluye:
- Asunto atractivo
- Personalización
- Estructura clara
- CTA prominente`;
      break;
      
    case CONTENT_TYPES.LANDING_PAGE:
      basePrompt += `\n\nPara landing page, estructura:
- Headline principal
- Subheadline
- Beneficios clave
- Prueba social
- CTA principal`;
      break;
      
    case CONTENT_TYPES.AD_COPY:
      basePrompt += `\n\nPara publicidad, enfócate en:
- Propuesta de valor clara
- Urgencia o escasez
- Beneficios específicos
- CTA directo`;
      break;
  }

  return basePrompt;
};

// Get content type label in Spanish
const getContentTypeLabel = (type) => {
  const labels = {
    [CONTENT_TYPES.SOCIAL_MEDIA]: 'post para redes sociales',
    [CONTENT_TYPES.EMAIL_MARKETING]: 'email de marketing',
    [CONTENT_TYPES.LANDING_PAGE]: 'copy para landing page',
    [CONTENT_TYPES.BLOG_POST]: 'artículo de blog',
    [CONTENT_TYPES.AD_COPY]: 'copy publicitario',
    [CONTENT_TYPES.VIDEO_SCRIPT]: 'script para video',
    [CONTENT_TYPES.PRODUCT_DESCRIPTION]: 'descripción de producto'
  };
  return labels[type] || 'contenido de marketing';
};

// Generate content using OpenAI
export const generateWithOpenAI = async (params, model = AI_MODELS.OPENAI_GPT4) => {
  try {
    const prompt = generatePrompt(params);
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "Eres un experto copywriter y especialista en marketing digital con más de 10 años de experiencia. Creas contenido que convierte y genera resultados medibles."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.1
    });

    return {
      success: true,
      content: completion.choices[0].message.content.trim(),
      model: model,
      usage: completion.usage,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('OpenAI Error:', error);
    return {
      success: false,
      error: error.message,
      model: model,
      timestamp: new Date().toISOString()
    };
  }
};

// Generate content using Claude
export const generateWithClaude = async (params, model = AI_MODELS.CLAUDE_SONNET) => {
  try {
    const prompt = generatePrompt(params);
    
    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 1500,
      temperature: 0.7,
      system: "Eres un experto copywriter y especialista en marketing digital con más de 10 años de experiencia. Creas contenido que convierte y genera resultados medibles.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return {
      success: true,
      content: message.content[0].text.trim(),
      model: model,
      usage: message.usage,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Claude Error:', error);
    return {
      success: false,
      error: error.message,
      model: model,
      timestamp: new Date().toISOString()
    };
  }
};

// Main function to generate content with fallback
export const generateContent = async (params, preferredProvider = 'openai') => {
  try {
    let result;
    
    if (preferredProvider === 'openai') {
      result = await generateWithOpenAI(params);
      
      // Fallback to Claude if OpenAI fails
      if (!result.success) {
        console.log('OpenAI failed, trying Claude...');
        result = await generateWithClaude(params);
        result.fallback = true;
      }
    } else {
      result = await generateWithClaude(params);
      
      // Fallback to OpenAI if Claude fails
      if (!result.success) {
        console.log('Claude failed, trying OpenAI...');
        result = await generateWithOpenAI(params);
        result.fallback = true;
      }
    }

    return result;
  } catch (error) {
    console.error('Content generation error:', error);
    return {
      success: false,
      error: 'Error generating content. Please try again.',
      timestamp: new Date().toISOString()
    };
  }
};

// Validate content quality
export const validateContent = (content, params) => {
  const issues = [];
  const platformConfig = PLATFORM_CONFIGS[params.platform?.toUpperCase()];
  
  if (platformConfig) {
    // Check length
    if (content.length > platformConfig.maxLength) {
      issues.push(`Content exceeds maximum length (${content.length}/${platformConfig.maxLength})`);
    }
    
    // Check hashtags
    if (platformConfig.supportsHashtags) {
      const hashtagCount = (content.match(/#\w+/g) || []).length;
      if (platformConfig.maxHashtags && hashtagCount > platformConfig.maxHashtags) {
        issues.push(`Too many hashtags (${hashtagCount}/${platformConfig.maxHashtags})`);
      }
    }
  }
  
  // Check for required elements
  if (params.callToAction && !content.toLowerCase().includes(params.callToAction.toLowerCase())) {
    issues.push('Call to action not clearly included');
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues,
    score: Math.max(0, 100 - (issues.length * 20))
  };
};

export default {
  generateContent,
  generateWithOpenAI,
  generateWithClaude,
  validateContent,
  AI_MODELS,
  CONTENT_TYPES,
  TONE_OPTIONS,
  PLATFORM_CONFIGS
};

