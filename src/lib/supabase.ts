import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vvgymmgcjimnkodqqluk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3ltbWdjamltbmtvZHFxbHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjAxOTcsImV4cCI6MjA2NTQzNjE5N30.c7BwpVVI0xk8x79uWJS-vXSO0Bf4gdtq2OfBu-ps3cc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// N8N Webhook URLs
export const N8N_WEBHOOKS = {
  generateScript: 'http://100.66.200.59:5678/webhook/generate-script',
  manageClient: 'http://100.66.200.59:5678/webhook/manage-client'
}

// API Helper Functions
export const api = {
  // Generar script usando N8N
  generateScript: async (scriptData: any) => {
    try {
      const response = await fetch(N8N_WEBHOOKS.generateScript, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scriptData)
      })
      return await response.json()
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

