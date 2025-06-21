import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permite POST' });
  }

  const {
    topic,
    platform,
    tone,
    targetAudience,
    script,
    hook,
    cta,
    hashtags,
    engagementScore,
    userId
  } = req.body;

  if (!topic || !platform || !script) {
    return res.status(400).json({ 
      error: 'Faltan campos obligatorios: topic, platform o script' 
    });
  }

  try {
    console.log('💾 Guardando script en Supabase...');

    const { data, error } = await supabase
      .from('scripts')
      .insert([
        {
          topic,
          platform,
          tone,
          target_audience: targetAudience || null,
          script,
          hook,
          cta,
          hashtags: Array.isArray(hashtags) ? hashtags : [],
          engagement_score: engagementScore || null,
          user_id: userId || null,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }

    console.log('✅ Script guardado exitosamente');

    return res.status(200).json({
      success: true,
      message: 'Script guardado correctamente',
      id: data?.[0]?.id || null,
      data: data?.[0] || null
    });

  } catch (err) {
    console.error('❌ Error guardando script:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al guardar el script en Supabase',
      details: err.message
    });
  }
}

