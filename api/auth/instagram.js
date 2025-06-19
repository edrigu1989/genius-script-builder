// INSTAGRAM AUTH - MANEJO DE AUTENTICACIÓN OAUTH
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'authorize':
        return handleAuthorize(req, res);
      
      case 'callback':
        return handleCallback(req, res);
      
      case 'refresh':
        return handleRefreshToken(req, res);
      
      default:
        return res.status(400).json({
          error: 'Acción no válida',
          message: 'Acciones disponibles: authorize, callback, refresh'
        });
    }
  } catch (error) {
    console.error('Error en Instagram Auth:', error);
    return res.status(500).json({
      error: 'Error de autenticación',
      message: error.message
    });
  }
}

// GENERAR URL DE AUTORIZACIÓN
function handleAuthorize(req, res) {
  const appId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  
  if (!appId || !redirectUri) {
    return res.status(500).json({
      error: 'Configuración incompleta',
      message: 'INSTAGRAM_APP_ID y INSTAGRAM_REDIRECT_URI son requeridos'
    });
  }

  const scope = 'user_profile,user_media';
  const responseType = 'code';
  
  const authUrl = `https://api.instagram.com/oauth/authorize?` +
    `client_id=${appId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${scope}&` +
    `response_type=${responseType}`;

  return res.status(200).json({
    success: true,
    authUrl,
    message: 'Redirige al usuario a esta URL para autorizar'
  });
}

// MANEJAR CALLBACK DE AUTORIZACIÓN
async function handleCallback(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({
      error: 'Autorización denegada',
      message: error
    });
  }

  if (!code) {
    return res.status(400).json({
      error: 'Código de autorización faltante',
      message: 'El código de autorización es requerido'
    });
  }

  try {
    // Intercambiar código por access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_message || 'Error al obtener access token');
    }

    // Intercambiar short-lived token por long-lived token
    const longLivedResponse = await fetch(`https://graph.instagram.com/access_token?` +
      `grant_type=ig_exchange_token&` +
      `client_secret=${process.env.INSTAGRAM_APP_SECRET}&` +
      `access_token=${tokenData.access_token}`
    );

    const longLivedData = await longLivedResponse.json();

    if (!longLivedResponse.ok) {
      throw new Error(longLivedData.error?.message || 'Error al obtener long-lived token');
    }

    return res.status(200).json({
      success: true,
      accessToken: longLivedData.access_token,
      tokenType: longLivedData.token_type,
      expiresIn: longLivedData.expires_in,
      userId: tokenData.user_id,
      message: 'Autenticación exitosa'
    });

  } catch (error) {
    console.error('Error en callback de Instagram:', error);
    return res.status(500).json({
      error: 'Error de autenticación',
      message: error.message
    });
  }
}

// REFRESCAR ACCESS TOKEN
async function handleRefreshToken(req, res) {
  const { access_token } = req.method === 'GET' ? req.query : req.body;

  if (!access_token) {
    return res.status(400).json({
      error: 'Access token requerido',
      message: 'Debes proporcionar el access_token a refrescar'
    });
  }

  try {
    const refreshResponse = await fetch(`https://graph.instagram.com/refresh_access_token?` +
      `grant_type=ig_refresh_token&` +
      `access_token=${access_token}`
    );

    const refreshData = await refreshResponse.json();

    if (!refreshResponse.ok) {
      throw new Error(refreshData.error?.message || 'Error al refrescar token');
    }

    return res.status(200).json({
      success: true,
      accessToken: refreshData.access_token,
      tokenType: refreshData.token_type,
      expiresIn: refreshData.expires_in,
      message: 'Token refrescado exitosamente'
    });

  } catch (error) {
    console.error('Error al refrescar token de Instagram:', error);
    return res.status(500).json({
      error: 'Error al refrescar token',
      message: error.message
    });
  }
}

