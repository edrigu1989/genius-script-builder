export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://genius-script-builder.vercel.app'); // Ajustalo si cambia tu dominio
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
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'API key not configured' });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const { topic, platform = 'TikTok', tone = 'Profesional', targetAudience = 'General' } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    const prompt = `
Crea 2 scripts creativos para ${platform} sobre el tema: "${topic}" enfocados en ${targetAudience}.

Reglas:
- Usa un tono ${tone}.
- No menciones la locación en el contenido del script.
- El idioma del contenido debe ser el mismo que usó el usuario al escribir el tema.
- Después de los scripts, incluye una lista separada de recomendaciones para mejorar el contenido.

Formato de respuesta (SOLO este JSON, sin texto adicional):
{
  "success": true,
  "scripts": [
    {
      "id": 1,
      "hook": "Hook inicial atractivo",
      "script": "Texto principal del script (sin mencionar locación)",
      "cta": "Llamado a la acción",
      "hashtags": ["#ejemplo1", "#ejemplo2"],
      "engagementScore": 0-100
    },
    {
      "id": 2,
      "hook": "Segundo hook",
      "script": "Segundo script creativo",
      "cta": "Segundo llamado a la acción",
      "hashtags": ["#ejemplo3", "#ejemplo4"],
      "engagementScore": 0-100
    }
  ],
  "recommendations": [
    "Recomendación 1",
    "Recomendación 2",
    "Recomendación 3"
  ]
}
`;

    const result = await model.generateContent({
      contents: [{ text: prompt }],
      generationConfig: {
        temperature: 0.3
      },
      systemInstruction: 'Eres un redactor profesional. Sigue las reglas del prompt con precisión.'
    });

    const response = await result.response;
    const text = response.text();

    // Limpiar y parsear
    const cleanText = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(cleanText);
      res.json(parsed);
    } catch (err) {
      console.warn('Fallo al parsear, respuesta cruda:', cleanText);
      res.status(200).json({
        success: true,
        scripts: [],
        recommendations: ["La IA no pudo generar el resultado en formato correcto."]
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

