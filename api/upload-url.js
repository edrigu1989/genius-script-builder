import { Storage } from '@google-cloud/storage';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST permitido' });
  }

  try {
    console.log('🔗 Generando signed URL para subida...');

    // Verificar variables de entorno
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_CLOUD_STORAGE_BUCKET) {
      return res.status(500).json({
        success: false,
        error: 'Google Cloud no configurado correctamente'
      });
    }

    const { fileName, fileType } = req.body;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        error: 'fileName requerido'
      });
    }

    // Configurar Google Cloud Storage
    let storage;
    
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Si hay credenciales JSON
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        credentials: credentials
      });
    } else {
      // Usar configuración por defecto
      storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
      });
    }

    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
    
    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const uniqueFileName = `videos/${timestamp}-${fileName}`;

    // Configurar signed URL para subida
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      contentType: fileType || 'video/mp4',
    };

    const [signedUrl] = await bucket.file(uniqueFileName).getSignedUrl(options);

    // URL pública para acceso posterior
    const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${uniqueFileName}`;

    console.log('✅ Signed URL generada exitosamente');

    return res.status(200).json({
      success: true,
      signedUrl: signedUrl,
      publicUrl: publicUrl,
      fileName: uniqueFileName,
      expiresIn: '15 minutos'
    });

  } catch (error) {
    console.error('❌ Error generando signed URL:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error generando URL de subida',
      details: error.message
    });
  }
}

