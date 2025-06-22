import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // CORS headers para Railway
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
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const { topic, platform = 'TikTok', tone = 'Profesional', targetAudience = 'General' } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    const prompt = `
Crea 2 scripts creativos para ${platform} sobre el tema: "${topic}" enfocados en ${targetAudience}.

Usa un tono ${tone}.

Responde SOLO con este JSON válido (sin texto adicional, sin markdown):
{
  "success": true,
  "scripts": [
    {
      "id": 1,
      "hook": "Hook inicial atractivo",
      "script": "Texto principal del script",
      "cta": "Llamado a la acción",
      "hashtags": ["#ejemplo1", "#ejemplo2"],
      "engagementScore": 85
    },
    {
      "id": 2,
      "hook": "Segundo hook",
      "script": "Segundo script creativo",
      "cta": "Segundo llamado a la acción",
      "hashtags": ["#ejemplo3", "#ejemplo4"],
      "engagementScore": 82
    }
  ],
  "recommendations": [
    "Recomendación 1",
    "Recomendación 2",
    "Recomendación 3"
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpiar texto más agresivamente
    let cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```/g, '')
      .replace(/^\s*[\r\n]/gm, '')
      .trim();

    try {
      const parsed = JSON.parse(cleanText);
      
      // Validar estructura básica
      if (parsed.scripts && Array.isArray(parsed.scripts) && parsed.scripts.length > 0) {
        return res.json(parsed);
      } else {
        throw new Error('Estructura de respuesta inválida');
      }
    } catch (parseError) {
      console.error('❌ Error parsing JSON:', parseError.message);
      console.error('📄 Texto recibido:', cleanText.substring(0, 500));
      
      // Fallback con datos estáticos
      return res.json({
        success: true,
        scripts: [
          {
            id: 1,
            hook: `¿Sabías que ${topic} puede cambiar tu vida?`,
            script: `Hoy te voy a contar todo sobre ${topic}. Es increíble cómo esto puede impactar en tu día a día. Te explico paso a paso lo que necesitas saber.`,
            cta: "¡Sígueme para más contenido como este!",
            hashtags: [`#${topic.replace(/\s+/g, '').toLowerCase()}`, "#viral", "#tips"],
            engagementScore: 78
          },
          {
            id: 2,
            hook: `La verdad sobre ${topic} que nadie te dice`,
            script: `Después de investigar mucho sobre ${topic}, descubrí algo que me sorprendió. Esto es lo que realmente funciona y lo que debes evitar.`,
            cta: "¿Qué opinas? ¡Déjamelo en los comentarios!",
            hashtags: [`#${topic.replace(/\s+/g, '').toLowerCase()}`, "#verdad", "#consejos"],
            engagementScore: 82
          }
        ],
        recommendations: [
          "Usa un lenguaje más directo y personal",
          "Agrega elementos visuales llamativos",
          "Incluye una pregunta al final para generar engagement"
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

