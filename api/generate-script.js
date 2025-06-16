// API ENDPOINT PARA GENERACIÓN DE SCRIPTS CON N8N
// Archivo: api/generate-script.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, platform, tone, audienceData, userMetrics } = req.body;
    
    if (!topic || !platform) {
      return res.status(400).json({ error: 'Topic and platform are required' });
    }

    // Preparar datos para n8n
    const n8nPayload = {
      topic,
      platform,
      tone: tone || 'profesional',
      audienceData: audienceData || {},
      userMetrics: userMetrics || {},
      timestamp: new Date().toISOString(),
      requestId: `script_${Date.now()}`
    };

    // Llamar al webhook de n8n
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload)
    });

    if (!n8nResponse.ok) {
      throw new Error(`N8N webhook error: ${n8nResponse.status}`);
    }

    const result = await n8nResponse.json();
    
    // Si n8n devuelve el script directamente
    if (result.script) {
      return res.json({
        success: true,
        script: result.script,
        metadata: result.metadata || {},
        generatedAt: new Date().toISOString()
      });
    }

    // Fallback: generar script básico si n8n no responde correctamente
    const fallbackScript = generateFallbackScript(topic, platform, tone);
    
    res.json({
      success: true,
      script: fallbackScript,
      metadata: {
        source: 'fallback',
        warning: 'Generated using fallback method'
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating script:', error);
    
    // Fallback en caso de error
    try {
      const fallbackScript = generateFallbackScript(
        req.body.topic || 'marketing', 
        req.body.platform || 'general', 
        req.body.tone || 'profesional'
      );
      
      res.json({
        success: true,
        script: fallbackScript,
        metadata: {
          source: 'fallback',
          error: 'N8N webhook unavailable'
        },
        generatedAt: new Date().toISOString()
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        error: 'Error generating script',
        details: error.message 
      });
    }
  }
}

// Función de fallback para generar scripts básicos
function generateFallbackScript(topic, platform, tone) {
  const scripts = {
    tiktok: {
      profesional: `🎯 ¿Sabías que ${topic} puede transformar tu negocio?

En los próximos 30 segundos te voy a mostrar exactamente cómo.

✨ Primero: [Explica el problema principal]
🚀 Segundo: [Presenta tu solución]
💡 Tercero: [Da un tip accionable]

¿Quieres más consejos como este? ¡Sígueme para más contenido de ${topic}!

#${topic.replace(/\s+/g, '')} #Marketing #Emprendimiento`,

      casual: `¡Hola! 👋 

Hoy quiero hablarte de ${topic} porque es algo que puede cambiar tu vida.

Mira, yo antes pensaba que [problema común]... pero después descubrí esto:

[Tu consejo principal]

Y desde entonces todo cambió 🔥

¿Tú qué opinas? ¡Déjamelo en los comentarios!

#${topic.replace(/\s+/g, '')} #Viral #Consejos`
    },
    
    instagram: {
      profesional: `📈 ${topic.toUpperCase()}: La estrategia que necesitas conocer

¿Te has preguntado por qué algunos logran resultados extraordinarios mientras otros se quedan estancados?

La diferencia está en [insight clave sobre el topic].

✅ Paso 1: [Acción específica]
✅ Paso 2: [Acción específica]  
✅ Paso 3: [Acción específica]

💡 TIP EXTRA: [Consejo valioso]

¿Cuál de estos pasos vas a implementar primero? ¡Cuéntame en los comentarios! 👇

#${topic.replace(/\s+/g, '')} #Marketing #Estrategia #Emprendimiento`,

      casual: `✨ Storytime: Cómo ${topic} cambió mi perspectiva

Hace unos meses estaba súper frustrado/a porque [situación relatable]...

Hasta que descubrí [tu insight principal] 🤯

Ahora mi rutina es:
🌅 [Hábito 1]
💪 [Hábito 2]
🎯 [Hábito 3]

Y los resultados han sido increíbles.

¿Tú has probado algo similar? ¡Comparte tu experiencia! 💬

#${topic.replace(/\s+/g, '')} #Lifestyle #Motivacion #Cambio`
    },

    youtube: {
      profesional: `🎬 GUIÓN PARA YOUTUBE: ${topic.toUpperCase()}

INTRO (0-15 segundos):
"¿Alguna vez te has preguntado [pregunta gancho sobre el topic]? En este video te voy a mostrar exactamente [promesa de valor]. Quédate hasta el final porque voy a compartir [bonus específico]."

DESARROLLO (15 segundos - 80% del video):

Punto 1: [Subtema principal]
- Explicación clara
- Ejemplo práctico
- Tip accionable

Punto 2: [Subtema principal]
- Explicación clara  
- Ejemplo práctico
- Tip accionable

Punto 3: [Subtema principal]
- Explicación clara
- Ejemplo práctico
- Tip accionable

CIERRE (últimos 20% del video):
"Recuerda: [mensaje clave]. Si este video te ayudó, dale like, suscríbete y compártelo con alguien que lo necesite. ¿Qué opinas sobre ${topic}? ¡Déjamelo en los comentarios!"

CALL TO ACTION:
"Y no olvides descargar mi guía gratuita sobre [lead magnet relacionado] en el enlace de la descripción."`,

      casual: `🎥 VIDEO CASUAL PARA YOUTUBE: ${topic}

INTRO RELAJADA:
"¡Hola, hermosa gente! ¿Cómo están? Hoy quiero platicarles sobre ${topic} porque es algo que me ha ayudado muchísimo y sé que a ustedes también les puede servir."

CONTENIDO CONVERSACIONAL:
"Miren, yo antes [experiencia personal]... y la verdad es que estaba súper perdido/a.

Pero entonces [momento de cambio] y todo empezó a tener sentido.

Lo que aprendí es que [insight principal]. Y esto es súper importante porque [razón].

Les voy a dar 3 consejos súper prácticos:

1. [Consejo con ejemplo personal]
2. [Consejo con ejemplo personal]  
3. [Consejo con ejemplo personal]"

CIERRE AMIGABLE:
"Y eso es todo por hoy. Espero que les haya gustado este video. Si tienen alguna pregunta, déjenmela en los comentarios que yo siempre los leo. ¡Los amo y nos vemos en el próximo video! 💕"`
    }
  };

  const platformScripts = scripts[platform.toLowerCase()] || scripts.instagram;
  const toneScript = platformScripts[tone.toLowerCase()] || platformScripts.profesional;
  
  return toneScript;
}

