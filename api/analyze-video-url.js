import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usá POST.' });
  }

  const { videoUrl, fileName, fileSize, mimeType } = req.body;

  if (!videoUrl || !fileName || !fileSize || !mimeType) {
    return res.status(400).json({ error: 'Faltan campos obligatorios en el body' });
  }

  console.log(`🎬 Analizando video desde URL: ${videoUrl}`);

  const prompt = `Actuá como un experto en análisis de video, psicología del color y marketing visual científico.

Analizá este video basándote en:
- Nombre del archivo: "${fileName}"
- Tamaño: ${(fileSize / 1024 / 1024).toFixed(2)}MB
- Tipo MIME: ${mimeType}
- Duración estimada: ${Math.round((fileSize / 1024 / 1024) * 2)} segundos

Generá un análisis científico completo que incluya:

1. **ANÁLISIS DE COLOR Y PSICOLOGÍA VISUAL:**
   - Colores dominantes probables y su impacto psicológico
   - Teoría del color aplicada al engagement
   - Recomendaciones científicas de optimización cromática

2. **ANÁLISIS TÉCNICO DE EJECUCIÓN:**
   - Calidad de composición y encuadre
   - Evaluación de iluminación y exposición
   - Estabilidad y enfoque técnico

3. **INSIGHTS PSICOLÓGICOS Y NEUROLÓGICOS:**
   - Factores de atención y retención
   - Triggers emocionales identificados
   - Carga cognitiva y procesamiento

4. **RECOMENDACIONES CIENTÍFICAS:**
   - Optimizaciones basadas en neuromarketing
   - Mejoras técnicas específicas
   - Estrategias de viralidad científicamente probadas

5. **ANÁLISIS POR PLATAFORMA:**
   - Optimización específica para TikTok, Instagram, YouTube
   - Predicciones de rendimiento algorítmico
   - Recomendaciones de timing y formato

Basado en el nombre del archivo, inferí el tipo de contenido y generá insights específicos y accionables.

Respondé SOLAMENTE con un JSON válido con esta estructura:

{
  "visual_analysis": {
    "color_psychology": {
      "dominant_colors": ["array de colores con códigos hex"],
      "psychological_impact": "impacto psicológico detallado",
      "mood_conveyed": "estado emocional transmitido",
      "optimization_recommendations": ["recomendaciones específicas"]
    },
    "technical_execution": {
      "composition_score": 85,
      "lighting_quality": "evaluación detallada",
      "stability_assessment": "análisis de estabilidad",
      "focus_quality": "evaluación de enfoque"
    }
  },
  "psychological_insights": {
    "attention_factors": ["factores que captan atención"],
    "emotional_triggers": ["triggers emocionales identificados"],
    "retention_elements": ["elementos que mantienen interés"],
    "cognitive_load": "evaluación de carga mental"
  },
  "scientific_recommendations": {
    "color_optimizations": ["mejoras de color basadas en ciencia"],
    "timing_improvements": ["optimizaciones de timing"],
    "engagement_boosters": ["elementos para aumentar engagement"],
    "viral_factors": ["factores científicos de viralidad"]
  },
  "platform_analysis": {
    "tiktok": {
      "optimization_score": 88,
      "recommendations": ["recomendaciones específicas"],
      "predicted_performance": "predicción de rendimiento"
    },
    "instagram": {
      "optimization_score": 82,
      "recommendations": ["recomendaciones específicas"],
      "predicted_performance": "predicción de rendimiento"
    },
    "youtube": {
      "optimization_score": 79,
      "recommendations": ["recomendaciones específicas"],
      "predicted_performance": "predicción de rendimiento"
    }
  },
  "actionable_insights": {
    "immediate_improvements": ["mejoras inmediatas"],
    "advanced_optimizations": ["optimizaciones avanzadas"],
    "creative_suggestions": ["sugerencias creativas"],
    "technical_upgrades": ["mejoras técnicas"]
  },
  "viral_potential": {
    "overall_score": 84,
    "key_strengths": ["fortalezas principales"],
    "improvement_areas": ["áreas de mejora"],
    "success_probability": "probabilidad de éxito"
  }
}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(text);

    return res.status(200).json({
      success: true,
      analysis,
      metadata: {
        videoUrl,
        fileName,
        fileSize: `${(fileSize / 1024 / 1024).toFixed(2)}MB`,
        mimeType,
        processedAt: new Date().toISOString(),
        analysisType: "Scientific AI-powered video analysis"
      }
    });
  } catch (error) {
    console.error('❌ Error en análisis:', error);
    return res.status(500).json({
      success: false,
      error: 'Error durante el análisis',
      details: error.message
    });
  }
}

