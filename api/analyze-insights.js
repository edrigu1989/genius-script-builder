// API ENDPOINT PARA ANÁLISIS DE INSIGHTS PROFUNDOS
// Archivo: api/analyze-insights.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { metadata, visualAnalysis, transcription, sentiment } = req.body;

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // PROMPT PARA ANÁLISIS DE INSIGHTS PROFUNDOS
    const insightsPrompt = `
Eres un experto en análisis de contenido digital y psicología del consumidor. Analiza este video de manera EXTREMADAMENTE PROFUNDA:

DATOS DEL VIDEO:
- Duración: ${metadata.duration} segundos
- Resolución: ${metadata.width}x${metadata.height}
- Transcripción: "${transcription}"
- Sentimiento general: ${sentiment.overall}
- Análisis visual: ${JSON.stringify(visualAnalysis.overallInsights || {})}

GENERA UN ANÁLISIS PROFUNDO que incluya:

1. AUDIENCIA OBJETIVO ESPECÍFICA:
   - Demografía exacta (edad, género, intereses)
   - Psicografía (valores, motivaciones, miedos)
   - Comportamiento de consumo digital

2. PILARES DE CONTENIDO IDENTIFICADOS:
   - Temas principales que resuenan
   - Valores transmitidos
   - Propuesta de valor única

3. VIAJE EMOCIONAL DEL ESPECTADOR:
   - Emociones en cada fase del video
   - Puntos de máximo engagement
   - Momentos de posible abandono

4. MOMENTOS CLAVE IDENTIFICADOS:
   - Hooks de apertura
   - Puntos de inflexión
   - Call-to-action efectivos

5. EFECTIVIDAD DEL CALL-TO-ACTION:
   - Claridad del mensaje
   - Momento de presentación
   - Persuasión psicológica

6. BRAND SAFETY Y RIESGOS:
   - Elementos controversiales
   - Riesgos de malinterpretación
   - Compatibilidad con marcas

Responde en formato JSON:
{
  "targetAudience": {
    "primary": {
      "age": "rango de edad",
      "gender": "género principal",
      "interests": ["interés1", "interés2"],
      "psychographics": {
        "values": ["valor1", "valor2"],
        "motivations": ["motivación1", "motivación2"],
        "fears": ["miedo1", "miedo2"]
      },
      "digitalBehavior": {
        "platforms": ["plataforma1", "plataforma2"],
        "consumptionTime": "momento del día",
        "contentPreferences": ["preferencia1", "preferencia2"]
      }
    },
    "secondary": {
      "description": "audiencia secundaria",
      "potential": "alto/medio/bajo"
    }
  },
  "contentPillars": [
    {
      "pillar": "nombre del pilar",
      "strength": "alto/medio/bajo",
      "evidence": "evidencia en el video",
      "marketAppeal": "atractivo en el mercado"
    }
  ],
  "emotionalJourney": [
    {
      "timeframe": "0-10s",
      "emotion": "emoción dominante",
      "intensity": "alta/media/baja",
      "trigger": "qué lo causa",
      "retention_risk": "alto/medio/bajo"
    }
  ],
  "keyMoments": [
    {
      "timestamp": "tiempo en segundos",
      "type": "hook/climax/cta/transition",
      "description": "descripción del momento",
      "effectiveness": "score 1-100",
      "improvement": "cómo mejorarlo"
    }
  ],
  "callToActionAnalysis": {
    "present": true/false,
    "clarity": "score 1-100",
    "timing": "perfecto/temprano/tardío",
    "persuasiveness": "score 1-100",
    "improvements": ["mejora1", "mejora2"]
  },
  "brandSafety": {
    "score": "score 1-100",
    "risks": ["riesgo1", "riesgo2"],
    "opportunities": ["oportunidad1", "oportunidad2"],
    "brandCompatibility": {
      "luxury": "alto/medio/bajo",
      "tech": "alto/medio/bajo",
      "lifestyle": "alto/medio/bajo",
      "education": "alto/medio/bajo"
    }
  },
  "competitiveAdvantages": [
    {
      "advantage": "ventaja específica",
      "uniqueness": "score 1-100",
      "marketGap": "gap que llena",
      "scalability": "alto/medio/bajo"
    }
  ],
  "psychologicalTriggers": [
    {
      "trigger": "escasez/autoridad/reciprocidad/etc",
      "strength": "alto/medio/bajo",
      "evidence": "dónde se ve en el video",
      "effectiveness": "score 1-100"
    }
  ],
  "optimizationOpportunities": [
    {
      "category": "técnico/contenido/psicológico",
      "opportunity": "descripción de la oportunidad",
      "impact": "alto/medio/bajo",
      "effort": "alto/medio/bajo",
      "priority": "score 1-100"
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en análisis de contenido digital, psicología del consumidor y marketing. Proporciona análisis profundos y accionables basados en datos reales.'
          },
          {
            role: 'user',
            content: insightsPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      return res.status(500).json({ 
        error: 'Error analyzing insights with OpenAI',
        details: errorData
      });
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    // Intentar parsear el JSON de la respuesta
    let insightsResult;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insightsResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing insights response:', parseError);
      // Fallback con insights básicos
      insightsResult = generateFallbackInsights(metadata, transcription, sentiment);
    }

    // Enriquecer con análisis adicional
    const enrichedInsights = {
      ...insightsResult,
      metadata: {
        analysisTimestamp: new Date().toISOString(),
        confidence: calculateInsightsConfidence(insightsResult),
        dataQuality: assessDataQuality(metadata, transcription, sentiment)
      },
      actionableRecommendations: generateActionableRecommendations(insightsResult),
      marketingStrategy: generateMarketingStrategy(insightsResult)
    };

    res.status(200).json(enrichedInsights);

  } catch (error) {
    console.error('Error in insights analysis:', error);
    res.status(500).json({ 
      error: 'Internal server error during insights analysis',
      details: error.message 
    });
  }
}

// FUNCIONES AUXILIARES

function generateFallbackInsights(metadata, transcription, sentiment) {
  return {
    targetAudience: {
      primary: {
        age: "25-45",
        gender: "mixto",
        interests: ["contenido digital", "entretenimiento"],
        psychographics: {
          values: ["autenticidad", "calidad"],
          motivations: ["aprendizaje", "entretenimiento"],
          fears: ["perder tiempo", "contenido irrelevante"]
        },
        digitalBehavior: {
          platforms: ["YouTube", "Instagram"],
          consumptionTime: "tarde-noche",
          contentPreferences: ["videos cortos", "contenido visual"]
        }
      },
      secondary: {
        description: "Audiencia más joven interesada en tendencias",
        potential: "medio"
      }
    },
    contentPillars: [
      {
        pillar: "Entretenimiento",
        strength: "medio",
        evidence: "Contenido visual atractivo",
        marketAppeal: "amplio"
      }
    ],
    emotionalJourney: [
      {
        timeframe: "0-10s",
        emotion: "curiosidad",
        intensity: "media",
        trigger: "apertura del video",
        retention_risk: "medio"
      }
    ],
    keyMoments: [
      {
        timestamp: "0",
        type: "hook",
        description: "Inicio del video",
        effectiveness: 70,
        improvement: "Mejorar hook de apertura"
      }
    ],
    callToActionAnalysis: {
      present: false,
      clarity: 50,
      timing: "ausente",
      persuasiveness: 30,
      improvements: ["Agregar CTA claro", "Definir acción específica"]
    },
    brandSafety: {
      score: 85,
      risks: ["Ninguno identificado"],
      opportunities: ["Contenido seguro para marcas"],
      brandCompatibility: {
        luxury: "medio",
        tech: "alto",
        lifestyle: "alto",
        education: "medio"
      }
    },
    competitiveAdvantages: [],
    psychologicalTriggers: [],
    optimizationOpportunities: [
      {
        category: "contenido",
        opportunity: "Mejorar estructura narrativa",
        impact: "alto",
        effort: "medio",
        priority: 80
      }
    ]
  };
}

function calculateInsightsConfidence(insights) {
  let confidence = 50;
  
  // Aumentar confianza basado en la completitud del análisis
  if (insights.targetAudience && insights.targetAudience.primary) confidence += 15;
  if (insights.contentPillars && insights.contentPillars.length > 0) confidence += 15;
  if (insights.emotionalJourney && insights.emotionalJourney.length > 0) confidence += 10;
  if (insights.keyMoments && insights.keyMoments.length > 0) confidence += 10;
  
  return Math.min(100, confidence);
}

function assessDataQuality(metadata, transcription, sentiment) {
  let quality = 50;
  
  if (metadata && metadata.duration > 0) quality += 20;
  if (transcription && transcription.length > 50) quality += 20;
  if (sentiment && sentiment.overall !== 'Neutral') quality += 10;
  
  return Math.min(100, quality);
}

function generateActionableRecommendations(insights) {
  const recommendations = [];
  
  // Recomendaciones basadas en audiencia objetivo
  if (insights.targetAudience && insights.targetAudience.primary) {
    recommendations.push({
      category: "Audiencia",
      action: `Crear contenido específico para ${insights.targetAudience.primary.age}`,
      priority: "alta",
      timeframe: "inmediato"
    });
  }
  
  // Recomendaciones basadas en CTA
  if (insights.callToActionAnalysis && !insights.callToActionAnalysis.present) {
    recommendations.push({
      category: "Conversión",
      action: "Agregar call-to-action claro al final del video",
      priority: "alta",
      timeframe: "próximo video"
    });
  }
  
  return recommendations;
}

function generateMarketingStrategy(insights) {
  const strategy = {
    primaryPlatforms: [],
    contentStrategy: [],
    timingStrategy: {},
    budgetAllocation: {}
  };
  
  // Estrategia basada en audiencia
  if (insights.targetAudience && insights.targetAudience.primary) {
    const audience = insights.targetAudience.primary;
    
    if (audience.digitalBehavior && audience.digitalBehavior.platforms) {
      strategy.primaryPlatforms = audience.digitalBehavior.platforms;
    }
    
    if (audience.psychographics && audience.psychographics.values) {
      strategy.contentStrategy = audience.psychographics.values.map(value => 
        `Crear contenido que refuerce el valor de ${value}`
      );
    }
  }
  
  return strategy;
}

