const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateScripts(req, res) {
  try {
    const { topic, platform, tone, targetAudience } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }

    // Obtener el modelo
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Crear el prompt para generar scripts
    const prompt = `
Eres un experto en marketing digital y creación de contenido viral. Genera 2 scripts únicos y creativos para ${platform} sobre el tema: "${topic}".

Parámetros:
- Plataforma: ${platform}
- Tono: ${tone}
- Audiencia objetivo: ${targetAudience || 'General'}

Para cada script, proporciona:
1. Un hook atractivo (primeras 3 segundos)
2. El contenido principal estructurado
3. Un call-to-action efectivo
4. Hashtags relevantes
5. Una predicción de engagement (score del 1-100)

Formato de respuesta en JSON:
{
  "success": true,
  "scripts": [
    {
      "id": 1,
      "hook": "Hook atractivo aquí",
      "script": "Contenido principal del script aquí",
      "cta": "Call to action aquí",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
      "engagementScore": 85,
      "platform": "${platform}",
      "tone": "${tone}"
    },
    {
      "id": 2,
      "hook": "Segundo hook atractivo",
      "script": "Segundo contenido principal",
      "cta": "Segundo call to action",
      "hashtags": ["hashtag4", "hashtag5", "hashtag6"],
      "engagementScore": 78,
      "platform": "${platform}",
      "tone": "${tone}"
    }
  ]
}

Asegúrate de que los scripts sean únicos, creativos y optimizados para generar engagement en ${platform}.
`;

    // Generar contenido
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Intentar parsear la respuesta como JSON
    try {
      const parsedResponse = JSON.parse(text);
      res.json(parsedResponse);
    } catch (parseError) {
      // Si no es JSON válido, crear una respuesta estructurada
      const scripts = [
        {
          id: 1,
          hook: "🔥 ¿Sabías que puedes transformar tu negocio en 30 días?",
          script: text.substring(0, 500) + "...",
          cta: "¡Comenta 'SÍ' si quieres saber cómo!",
          hashtags: ["marketing", "negocio", "emprendimiento"],
          engagementScore: 85,
          platform: platform,
          tone: tone
        },
        {
          id: 2,
          hook: "💡 El secreto que los expertos no quieren que sepas",
          script: text.substring(500, 1000) + "...",
          cta: "¡Guarda este post para no olvidarlo!",
          hashtags: ["tips", "secretos", "exito"],
          engagementScore: 78,
          platform: platform,
          tone: tone
        }
      ];

      res.json({
        success: true,
        scripts: scripts
      });
    }

  } catch (error) {
    console.error('Error generating scripts:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating scripts',
      details: error.message
    });
  }
}

module.exports = { generateScripts };

