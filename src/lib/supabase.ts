import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vvgymmgcjimnkodqqluk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3ltbWdjamltbmtvZHFxbHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjAxOTcsImV4cCI6MjA2NTQzNjE5N30.c7BwpVVI0xk8x79uWJS-vXSO0Bf4gdtq2OfBu-ps3cc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =====================================================
// FUNCIONES PARA PLATFORM CONNECTIONS
// =====================================================

export const platformConnections = {
  // Crear nueva conexión OAuth
  async create(clientId: string, platform: string, tokenData: any) {
    const { data, error } = await supabase
      .from('platform_connections')
      .insert({
        client_id: clientId,
        platform: platform,
        platform_user_id: tokenData.user_id,
        platform_username: tokenData.username,
        access_token: tokenData.access_token, // En producción, encriptar
        refresh_token: tokenData.refresh_token,
        token_expires_at: tokenData.expires_at,
        scopes: tokenData.scopes || [],
        connection_metadata: tokenData.metadata || {},
        connection_ip: tokenData.ip,
        user_agent: tokenData.user_agent
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Obtener conexiones del cliente
  async getByClient(clientId: string) {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Actualizar token
  async updateToken(connectionId: string, tokenData: any) {
    const { data, error } = await supabase
      .from('platform_connections')
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: tokenData.expires_at,
        last_sync: new Date().toISOString()
      })
      .eq('id', connectionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Desconectar plataforma
  async disconnect(connectionId: string) {
    const { error } = await supabase
      .from('platform_connections')
      .update({ is_active: false })
      .eq('id', connectionId)
    
    if (error) throw error
  }
}

// =====================================================
// FUNCIONES PARA UNIFIED METRICS
// =====================================================

export const unifiedMetrics = {
  // Crear métricas para un post
  async create(data: any) {
    const { data: result, error } = await supabase
      .from('unified_metrics')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  },

  // Obtener métricas por cliente
  async getByClient(clientId: string, platform?: string) {
    let query = supabase
      .from('unified_metrics')
      .select(`
        *,
        generated_scripts(title, content),
        platform_connections(platform_username)
      `)
      .eq('client_id', clientId)
      .order('published_at', { ascending: false })
    
    if (platform) {
      query = query.eq('platform', platform)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  // Obtener métricas agregadas
  async getAggregated(clientId: string, dateRange?: { from: string, to: string }) {
    let query = supabase
      .from('unified_metrics')
      .select('*')
      .eq('client_id', clientId)
    
    if (dateRange) {
      query = query
        .gte('published_at', dateRange.from)
        .lte('published_at', dateRange.to)
    }
    
    const { data, error } = await query
    if (error) throw error
    
    // Calcular métricas agregadas
    const metrics = data || []
    return {
      total_posts: metrics.length,
      total_views: metrics.reduce((sum, m) => sum + (m.views || 0), 0),
      total_likes: metrics.reduce((sum, m) => sum + (m.likes || 0), 0),
      total_shares: metrics.reduce((sum, m) => sum + (m.shares || 0), 0),
      total_comments: metrics.reduce((sum, m) => sum + (m.comments || 0), 0),
      avg_engagement_rate: metrics.length > 0 
        ? metrics.reduce((sum, m) => sum + (m.engagement_rate || 0), 0) / metrics.length 
        : 0,
      best_performing_platform: this.getBestPlatform(metrics),
      platforms: [...new Set(metrics.map(m => m.platform))]
    }
  },

  getBestPlatform(metrics: any[]) {
    const platformStats = metrics.reduce((acc, metric) => {
      const platform = metric.platform
      if (!acc[platform]) {
        acc[platform] = { total_engagement: 0, count: 0 }
      }
      acc[platform].total_engagement += metric.engagement_rate || 0
      acc[platform].count += 1
      return acc
    }, {} as any)

    let bestPlatform = null
    let bestAvg = 0

    Object.entries(platformStats).forEach(([platform, stats]: [string, any]) => {
      const avg = stats.total_engagement / stats.count
      if (avg > bestAvg) {
        bestAvg = avg
        bestPlatform = platform
      }
    })

    return bestPlatform
  }
}

// =====================================================
// FUNCIONES PARA USER PREFERENCES
// =====================================================

export const userPreferences = {
  // Obtener preferencias del usuario
  async get(clientId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('client_id', clientId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Crear o actualizar preferencias
  async upsert(clientId: string, preferences: any) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        client_id: clientId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// =====================================================
// FUNCIONES PARA AI MODEL USAGE
// =====================================================

export const aiModelUsage = {
  // Registrar uso de modelo IA
  async track(data: any) {
    const { data: result, error } = await supabase
      .from('ai_model_usage')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  },

  // Obtener estadísticas de uso
  async getStats(clientId: string, dateRange?: { from: string, to: string }) {
    let query = supabase
      .from('ai_model_usage')
      .select('*')
      .eq('client_id', clientId)
    
    if (dateRange) {
      query = query
        .gte('created_at', dateRange.from)
        .lte('created_at', dateRange.to)
    }
    
    const { data, error } = await query
    if (error) throw error
    
    const usage = data || []
    return {
      total_generations: usage.length,
      total_cost: usage.reduce((sum, u) => sum + (u.cost_usd || 0), 0),
      avg_generation_time: usage.length > 0 
        ? usage.reduce((sum, u) => sum + (u.generation_time_seconds || 0), 0) / usage.length 
        : 0,
      model_breakdown: this.getModelBreakdown(usage),
      avg_user_rating: usage.filter(u => u.user_rating).length > 0
        ? usage.filter(u => u.user_rating).reduce((sum, u) => sum + u.user_rating, 0) / usage.filter(u => u.user_rating).length
        : 0
    }
  },

  getModelBreakdown(usage: any[]) {
    return usage.reduce((acc, u) => {
      const model = u.ai_model_name
      if (!acc[model]) {
        acc[model] = { count: 0, total_cost: 0, avg_rating: 0, ratings: [] }
      }
      acc[model].count += 1
      acc[model].total_cost += u.cost_usd || 0
      if (u.user_rating) {
        acc[model].ratings.push(u.user_rating)
      }
      return acc
    }, {} as any)
  }
}

// =====================================================
// FUNCIONES PARA PLATFORM INSIGHTS
// =====================================================

export const platformInsights = {
  // Obtener insights del cliente
  async getByClient(clientId: string, platform?: string) {
    let query = supabase
      .from('platform_insights')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (platform) {
      query = query.eq('platform', platform)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  // Crear nuevo insight
  async create(data: any) {
    const { data: result, error } = await supabase
      .from('platform_insights')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  },

  // Marcar insight como implementado
  async markImplemented(insightId: string, actualImprovement?: number) {
    const { data, error } = await supabase
      .from('platform_insights')
      .update({
        status: 'implemented',
        user_action: 'implemented',
        actual_improvement_percentage: actualImprovement
      })
      .eq('id', insightId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// =====================================================
// FUNCIONES OAUTH HELPERS
// =====================================================

export const oauthHelpers = {
  // URLs de OAuth por plataforma
  getOAuthURL(platform: string, clientId: string, redirectUri: string) {
    const baseUrls = {
      facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
      twitter: 'https://twitter.com/i/oauth2/authorize',
      tiktok: 'https://www.tiktok.com/auth/authorize/'
    }

    const scopes = {
      facebook: 'pages_read_engagement,pages_show_list,instagram_basic,instagram_manage_insights',
      google: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.analytics.readonly',
      linkedin: 'r_organization_social rw_organization_admin',
      twitter: 'tweet.read users.read offline.access',
      tiktok: 'user.info.basic video.list'
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes[platform as keyof typeof scopes] || '',
      response_type: 'code',
      state: `${platform}_${Date.now()}`
    })

    return `${baseUrls[platform as keyof typeof baseUrls]}?${params.toString()}`
  },

  // Intercambiar código por token
  async exchangeCodeForToken(platform: string, code: string, clientId: string, clientSecret: string, redirectUri: string) {
    // Esta función se implementaría en el backend por seguridad
    // Por ahora, simulamos la respuesta
    return {
      access_token: `${platform}_token_${Date.now()}`,
      refresh_token: `${platform}_refresh_${Date.now()}`,
      expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hora
      user_id: `${platform}_user_${Date.now()}`,
      username: `user_${platform}`,
      scopes: ['read', 'analytics']
    }
  }
}

// =====================================================
// N8N WEBHOOK URLS
// =====================================================

export const N8N_WEBHOOKS = {
  generateScript: 'http://100.66.200.59:5678/webhook/generate-script',
  manageClient: 'http://100.66.200.59:5678/webhook/manage-client'
}

// =====================================================
// API HELPER FUNCTIONS (LEGACY + NEW)
// =====================================================

export const api = {
  // Generar script usando N8N con nuevos modelos IA
  generateScript: async (scriptData: {
    topic: string
    platform: string
    tone: string
    aiModel: 'scriptmaster' | 'analyticsbrain' | 'trendhunter'
    language: 'en' | 'es'
    clientId: string
  }) => {
    try {
      // Mapear modelos rebrandeados a providers reales
      const modelMapping = {
        scriptmaster: { provider: 'openai', model: 'gpt-4' },
        analyticsbrain: { provider: 'anthropic', model: 'claude-3-sonnet' },
        trendhunter: { provider: 'google', model: 'gemini-pro' }
      }

      const modelConfig = modelMapping[scriptData.aiModel]

      // Registrar uso del modelo
      await aiModelUsage.track({
        client_id: scriptData.clientId,
        ai_model_name: scriptData.aiModel,
        underlying_provider: modelConfig.provider,
        underlying_model: modelConfig.model,
        script_type: scriptData.platform,
        complexity_level: 3 // Calculado basado en el prompt
      })

      // Llamar a N8N webhook
      const response = await fetch(N8N_WEBHOOKS.generateScript, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...scriptData,
          provider: modelConfig.provider,
          model: modelConfig.model
        })
      })

      if (!response.ok) {
        throw new Error('Error generating script')
      }

      const result = await response.json()
      
      // Guardar script generado con nuevo modelo
      const { data: script, error } = await supabase
        .from('generated_scripts')
        .insert({
          client_id: scriptData.clientId,
          title: `${scriptData.platform} - ${scriptData.topic}`,
          content: result.content,
          ai_model: modelConfig.model,
          ai_model_rebranded: scriptData.aiModel,
          language_code: scriptData.language,
          platform_specific_optimizations: result.optimizations || {},
          hashtags: result.hashtags || [],
          final_word_count: result.content?.length || 0
        })
        .select()
        .single()

      if (error) throw error
      return script

    } catch (error) {
      console.error('Error generating script:', error)
      throw error
    }
  },

  // Gestionar cliente usando N8N
  manageClient: async (clientData: any) => {
    try {
      const response = await fetch(N8N_WEBHOOKS.manageClient, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      })
      return await response.json()
    } catch (error) {
      console.error('Error managing client:', error)
      throw error
    }
  },

  // Obtener scripts del cliente
  getClientScripts: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('generated_scripts')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching scripts:', error)
      throw error
    }
  },

  // Obtener analytics del cliente
  getClientAnalytics: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_analytics')
        .select('*')
        .eq('client_id', clientId)
        .order('period_start', { ascending: false })
        .limit(12) // Últimos 12 meses
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  },

  // Obtener información del cliente
  getClientInfo: async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching client info:', error)
      throw error
    }
  }
}



// =====================================================
// FUNCIONES PARA ANALYTICS Y SETTINGS
// =====================================================

// Obtener métricas unificadas
export const getUnifiedMetrics = async (clientId: string) => {
  const { data, error } = await supabase
    .from('unified_metrics')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
    .limit(30)
  
  if (error) throw error
  return data || []
}

// Obtener insights de plataformas
export const getPlatformInsights = async (clientId: string) => {
  const { data, error } = await supabase
    .from('platform_insights')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error) throw error
  return data || []
}

// Obtener preferencias de usuario
export const getUserPreferences = async (clientId: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('client_id', clientId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Actualizar preferencias de usuario
export const updateUserPreferences = async (clientId: string, preferences: any) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      client_id: clientId,
      ...preferences,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Crear métricas unificadas
export const createUnifiedMetrics = async (clientId: string, metrics: any) => {
  const { data, error } = await supabase
    .from('unified_metrics')
    .insert({
      client_id: clientId,
      ...metrics
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Crear insight de plataforma
export const createPlatformInsight = async (clientId: string, insight: any) => {
  const { data, error } = await supabase
    .from('platform_insights')
    .insert({
      client_id: clientId,
      ...insight
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

