import { IncomingForm } from 'formidable';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://genius-script-builder.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🎬 Iniciando análisis de video...');

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY no configurada');
      return res.status(500).json({ success: false, error: 'API key not configured' });
    }

    const form = new IncomingForm({
      maxFileSize: 100 * 1024 * 1024, // 100MB
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('❌ Error parsing form:', err);
        return res.status(400).json({ success: false, error: 'Error parsing form data' });
      }

      const file = files.video?.[0] || files.video;
      
      if (!file) {
        console.error('❌ No video file uploaded');
        return res.status(400).json({ success: false, error: 'No video uploaded' });
      }

      console.log('📁 Archivo recibido:', {
        name: file.originalFilename,
        size: file.size,
        type: file.mimetype
      });

      // Validar tipo de archivo
      const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(file.mimetype)) {
        console.error('❌ Tipo de archivo no válido:', file.mimetype);
        return res.status(400).json({ 
          success: false, 
          error: 'Solo se permiten archivos de video (MP4, MOV, AVI, etc.)' 
        });
      }

      try {
        console.log('📖 Leyendo archivo de video...');
        const buffer = fs.readFileSync(file.filepath);
        const base64Video = buffer.toString('base64');
        
        console.log('🤖 Inicializando Gemini AI...');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        console.log('🔍 Enviando video a Gemini para análisis...');
        const result = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: file.mimetype,
                    data: base64Video,
                  },
                },
                {
                  text: `
Analiza este video y proporciona lo siguiente:
1. Breve resumen del contenido.
2. Fortalezas visuales y de contenido.
3. Elementos que podrían mejorarse para redes sociales.
4. Potencial viral del video (score del 1 al 100).
5. Recomendaciones finales basadas en TikTok, Instagram o YouTube.

Responde en este JSON sin explicar nada adicional y en el idioma original del usuario:
{
  "summary": "...",
  "strengths": ["..."],
  "improvements": ["..."],
  "viralScore": 0-100,
  "recommendations": ["..."],
  "platform": "TikTok/Instagram/YouTube",
  "duration": "estimación de duración",
  "mood": "tono/ambiente del video"
}
                  `,
                },
              ],
            },
          ],
        });

        console.log('✅ Respuesta recibida de Gemini');
        const responseText = result.response.text().replace(/```json\n?|```/g, '').trim();
        
        console.log('📝 Texto de respuesta:', responseText.substring(0, 200) + '...');

        try {
          const parsed = JSON.parse(responseText);
          console.log('✅ JSON parseado exitosamente');
          
          // Limpiar archivo temporal
          fs.unlinkSync(file.filepath);
          
          res.json({ 
            success: true, 
            analysis: parsed,
            metadata: {
              filename: file.originalFilename,
              size: file.size,
              type: file.mimetype
            }
          });
        } catch (parseError) {
          console.error('❌ Error parsing JSON:', parseError);
          console.error('📄 Raw response:', responseText);
          
          // Limpiar archivo temporal
          fs.unlinkSync(file.filepath);
          
          res.status(200).json({ 
            success: false, 
            error: 'Error parsing AI response',
            raw: responseText.substring(0, 500),
            details: parseError.message
          });
        }

      } catch (aiError) {
        console.error('❌ Error con Gemini AI:', aiError);
        
        // Limpiar archivo temporal si existe
        if (fs.existsSync(file.filepath)) {
          fs.unlinkSync(file.filepath);
        }
        
        res.status(500).json({
          success: false,
          error: 'Error analyzing video with AI',
          details: aiError.message
        });
      }
    });

  } catch (error) {
    console.error('❌ Error general:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}

