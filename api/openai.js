// API Route for OpenAI - Secure backend implementation
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model = 'gpt-4', max_tokens = 1000, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('OpenAI API call:', { model, prompt: prompt.substring(0, 100) + '...' });

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens,
      temperature,
    });

    const response = {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage,
      model: completion.model,
      timestamp: new Date().toISOString()
    };

    console.log('OpenAI response success:', { 
      tokens: completion.usage.total_tokens,
      model: completion.model 
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error generating content',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

