import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Sparkles, 
  Download, 
  Copy, 
  RefreshCw, 
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';

const ScriptGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    scriptType: '',
    topic: '',
    targetAudience: '',
    tone: '',
    length: '',
    platform: '',
    additionalInfo: '',
    aiModel: 'openai'
  });

  const handleGenerate = async () => {
    if (!formData.scriptType || !formData.topic || !formData.targetAudience) {
      setError('Por favor completa los campos requeridos');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Preparar datos para N8N
      const scriptData = {
        client_id: user?.id,
        script_type: formData.scriptType,
        topic: formData.topic,
        target_audience: formData.targetAudience,
        tone: formData.tone,
        length: formData.length,
        platform: formData.platform,
        additional_info: formData.additionalInfo,
        ai_model: formData.aiModel,
        timestamp: new Date().toISOString()
      };

      console.log('Enviando datos a N8N:', scriptData);

      // Llamar al webhook de N8N
      const response = await api.generateScript(scriptData);
      
      if (response && response.script) {
        setGeneratedScript(response.script);
        setSuccess('¡Script generado exitosamente!');
      } else {
        // Fallback con script simulado si N8N no responde
        const mockScript = generateMockScript(formData);
        setGeneratedScript(mockScript);
        setSuccess('Script generado (modo demo)');
      }
    } catch (err) {
      console.error('Error generando script:', err);
      
      // Fallback con script simulado
      const mockScript = generateMockScript(formData);
      setGeneratedScript(mockScript);
      setSuccess('Script generado (modo demo - N8N no disponible)');
    } finally {
      setLoading(false);
    }
  };

  const generateMockScript = (data: any) => {
    const scripts = {
      social_media: `🚀 ¡Descubre ${data.topic}! 

Dirigido especialmente para ${data.targetAudience}, esta innovadora solución transformará tu experiencia.

✨ Beneficios principales:
• Resultados inmediatos
• Fácil implementación  
• Soporte 24/7

${data.tone === 'professional' ? 'Contáctanos para más información.' : '¡No te lo pierdas! 🔥'}

#Marketing #Innovación #${data.topic.replace(/\s+/g, '')}`,

      email: `Asunto: ${data.topic} - Especial para ${data.targetAudience}

Hola,

Esperamos que te encuentres bien. Queremos compartir contigo algo especial sobre ${data.topic}.

Como sabemos que eres parte de ${data.targetAudience}, hemos preparado esta información exclusiva que creemos será de gran valor para ti.

Principales beneficios:
- Solución personalizada para tus necesidades
- Implementación rápida y sencilla
- Resultados medibles desde el primer día

${data.tone === 'professional' ? 
  'Estaremos encantados de programar una llamada para discutir cómo esto puede beneficiarte.' : 
  '¡No dejes pasar esta oportunidad única!'}

Saludos cordiales,
El equipo de MarketingGenius`,

      landing_page: `# ${data.topic}
## La solución perfecta para ${data.targetAudience}

### ¿Por qué elegir nuestra propuesta?

**Beneficios únicos:**
- ✅ Resultados garantizados
- ✅ Implementación inmediata
- ✅ Soporte especializado

### Lo que dicen nuestros clientes

"Increíble experiencia, superó todas nuestras expectativas" - Cliente satisfecho

### ¡Actúa ahora!

${data.tone === 'professional' ? 
  'Solicita una consulta gratuita y descubre cómo podemos ayudarte.' : 
  '¡Aprovecha esta oferta limitada!'}

[BOTÓN: Comenzar Ahora]`,

      blog_post: `# ${data.topic}: Guía Completa para ${data.targetAudience}

## Introducción

En el mundo actual, ${data.topic} se ha convertido en un elemento fundamental para ${data.targetAudience}. En este artículo, exploraremos todo lo que necesitas saber.

## ¿Por qué es importante?

Para ${data.targetAudience}, entender ${data.topic} puede marcar la diferencia entre el éxito y el estancamiento.

### Beneficios principales:

1. **Eficiencia mejorada**: Optimiza tus procesos
2. **Resultados medibles**: Obtén datos concretos
3. **Escalabilidad**: Crece sin limitaciones

## Implementación práctica

${data.tone === 'professional' ? 
  'La implementación requiere un enfoque metodológico y planificado.' : 
  '¡Es más fácil de lo que piensas!'}

## Conclusión

${data.topic} representa una oportunidad única para ${data.targetAudience} que buscan destacar en su sector.

¿Listo para dar el siguiente paso?`,

      ad_copy: `🎯 ${data.topic}

Especialmente diseñado para ${data.targetAudience}

✨ Lo que obtienes:
→ Solución inmediata
→ Resultados garantizados  
→ Soporte premium

${data.tone === 'professional' ? 
  '📞 Consulta gratuita disponible' : 
  '🔥 ¡Oferta por tiempo limitado!'}

[CTA: ${data.tone === 'professional' ? 'Solicitar información' : 'Aprovecha ahora'}]`
    };

    return scripts[data.scriptType as keyof typeof scripts] || 'Script generado exitosamente.';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    setSuccess('Script copiado al portapapeles');
  };

  const downloadScript = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `script_${formData.scriptType}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSuccess('Script descargado exitosamente');
  };

  const resetForm = () => {
    setFormData({
      scriptType: '',
      topic: '',
      targetAudience: '',
      tone: '',
      length: '',
      platform: '',
      additionalInfo: '',
      aiModel: 'openai'
    });
    setGeneratedScript('');
    setError('');
    setSuccess('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generador de Scripts IA</h1>
              <p className="text-gray-600">Crea contenido profesional en segundos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white">
              <Sparkles className="h-3 w-3 mr-1" />
              IA Avanzada
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Configuración del Script
              </CardTitle>
              <CardDescription>
                Completa los detalles y la IA generará tu contenido personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mensajes */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Tipo de script */}
              <div className="space-y-2">
                <Label htmlFor="scriptType">Tipo de Script *</Label>
                <Select value={formData.scriptType} onValueChange={(value) => setFormData({...formData, scriptType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de contenido" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_media">Redes Sociales</SelectItem>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="landing_page">Landing Page</SelectItem>
                    <SelectItem value="blog_post">Blog Post</SelectItem>
                    <SelectItem value="ad_copy">Publicidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tema/Tópico */}
              <div className="space-y-2">
                <Label htmlFor="topic">Tema/Tópico *</Label>
                <Input
                  id="topic"
                  placeholder="Ej: Lanzamiento de nuevo producto, promoción especial..."
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                />
              </div>

              {/* Audiencia objetivo */}
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Audiencia Objetivo *</Label>
                <Input
                  id="targetAudience"
                  placeholder="Ej: Empresarios, jóvenes profesionales, madres trabajadoras..."
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                />
              </div>

              {/* Tono */}
              <div className="space-y-2">
                <Label htmlFor="tone">Tono</Label>
                <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tono" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profesional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Amigable</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="inspiring">Inspirador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Longitud */}
              <div className="space-y-2">
                <Label htmlFor="length">Longitud</Label>
                <Select value={formData.length} onValueChange={(value) => setFormData({...formData, length: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la longitud" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Corto (50-100 palabras)</SelectItem>
                    <SelectItem value="medium">Medio (100-300 palabras)</SelectItem>
                    <SelectItem value="long">Largo (300+ palabras)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Plataforma */}
              {formData.scriptType === 'social_media' && (
                <div className="space-y-2">
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Modelo de IA */}
              <div className="space-y-2">
                <Label htmlFor="aiModel">Modelo de IA</Label>
                <Select value={formData.aiModel} onValueChange={(value) => setFormData({...formData, aiModel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                    <SelectItem value="claude">Claude 3</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Información adicional */}
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Información Adicional</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Agrega cualquier detalle específico, palabras clave, CTAs preferidos..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generar Script
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Script Generado
              </CardTitle>
              <CardDescription>
                Tu contenido personalizado está listo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900">Generando tu script...</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      La IA está creando contenido personalizado para ti
                    </p>
                  </div>
                </div>
              ) : generatedScript ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 border rounded-lg p-4 min-h-[300px]">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                      {generatedScript}
                    </pre>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                    <Button onClick={downloadScript} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Próximos pasos:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Revisa y personaliza el contenido según tus necesidades</li>
                      <li>• Adapta el tono si es necesario</li>
                      <li>• Agrega elementos visuales complementarios</li>
                      <li>• Programa la publicación en tu plataforma preferida</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Completa el formulario</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Llena los campos requeridos para generar tu script personalizado
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScriptGenerator;

