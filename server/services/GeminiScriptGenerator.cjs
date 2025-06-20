class GeminiScriptGenerator {
  constructor(genAI) {
    this.genAI = genAI;
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500,
      }
    });
  }

  async generateScripts(videoAnalysis, platform, businessProfile = null) {
    try {
      console.log(`📝 Generating scripts for ${platform} with Gemini AI`);

      const prompt = this.buildScriptPrompt(videoAnalysis, platform, businessProfile);
      
      console.log(`📤 Sending script generation request to Gemini`);
      
      const result = await this.model.generateContent(prompt);
      const scriptText = result.response.text();

      console.log(`📥 Received script response (${scriptText.length} chars)`);

      // Parse and structure the scripts
      const structuredScripts = this.parseScriptResult(scriptText, platform, videoAnalysis);

      console.log(`✅ Generated ${structuredScripts.scripts.length} script variations`);

      return structuredScripts;

    } catch (error) {
      console.error('❌ Gemini script generation failed:', error);
      throw new Error(`Script generation failed: ${error.message}`);
    }
  }

  buildScriptPrompt(videoAnalysis, platform, businessProfile) {
    const platformSpecs = {
      instagram: {
        maxLength: 125,
        hookLength: "3-5 words",
        style: "casual, engaging, visual-focused",
        elements: ["strong hook", "visual description", "trending hashtags", "clear CTA"],
        bestPractices: [
          "Start with attention-grabbing hook",
          "Use emojis strategically", 
          "Include 3-5 relevant hashtags",
          "End with clear call-to-action",
          "Keep it concise and scannable"
        ]
      },
      tiktok: {
        maxLength: 100,
        hookLength: "2-4 words",
        style: "trendy, authentic, conversational",
        elements: ["viral hook", "trend participation", "trending hashtags", "engagement bait"],
        bestPractices: [
          "Use trending phrases or sounds",
          "Create curiosity or controversy",
          "Include trending hashtags like #fyp",
          "Ask questions to boost comments",
          "Be authentic and relatable"
        ]
      },
      facebook: {
        maxLength: 250,
        hookLength: "5-8 words",
        style: "informative, community-focused, storytelling",
        elements: ["compelling story", "educational value", "community relevance", "discussion starter"],
        bestPractices: [
          "Tell a complete story",
          "Provide educational value",
          "Ask thought-provoking questions",
          "Use longer-form content",
          "Focus on community building"
        ]
      }
    };

    const spec = platformSpecs[platform] || platformSpecs.instagram;
    
    let businessContext = "";
    if (businessProfile) {
      businessContext = `
BUSINESS CONTEXT:
- Business Type: ${businessProfile.type || 'General'}
- Target Audience: ${businessProfile.audience || 'General audience'}
- Brand Voice: ${businessProfile.voice || 'Professional yet approachable'}
- Key Messages: ${businessProfile.keyMessages || 'Quality, innovation, customer satisfaction'}
- Industry: ${businessProfile.industry || 'General'}
- Unique Value Proposition: ${businessProfile.uvp || 'Delivering exceptional results'}
`;
    }

    return `You are an expert social media copywriter and viral content strategist specializing in ${platform} content that drives massive engagement and conversions.

${businessContext}

VIDEO ANALYSIS INSIGHTS:
- Platform: ${platform}
- Virality Score: ${videoAnalysis.viralityScore}/100
- Hook Strength: ${videoAnalysis.technicalAnalysis?.hookStrength || 'N/A'}/100
- Emotional Impact: ${videoAnalysis.contentAnalysis?.emotionalImpact || 'N/A'}/100
- Shareability: ${videoAnalysis.contentAnalysis?.shareability || 'N/A'}/100
- Key Insights: ${videoAnalysis.insights?.join(', ') || 'General optimization needed'}
- Top Recommendations: ${videoAnalysis.recommendations?.slice(0, 3).join(', ') || 'Improve engagement'}

PLATFORM REQUIREMENTS FOR ${platform.toUpperCase()}:
- Maximum Length: ${spec.maxLength} characters
- Hook Length: ${spec.hookLength}
- Style: ${spec.style}
- Must Include: ${spec.elements.join(', ')}
- Best Practices: ${spec.bestPractices.join(', ')}

TASK: Generate 4 different script variations optimized for ${platform}, each with a distinct strategic approach:

1. VIRAL HOOK VERSION: Maximum attention-grabbing opening designed for instant engagement
2. VALUE-DRIVEN VERSION: Focus on educational/entertainment value with clear benefits
3. ENGAGEMENT-BAIT VERSION: Designed to maximize comments, shares, and saves
4. CONVERSION-FOCUSED VERSION: Optimized for driving specific actions and conversions

For each script, provide:
- Main Script Text (within ${spec.maxLength} character limit)
- Hook (${spec.hookLength})
- Call-to-Action
- Suggested Hashtags (3-5 for Instagram/TikTok, 2-3 for Facebook)
- Expected Performance Prediction
- Target Emotion/Response

IMPORTANT GUIDELINES:
- Each script must be completely different in approach and wording
- Incorporate insights from the video analysis
- Use platform-specific language and trends
- Ensure hooks are irresistible and scroll-stopping
- CTAs must be specific and action-oriented
- Consider current viral trends and formats

Format your response as:

VERSION 1: VIRAL HOOK
Script: [script text]
Hook: [hook text]
CTA: [call to action]
Hashtags: [hashtag list]
Performance: [predicted engagement rate and reach]
Target Emotion: [primary emotion to evoke]

VERSION 2: VALUE-DRIVEN
Script: [script text]
Hook: [hook text]
CTA: [call to action]
Hashtags: [hashtag list]
Performance: [predicted engagement rate and reach]
Target Emotion: [primary emotion to evoke]

VERSION 3: ENGAGEMENT-BAIT
Script: [script text]
Hook: [hook text]
CTA: [call to action]
Hashtags: [hashtag list]
Performance: [predicted engagement rate and reach]
Target Emotion: [primary emotion to evoke]

VERSION 4: CONVERSION-FOCUSED
Script: [script text]
Hook: [hook text]
CTA: [call to action]
Hashtags: [hashtag list]
Performance: [predicted engagement rate and reach]
Target Emotion: [primary emotion to evoke]

Make each version compelling, platform-optimized, and designed for maximum impact based on the video analysis insights.`;
  }

  parseScriptResult(scriptText, platform, videoAnalysis) {
    try {
      const scripts = [];
      const versions = scriptText.split(/VERSION \d+:/i);
      
      // Remove empty first element
      versions.shift();

      versions.forEach((version, index) => {
        const versionNumber = index + 1;
        const versionType = this.extractVersionType(version);
        
        const script = this.extractField(version, 'Script');
        const hook = this.extractField(version, 'Hook');
        const cta = this.extractField(version, 'CTA');
        const hashtags = this.extractHashtags(version);
        const performance = this.extractField(version, 'Performance');
        const targetEmotion = this.extractField(version, 'Target Emotion') || this.extractField(version, 'Emotion');

        if (script && script.length > 10) {
          scripts.push({
            id: `${platform}_gemini_v${versionNumber}`,
            version: versionNumber,
            type: versionType,
            platform: platform,
            script: script.trim(),
            hook: hook?.trim() || this.generateFallbackHook(script, platform),
            cta: cta?.trim() || this.generateFallbackCTA(platform),
            hashtags: hashtags.length > 0 ? hashtags : this.getDefaultHashtags(platform),
            predictedPerformance: this.parsePerformance(performance, videoAnalysis, versionType),
            targetEmotion: targetEmotion?.trim() || 'Engagement',
            characterCount: script.length,
            optimizationScore: this.calculateOptimizationScore(script, platform),
            viralityPotential: this.calculateViralityPotential(script, versionType, videoAnalysis),
            generatedAt: new Date().toISOString(),
            geminiGenerated: true
          });
        }
      });

      // If parsing failed, create enhanced default scripts
      if (scripts.length === 0) {
        scripts.push(...this.createEnhancedDefaultScripts(platform, videoAnalysis));
      }

      return {
        platform: platform,
        totalVersions: scripts.length,
        scripts: scripts,
        metadata: {
          baseViralityScore: videoAnalysis.viralityScore,
          analysisInsights: videoAnalysis.insights || [],
          generatedAt: new Date().toISOString(),
          rawResponse: scriptText,
          geminiModel: "gemini-1.5-flash"
        }
      };

    } catch (error) {
      console.error('❌ Error parsing script result:', error);
      
      // Return enhanced default scripts if parsing fails
      return {
        platform: platform,
        totalVersions: 4,
        scripts: this.createEnhancedDefaultScripts(platform, videoAnalysis),
        metadata: {
          baseViralityScore: videoAnalysis.viralityScore,
          generatedAt: new Date().toISOString(),
          rawResponse: scriptText,
          parseError: error.message,
          fallbackUsed: true
        }
      };
    }
  }

  extractVersionType(versionText) {
    const text = versionText.toLowerCase();
    if (text.includes('viral hook')) return 'Viral Hook';
    if (text.includes('value-driven') || text.includes('value driven')) return 'Value-Driven';
    if (text.includes('engagement-bait') || text.includes('engagement bait')) return 'Engagement-Bait';
    if (text.includes('conversion-focused') || text.includes('conversion focused')) return 'Conversion-Focused';
    return 'Standard';
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

  extractHashtags(text) {
    const hashtagSection = this.extractField(text, 'Hashtags');
    if (!hashtagSection) return [];

    // Extract hashtags from the section
    const hashtagRegex = /#[\w]+/g;
    const matches = hashtagSection.match(hashtagRegex);
    
    if (matches) {
      return [...new Set(matches)].slice(0, 6); // Remove duplicates, limit to 6
    }

    // If no # symbols, split by commas and add #
    const tags = hashtagSection.split(/[,\s]+/).map(tag => {
      const cleaned = tag.trim().replace(/^#/, '').replace(/[^\w]/g, '');
      return cleaned ? `#${cleaned}` : null;
    }).filter(Boolean);

    return tags.slice(0, 6);
  }

  parsePerformance(performanceText, videoAnalysis, versionType) {
    if (!performanceText) {
      return this.generateEnhancedPerformance(videoAnalysis, versionType);
    }

    // Extract engagement rate
    const engagementMatch = performanceText.match(/(\d+(?:\.\d+)?)%/);
    const engagementRate = engagementMatch ? parseFloat(engagementMatch[1]) : this.calculateBaseEngagement(videoAnalysis, versionType);

    // Extract reach numbers
    const reachMatch = performanceText.match(/(\d+(?:,\d+)*)/);
    const estimatedReach = reachMatch ? parseInt(reachMatch[1].replace(/,/g, '')) : this.calculateBaseReach(videoAnalysis, versionType);

    return {
      estimatedEngagementRate: engagementRate,
      estimatedReach: estimatedReach,
      confidenceLevel: this.calculateConfidenceLevel(videoAnalysis, versionType),
      factors: this.getPerformanceFactors(versionType),
      viralityBoost: this.calculateViralityBoost(versionType, videoAnalysis)
    };
  }

  generateEnhancedPerformance(videoAnalysis, versionType) {
    const baseEngagement = this.calculateBaseEngagement(videoAnalysis, versionType);
    const baseReach = this.calculateBaseReach(videoAnalysis, versionType);
    
    return {
      estimatedEngagementRate: baseEngagement,
      estimatedReach: baseReach,
      confidenceLevel: this.calculateConfidenceLevel(videoAnalysis, versionType),
      factors: this.getPerformanceFactors(versionType),
      viralityBoost: this.calculateViralityBoost(versionType, videoAnalysis)
    };
  }

  calculateBaseEngagement(videoAnalysis, versionType) {
    const baseRate = 4.0;
    const viralityMultiplier = (videoAnalysis.viralityScore || 50) / 50;
    
    const typeMultipliers = {
      'Viral Hook': 1.4,
      'Value-Driven': 1.1,
      'Engagement-Bait': 1.6,
      'Conversion-Focused': 1.0
    };
    
    const typeMultiplier = typeMultipliers[versionType] || 1.0;
    
    return Math.round((baseRate * viralityMultiplier * typeMultiplier) * 10) / 10;
  }

  calculateBaseReach(videoAnalysis, versionType) {
    const baseReach = videoAnalysis.predictions?.estimatedReach || 1200;
    
    const typeMultipliers = {
      'Viral Hook': 1.5,
      'Value-Driven': 1.1,
      'Engagement-Bait': 1.3,
      'Conversion-Focused': 0.9
    };
    
    const typeMultiplier = typeMultipliers[versionType] || 1.0;
    
    return Math.round(baseReach * typeMultiplier);
  }

  calculateConfidenceLevel(videoAnalysis, versionType) {
    const baseConfidence = videoAnalysis.confidence || 70;
    
    if (baseConfidence >= 80) return 'High';
    if (baseConfidence >= 60) return 'Medium';
    return 'Low';
  }

  getPerformanceFactors(versionType) {
    const factors = {
      'Viral Hook': ['Hook strength', 'Scroll-stopping power', 'Curiosity gap'],
      'Value-Driven': ['Educational value', 'Practical benefits', 'Authority building'],
      'Engagement-Bait': ['Comment triggers', 'Share motivation', 'Discussion starters'],
      'Conversion-Focused': ['Clear CTA', 'Value proposition', 'Trust signals']
    };
    
    return factors[versionType] || ['Content quality', 'Platform optimization', 'Timing'];
  }

  calculateViralityBoost(versionType, videoAnalysis) {
    const baseScore = videoAnalysis.viralityScore || 50;
    
    const boosts = {
      'Viral Hook': 15,
      'Value-Driven': 8,
      'Engagement-Bait': 12,
      'Conversion-Focused': 5
    };
    
    return boosts[versionType] || 0;
  }

  calculateOptimizationScore(script, platform) {
    let score = 60; // Base score

    const platformLimits = {
      instagram: 125,
      tiktok: 100,
      facebook: 250
    };

    const limit = platformLimits[platform] || 125;
    
    // Length optimization
    if (script.length <= limit) score += 15;
    else score -= 10;

    // Hashtag presence
    if (script.includes('#')) score += 10;

    // Call-to-action keywords
    const ctaKeywords = ['click', 'follow', 'share', 'comment', 'like', 'save', 'watch', 'learn', 'try', 'get'];
    if (ctaKeywords.some(keyword => script.toLowerCase().includes(keyword))) {
      score += 15;
    }

    // Engagement words
    const engagementWords = ['you', 'your', 'how', 'why', 'what', 'when', 'where', 'this', 'secret'];
    const engagementCount = engagementWords.filter(word => 
      script.toLowerCase().includes(word)
    ).length;
    score += Math.min(engagementCount * 2, 10);

    // Emoji usage
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
    if (script.match(emojiRegex)) score += 5;

    return Math.min(Math.max(score, 0), 100);
  }

  calculateViralityPotential(script, versionType, videoAnalysis) {
    const baseScore = videoAnalysis.viralityScore || 50;
    const optimizationScore = this.calculateOptimizationScore(script, 'general');
    
    const typeBoosts = {
      'Viral Hook': 20,
      'Value-Driven': 10,
      'Engagement-Bait': 15,
      'Conversion-Focused': 8
    };
    
    const boost = typeBoosts[versionType] || 0;
    const potential = Math.round((baseScore + optimizationScore + boost) / 3);
    
    return Math.min(Math.max(potential, 0), 100);
  }

  generateFallbackHook(script, platform) {
    const words = script.split(' ').slice(0, 4);
    return words.join(' ') + (words.length >= 4 ? '...' : '');
  }

  generateFallbackCTA(platform) {
    const ctas = {
      instagram: 'Save this post!',
      tiktok: 'Follow for more!',
      facebook: 'What do you think?'
    };
    
    return ctas[platform] || 'Engage with this content!';
  }

  createEnhancedDefaultScripts(platform, videoAnalysis) {
    const viralityScore = videoAnalysis.viralityScore || 50;
    const insights = videoAnalysis.insights || [];
    
    const platformDefaults = {
      instagram: {
        scripts: [
          {
            script: "🔥 This changes everything! The results speak for themselves... What's your biggest challenge? Drop it below! 👇 #transformation #results #viral",
            hook: "🔥 This changes everything!",
            cta: "Drop it below! 👇",
            type: "Viral Hook",
            emotion: "Excitement"
          },
          {
            script: "💡 Here's what 90% of people don't know... This strategy helped us achieve incredible results. Save this for later! #tips #strategy #knowledge",
            hook: "💡 Here's what 90% don't know...",
            cta: "Save this for later!",
            type: "Value-Driven", 
            emotion: "Curiosity"
          },
          {
            script: "✨ You won't believe what happened next! This story will change your perspective. Tag someone who needs to see this! #inspiration #story #mindblown",
            hook: "✨ You won't believe...",
            cta: "Tag someone!",
            type: "Engagement-Bait",
            emotion: "Surprise"
          },
          {
            script: "Ready to transform your results? This proven method works every time. Click the link in bio to get started! #transformation #proven #results",
            hook: "Ready to transform?",
            cta: "Click link in bio!",
            type: "Conversion-Focused",
            emotion: "Motivation"
          }
        ]
      },
      tiktok: {
        scripts: [
          {
            script: "POV: You discover the secret everyone's using 🤯 This is why it works... #fyp #viral #secret #mindblown",
            hook: "POV: You discover...",
            cta: "Follow for more secrets!",
            type: "Viral Hook",
            emotion: "Shock"
          },
          {
            script: "Here's how to actually do it right ✨ Most people get this wrong... #tutorial #howto #tips #fyp",
            hook: "Here's how to...",
            cta: "Try this method!",
            type: "Value-Driven",
            emotion: "Learning"
          },
          {
            script: "Wait for it... 😱 The plot twist nobody saw coming! Who else didn't expect this? #waitforit #plottwist #fyp",
            hook: "Wait for it... 😱",
            cta: "Comment your reaction!",
            type: "Engagement-Bait",
            emotion: "Anticipation"
          },
          {
            script: "This changed my life in 30 days 🚀 Link in bio for the full method! #transformation #lifehack #results #fyp",
            hook: "This changed my life...",
            cta: "Link in bio!",
            type: "Conversion-Focused",
            emotion: "Hope"
          }
        ]
      },
      facebook: {
        scripts: [
          {
            script: "I never thought this would work until I tried it myself. Here's what happened when we implemented this strategy and how it completely changed our results. The best part? Anyone can do this. What's been your experience?",
            hook: "I never thought this would work...",
            cta: "Share your experience!",
            type: "Viral Hook",
            emotion: "Relatability"
          },
          {
            script: "After months of research, we finally found the solution that works. This comprehensive approach helped us achieve results we never thought possible. Here's the complete breakdown and how you can apply it too.",
            hook: "After months of research...",
            cta: "Read the full breakdown!",
            type: "Value-Driven",
            emotion: "Authority"
          },
          {
            script: "This story will change how you think about problem-solving. When we faced this challenge, we had to get creative. The results exceeded all expectations. Have you faced similar challenges? Let's discuss!",
            hook: "This story will change...",
            cta: "Let's discuss in comments!",
            type: "Engagement-Bait",
            emotion: "Community"
          },
          {
            script: "Ready to see real results? This proven system has helped thousands achieve their goals. We're offering a free consultation to show you exactly how it works. Book your call today!",
            hook: "Ready to see real results?",
            cta: "Book your free call!",
            type: "Conversion-Focused",
            emotion: "Opportunity"
          }
        ]
      }
    };

    const defaults = platformDefaults[platform] || platformDefaults.instagram;
    
    return defaults.scripts.map((scriptData, index) => ({
      id: `${platform}_enhanced_v${index + 1}`,
      version: index + 1,
      type: scriptData.type,
      platform: platform,
      script: scriptData.script,
      hook: scriptData.hook,
      cta: scriptData.cta,
      hashtags: this.getDefaultHashtags(platform),
      predictedPerformance: this.generateEnhancedPerformance(videoAnalysis, scriptData.type),
      targetEmotion: scriptData.emotion,
      characterCount: scriptData.script.length,
      optimizationScore: this.calculateOptimizationScore(scriptData.script, platform),
      viralityPotential: this.calculateViralityPotential(scriptData.script, scriptData.type, videoAnalysis),
      generatedAt: new Date().toISOString(),
      isEnhancedDefault: true
    }));
  }

  getDefaultHashtags(platform) {
    const defaultTags = {
      instagram: ['#content', '#viral', '#trending', '#instagram', '#reels'],
      tiktok: ['#fyp', '#viral', '#trending', '#tiktok', '#foryou'],
      facebook: ['#content', '#community', '#engagement', '#facebook', '#video']
    };

    return defaultTags[platform] || defaultTags.instagram;
  }
}

module.exports = GeminiScriptGenerator;

