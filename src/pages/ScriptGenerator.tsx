
import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Copy, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const ScriptGenerator = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product: '',
    target: '',
    platform: 'facebook',
    tone: 'profesional',
    objective: 'venta'
  });
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'youtube', label: 'YouTube' }
  ];

  const tones = [
    { value: 'profesional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'urgente', label: 'Urgente' },
    { value: 'emocional', label: 'Emocional' },
    { value: 'educativo', label: 'Educativo' }
  ];

  const objectives = [
    { value: 'venta', label: 'Generar Ventas' },
    { value: 'leads', label: 'Captar Leads' },
    { value: 'engagement', label: 'Aumentar Engagement' },
    { value: 'awareness', label: 'Aumentar Reconocimiento' },
    { value: 'trafico', label: 'Generar Tráfico' }
  ];

  const generateScript = async () => {
    if (!formData.product || !formData.target) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsGenerating(true);
    
    // Simulamos la generación de script con diferentes modelos de IA
    const scripts = {
      facebook: `🚀 ¡Descubre ${formData.product}! 

¿Sabías que ${formData.target} pueden transformar completamente su estrategia de marketing?

✨ Con ${formData.product}, obtendrás:
• Resultados inmediatos en tus campañas
• ROI mejorado hasta un 300%
• Automatización completa de procesos

💡 Miles de empresas ya confían en nosotros.

👉 ¡Prueba GRATIS por 14 días!
[Enlace de acción]

#Marketing #IA #Automatización`,

      instagram: `✨ ${formData.product} para ${formData.target} ✨

🎯 ¿Cansado de campañas que no convierten?

Con nuestra IA avanzada:
📈 +300% ROI garantizado
⚡ Scripts en 30 segundos
🎨 Personalización total

💫 Únete a +2,500 agencias exitosas

👆 Link en bio para prueba GRATUITA

#MarketingGenius #IA #Scripts #Marketing`,

      linkedin: `¿Estás maximizando el potencial de tus campañas de marketing?

Como profesional enfocado en ${formData.target}, sabes que el tiempo es dinero. ${formData.product} está revolucionando cómo las agencias crean contenido de alta conversión.

🔹 Acceso a OpenAI, Claude, y Gemini
🔹 Scripts profesionales en 30 segundos
🔹 +95% de satisfacción del cliente

Más de 2,500 agencias ya optimizaron sus procesos y aumentaron sus ingresos hasta un 300%.

¿Listo para transformar tu agencia?
Prueba gratuita disponible.`,

      email: `Asunto: [${formData.target}] Revoluciona tus campañas en 30 segundos

Hola,

¿Cuánto tiempo inviertes creando scripts de marketing que realmente conviertan?

Sabemos que como ${formData.target}, tu tiempo es valioso. Por eso creamos ${formData.product} - la única plataforma que genera scripts profesionales en 30 segundos usando IA avanzada.

✅ Acceso a múltiples modelos de IA (OpenAI, Claude, Gemini)
✅ Scripts optimizados para cada plataforma
✅ ROI mejorado hasta 300%
✅ Soporte 24/7

Más de 2,500 agencias ya confían en nosotros.

¿Listo para probarlo GRATIS por 14 días?

[BOTÓN: Comenzar Prueba Gratuita]

Saludos,
Equipo Marketing Genius`,

      youtube: `🎬 GUIÓN PARA VIDEO PROMOCIONAL

HOOK (0-3 segundos):
"¿3 horas creando UN solo script de marketing?"

PROBLEMA (3-15 segundos):
Si eres ${formData.target}, sabes lo frustrante que es crear contenido que realmente convierta. Horas de trabajo para resultados mediocres.

SOLUCIÓN (15-45 segundos):
Con ${formData.product}, generas scripts profesionales en 30 segundos. Acceso a OpenAI, Claude, Gemini. Todo en una plataforma.

BENEFICIOS (45-60 segundos):
• Scripts optimizados para cada plataforma
• ROI mejorado hasta 300%
• Más de 2,500 agencias satisfechas

LLAMADA A LA ACCIÓN (60-75 segundos):
Prueba GRATIS por 14 días. Link en descripción.

¿Te gustó? Suscríbete para más tips de marketing con IA.`
    };

    // Simulamos delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGeneratedScript(scripts[formData.platform as keyof typeof scripts] || scripts.facebook);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    alert('Script copiado al portapapeles');
  };

  const downloadScript = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `script-${formData.platform}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al inicio
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">MG</span>
              </div>
              <span className="text-xl font-bold">Marketing Genius</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Generador de Scripts de Marketing
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Powered by IA
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Crea scripts profesionales en 30 segundos con múltiples modelos de IA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Script</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Producto/Servicio *
                </label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  placeholder="Ej: Marketing Genius - Plataforma de IA para marketing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Audiencia Objetivo *
                </label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => setFormData({...formData, target: e.target.value})}
                  placeholder="Ej: Agencias de marketing, emprendedores, marketers"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plataforma
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {platforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tono de Comunicación
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {tones.map(tone => (
                    <option key={tone.value} value={tone.value}>
                      {tone.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Objetivo de la Campaña
                </label>
                <select
                  value={formData.objective}
                  onChange={(e) => setFormData({...formData, objective: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {objectives.map(objective => (
                    <option key={objective.value} value={objective.value}>
                      {objective.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={generateScript}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-200"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="animate-spin h-5 w-5 mr-2" />
                    Generando Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generar Script con IA
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Script Generado</h2>
              {generatedScript && (
                <div className="flex space-x-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                  <Button
                    onClick={downloadScript}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                </div>
              )}
            </div>
            
            {generatedScript ? (
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm leading-relaxed">
                  {generatedScript}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Completa el formulario y haz clic en "Generar Script" para ver tu contenido optimizado por IA
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Demo */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Funcionalidades Disponibles en la Versión Completa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold text-gray-900 mb-2">Múltiples Modelos de IA</h4>
              <p className="text-gray-600 text-sm">OpenAI GPT-4, Claude 3, Gemini Pro</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="font-semibold text-gray-900 mb-2">Personalización Avanzada</h4>
              <p className="text-gray-600 text-sm">Templates, variables, A/B testing</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold text-gray-900 mb-2">Analytics Integrado</h4>
              <p className="text-gray-600 text-sm">Métricas de rendimiento en tiempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;
