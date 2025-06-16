// API ENDPOINT PARA TRANSCRIPCIÓN DE AUDIO
// Archivo: api/transcribe-audio.js

import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB max
    });

    const [fields, files] = await form.parse(req);
    const audioFile = files.audio?.[0];

    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Leer el archivo de audio
    const audioBuffer = fs.readFileSync(audioFile.filepath);

    // Transcribir con OpenAI Whisper
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer]), 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'es'); // Español por defecto

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Whisper API error');
    }

    const result = await response.json();

    // Limpiar archivo temporal
    fs.unlinkSync(audioFile.filepath);

    res.json({
      transcription: result.text || 'No se pudo transcribir el audio'
    });

  } catch (error) {
    console.error('Error in audio transcription:', error);
    res.status(500).json({ 
      error: 'Error transcribing audio',
      transcription: 'No se pudo transcribir el audio'
    });
  }
}

