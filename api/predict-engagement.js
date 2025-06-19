// api/predict-engagement.js
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { metadata, visualAnalysis, transcription, sentiment, deepInsights } = req.body;
    
    if (!metadata) {
      return res.status(400).json({ error: 'Missing required metadata' });
    }

    // Modelo de predicción basado en factores clave
    const calculateEngagement = () => {
      // Factores base
      let baseViews = 1000;
      let baseEngagementRate = 0.06; // 6%
      
      // Factores de duración
      const durationMultiplier = 
        metadata.duration < 30 ? 1.8 :  // Videos muy cortos (TikTok, Reels)
        metadata.duration < 60 ? 1.5 :  // Videos cortos (Instagram)
        metadata.duration < 180 ? 1.2 : // Videos medios
        metadata.duration < 600 ? 1.0 : // Videos largos
        0.7;                            // Videos muy largos
      
      // Factores de calidad
      const qualityMultiplier = 
        metadata.width >= 1920 ? 1.4 :  // Full HD o superior
        metadata.width >= 1280 ? 1.2 :  // HD
        metadata.width >= 720 ? 1.0 :   // SD alto
        0.8;                            // SD bajo
      
      // Factores de sentimiento
      const sentimentMultiplier = 
        sentiment?.overall === 'Positivo' ? 1.3 :
        sentiment?.overall === 'Negativo' ? 0.7 :
        1.0;
      
      // Factores de contenido visual
      const visualMultiplier = 
        (visualAnalysis?.emotions?.length > 3) ? 1.3 :
        (visualAnalysis?.keyObjects?.length > 5) ? 1.2 :
        1.0;
      
      // Factores de audiencia
      const audienceMultiplier = 
        deepInsights?.targetAudience?.toLowerCase().includes('nicho') ? 1.5 :
        deepInsights?.targetAudience?.toLowerCase().includes('específic') ? 1.3 :
        1.0;
      
      // Factores narrativos
      const narrativeMultiplier = 
        deepInsights?.emotionalJourney?.length > 3 ? 1.4 :
        deepInsights?.keyMoments?.length > 3 ? 1.3 :
        1.0;
      
      // Cálculo de vistas predichas
      const predictedViews = Math.round(
        baseViews * 
        durationMultiplier * 
        qualityMultiplier * 
        sentimentMultiplier * 
        visualMultiplier *
        audienceMultiplier *
        narrativeMultiplier
      );
      
      // Cálculo de engagement
      const engagementRate = baseEngagementRate * 
        sentimentMultiplier * 
        narrativeMultiplier;
      
      // Cálculo de retención
      const retentionRate = 
        metadata.duration < 30 ? 0.85 :
        metadata.duration < 60 ? 0.75 :
        metadata.duration < 180 ? 0.60 :
        metadata.duration < 600 ? 0.45 :
        0.30;
      
      // Ajuste por calidad de contenido
      const contentQualityAdjustment = 
        (deepInsights?.psychologicalTriggers?.length > 2) ? 1.3 :
        (deepInsights?.uniqueSellingPoints?.length > 2) ? 1.2 :
        1.0;
      
      // Predicciones finales
      return {
        predictedViews: predictedViews,
        predictedLikes: Math.round(predictedViews * engagementRate * 0.6),
        predictedComments: Math.round(predictedViews * engagementRate * 0.15),
        predictedShares: Math.round(predictedViews * engagementRate * 0.25),
        engagementRate: parseFloat((engagementRate * 100).toFixed(2)),
        retentionRate: parseFloat((retentionRate * contentQualityAdjustment * 100).toFixed(2)),
        ctr: parseFloat((0.04 * contentQualityAdjustment * 100).toFixed(2)),
        watchTime: Math.round(predictedViews * metadata.duration * retentionRate),
        viralPotential: calculateViralPotential()
      };
    };
    
    // Cálculo de potencial viral
    const calculateViralPotential = () => {
      let score = 50; // Base score
      
      // Factores positivos
      if (metadata.duration >= 15 && metadata.duration <= 60) score += 15;
      if (sentiment?.overall === 'Positivo') score += 10;
      if (sentiment?.confidence > 0.8) score += 10;
      if (visualAnalysis?.emotions?.includes('Sorpresa')) score += 15;
      if (visualAnalysis?.emotions?.includes('Alegría')) score += 10;
      if (deepInsights?.psychologicalTriggers?.includes('Curiosidad')) score += 15;
      if (deepInsights?.psychologicalTriggers?.includes('Asombro')) score += 20;
      if (deepInsights?.emotionalJourney?.length > 3) score += 10;
      
      // Factores negativos
      if (metadata.duration > 300) score -= 15;
      if (sentiment?.overall === 'Negativo') score -= 10;
      if (metadata.width < 720) score -= 10;
      
      return Math.max(1, Math.min(100, score));
    };

    // Calcular predicciones
    const predictions = calculateEngagement();

    // Opcionalmente, usar OpenAI para refinar las predicciones
    if (process.env.USE_AI_REFINEMENT === 'true') {
      try {
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        
        const prompt = `
        Refina estas predicciones de engagement para un video con las siguientes características:
        
        METADATOS:
        - Duración: ${metadata.duration} segundos
        - Resolución: ${metadata.width}x${metadata.height}
        
        ANÁLISIS:
        - Sentimiento: ${sentiment?.overall || 'Neutral'}
        - Audiencia objetivo: ${deepInsights?.targetAudience || 'General'}
        - Disparadores psicológicos: ${(deepInsights?.psychologicalTriggers || []).join(', ')}
        
        PREDICCIONES ACTUALES:
        - Vistas: ${predictions.predictedViews}
        - Likes: ${predictions.predictedLikes}
        - Comentarios: ${predictions.predictedComments}
        - Compartidos: ${predictions.predictedShares}
        - Tasa de engagement: ${predictions.engagementRate}%
        - Tasa de retención: ${predictions.retentionRate}%
        - CTR: ${predictions.ctr}%
        - Potencial viral: ${predictions.viralPotential}/100
        
        Proporciona predicciones refinadas en formato JSON con los mismos campos.`;

        const response = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [
            { role: "system", content: "Eres un experto en análisis de datos de redes sociales y predicción de engagement." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 500,
        });

        const content = response.data.choices[0].message.content;
        
        try {
          // Intentar extraer JSON
          const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || 
                           content.match(/```([\s\S]*)```/) || 
                           content.match(/{[\s\S]*}/);
                           
          const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
          const refinedPredictions = JSON.parse(jsonString);
          
          // Combinar predicciones originales con refinadas
          Object.assign(predictions, refinedPredictions);
        } catch (parseError) {
          console.error("Error parsing refined predictions:", parseError);
          // Usar predicciones originales si hay error
        }
      } catch (aiError) {
        console.error("Error refining predictions with AI:", aiError);
        // Usar predicciones originales si hay error
      }
    }

    return res.status(200).json(predictions);
  } catch (error) {
    console.error('Error predicting engagement:', error);
    return res.status(500).json({ 
      error: 'Error predicting engagement',
      predictedViews: 1000,
      predictedLikes: 60,
      predictedComments: 15,
      predictedShares: 25,
      engagementRate: 6.0,
      retentionRate: 60.0,
      ctr: 4.0,
      watchTime: 0,
      viralPotential: 50
    });
  }
}

