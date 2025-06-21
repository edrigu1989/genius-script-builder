import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Solo se permite GET' });
  }

  const { userId, platform, limit = 10 } = req.query;

  try {
    console.log('📚 Obteniendo scripts guardados...');

    let query = supabase
      .from('scripts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    // Filtrar por usuario si se proporciona
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Filtrar por plataforma si se proporciona
    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }

    console.log(`✅ ${data?.length || 0} scripts obtenidos`);

    return res.status(200).json({
      success: true,
      scripts: data || [],
      count: data?.length || 0
    });

  } catch (err) {
    console.error('❌ Error obteniendo scripts:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener scripts de Supabase',
      details: err.message
    });
  }
}

