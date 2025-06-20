class GeminiFinetuningService {
  constructor(genAI) {
    this.genAI = genAI;
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
  }

  async generateOnboardingQuestions(businessProfile) {
    try {
      console.log(`🎯 Generating onboarding questions for ${businessProfile.type || 'business'}`);

      const prompt = this.buildOnboardingPrompt(businessProfile);
      
      const result = await this.model.generateContent(prompt);
      const questionsText = result.response.text();

      console.log(`📥 Generated onboarding questions (${questionsText.length} chars)`);

      const structuredQuestions = this.parseOnboardingQuestions(questionsText, businessProfile);

      return {
        success: true,
        questions: structuredQuestions,
        sessionId: this.generateSessionId(),
        estimatedTime: structuredQuestions.length * 2, // 2 minutes per question
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Gemini onboarding generation failed:', error);
      throw new Error(`Onboarding generation failed: ${error.message}`);
    }
  }

  buildOnboardingPrompt(businessProfile) {
    return `You are an expert business consultant and voice branding specialist. Your task is to generate personalized onboarding questions that will help capture the unique voice, tone, and messaging style of a business through audio responses.

BUSINESS CONTEXT:
- Business Type: ${businessProfile.type || 'General Business'}
- Industry: ${businessProfile.industry || 'General'}
- Target Audience: ${businessProfile.audience || 'General audience'}
- Current Brand Voice: ${businessProfile.voice || 'Professional'}
- Business Goals: ${businessProfile.goals || 'Growth and engagement'}
- Company Size: ${businessProfile.size || 'Small to Medium'}

OBJECTIVE: Generate 8-10 strategic questions that will:
1. Capture the founder's/brand's authentic speaking style
2. Understand core business values and messaging
3. Identify unique value propositions and differentiators
4. Reveal personality traits and communication preferences
5. Gather examples of successful messaging
6. Understand target audience pain points and desires

QUESTION REQUIREMENTS:
- Each question should elicit 60-90 seconds of natural speaking
- Questions should feel conversational, not like an interview
- Mix personal story questions with business strategy questions
- Include scenario-based questions to reveal authentic reactions
- Ensure questions capture emotional tone and energy levels
- Questions should be specific enough to avoid generic answers

QUESTION CATEGORIES TO INCLUDE:
1. Origin Story (1-2 questions)
2. Value Proposition (2 questions)
3. Customer Success Stories (1-2 questions)
4. Brand Personality (2 questions)
5. Communication Style (1-2 questions)
6. Vision & Goals (1 question)

FORMAT YOUR RESPONSE AS:

QUESTION 1: [Category]
Question: [The actual question to ask]
Purpose: [Why this question captures voice/brand essence]
Expected Response: [What type of response this should elicit]
Audio Duration: [Expected speaking time: 60-90 seconds]

QUESTION 2: [Category]
Question: [The actual question to ask]
Purpose: [Why this question captures voice/brand essence]
Expected Response: [What type of response this should elicit]
Audio Duration: [Expected speaking time: 60-90 seconds]

[Continue for all questions...]

IMPORTANT GUIDELINES:
- Make questions feel natural and conversational
- Avoid yes/no questions - all should require detailed responses
- Include emotional triggers to capture authentic personality
- Questions should reveal both professional expertise and personal passion
- Ensure questions are relevant to the specific business type and industry
- Each question should contribute unique insights for voice modeling

Generate questions that will create a comprehensive voice profile for AI fine-tuning.`;
  }

  parseOnboardingQuestions(questionsText, businessProfile) {
    try {
      const questions = [];
      const questionBlocks = questionsText.split(/QUESTION \d+:/i);
      
      // Remove empty first element
      questionBlocks.shift();

      questionBlocks.forEach((block, index) => {
        const questionNumber = index + 1;
        
        const category = this.extractField(block, 'Category') || this.extractCategoryFromBlock(block);
        const question = this.extractField(block, 'Question');
        const purpose = this.extractField(block, 'Purpose');
        const expectedResponse = this.extractField(block, 'Expected Response');
        const duration = this.extractField(block, 'Audio Duration') || '60-90 seconds';

        if (question && question.length > 10) {
          questions.push({
            id: `q${questionNumber}`,
            number: questionNumber,
            category: category?.trim() || 'General',
            question: question.trim(),
            purpose: purpose?.trim() || 'Capture brand voice and messaging style',
            expectedResponse: expectedResponse?.trim() || 'Detailed personal/business response',
            estimatedDuration: duration.trim(),
            audioRequired: true,
            completed: false,
            audioUrl: null,
            transcription: null,
            voiceAnalysis: null
          });
        }
      });

      // If parsing failed, create enhanced default questions
      if (questions.length === 0) {
        questions.push(...this.createEnhancedDefaultQuestions(businessProfile));
      }

      return questions;

    } catch (error) {
      console.error('❌ Error parsing onboarding questions:', error);
      return this.createEnhancedDefaultQuestions(businessProfile);
    }
  }

  extractField(text, fieldName) {
    const patterns = [
      new RegExp(`${fieldName}:\\s*(.+?)(?=\\n[A-Z][a-z]+:|$)`, 'is'),
      new RegExp(`${fieldName}:\\s*(.+?)(?=\\n\\w+:|$)`, 'is'),
      new RegExp(`${fieldName}:\\s*(.+?)(?=\\n|$)`, 'is')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  }

  extractCategoryFromBlock(block) {
    const text = block.toLowerCase();
    if (text.includes('origin') || text.includes('story') || text.includes('started')) return 'Origin Story';
    if (text.includes('value') || text.includes('unique') || text.includes('different')) return 'Value Proposition';
    if (text.includes('customer') || text.includes('client') || text.includes('success')) return 'Customer Success';
    if (text.includes('personality') || text.includes('brand') || text.includes('culture')) return 'Brand Personality';
    if (text.includes('communication') || text.includes('speak') || text.includes('talk')) return 'Communication Style';
    if (text.includes('vision') || text.includes('future') || text.includes('goal')) return 'Vision & Goals';
    return 'General';
  }

  createEnhancedDefaultQuestions(businessProfile) {
    const businessType = businessProfile.type || 'business';
    const industry = businessProfile.industry || 'your industry';
    
    return [
      {
        id: 'q1',
        number: 1,
        category: 'Origin Story',
        question: `Tell me the story of how you started ${businessType}. What was the moment you realized this was your calling, and what drove you to take that first step?`,
        purpose: 'Capture authentic passion and founding motivation',
        expectedResponse: 'Personal story with emotional connection to business',
        estimatedDuration: '90 seconds',
        audioRequired: true,
        completed: false
      },
      {
        id: 'q2',
        number: 2,
        category: 'Value Proposition',
        question: `Imagine you're at a networking event and someone asks "What makes your ${businessType} different from everyone else in ${industry}?" How do you respond?`,
        purpose: 'Capture natural elevator pitch and unique positioning',
        expectedResponse: 'Confident explanation of unique value proposition',
        estimatedDuration: '75 seconds',
        audioRequired: true,
        completed: false
      },
      {
        id: 'q3',
        number: 3,
        category: 'Customer Success',
        question: `Describe a time when you helped a client achieve something amazing. Walk me through what happened and how it made you feel.`,
        purpose: 'Capture storytelling style and emotional connection to results',
        expectedResponse: 'Detailed success story with emotional elements',
        estimatedDuration: '90 seconds',
        audioRequired: true,
        completed: false
      },
      {
        id: 'q4',
        number: 4,
        category: 'Brand Personality',
        question: `If your ${businessType} was a person at a party, how would they behave? What would they talk about, and how would people describe them?`,
        purpose: 'Capture brand personality and communication style',
        expectedResponse: 'Creative description revealing brand personality',
        estimatedDuration: '60 seconds',
        audioRequired: true,
        completed: false
      },
      {
        id: 'q5',
        number: 5,
        category: 'Communication Style',
        question: `When you're explaining your services to someone who's never heard of ${industry} before, how do you break it down? Give me an example.`,
        purpose: 'Capture teaching style and simplification approach',
        expectedResponse: 'Clear explanation with analogies or examples',
        estimatedDuration: '75 seconds',
        audioRequired: true,
        completed: false
      },
      {
        id: 'q6',
        number: 6,
        category: 'Problem Solving',
        question: `Tell me about a challenge your ideal client faces that keeps them up at night. How do you address this in your messaging?`,
        purpose: 'Capture empathy and problem-solving communication',
        expectedResponse: 'Empathetic problem identification and solution approach',
        estimatedDuration: '80 seconds',
        audioRequired: true,
        completed: false
      },
      {
        id: 'q7',
        number: 7,
        category: 'Vision & Goals',
        question: `Fast forward 3 years - your ${businessType} has achieved everything you dreamed of. Describe what that looks like and how it feels.`,
        purpose: 'Capture aspirational tone and future vision',
        expectedResponse: 'Inspirational vision with emotional connection',
        estimatedDuration: '70 seconds',
        audioRequired: true,
        completed: false
      },
      {
        id: 'q8',
        number: 8,
        category: 'Personal Connection',
        question: `What's one thing about your approach to ${industry} that comes directly from your personal values or life experience?`,
        purpose: 'Capture authentic personal connection to business',
        expectedResponse: 'Personal story connecting values to business approach',
        estimatedDuration: '85 seconds',
        audioRequired: true,
        completed: false
      }
    ];
  }

  async analyzeAudioResponse(audioFile, questionData) {
    try {
      console.log(`🎤 Analyzing audio response for question ${questionData.number}`);

      // Convert audio to base64 for Gemini
      const audioBuffer = audioFile.buffer || audioFile;
      const audioBase64 = audioBuffer.toString('base64');

      const prompt = `Analyze this audio response for voice branding and fine-tuning purposes:

QUESTION CONTEXT:
- Category: ${questionData.category}
- Question: ${questionData.question}
- Purpose: ${questionData.purpose}

ANALYSIS REQUIREMENTS:
1. VOICE CHARACTERISTICS:
   - Tone (warm, professional, energetic, calm, etc.)
   - Pace (fast, moderate, slow, varied)
   - Energy level (high, medium, low)
   - Emotional range and expression
   - Confidence level
   - Authenticity markers

2. COMMUNICATION STYLE:
   - Vocabulary complexity and choice
   - Sentence structure preferences
   - Use of metaphors, analogies, or examples
   - Storytelling approach
   - Technical vs. conversational language
   - Humor or personality elements

3. BRAND VOICE ELEMENTS:
   - Key phrases or expressions used
   - Values and beliefs expressed
   - Unique perspectives or approaches
   - Passion points and enthusiasm triggers
   - Problem-solving communication style
   - Customer empathy and connection style

4. CONTENT INSIGHTS:
   - Main messages and themes
   - Unique value propositions mentioned
   - Success stories or examples shared
   - Personal experiences that shape approach
   - Vision and aspirational elements

Provide detailed analysis that can be used for AI fine-tuning to replicate this voice and messaging style.`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: audioBase64,
            mimeType: "audio/wav" // Adjust based on actual audio format
          }
        }
      ]);

      const analysisText = result.response.text();
      
      console.log(`✅ Audio analysis completed (${analysisText.length} chars)`);

      return {
        success: true,
        analysis: this.parseAudioAnalysis(analysisText),
        transcription: this.extractTranscription(analysisText),
        voiceProfile: this.extractVoiceProfile(analysisText),
        analyzedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Audio analysis failed:', error);
      
      // Return fallback analysis
      return {
        success: false,
        analysis: this.createFallbackAudioAnalysis(questionData),
        error: error.message
      };
    }
  }

  parseAudioAnalysis(analysisText) {
    return {
      voiceCharacteristics: this.extractSection(analysisText, 'VOICE CHARACTERISTICS'),
      communicationStyle: this.extractSection(analysisText, 'COMMUNICATION STYLE'),
      brandVoiceElements: this.extractSection(analysisText, 'BRAND VOICE ELEMENTS'),
      contentInsights: this.extractSection(analysisText, 'CONTENT INSIGHTS'),
      rawAnalysis: analysisText
    };
  }

  extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:([\\s\\S]*?)(?=\\d+\\.|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : `Analysis for ${sectionName} section`;
  }

  extractTranscription(analysisText) {
    // Extract transcription if available in the analysis
    const transcriptionMatch = analysisText.match(/transcription:([\\s\\S]*?)(?=analysis:|$)/i);
    return transcriptionMatch ? transcriptionMatch[1].trim() : 'Transcription not available';
  }

  extractVoiceProfile(analysisText) {
    return {
      tone: this.extractAttribute(analysisText, 'tone'),
      pace: this.extractAttribute(analysisText, 'pace'),
      energy: this.extractAttribute(analysisText, 'energy'),
      confidence: this.extractAttribute(analysisText, 'confidence'),
      authenticity: this.extractAttribute(analysisText, 'authenticity'),
      vocabulary: this.extractAttribute(analysisText, 'vocabulary'),
      storytelling: this.extractAttribute(analysisText, 'storytelling')
    };
  }

  extractAttribute(text, attribute) {
    const regex = new RegExp(`${attribute}[:\\s]*([^\\n,\\.]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not specified';
  }

  createFallbackAudioAnalysis(questionData) {
    return {
      voiceCharacteristics: {
        tone: 'Professional and engaging',
        pace: 'Moderate with emphasis on key points',
        energy: 'Medium to high energy level',
        confidence: 'Confident and assured',
        authenticity: 'Genuine and personal'
      },
      communicationStyle: {
        vocabulary: 'Professional yet accessible',
        structure: 'Clear and organized',
        examples: 'Uses relevant examples and stories',
        approach: 'Educational and supportive'
      },
      brandVoiceElements: {
        keyPhrases: ['We believe in', 'Our approach is', 'What makes us different'],
        values: 'Quality, innovation, customer success',
        perspective: 'Solution-oriented and positive',
        passion: 'Helping clients achieve their goals'
      },
      contentInsights: {
        mainMessages: 'Focus on value and results',
        uniqueValue: 'Personalized approach and expertise',
        vision: 'Long-term client success and growth'
      }
    };
  }

  async generateFinetunedContent(prompt, voiceProfile, contentType = 'script') {
    try {
      console.log(`🎯 Generating ${contentType} with finetuned voice profile`);

      const fineTunedPrompt = this.buildFineTunedPrompt(prompt, voiceProfile, contentType);
      
      const result = await this.model.generateContent(fineTunedPrompt);
      const content = result.response.text();

      console.log(`✅ Finetuned content generated (${content.length} chars)`);

      return {
        success: true,
        content: content,
        voiceProfileUsed: voiceProfile,
        contentType: contentType,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Finetuned content generation failed:', error);
      throw new Error(`Finetuned generation failed: ${error.message}`);
    }
  }

  buildFineTunedPrompt(prompt, voiceProfile, contentType) {
    return `You are now writing in the specific voice and style of this business owner based on their audio analysis:

VOICE PROFILE:
- Tone: ${voiceProfile.tone || 'Professional and engaging'}
- Communication Style: ${voiceProfile.communicationStyle || 'Clear and accessible'}
- Key Phrases: ${voiceProfile.keyPhrases || 'Value-focused language'}
- Values: ${voiceProfile.values || 'Quality and customer success'}
- Energy Level: ${voiceProfile.energy || 'Medium to high'}
- Storytelling Style: ${voiceProfile.storytelling || 'Personal and relatable'}

CONTENT REQUEST: ${prompt}

CONTENT TYPE: ${contentType}

INSTRUCTIONS:
- Write EXACTLY as this person would speak/write
- Use their specific tone, pace, and energy level
- Include their characteristic phrases and expressions
- Reflect their values and perspective
- Match their level of technical vs. conversational language
- Incorporate their storytelling and example-giving style
- Maintain their authentic voice throughout

Generate content that sounds like it came directly from this person, not from a generic AI.`;
  }

  generateSessionId() {
    return 'ft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = GeminiFinetuningService;

