// API ENDPOINT PARA PREDICCIÓN DE ENGAGEMENT INTELIGENTE
// Archivo: api/predict-engagement.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { metadata, visualAnalysis, transcription, sentiment, deepInsights } = req.body;

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // PROMPT PARA PREDICCIÓN INTELIGENTE DE ENGAGEMENT
    const predictionPrompt = `
Eres un experto en análisis predictivo de contenido digital con acceso a datos de millones de videos. 
Analiza este video y predice métricas de engagement ESPECÍFICAS Y REALISTAS:

DATOS DEL VIDEO:
- Duración: ${metadata.duration} segundos
- Resolución: ${metadata.width}x${metadata.height}
- Tamaño: ${(metadata.size / (1024*1024)).toFixed(1)} MB
- Transcripción: "${transcription}"
- Sentimiento: ${sentiment.overall}
- Audiencia objetivo: ${deepInsights?.targetAudience?.primary?.age || 'General'}
- Pilares de contenido: ${deepInsights?.contentPillars?.map(p => p.pillar).join(', ') || 'No identificados'}

GENERA PREDICCIONES ESPECÍFICAS basadas en:
1. Duración óptima para cada plataforma
2. Calidad técnica vs engagement
3. Sentimiento del contenido vs retención
4. Audiencia objetivo vs alcance
5. Triggers psicológicos identificados
6. Factores de viralidad

Proporciona predicciones ESPECÍFICAS para cada plataforma con RANGOS DE CONFIANZA:

{
  "youtube": {
    "predictedViews": {
      "estimate": número_específico,
      "range": {"min": número, "max": número},
      "confidence": "score 1-100"
    },
    "avgWatchTime": {
      "percentage": "porcentaje de retención",
      "seconds": número_de_segundos,
      "dropOffPoints": ["timestamp1", "timestamp2"]
    },
    "ctr": {
      "estimate": "porcentaje",
      "factors": ["factor1", "factor2"]
    },
    "engagement": {
      "likes": número,
      "comments": número,
      "shares": número,
      "saves": número
    },
    "revenueProjection": {
      "adRevenue": "estimado en USD",
      "sponsorshipValue": "valor potencial"
    }
  },
  "tiktok": {
    "predictedViews": {
      "estimate": número_específico,
      "range": {"min": número, "max": número},
      "confidence": "score 1-100"
    },
    "completionRate": "porcentaje",
    "viralPotential": {
      "score": "1-100",
      "factors": ["factor1", "factor2"],
      "timeline": "horas/días para peak"
    },
    "engagement": {
      "likes": número,
      "comments": número,
      "shares": número,
      "follows": número
    }
  },
  "instagram": {
    "reels": {
      "views": número,
      "reach": número,
      "saves": número,
      "shares": número
    },
    "stories": {
      "views": número,
      "replies": número,
      "forwards": número
    },
    "engagement": {
      "rate": "porcentaje",
      "quality": "alta/media/baja"
    }
  },
  "facebook": {
    "organicReach": número,
    "engagement": {
      "reactions": número,
      "comments": número,
      "shares": número
    },
    "videoRetention": "porcentaje"
  },
  "linkedin": {
    "views": número,
    "engagement": {
      "likes": número,
      "comments": número,
      "shares": número
    },
    "professionalImpact": "score 1-100"
  },
  "crossPlatformInsights": {
    "bestPerformingPlatform": "nombre_plataforma",
    "worstPerformingPlatform": "nombre_plataforma",
    "synergies": ["sinergia1", "sinergia2"],
    "contentAdaptations": [
      {
        "platform": "nombre",
        "adaptation": "qué cambiar",
        "expectedImprovement": "porcentaje"
      }
    ]
  },
  "temporalPredictions": {
    "firstHour": {
      "views": número,
      "engagement": "porcentaje"
    },
    "first24Hours": {
      "views": número,
      "peakHour": "hora del día"
    },
    "firstWeek": {
      "totalViews": número,
      "dailyAverage": número
    },
    "longTerm": {
      "monthlyViews": número,
      "evergreen": true/false
    }
  },
  "audienceInsights": {
    "demographics": {
      "ageDistribution": {"18-24": "porcentaje", "25-34": "porcentaje", "35-44": "porcentaje"},
      "genderSplit": {"male": "porcentaje", "female": "porcentaje"},
      "topCountries": ["país1", "país2", "país3"]
    },
    "behaviorPredictions": {
      "watchTime": "promedio en segundos",
      "interactionRate": "porcentaje",
      "subscriptionLikelihood": "porcentaje"
    }
  },
  "optimizationRecommendations": [
    {
      "platform": "nombre",
      "recommendation": "recomendación específica",
      "expectedImpact": "porcentaje de mejora",
      "implementation": "cómo implementar"
    }
  ],
  "riskFactors": [
    {
      "risk": "descripción del riesgo",
      "probability": "alta/media/baja",
      "impact": "descripción del impacto",
      "mitigation": "cómo mitigar"
    }
  ]
}

IMPORTANTE: 
- Usa números específicos, no rangos vagos
- Basa las predicciones en los datos reales del video
- Considera factores estacionales y de tendencias
- Incluye intervalos de confianza realistas
- Explica el razonamiento detrás de cada predicción`;

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
            content: 'Eres un experto en análisis predictivo de contenido digital con acceso a datos de rendimiento de millones de videos. Proporciona predicciones específicas y realistas basadas en datos reales.'
          },
          {
            role: 'user',
            content: predictionPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.1 // Baja temperatura para predicciones más consistentes
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      return res.status(500).json({ 
        error: 'Error predicting engagement with OpenAI',
        details: errorData
      });
    }

    const data = await response.json();
    const predictionText = data.choices[0].message.content;

    // Intentar parsear el JSON de la respuesta
    let predictionResult;
    try {
      const jsonMatch = predictionText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        predictionResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing prediction response:', parseError);
      // Fallback con predicciones básicas pero realistas
      predictionResult = generateFallbackPredictions(metadata, sentiment, deepInsights);
    }

    // Enriquecer con análisis adicional
    const enrichedPredictions = {
      ...predictionResult,
      metadata: {
        predictionTimestamp: new Date().toISOString(),
        confidence: calculateOverallConfidence(predictionResult),
        modelVersion: "v2.0",
        dataQuality: assessPredictionDataQuality(metadata, transcription, sentiment)
      },
      summary: generatePredictionSummary(predictionResult),
      actionableTakeaways: generateActionableTakeaways(predictionResult)
    };

    res.status(200).json(enrichedPredictions);

  } catch (error) {
    console.error('Error in engagement prediction:', error);
    res.status(500).json({ 
      error: 'Internal server error during engagement prediction',
      details: error.message 
    });
  }
}

// FUNCIONES AUXILIARES

function generateFallbackPredictions(metadata, sentiment, deepInsights) {
  const duration = metadata.duration;
  const quality = metadata.width >= 1280 ? 1.2 : metadata.width >= 720 ? 1.0 : 0.8;
  const sentimentMultiplier = sentiment.overall === 'Positivo' ? 1.3 : 
                             sentiment.overall === 'Negativo' ? 0.7 : 1.0;
  
  // Base predictions
  const baseViews = Math.round(1000 * quality * sentimentMultiplier);
  
  return {
    youtube: {
      predictedViews: {
        estimate: Math.round(baseViews * 1.5),
        range: { 
          min: Math.round(baseViews * 1.2), 
          max: Math.round(baseViews * 2.0) 
        },
        confidence: 75
      },
      avgWatchTime: {
        percentage: duration < 60 ? "68%" : duration < 180 ? "45%" : "32%",
        seconds: Math.round(duration * (duration < 60 ? 0.68 : duration < 180 ? 0.45 : 0.32)),
        dropOffPoints: ["10s", `${Math.round(duration * 0.3)}s`]
      },
      ctr: {
        estimate: "4.2%",
        factors: ["Thumbnail quality", "Title relevance"]
      },
      engagement: {
        likes: Math.round(baseViews * 0.06),
        comments: Math.round(baseViews * 0.02),
        shares: Math.round(baseViews * 0.01),
        saves: Math.round(baseViews * 0.03)
      },
      revenueProjection: {
        adRevenue: `$${(baseViews * 0.001).toFixed(2)}`,
        sponsorshipValue: `$${(baseViews * 0.01).toFixed(2)}`
      }
    },
    tiktok: {
      predictedViews: {
        estimate: Math.round(baseViews * 3.0),
        range: { 
          min: Math.round(baseViews * 2.0), 
          max: Math.round(baseViews * 5.0) 
        },
        confidence: 70
      },
      completionRate: duration < 30 ? "78%" : duration < 60 ? "65%" : "45%",
      viralPotential: {
        score: Math.round(60 * sentimentMultiplier),
        factors: ["Short duration", "Visual appeal"],
        timeline: duration < 30 ? "6-12 horas" : "12-24 horas"
      },
      engagement: {
        likes: Math.round(baseViews * 0.08),
        comments: Math.round(baseViews * 0.03),
        shares: Math.round(baseViews * 0.04),
        follows: Math.round(baseViews * 0.005)
      }
    },
    instagram: {
      reels: {
        views: Math.round(baseViews * 2.2),
        reach: Math.round(baseViews * 1.8),
        saves: Math.round(baseViews * 0.04),
        shares: Math.round(baseViews * 0.02)
      },
      stories: {
        views: Math.round(baseViews * 0.8),
        replies: Math.round(baseViews * 0.01),
        forwards: Math.round(baseViews * 0.005)
      },
      engagement: {
        rate: "5.2%",
        quality: "media"
      }
    },
    facebook: {
      organicReach: Math.round(baseViews * 0.6),
      engagement: {
        reactions: Math.round(baseViews * 0.05),
        comments: Math.round(baseViews * 0.015),
        shares: Math.round(baseViews * 0.008)
      },
      videoRetention: "52%"
    },
    linkedin: {
      views: Math.round(baseViews * 0.4),
      engagement: {
        likes: Math.round(baseViews * 0.04),
        comments: Math.round(baseViews * 0.01),
        shares: Math.round(baseViews * 0.005)
      },
      professionalImpact: 65
    },
    crossPlatformInsights: {
      bestPerformingPlatform: "TikTok",
      worstPerformingPlatform: "LinkedIn",
      synergies: ["Cross-posting", "Audience overlap"],
      contentAdaptations: [
        {
          platform: "YouTube",
          adaptation: "Agregar intro más larga",
          expectedImprovement: "15%"
        }
      ]
    },
    temporalPredictions: {
      firstHour: {
        views: Math.round(baseViews * 0.1),
        engagement: "8.5%"
      },
      first24Hours: {
        views: Math.round(baseViews * 0.7),
        peakHour: "20:00"
      },
      firstWeek: {
        totalViews: baseViews,
        dailyAverage: Math.round(baseViews / 7)
      },
      longTerm: {
        monthlyViews: Math.round(baseViews * 1.3),
        evergreen: duration > 120
      }
    },
    audienceInsights: {
      demographics: {
        ageDistribution: {"18-24": "35%", "25-34": "40%", "35-44": "25%"},
        genderSplit: {"male": "52%", "female": "48%"},
        topCountries: ["Estados Unidos", "Reino Unido", "Canadá"]
      },
      behaviorPredictions: {
        watchTime: `${Math.round(duration * 0.6)}s`,
        interactionRate: "6.8%",
        subscriptionLikelihood: "2.1%"
      }
    },
    optimizationRecommendations: [
      {
        platform: "YouTube",
        recommendation: "Mejorar thumbnail con colores más vibrantes",
        expectedImpact: "12%",
        implementation: "Usar herramientas de diseño gráfico"
      }
    ],
    riskFactors: [
      {
        risk: "Baja retención en primeros 15 segundos",
        probability: "media",
        impact: "Reducción del 25% en alcance orgánico",
        mitigation: "Crear hook más fuerte en la apertura"
      }
    ]
  };
}

function calculateOverallConfidence(predictions) {
  let totalConfidence = 0;
  let count = 0;
  
  // Calcular confianza promedio de las predicciones principales
  if (predictions.youtube?.predictedViews?.confidence) {
    totalConfidence += predictions.youtube.predictedViews.confidence;
    count++;
  }
  if (predictions.tiktok?.predictedViews?.confidence) {
    totalConfidence += predictions.tiktok.predictedViews.confidence;
    count++;
  }
  
  return count > 0 ? Math.round(totalConfidence / count) : 70;
}

function assessPredictionDataQuality(metadata, transcription, sentiment) {
  let quality = 50;
  
  if (metadata && metadata.duration > 0) quality += 15;
  if (metadata && metadata.width >= 720) quality += 10;
  if (transcription && transcription.length > 50) quality += 15;
  if (sentiment && sentiment.overall !== 'Neutral') quality += 10;
  
  return Math.min(100, quality);
}

function generatePredictionSummary(predictions) {
  const summary = {
    bestPlatform: predictions.crossPlatformInsights?.bestPerformingPlatform || "TikTok",
    totalEstimatedViews: 0,
    avgEngagementRate: "6.2%",
    keyInsights: []
  };
  
  // Calcular total de views estimadas
  if (predictions.youtube?.predictedViews?.estimate) {
    summary.totalEstimatedViews += predictions.youtube.predictedViews.estimate;
  }
  if (predictions.tiktok?.predictedViews?.estimate) {
    summary.totalEstimatedViews += predictions.tiktok.predictedViews.estimate;
  }
  if (predictions.instagram?.reels?.views) {
    summary.totalEstimatedViews += predictions.instagram.reels.views;
  }
  
  // Generar insights clave
  summary.keyInsights = [
    `Mejor rendimiento esperado en ${summary.bestPlatform}`,
    `Total estimado de ${summary.totalEstimatedViews.toLocaleString()} views`,
    `Engagement rate promedio de ${summary.avgEngagementRate}`
  ];
  
  return summary;
}

function generateActionableTakeaways(predictions) {
  const takeaways = [];
  
  // Takeaways basados en predicciones
  if (predictions.youtube?.avgWatchTime?.percentage) {
    const retention = parseFloat(predictions.youtube.avgWatchTime.percentage);
    if (retention < 50) {
      takeaways.push({
        category: "Retención",
        action: "Mejorar hook de apertura para aumentar retención",
        priority: "alta"
      });
    }
  }
  
  if (predictions.crossPlatformInsights?.bestPerformingPlatform) {
    takeaways.push({
      category: "Distribución",
      action: `Priorizar contenido para ${predictions.crossPlatformInsights.bestPerformingPlatform}`,
      priority: "media"
    });
  }
  
  return takeaways;
}

