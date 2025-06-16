// API ENDPOINT PARA ANÁLISIS DE SENTIMIENTOS
// Archivo: api/analyze-sentiment.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Analizar sentimientos con OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en análisis de sentimientos. Analiza el texto y responde SOLO en formato JSON con: {"overall": "Positivo/Neutral/Negativo", "confidence": 0.0-1.0, "emotions": {"alegría": 0-100, "confianza": 0-100, "entusiasmo": 0-100, "calma": 0-100, "tristeza": 0-100, "enojo": 0-100}}'
          },
          {
            role: 'user',
            content: `Analiza el sentimiento de este texto: "${text}"`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const result = await response.json();
    const sentiment = JSON.parse(result.choices[0].message.content);

    res.json(sentiment);

  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    res.status(500).json({ 
      error: 'Error analyzing sentiment',
      overall: 'Neutral',
      confidence: 0,
      emotions: {
        alegría: 0,
        confianza: 0,
        entusiasmo: 0,
        calma: 0,
        tristeza: 0,
        enojo: 0
      }
    });
  }
}

