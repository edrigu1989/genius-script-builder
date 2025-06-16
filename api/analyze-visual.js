// API ENDPOINTS PARA ANÁLISIS DE VIDEO
// Archivo: api/analyze-visual.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { frames } = req.body;
    
    if (!frames || frames.length === 0) {
      return res.status(400).json({ error: 'No frames provided' });
    }

    // Analizar con OpenAI Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analiza estos frames de video y describe: 1) Objetos y personas presentes, 2) Escenas y ambientes, 3) Emociones y expresiones, 4) Calidad visual. Responde en formato JSON con las claves: objects, scenes, emotions, quality.'
              },
              ...frames.slice(0, 3).map(frame => ({
                type: 'image_url',
                image_url: {
                  url: frame,
                  detail: 'low'
                }
              }))
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const result = await response.json();
    const analysis = JSON.parse(result.choices[0].message.content);

    res.json(analysis);

  } catch (error) {
    console.error('Error in visual analysis:', error);
    res.status(500).json({ 
      error: 'Error analyzing visual content',
      objects: [],
      scenes: ['No se pudo analizar'],
      emotions: [],
      quality: 'No determinada'
    });
  }
}

