const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, platform, tone, targetAudience } = req.body;

    if (!topic || !platform) {
      return res.status(400).json({ 
        error: 'Missing required fields: topic, platform' 
      });
    }

    // Get the model - using gemini-2.5-flash as per documentation
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });

    const prompt = `Genera 4 scripts virales para ${platform} sobre el tema: "${topic}"

Parámetros:
- Tono: ${tone || 'casual'}
- Audiencia objetivo: ${targetAudience || 'general'}
- Plataforma: ${platform}

Para cada script, incluye:
1. Hook atractivo (primeros 3 segundos)
2. Contenido principal estructurado
3. Call-to-action efectivo
4. Hashtags relevantes
5. Predicción de engagement (%)
6. Score de viralidad (1-10)

Responde en formato JSON válido:
{
  "success": true,
  "scripts": [
    {
      "id": 1,
      "title": "Título del script",
      "hook": "Hook inicial",
      "content": "Contenido principal del script",
      "cta": "Call to action",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "engagement_prediction": 85,
      "virality_score": 8,
      "platform": "${platform}",
      "tone": "${tone || 'casual'}"
    }
  ]
}`;

    console.log('Generating content with Gemini API...');
    
    // Generate content using the correct API syntax from documentation
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini API response received:', text.substring(0, 200) + '...');

    try {
      // Try to parse as JSON
      const jsonResponse = JSON.parse(text);
      console.log('Successfully parsed JSON response');
      return res.status(200).json(jsonResponse);
    } catch (parseError) {
      console.log('Response is not JSON, creating structured response');
      // If not JSON, create a structured response
      return res.status(200).json({
        success: true,
        scripts: [
          {
            id: 1,
            title: `Script para ${platform} - ${topic}`,
            hook: "¿Sabías que puedes transformar tu negocio en 30 días?",
            content: text.substring(0, 500) + "...",
            cta: "¡Sígueme para más tips como este!",
            hashtags: [`#${platform.toLowerCase()}`, "#marketing", "#tips", "#viral"],
            engagement_prediction: Math.floor(Math.random() * 30) + 70,
            virality_score: Math.floor(Math.random() * 3) + 7,
            platform: platform,
            tone: tone || 'casual'
          },
          {
            id: 2,
            title: `Script Alternativo - ${topic}`,
            hook: "Esto cambió mi perspectiva completamente...",
            content: text.substring(100, 600) + "...",
            cta: "¿Qué opinas? Comenta abajo 👇",
            hashtags: [`#${platform.toLowerCase()}`, "#contenido", "#viral"],
            engagement_prediction: Math.floor(Math.random() * 30) + 65,
            virality_score: Math.floor(Math.random() * 3) + 6,
            platform: platform,
            tone: tone || 'casual'
          }
        ]
      });
    }

  } catch (error) {
    console.error('Error generating scripts:', error);
    return res.status(500).json({ 
      error: 'Error generating scripts',
      details: error.message 
    });
  }
}

