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
    const { businessType, industry, targetAudience } = req.body;

    if (!businessType) {
      return res.status(400).json({ 
        error: 'Missing required field: businessType' 
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    You are an expert business consultant specializing in brand voice and communication strategy.
    
    CONTEXT:
    - Business Type: ${businessType}
    - Industry: ${industry || 'General'}
    - Target Audience: ${targetAudience || 'General audience'}
    
    TASK: Generate 8-10 strategic questions to capture the unique voice, tone, and communication style of this business.
    
    The questions should help identify:
    1. Brand personality and values
    2. Communication tone and style
    3. Unique value propositions
    4. Customer relationship approach
    5. Industry-specific language and terminology
    6. Emotional connection strategies
    7. Competitive differentiation
    8. Success stories and examples
    
    REQUIREMENTS:
    - Questions should be open-ended to encourage detailed responses
    - Each question should capture different aspects of brand voice
    - Include industry-specific questions when relevant
    - Questions should be conversational and engaging
    - Responses will be used to train AI for consistent content generation
    
    Format as a JSON array of question objects with:
    - id: unique identifier
    - question: the actual question text
    - purpose: what aspect of brand voice this captures
    - category: the main category (personality, tone, values, etc.)
    - expectedResponseType: what kind of response is expected
    
    Make questions specific to ${businessType} in ${industry || 'their industry'}.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and structure the questions
    const questions = parseGeminiQuestionsResponse(text, businessType, industry);

    return res.status(200).json({
      success: true,
      questions: questions,
      metadata: {
        businessType,
        industry: industry || 'General',
        targetAudience: targetAudience || 'General audience',
        generatedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        estimatedCompletionTime: `${questions.length * 2}-${questions.length * 3} minutes`,
        rawResponse: text,
        geminiModel: 'gemini-1.5-flash'
      }
    });

  } catch (error) {
    console.error('Error generating onboarding questions:', error);
    return res.status(500).json({ 
      error: 'Failed to generate questions',
      details: error.message 
    });
  }
}

function parseGeminiQuestionsResponse(text, businessType, industry) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback: parse manually
    const questions = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentQuestion = {};
    lines.forEach((line, index) => {
      if (line.includes('?')) {
        if (currentQuestion.question) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          id: `q${questions.length + 1}`,
          question: line.trim(),
          purpose: `Capture brand voice aspect ${questions.length + 1}`,
          category: getCategoryFromQuestion(line),
          expectedResponseType: 'detailed_text'
        };
      }
    });
    
    if (currentQuestion.question) {
      questions.push(currentQuestion);
    }
    
    return questions.length > 0 ? questions : generateFallbackQuestions(businessType, industry);
    
  } catch (error) {
    console.error('Error parsing questions:', error);
    return generateFallbackQuestions(businessType, industry);
  }
}

function getCategoryFromQuestion(question) {
  const q = question.toLowerCase();
  if (q.includes('story') || q.includes('start')) return 'brand_story';
  if (q.includes('value') || q.includes('important')) return 'values';
  if (q.includes('different') || q.includes('unique')) return 'differentiation';
  if (q.includes('customer') || q.includes('client')) return 'customer_relationship';
  if (q.includes('tone') || q.includes('communicate')) return 'communication_style';
  if (q.includes('success') || q.includes('proud')) return 'achievements';
  if (q.includes('challenge') || q.includes('problem')) return 'problem_solving';
  if (q.includes('future') || q.includes('goal')) return 'vision';
  return 'general';
}

function generateFallbackQuestions(businessType, industry) {
  const baseQuestions = [
    {
      id: 'q1',
      question: `Tell me the story of how you started your ${businessType}. What inspired you to begin this journey?`,
      purpose: 'Capture founding story and motivation',
      category: 'brand_story',
      expectedResponseType: 'detailed_narrative'
    },
    {
      id: 'q2',
      question: `What makes your ${businessType} different from everyone else in ${industry || 'your industry'}?`,
      purpose: 'Identify unique value proposition and differentiation',
      category: 'differentiation',
      expectedResponseType: 'detailed_text'
    },
    {
      id: 'q3',
      question: 'What are the core values that guide every decision you make in your business?',
      purpose: 'Understand fundamental business values and principles',
      category: 'values',
      expectedResponseType: 'detailed_text'
    },
    {
      id: 'q4',
      question: 'Describe your ideal client or customer. What are they like and what do they need most?',
      purpose: 'Define target audience and their needs',
      category: 'customer_relationship',
      expectedResponseType: 'detailed_description'
    },
    {
      id: 'q5',
      question: 'Share a story about a client who initially struggled but achieved amazing results with your help.',
      purpose: 'Capture success stories and transformation narratives',
      category: 'achievements',
      expectedResponseType: 'detailed_story'
    },
    {
      id: 'q6',
      question: 'How do you want people to feel when they interact with your brand or content?',
      purpose: 'Understand desired emotional impact and brand personality',
      category: 'communication_style',
      expectedResponseType: 'emotional_description'
    },
    {
      id: 'q7',
      question: 'What\'s the biggest misconception people have about your industry, and how do you address it?',
      purpose: 'Identify industry challenges and unique perspective',
      category: 'problem_solving',
      expectedResponseType: 'detailed_explanation'
    },
    {
      id: 'q8',
      question: 'If you could give one piece of advice to someone just starting in your field, what would it be?',
      purpose: 'Capture wisdom and mentoring approach',
      category: 'expertise',
      expectedResponseType: 'advice_format'
    },
    {
      id: 'q9',
      question: 'What are you most excited about for the future of your business?',
      purpose: 'Understand vision and forward-looking perspective',
      category: 'vision',
      expectedResponseType: 'aspirational_text'
    }
  ];

  // Customize questions based on business type
  if (businessType.toLowerCase().includes('agency')) {
    baseQuestions.push({
      id: 'q10',
      question: 'What\'s your process for taking a client from their current state to their desired outcome?',
      purpose: 'Capture methodology and process approach',
      category: 'methodology',
      expectedResponseType: 'process_description'
    });
  }

  return baseQuestions;
}

