import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS // o usa el JSON directo si lo importás como string
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Solo POST.' });
  }

  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: 'Faltan datos: fileName o fileType' });
  }

  try {
    const file = bucket.file(fileName);

    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      contentType: fileType
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return res.status(200).json({
      success: true,
      signedUrl,
      publicUrl
    });
  } catch (err) {
    console.error('❌ Error generando signed URL:', err);
    return res.status(500).json({ success: false, error: 'Error interno al generar la URL' });
  }
}
