// CONFIGURACIÓN PARA DEPLOYMENT EN VERCEL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // En producción, usar rutas relativas
  : 'http://localhost:3001';

// GENERAR SCRIPTS CON GEMINI AI
export const generateScript = async (scriptData) => {
  try {
    console.log('🚀 Generando scripts con API de producción...');
    
    const response = await fetch('/api/generate-scripts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scriptData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Scripts generados exitosamente');
    return result;

  } catch (error) {
    console.error('❌ Error generando scripts:', error);
    throw error;
  }
};

// ANALIZAR VIDEO CON GEMINI AI
export const analyzeVideo = async (videoData) => {
  try {
    console.log('🎬 Analizando video con API de producción...');
    
    const response = await fetch('/api/analyze-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Video analizado exitosamente');
    return result;

  } catch (error) {
    console.error('❌ Error analizando video:', error);
    throw error;
  }
};

// ANALIZAR AUDIO CON GEMINI AI
export const analyzeAudio = async (audioData) => {
  try {
    console.log('🎵 Analizando audio con API de producción...');
    
    const response = await fetch('/api/analyze-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(audioData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Audio analizado exitosamente');
    return result;

  } catch (error) {
    console.error('❌ Error analizando audio:', error);
    throw error;
  }
};

// FINE-TUNING DE MODELO
export const fineTuneModel = async (tuningData) => {
  try {
    console.log('🎯 Iniciando fine-tuning con API de producción...');
    
    const response = await fetch('/api/fine-tune', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tuningData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Fine-tuning iniciado exitosamente');
    return result;

  } catch (error) {
    console.error('❌ Error en fine-tuning:', error);
    throw error;
  }
};

export default {
  generateScript,
  analyzeVideo,
  analyzeAudio,
  fineTuneModel
};

