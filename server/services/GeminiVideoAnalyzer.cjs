const fs = require('fs');
const path = require('path');

class GeminiVideoAnalyzer {
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

  async analyzeVideo(videoPath, platform = 'instagram') {
    try {
      console.log(`🔍 Starting Gemini analysis for ${videoPath} on ${platform}`);

      // Read video file
      const videoBuffer = fs.readFileSync(videoPath);
      const videoBase64 = videoBuffer.toString('base64');

      // Build platform-specific analysis prompt
      const prompt = this.buildAnalysisPrompt(platform);

      console.log(`📤 Sending video to Gemini API (${Math.round(videoBuffer.length / 1024)}KB)`);

      // Analyze with Gemini
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: videoBase64,
            mimeType: "video/mp4"
          }
        }
      ]);

      const analysisText = result.response.text();
      console.log(`📥 Received Gemini response (${analysisText.length} chars)`);

      // Parse and structure the analysis
      const structuredAnalysis = this.parseAnalysisResult(analysisText, platform);

      console.log(`✅ Analysis complete - Virality Score: ${structuredAnalysis.viralityScore}/100`);

      return structuredAnalysis;

    } catch (error) {
      console.error('❌ Gemini video analysis failed:', error);
      throw new Error(`Video analysis failed: ${error.message}`);
    }
  }

  buildAnalysisPrompt(platform) {
    const platformSpecs = {
      instagram: {
        optimalDuration: "7-15 seconds",
        aspectRatio: "9:16 (vertical)",
        keyMetrics: ["saves", "shares", "comments", "watch_time"],
        viralElements: ["trending_audio", "hashtags", "visual_hooks", "story_structure"],
        bestPractices: [
          "Strong hook in first 3 seconds",
          "Subtitles for accessibility", 
          "High visual quality",
          "Trending audio usage",
          "Clear call-to-action"
        ]
      },
      tiktok: {
        optimalDuration: "15-30 seconds (sweet spot: 21 seconds)",
        aspectRatio: "9:16 (vertical)",
        keyMetrics: ["completion_rate", "velocity", "shares", "comments"],
        viralElements: ["trends", "sounds", "effects", "challenges", "POV_format"],
        bestPractices: [
          "Participate in current trends",
          "Use trending sounds",
          "Quick cuts and transitions", 
          "Engaging thumbnail",
          "Hook-tension-resolution structure"
        ]
      },
      facebook: {
        optimalDuration: "1-3 minutes (ideal: 90 seconds)",
        aspectRatio: "1:1 (square) or 4:5",
        keyMetrics: ["watch_time", "shares", "reactions", "comments"],
        viralElements: ["emotional_content", "educational_value", "community_relevance", "storytelling"],
        bestPractices: [
          "Captions/subtitles required",
          "Strong emotional hook",
          "Educational or entertaining value",
          "Community-focused content", 
          "Longer narrative structure"
        ]
      }
    };

    const spec = platformSpecs[platform] || platformSpecs.instagram;

    return `You are an expert social media analyst specializing in ${platform} content optimization with access to real-time viral content data.

Analyze this video comprehensively for ${platform} and provide a detailed assessment:

TECHNICAL ANALYSIS:
- Video duration vs optimal length for ${platform} (target: ${spec.optimalDuration})
- Aspect ratio and format optimization (target: ${spec.aspectRatio})
- Video quality, resolution, and visual clarity assessment
- Audio quality, clarity, and background noise evaluation
- Subtitle presence and readability check

CONTENT ANALYSIS:
- Hook effectiveness in first 3 seconds (CRITICAL for retention)
- Overall narrative structure and pacing evaluation
- Visual appeal and composition quality
- Emotional impact and engagement potential
- Call-to-action presence and effectiveness

PLATFORM OPTIMIZATION FOR ${platform.toUpperCase()}:
- Alignment with best practices: ${spec.bestPractices.join(', ')}
- Trending elements usage: ${spec.viralElements.join(', ')}
- Audience targeting and relevance
- Shareability and comment-worthiness

VIRALITY PREDICTION:
- Overall viral potential score (0-100) with confidence level
- Key success factors identified
- Potential weaknesses or improvement areas
- Estimated reach and engagement prediction
- Time-to-viral estimation

ACTIONABLE RECOMMENDATIONS:
- 5 specific improvements for better performance
- Hashtag suggestions optimized for ${platform}
- Optimal posting time recommendations
- Content variations to A/B test

Provide your analysis in a structured format with specific scores and actionable insights. Focus on what makes content go viral on ${platform} specifically.`;
  }

  parseAnalysisResult(analysisText, platform) {
    try {
      // Extract key metrics using enhanced regex patterns
      const viralityScore = this.extractScore(analysisText, /viral.*?(?:score|potential).*?(\d+)/i) || 
                           this.extractScore(analysisText, /score.*?(\d+)/i) || 
                           this.calculateViralityFromText(analysisText);

      const hookStrength = this.extractScore(analysisText, /hook.*?(?:strength|effectiveness).*?(\d+)/i) || 
                          this.assessHookFromText(analysisText);

      const technicalQuality = this.extractScore(analysisText, /(?:technical|video).*?quality.*?(\d+)/i) || 
                              this.assessQualityFromText(analysisText);

      // Extract recommendations with better parsing
      const recommendations = this.extractRecommendations(analysisText);

      // Extract hashtags if mentioned
      const hashtags = this.extractHashtags(analysisText);

      // Calculate confidence based on analysis depth
      const confidence = this.calculateConfidence(analysisText);

      // Extract time to viral
      const timeToViral = this.extractTimeToViral(analysisText);

      return {
        platform: platform,
        viralityScore: viralityScore,
        confidence: confidence,
        technicalAnalysis: {
          hookStrength: hookStrength,
          visualQuality: technicalQuality,
          audioQuality: this.assessAudioFromText(analysisText),
          platformOptimization: this.assessPlatformOptimization(analysisText, platform),
          durationOptimization: this.assessDurationFromText(analysisText, platform)
        },
        contentAnalysis: {
          emotionalImpact: this.assessEmotionalImpact(analysisText),
          narrativeStructure: this.assessNarrativeStructure(analysisText),
          shareability: this.assessShareability(analysisText),
          engagement: this.assessEngagement(analysisText),
          trendAlignment: this.assessTrendAlignment(analysisText)
        },
        predictions: {
          estimatedReach: this.calculateEstimatedReach(viralityScore, platform),
          engagementRate: this.calculateEngagementRate(viralityScore),
          timeToViral: timeToViral,
          bestPostingTime: this.getBestPostingTime(platform),
          peakPerformanceWindow: this.calculatePeakWindow(viralityScore)
        },
        recommendations: recommendations,
        hashtags: hashtags,
        insights: this.extractKeyInsights(analysisText),
        rawAnalysis: analysisText,
        analyzedAt: new Date().toISOString(),
        geminiModel: "gemini-1.5-flash"
      };

    } catch (error) {
      console.error('❌ Error parsing analysis result:', error);
      
      // Return enhanced fallback structure
      return this.createFallbackAnalysis(platform, analysisText, error);
    }
  }

  extractScore(text, regex) {
    const match = text.match(regex);
    if (match && match[1]) {
      const score = parseInt(match[1]);
      return Math.min(Math.max(score, 0), 100);
    }
    return null;
  }

  calculateViralityFromText(text) {
    const lowerText = text.toLowerCase();
    let score = 50; // Start with neutral
    
    // Positive indicators
    const positiveWords = ['excellent', 'outstanding', 'strong', 'effective', 'engaging', 'viral', 'trending', 'compelling', 'captivating'];
    const negativeWords = ['poor', 'weak', 'lacking', 'needs improvement', 'unclear', 'low quality', 'boring', 'ineffective'];
    
    positiveWords.forEach(word => {
      const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
      score += matches * 6;
    });
    
    negativeWords.forEach(word => {
      const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
      score -= matches * 8;
    });
    
    // Bonus for specific viral indicators
    if (lowerText.includes('high viral potential')) score += 15;
    if (lowerText.includes('likely to go viral')) score += 12;
    if (lowerText.includes('strong hook')) score += 10;
    if (lowerText.includes('trending elements')) score += 8;
    
    return Math.min(Math.max(score, 0), 100);
  }

  assessHookFromText(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('strong hook') || lowerText.includes('effective hook') || lowerText.includes('compelling opening')) {
      return 85;
    } else if (lowerText.includes('weak hook') || lowerText.includes('poor opening') || lowerText.includes('needs better hook')) {
      return 30;
    } else if (lowerText.includes('decent hook') || lowerText.includes('adequate opening')) {
      return 65;
    }
    return 60;
  }

  assessQualityFromText(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('high quality') || lowerText.includes('excellent quality') || lowerText.includes('professional quality')) {
      return 90;
    } else if (lowerText.includes('low quality') || lowerText.includes('poor quality') || lowerText.includes('needs improvement')) {
      return 35;
    } else if (lowerText.includes('good quality') || lowerText.includes('decent quality')) {
      return 75;
    }
    return 65;
  }

  assessAudioFromText(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('clear audio') || lowerText.includes('good audio') || lowerText.includes('excellent sound')) {
      return 85;
    } else if (lowerText.includes('poor audio') || lowerText.includes('unclear audio') || lowerText.includes('audio issues')) {
      return 40;
    } else if (lowerText.includes('decent audio') || lowerText.includes('adequate sound')) {
      return 70;
    }
    return 60;
  }

  assessPlatformOptimization(text, platform) {
    const lowerText = text.toLowerCase();
    const platformKeywords = {
      instagram: ['reels', 'stories', 'hashtags', 'vertical', 'saves', 'shares'],
      tiktok: ['fyp', 'trending', 'sounds', 'effects', 'completion rate', 'velocity'],
      facebook: ['watch', 'shares', 'community', 'captions', 'reactions', 'engagement']
    };
    
    const keywords = platformKeywords[platform] || [];
    let score = 50;
    
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) score += 8;
    });
    
    // Platform-specific optimizations
    if (lowerText.includes(`optimized for ${platform}`)) score += 15;
    if (lowerText.includes('platform best practices')) score += 10;
    
    return Math.min(score, 100);
  }

  assessDurationFromText(text, platform) {
    const lowerText = text.toLowerCase();
    const optimalRanges = {
      instagram: { min: 7, max: 15 },
      tiktok: { min: 15, max: 30 },
      facebook: { min: 60, max: 180 }
    };
    
    const range = optimalRanges[platform] || optimalRanges.instagram;
    
    if (lowerText.includes('optimal duration') || lowerText.includes('perfect length')) {
      return 90;
    } else if (lowerText.includes('too long') || lowerText.includes('too short')) {
      return 40;
    }
    return 70;
  }

  assessEmotionalImpact(text) {
    const emotionalWords = ['emotional', 'inspiring', 'funny', 'touching', 'exciting', 'surprising', 'heartwarming', 'motivational'];
    const lowerText = text.toLowerCase();
    let score = 50;
    
    emotionalWords.forEach(word => {
      if (lowerText.includes(word)) score += 7;
    });
    
    if (lowerText.includes('strong emotional impact')) score += 15;
    if (lowerText.includes('emotionally engaging')) score += 12;
    
    return Math.min(score, 100);
  }

  assessNarrativeStructure(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('clear structure') || lowerText.includes('good pacing') || lowerText.includes('well-structured')) {
      return 80;
    } else if (lowerText.includes('confusing') || lowerText.includes('unclear structure') || lowerText.includes('poor pacing')) {
      return 35;
    } else if (lowerText.includes('decent structure') || lowerText.includes('adequate pacing')) {
      return 65;
    }
    return 60;
  }

  assessShareability(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('highly shareable') || lowerText.includes('viral potential') || lowerText.includes('share-worthy')) {
      return 85;
    } else if (lowerText.includes('not shareable') || lowerText.includes('low viral potential')) {
      return 30;
    } else if (lowerText.includes('moderately shareable')) {
      return 65;
    }
    return 55;
  }

  assessEngagement(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('highly engaging') || lowerText.includes('very engaging') || lowerText.includes('captivating')) {
      return 85;
    } else if (lowerText.includes('not engaging') || lowerText.includes('boring') || lowerText.includes('uninteresting')) {
      return 30;
    } else if (lowerText.includes('engaging') || lowerText.includes('interesting')) {
      return 70;
    }
    return 60;
  }

  assessTrendAlignment(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('trending') || lowerText.includes('current trends') || lowerText.includes('viral trends')) {
      return 80;
    } else if (lowerText.includes('outdated') || lowerText.includes('not trending')) {
      return 35;
    }
    return 55;
  }

  extractRecommendations(text) {
    const recommendations = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      const cleanLine = line.trim();
      if (cleanLine.match(/^[-*•]\s*/) || 
          cleanLine.toLowerCase().includes('recommend') || 
          cleanLine.toLowerCase().includes('suggest') || 
          cleanLine.toLowerCase().includes('improve') ||
          cleanLine.toLowerCase().includes('consider') ||
          cleanLine.toLowerCase().includes('add') ||
          cleanLine.toLowerCase().includes('use')) {
        
        const cleaned = cleanLine.replace(/^[-*•]\s*/, '').trim();
        if (cleaned.length > 15 && cleaned.length < 200) {
          recommendations.push(cleaned);
        }
      }
    });
    
    // Enhanced default recommendations if none found
    if (recommendations.length === 0) {
      recommendations.push(
        "Strengthen the hook in the first 3 seconds to capture attention immediately",
        "Add trending audio or music to increase discoverability",
        "Include clear call-to-action to drive specific user behavior",
        "Optimize video quality and ensure good lighting throughout",
        "Add relevant hashtags to improve reach and categorization"
      );
    }
    
    return recommendations.slice(0, 6); // Limit to 6 recommendations
  }

  extractHashtags(text) {
    const hashtagRegex = /#[\w]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? [...new Set(matches)].slice(0, 10) : [];
  }

  extractTimeToViral(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('2-6 hours') || lowerText.includes('few hours')) return "2-6 hours";
    if (lowerText.includes('6-24 hours') || lowerText.includes('within a day')) return "6-24 hours";
    if (lowerText.includes('1-3 days') || lowerText.includes('couple of days')) return "1-3 days";
    if (lowerText.includes('3+ days') || lowerText.includes('several days')) return "3+ days";
    if (lowerText.includes('immediate') || lowerText.includes('instantly')) return "1-2 hours";
    
    // Default based on virality score
    return "6-24 hours";
  }

  extractKeyInsights(text) {
    const insights = [];
    const lowerText = text.toLowerCase();
    
    // Extract key insights based on content
    if (lowerText.includes('trending')) insights.push("Content aligns with current trends");
    if (lowerText.includes('emotional')) insights.push("Strong emotional appeal detected");
    if (lowerText.includes('hook')) insights.push("Hook effectiveness is crucial for performance");
    if (lowerText.includes('quality')) insights.push("Technical quality impacts viewer retention");
    if (lowerText.includes('engagement')) insights.push("High engagement potential identified");
    
    return insights.length > 0 ? insights : ["Content shows good potential for social media performance"];
  }

  calculateConfidence(text) {
    let confidence = 70; // Base confidence
    
    if (text.length > 800) confidence += 10; // Detailed analysis
    if (text.includes('score') || text.includes('rating')) confidence += 8;
    if (text.includes('recommend')) confidence += 8;
    if (text.includes('specific') || text.includes('detailed')) confidence += 7;
    if (text.includes('analysis') && text.includes('assessment')) confidence += 5;
    
    return Math.min(confidence, 95);
  }

  calculateEstimatedReach(viralityScore, platform) {
    const baseReach = {
      instagram: 1200,
      tiktok: 1800,
      facebook: 900
    };
    
    const base = baseReach[platform] || 1200;
    const multiplier = Math.pow(viralityScore / 50, 1.8);
    
    return Math.round(base * multiplier);
  }

  calculateEngagementRate(viralityScore) {
    const baseRate = 3.5;
    const multiplier = viralityScore / 50;
    
    return Math.round((baseRate * multiplier) * 10) / 10;
  }

  calculatePeakWindow(viralityScore) {
    if (viralityScore >= 80) return "First 6 hours";
    if (viralityScore >= 60) return "First 12 hours";
    if (viralityScore >= 40) return "First 24 hours";
    return "24-48 hours";
  }

  getBestPostingTime(platform) {
    const times = {
      instagram: "11 AM - 1 PM or 7 PM - 9 PM",
      tiktok: "6 AM, 10 AM, 4 PM, or 8 PM",
      facebook: "11 AM - 2 PM or 7 PM - 9 PM"
    };
    
    return times[platform] || times.instagram;
  }

  createFallbackAnalysis(platform, rawText, error) {
    return {
      platform: platform,
      viralityScore: 55,
      confidence: 60,
      technicalAnalysis: {
        hookStrength: 60,
        visualQuality: 65,
        audioQuality: 60,
        platformOptimization: 55,
        durationOptimization: 60
      },
      contentAnalysis: {
        emotionalImpact: 60,
        narrativeStructure: 55,
        shareability: 55,
        engagement: 60,
        trendAlignment: 50
      },
      predictions: {
        estimatedReach: 1200,
        engagementRate: 4.0,
        timeToViral: "6-24 hours",
        bestPostingTime: this.getBestPostingTime(platform),
        peakPerformanceWindow: "First 24 hours"
      },
      recommendations: [
        "Improve video quality and lighting",
        "Add engaging hook in first 3 seconds",
        "Include trending audio or music",
        "Optimize for platform-specific requirements",
        "Add clear call-to-action"
      ],
      hashtags: [],
      insights: ["Analysis completed with basic assessment"],
      rawAnalysis: rawText,
      analyzedAt: new Date().toISOString(),
      geminiModel: "gemini-1.5-flash",
      parseError: error.message
    };
  }
}

module.exports = GeminiVideoAnalyzer;

