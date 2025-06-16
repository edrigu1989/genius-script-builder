
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
    
    try {
      // Llamar al endpoint que usa n8n
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.product,
          platform: formData.platform,
          tone: formData.tone,
          objective: formData.objective,
          targetAudience: formData.target,
          audienceData: {
            target: formData.target,
            objective: formData.objective
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error generating script');
      }

      const result = await response.json();
      
      if (result.success && result.script) {
        setGeneratedScript(result.script);
      } else {
        throw new Error('Invalid response from script generator');
      }

    } catch (error) {
      console.error('Error generating script:', error);
      alert('Error generando el script. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(false);
    }
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
