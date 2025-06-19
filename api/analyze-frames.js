// api/analyze-frames.js
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { frames } = req.body;
    
    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return res.status(400).json({ error: 'Invalid frames data' });
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // Analizar solo un subconjunto de frames para optimizar costos
    const framesToAnalyze = frames.length > 5 ? 
      [frames[0], frames[Math.floor(frames.length/3)], frames[Math.floor(frames.length*2/3)], frames[frames.length-1]] : 
      frames;

    // Analizar cada frame seleccionado
    const frameAnalyses = await Promise.all(
      framesToAnalyze.map(async (frameData, index) => {
        try {
          const response = await openai.createChatCompletion({
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Analiza esta imagen de un video y proporciona la siguiente información en formato JSON:
                    1. Una descripción detallada de lo que se ve (description)
                    2. Objetos principales detectados con nivel de confianza (objects)
                    3. Tipo de plano/encuadre (shotType)
                    4. Colores dominantes (dominantColors)
                    5. Texto visible en la imagen (textContent)
                    6. Personas reconocibles o celebridades (people)
                    7. Calidad de la imagen (quality)
                    8. Emociones transmitidas (emotions)
                    9. Etiquetas relevantes (tags)
                    
                    Responde SOLO con un objeto JSON válido.`
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: frameData,
                    },
                  },
                ],
              },
            ],
            max_tokens: 1000,
          });

          const content = response.data.choices[0].message.content;
          let parsedContent;
          
          try {
            // Intentar extraer JSON si está envuelto en comillas o markdown
            const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || 
                             content.match(/```([\s\S]*)```/) || 
                             content.match(/{[\s\S]*}/);
                             
            const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
            parsedContent = JSON.parse(jsonString);
          } catch (parseError) {
            console.error("Error parsing frame analysis:", parseError);
            parsedContent = { 
              description: "Error al analizar el frame", 
              objects: [], 
              shotType: "unknown",
              dominantColors: [],
              textContent: "",
              people: [],
              quality: "unknown",
              emotions: [],
              tags: []
            };
          }

          return {
            frameIndex: index,
            analysis: parsedContent
          };
        } catch (frameError) {
          console.error(`Error analyzing frame ${index}:`, frameError);
          return {
            frameIndex: index,
            analysis: { 
              description: "Error al analizar el frame", 
              objects: [], 
              shotType: "unknown",
              dominantColors: [],
              textContent: "",
              people: [],
              quality: "unknown",
              emotions: [],
              tags: []
            }
          };
        }
      })
    );

    // Consolidar los análisis de todos los frames
    const consolidatedAnalysis = {
      summary: frameAnalyses.map(fa => fa.analysis.description).join(" "),
      tags: [...new Set(frameAnalyses.flatMap(fa => fa.analysis.tags || []))],
      keyObjects: [...new Set(frameAnalyses.flatMap(fa => fa.analysis.objects || []))],
      dominantColors: [...new Set(frameAnalyses.flatMap(fa => fa.analysis.dominantColors || []))],
      shotTypes: frameAnalyses.map(fa => fa.analysis.shotType).filter(Boolean),
      textInVideo: frameAnalyses.filter(fa => fa.analysis.textContent).map(fa => fa.analysis.textContent),
      celebrityDetection: [...new Set(frameAnalyses.flatMap(fa => fa.analysis.people || []))],
      emotions: [...new Set(frameAnalyses.flatMap(fa => fa.analysis.emotions || []))],
      quality: frameAnalyses[0]?.analysis.quality || "medium",
      frameAnalyses: frameAnalyses
    };

    return res.status(200).json(consolidatedAnalysis);
  } catch (error) {
    console.error('Error analyzing frames:', error);
    return res.status(500).json({ error: 'Error analyzing frames' });
  }
}

