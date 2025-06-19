// UTILIDADES COMUNES PARA APIs DE REDES SOCIALES
export class APIClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// RATE LIMITER PARA RESPETAR LÍMITES DE APIs
export class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async checkLimit() {
    const now = Date.now();
    
    // Limpiar requests antiguos
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest);
      
      console.log(`Rate limit reached. Waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      return this.checkLimit();
    }

    this.requests.push(now);
    return true;
  }
}

// MANEJO DE ERRORES ESTÁNDAR
export class SocialMediaAPIError extends Error {
  constructor(message, platform, statusCode, originalError) {
    super(message);
    this.name = 'SocialMediaAPIError';
    this.platform = platform;
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

// UTILIDADES DE FORMATEO DE DATOS
export const formatSocialData = {
  instagram: (data) => ({
    id: data.id,
    username: data.username,
    accountType: data.account_type,
    mediaCount: data.media_count,
    profilePicture: data.profile_picture_url,
    website: data.website,
    bio: data.biography,
    followersCount: data.followers_count,
    followingCount: data.follows_count,
    platform: 'instagram'
  }),

  facebook: (data) => ({
    id: data.id,
    name: data.name,
    category: data.category,
    about: data.about,
    website: data.website,
    fanCount: data.fan_count,
    talkingAboutCount: data.talking_about_count,
    picture: data.picture?.data?.url,
    platform: 'facebook'
  }),

  youtube: (data) => ({
    id: data.id,
    title: data.snippet.title,
    description: data.snippet.description,
    customUrl: data.snippet.customUrl,
    publishedAt: data.snippet.publishedAt,
    thumbnails: data.snippet.thumbnails,
    subscriberCount: data.statistics.subscriberCount,
    videoCount: data.statistics.videoCount,
    viewCount: data.statistics.viewCount,
    platform: 'youtube'
  }),

  twitter: (data) => ({
    id: data.id,
    username: data.username,
    name: data.name,
    description: data.description,
    profileImageUrl: data.profile_image_url,
    publicMetrics: data.public_metrics,
    verified: data.verified,
    website: data.entities?.url?.urls?.[0]?.expanded_url,
    platform: 'twitter'
  })
};

// VALIDADORES DE TOKENS
export const validateTokens = {
  instagram: (accessToken) => {
    return accessToken && accessToken.length > 50;
  },

  facebook: (accessToken) => {
    return accessToken && accessToken.length > 50;
  },

  youtube: (apiKey) => {
    return apiKey && apiKey.startsWith('AIza');
  },

  twitter: (bearerToken) => {
    return bearerToken && bearerToken.length > 100;
  }
};

