export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verificar API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    // Importar Gemini
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const { topic, platform = 'TikTok', tone = 'Casual', targetAudience = 'General' } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }

    // Usar modelo estable
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Genera 2 scripts creativos para ${platform} sobre: "${topic}"

Parámetros:
- Plataforma: ${platform}
- Tono: ${tone}
- Audiencia: ${targetAudience}

Responde SOLO con este JSON (sin texto adicional):
{
  "success": true,
  "scripts": [
    {
      "id": 1,
      "hook": "Hook atractivo aquí",
      "script": "Contenido principal del script",
      "cta": "Call to action",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
      "engagementScore": 85,
      "platform": "${platform}",
      "tone": "${tone}"
    },
    {
      "id": 2,
      "hook": "Segundo hook",
      "script": "Segundo contenido",
      "cta": "Segundo CTA",
      "hashtags": ["hashtag4", "hashtag5", "hashtag6"],
      "engagementScore": 78,
      "platform": "${platform}",
      "tone": "${tone}"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpiar respuesta
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsedResponse = JSON.parse(cleanText);
      res.json(parsedResponse);
    } catch (parseError) {
      // Respuesta de fallback
      res.json({
        success: true,
        scripts: [
          {
            id: 1,
            hook: "🔥 ¿Sabías que esto puede cambiar tu vida?",
            script: `Hablemos de ${topic}. Este tema es crucial para ${targetAudience} porque puede transformar completamente tu perspectiva. Te voy a contar los 3 puntos más importantes que necesitas saber...`,
            cta: "¡Comenta 'SÍ' si quieres saber más!",
            hashtags: ["viral", "tips", "marketing"],
            engagementScore: 85,
            platform: platform,
            tone: tone
          },
          {
            id: 2,
            hook: "💡 El secreto que nadie te cuenta",
            script: `Sobre ${topic}: La mayoría de personas no sabe esto, pero es fundamental para ${targetAudience}. Aquí te explico paso a paso cómo aplicarlo...`,
            cta: "¡Guarda este video para no olvidarlo!",
            hashtags: ["secretos", "exito", "consejos"],
            engagementScore: 78,
            platform: platform,
            tone: tone
          }
        ]
      });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating scripts',
      details: error.message
    });
  }
}

