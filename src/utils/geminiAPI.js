// CONFIGURACIÓN PARA DEPLOYMENT EN RAILWAY
// Todas las APIs usan rutas relativas - sin localhost

// GENERAR SCRIPTS CON GEMINI AI
export const generateScript = async (scriptData) => {
  try {
    console.log('🚀 Generando scripts con API...');
    
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
    console.log('🎬 Analizando video con API...');
    
    const response = await fetch('/api/analyze-video-url', {
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

export default {
  generateScript,
  analyzeVideo
};

