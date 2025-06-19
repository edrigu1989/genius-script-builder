// api/analyze-insights.js
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { metadata, visualAnalysis, transcription, sentiment } = req.body;
    
    if (!metadata || !visualAnalysis || !transcription) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // Preparar el prompt con toda la información del video
    const prompt = `
    Analiza profundamente este video basado en los siguientes datos:
    
    METADATOS:
    - Duración: ${metadata.duration} segundos
    - Resolución: ${metadata.width}x${metadata.height}
    - Relación de aspecto: ${metadata.aspectRatio}
    - Tamaño: ${Math.round(metadata.size / 1024 / 1024)} MB
    
    ANÁLISIS VISUAL:
    - Resumen: ${visualAnalysis.summary || 'No disponible'}
    - Objetos clave: ${(visualAnalysis.keyObjects || []).map(o => o.name).join(', ')}
    - Colores dominantes: ${(visualAnalysis.dominantColors || []).join(', ')}
    - Tipos de plano: ${(visualAnalysis.shotTypes || []).join(', ')}
    - Texto en video: ${(visualAnalysis.textInVideo || []).join(' ')}
    - Personas detectadas: ${(visualAnalysis.celebrityDetection || []).join(', ')}
    - Emociones visuales: ${(visualAnalysis.emotions || []).join(', ')}
    
    TRANSCRIPCIÓN:
    "${transcription}"
    
    ANÁLISIS DE SENTIMIENTO:
    - Sentimiento general: ${sentiment.overall || 'Neutral'}
    - Confianza: ${sentiment.confidence || 0}
    - Emociones: ${JSON.stringify(sentiment.emotions || {})}
    - Palabras clave: ${(sentiment.keywords || []).join(', ')}
    
    Basado en estos datos, proporciona un análisis profundo en formato JSON con los siguientes elementos:
    
    1. targetAudience: Audiencia objetivo específica del video
    2. contentPillars: Array de 3-5 pilares de contenido principales
    3. emotionalJourney: Array que describe el viaje emocional del espectador
    4. keyMoments: Array de momentos clave en el video con timestamps aproximados
    5. callToActionEffectiveness: Evaluación de la efectividad del llamado a la acción (si existe)
    6. brandSafety: Evaluación de la seguridad de marca
    7. psychologicalTriggers: Array de disparadores psicológicos utilizados
    8. narrativeStructure: Estructura narrativa identificada
    9. uniqueSellingPoints: Puntos de venta únicos identificados
    10. competitiveAdvantage: Ventaja competitiva del contenido
    
    Responde SOLO con un objeto JSON válido.`;

    const response = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "Eres un experto analista de video y marketing digital que proporciona insights profundos sobre contenido audiovisual." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    const content = response.data.choices[0].message.content;
    let insights;
    
    try {
      // Intentar extraer JSON si está envuelto en comillas o markdown
      const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || 
                       content.match(/```([\s\S]*)```/) || 
                       content.match(/{[\s\S]*}/);
                       
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      insights = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing insights:", parseError);
      insights = { 
        targetAudience: "General",
        contentPillars: ["Información", "Entretenimiento"],
        emotionalJourney: ["Interés", "Atención"],
        keyMoments: [{ time: Math.floor(metadata.duration / 2), description: "Punto medio del video" }],
        callToActionEffectiveness: "No detectado",
        brandSafety: "Neutral",
        psychologicalTriggers: ["Curiosidad"],
        narrativeStructure: "Estándar",
        uniqueSellingPoints: ["Contenido original"],
        competitiveAdvantage: "No determinado"
      };
    }

    return res.status(200).json(insights);
  } catch (error) {
    console.error('Error analyzing insights:', error);
    return res.status(500).json({ 
      error: 'Error analyzing insights',
      targetAudience: "General",
      contentPillars: ["Información"],
      emotionalJourney: ["Neutral"],
      keyMoments: [],
      callToActionEffectiveness: "N/A",
      brandSafety: "N/A",
      psychologicalTriggers: [],
      narrativeStructure: "No determinado",
      uniqueSellingPoints: [],
      competitiveAdvantage: "No determinado"
    });
  }
}

