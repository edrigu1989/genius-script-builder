// API Route for Claude - Secure backend implementation
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
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
    const { prompt, model = 'claude-3-sonnet-20240229', max_tokens = 1000, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Claude API call:', { model, prompt: prompt.substring(0, 100) + '...' });

    const message = await anthropic.messages.create({
      model,
      max_tokens,
      temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const response = {
      success: true,
      content: message.content[0].text,
      usage: message.usage,
      model: message.model,
      timestamp: new Date().toISOString()
    };

    console.log('Claude response success:', { 
      tokens: message.usage.output_tokens,
      model: message.model 
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('Claude API error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error generating content',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

