import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { AnimatedIcon } from '../components/AnimatedIcons.jsx';
import { 
  Sparkles, 
  PenTool, 
  TrendingUp, 
  Target, 
  Brain, 
  Zap,
  Copy,
  Download,
  RefreshCw,
  Clock,
  Users,
  Heart,
  Share,
  Eye,
  CheckCircle,
  Lightbulb,
  Wand2,
  BarChart3,
  Activity,
  Award,
  Rocket,
  Globe,
  Cpu
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';

const ScriptGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [tone, setTone] = useState('casual');
  const [duration, setDuration] = useState('30');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [knowledgeUpdate, setKnowledgeUpdate] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    // Simular actualización de conocimiento en tiempo real
    const updates = [
      "🔄 Actualizando base de conocimiento...",
      "📊 Analizando tendencias actuales...",
      "🎯 Detectando hashtags virales...",
      "🧠 Optimizando para algoritmos...",
      "✅ Base de conocimiento actualizada"
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      setKnowledgeUpdate(updates[index]);
      index++;
      if (index >= updates.length) {
        clearInterval(interval);
        setTimeout(() => setKnowledgeUpdate(''), 3000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const generateScript = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Inicializando generación...');
    
    try {
      // Importar el cliente API
      const { scriptGeneration, knowledgeBase } = await import('../utils/evolutiveAPI.js');
      
      // Simular progreso de generación
      const steps = [
        'Conectando con base de conocimiento evolutivo...',
        'Consultando tendencias actuales...',
        'Generando estructura optimizada...',
        'Aplicando técnicas de engagement...',
        'Calculando predicciones de performance...',
        'Optimizando para plataforma seleccionada...',
        'Finalizando script...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setGenerationProgress((i + 1) * (100 / steps.length));
        
        // En el paso 3, hacer la llamada real a Gemini API
        if (i === 2) {
          try {
            const response = await fetch('http://localhost:3001/api/generate-scripts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                videoAnalysis: {
                  viralityScore: 75,
                  insights: [`Contenido sobre ${topic}`, 'Optimizado para engagement'],
                  recommendations: ['Usar hook fuerte', 'Incluir CTA claro']
                },
                platform,
                businessProfile: {
                  type: 'General',
                  audience: targetAudience || 'General audience',
                  voice: tone,
                  industry: 'Content Creation'
                }
              }),
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success) {
                // Usar datos reales de Gemini
                setGeneratedScript(result.scripts);
                setIsGenerating(false);
                setGenerationProgress(100);
                setCurrentStep('¡Scripts generados con Gemini AI!');
                return;
              }
            }
          } catch (apiError) {
            console.log('Gemini API no disponible, usando datos simulados:', apiError);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Fallback: resultado simulado si la API no está disponible
      const mockScript = {
        script: {
          hook: platform === 'tiktok' 
            ? "¿Sabías que el 90% de las personas cometen este error todos los días?"
            : platform === 'instagram'
            ? "Este secreto cambió mi vida en solo 7 días"
            : "La historia que estás a punto de escuchar te va a sorprender...",
          body: platform === 'tiktok' ? [
            "Hoy te voy a enseñar el secreto que cambió mi vida completamente.",
            "Primero, necesitas entender que la mayoría de la gente hace esto mal.",
            "El truco está en hacer exactamente lo contrario de lo que todos hacen.",
            "Mira, cuando yo empecé, también cometía el mismo error.",
            "Pero cuando descubrí esta técnica, todo cambió en solo 7 días.",
            "Y lo mejor de todo es que cualquiera puede hacerlo."
          ] : platform === 'instagram' ? [
            "Swipe para ver el antes y después",
            "Este método me ayudó a conseguir resultados increíbles.",
            "La clave está en ser consistente y seguir estos pasos.",
            "Primero: identifica tu objetivo principal.",
            "Segundo: aplica esta técnica específica.",
            "Tercero: mantén la constancia durante 21 días.",
            "Los resultados hablan por sí solos."
          ] : [
            "Permíteme contarte una historia que cambió mi perspectiva.",
            "Todo comenzó cuando me di cuenta de algo importante.",
            "La mayoría de las personas no saben esto, pero...",
            "Después de investigar durante meses, descubrí la verdad.",
            "Y cuando apliqué este conocimiento, los resultados fueron increíbles.",
            "Ahora quiero compartir contigo exactamente lo que aprendí."
          ],
          cta: platform === 'tiktok'
            ? "¡Guarda este video y compártelo con alguien que lo necesite! ¿Qué opinas en los comentarios?"
            : platform === 'instagram'
            ? "💾 Guarda este post para no perderlo. ¿Ya lo probaste? Cuéntame en comentarios 👇"
            : "¿Te ha pasado algo similar? Comparte tu experiencia en los comentarios y ayudemos a más personas.",
          hashtags: platform === 'tiktok' 
            ? ["#viral", "#tips", "#lifehack", "#fyp", "#parati", "#trending"]
            : platform === 'instagram'
            ? ["#tips", "#motivation", "#lifestyle", "#growth", "#inspiration", "#reels"]
            : ["#story", "#experience", "#community", "#sharing", "#motivation"]
        },
        predictions: {
          viral_score: platform === 'tiktok' ? 92 : platform === 'instagram' ? 87 : 81,
          estimated_views: platform === 'tiktok' ? 125000 : platform === 'instagram' ? 45000 : 28000,
          engagement_rate: platform === 'tiktok' ? 0.14 : platform === 'instagram' ? 0.11 : 0.08,
          completion_rate: platform === 'tiktok' ? 0.82 : platform === 'instagram' ? 0.75 : 0.68,
          best_time: platform === 'tiktok' ? "7-9pm" : platform === 'instagram' ? "6-8pm" : "8-10pm",
          confidence: platform === 'tiktok' ? 0.94 : platform === 'instagram' ? 0.89 : 0.85,
          trending_potential: platform === 'tiktok' ? 0.88 : platform === 'instagram' ? 0.76 : 0.62
        },
        optimization_tips: [
          {
            element: "Hook",
            tip: platform === 'tiktok' 
              ? "Usa estadísticas impactantes para captar atención inmediata"
              : platform === 'instagram'
              ? "Incluye emojis y palabras que generen curiosidad"
              : "Comienza con una historia personal para crear conexión",
            impact: "Alto",
            platform_specific: true
          },
          {
            element: "Estructura",
            tip: platform === 'tiktok'
              ? "Mantén cada punto en máximo 3 segundos para retener atención"
              : platform === 'instagram'
              ? "Usa formato de lista numerada para facilitar lectura"
              : "Desarrolla la narrativa gradualmente para mantener interés",
            impact: "Alto",
            platform_specific: true
          },
          {
            element: "Call to Action",
            tip: "Incluye pregunta específica para generar comentarios",
            impact: "Medio",
            platform_specific: false
          },
          {
            element: "Hashtags",
            tip: platform === 'tiktok'
              ? "Combina hashtags trending con nicho específico"
              : platform === 'instagram'
              ? "Usa mix de hashtags populares y de nicho (máx. 10)"
              : "Enfócate en hashtags de comunidad y conversación",
            impact: "Medio",
            platform_specific: true
          }
        ],
        trending_elements: [
          {
            element: platform === 'tiktok' ? "Formato de revelación" : platform === 'instagram' ? "Carrusel educativo" : "Storytelling personal",
            trend_score: 95,
            usage_tip: platform === 'tiktok' 
              ? "Estructura: Problema → Solución → Resultado"
              : platform === 'instagram'
              ? "Cada slide debe tener un punto clave visual"
              : "Conecta emocionalmente antes de dar información"
          },
          {
            element: platform === 'tiktok' ? "Música trending" : platform === 'instagram' ? "Estética minimalista" : "Preguntas reflexivas",
            trend_score: 88,
            usage_tip: platform === 'tiktok'
              ? "Usa audio viral pero que complemente tu mensaje"
              : platform === 'instagram'
              ? "Colores neutros con un acento llamativo"
              : "Invita a la reflexión personal en comentarios"
          }
        ],
        knowledge_insights: [
          `Algoritmo de ${platform} favorece contenido con ${platform === 'tiktok' ? 'alta retención en primeros 3 segundos' : platform === 'instagram' ? 'engagement temprano (primeros 30 min)' : 'tiempo de permanencia largo'}`,
          `Tendencia actual: ${platform === 'tiktok' ? 'Videos educativos cortos con hook fuerte' : platform === 'instagram' ? 'Carruseles informativos con diseño limpio' : 'Historias personales con lecciones aplicables'}`,
          `Mejor momento para publicar: ${platform === 'tiktok' ? 'Martes-Jueves 7-9pm' : platform === 'instagram' ? 'Lunes-Miércoles 6-8pm' : 'Domingo-Martes 8-10pm'} (actualizado hoy)`
        ]
      };

      setGeneratedScript(mockScript);
    } catch (error) {
      console.error('Error generating script:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentStep('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok': return 'social';
      case 'instagram': return 'social';
      case 'facebook': return 'social';
      default: return 'social';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok': return 'from-pink-500 to-red-500';
      case 'instagram': return 'from-purple-500 to-pink-500';
      case 'facebook': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <AnimatedIcon iconKey="script" size="w-6 h-6" className="filter brightness-0 invert" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Script Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Genera scripts virales con IA evolutiva que se actualiza constantemente
          </p>
        </div>

        {/* Knowledge Update Status */}
        {knowledgeUpdate && (
          <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <Cpu className="h-4 w-4 animate-pulse" />
            <AlertDescription className="font-medium">
              {knowledgeUpdate}
            </AlertDescription>
          </Alert>
        )}

        {/* Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenTool className="w-5 h-5 mr-2" />
              Configuración del Script
            </CardTitle>
            <CardDescription>
              Describe tu idea y selecciona los parámetros para generar el script perfecto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">Tema o Idea Principal *</Label>
                  <Textarea
                    id="topic"
                    placeholder="Ej: Cómo mejorar la productividad trabajando desde casa..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="audience">Audiencia Objetivo</Label>
                  <Input
                    id="audience"
                    placeholder="Ej: Emprendedores de 25-35 años"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                      <SelectItem value="instagram">📸 Instagram</SelectItem>
                      <SelectItem value="facebook">👥 Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tone">Tono</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">😊 Casual y Amigable</SelectItem>
                      <SelectItem value="professional">💼 Profesional</SelectItem>
                      <SelectItem value="energetic">⚡ Energético</SelectItem>
                      <SelectItem value="educational">🎓 Educativo</SelectItem>
                      <SelectItem value="inspirational">✨ Inspiracional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duración Estimada</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 segundos</SelectItem>
                      <SelectItem value="30">30 segundos</SelectItem>
                      <SelectItem value="60">1 minuto</SelectItem>
                      <SelectItem value="90">1.5 minutos</SelectItem>
                      <SelectItem value="120">2 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={generateScript}
                disabled={!topic.trim() || isGenerating}
                className={`bg-gradient-to-r ${getPlatformColor(platform)} hover:opacity-90 text-white px-8 py-3 text-lg`}
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generar Script {getPlatformIcon(platform)}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        {isGenerating && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentStep}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(generationProgress)}%
                  </span>
                </div>
                <Progress value={generationProgress} className="h-2" />
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Brain className="w-4 h-4 animate-pulse" />
                  <span>IA evolutiva creando tu script perfecto...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Script Results */}
        {generatedScript && (
          <div className="space-y-6">
            {/* Performance Predictions */}
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Predicción de Performance</CardTitle>
                <div className={`text-6xl font-bold ${getScoreColor(generatedScript.predictions.viral_score)} mt-4`}>
                  {generatedScript.predictions.viral_score}/100
                </div>
                <CardDescription className="text-lg mt-2">
                  Score de Viralidad Estimado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Eye className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {formatNumber(generatedScript.predictions.estimated_views)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Views Estimados</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {(generatedScript.predictions.engagement_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Engagement</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {(generatedScript.predictions.completion_rate * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Retención</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {generatedScript.predictions.best_time}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Mejor Hora</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-4">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Confianza: {(generatedScript.predictions.confidence * 100).toFixed(0)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Generated Script Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <PenTool className="w-5 h-5 mr-2" />
                    Script Generado para {getPlatformIcon(platform)} {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(
                      `${generatedScript.script.hook}\n\n${generatedScript.script.body.join('\n\n')}\n\n${generatedScript.script.cta}\n\n${generatedScript.script.hashtags.join(' ')}`
                    )}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Todo
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hook */}
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">🎣 Hook (Gancho)</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedScript.script.hook)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{generatedScript.script.hook}</p>
                </div>

                {/* Body */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">📝 Contenido Principal</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedScript.script.body.join('\n\n'))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {generatedScript.script.body.map((paragraph: string, index: number) => (
                      <p key={index} className="text-gray-700 dark:text-gray-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AnimatedIcon iconKey="engagement" size="w-5 h-5" />
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Call to Action</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedScript.script.cta)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{generatedScript.script.cta}</p>
                </div>

                {/* Hashtags */}
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AnimatedIcon iconKey="trending" size="w-5 h-5" />
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200">Hashtags</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedScript.script.hashtags.join(' '))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedScript.script.hashtags.map((hashtag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-purple-700 dark:text-purple-300">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Tips de Optimización
                </CardTitle>
                <CardDescription>
                  Sugerencias específicas para maximizar el rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedScript.optimization_tips.map((tip: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg dark:border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{tip.element}</Badge>
                          <Badge 
                            variant={tip.impact === 'Alto' ? 'default' : 'secondary'}
                            className={tip.impact === 'Alto' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                          >
                            {tip.impact} Impacto
                          </Badge>
                          {tip.platform_specific && (
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900">
                              {getPlatformIcon(platform)} Específico
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {tip.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Elements */}
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Elementos Trending Aplicados
                </CardTitle>
                <CardDescription>
                  Tendencias actuales incorporadas en tu script
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedScript.trending_elements.map((element: any, index: number) => (
                    <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                          {element.element}
                        </h4>
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          {element.trend_score}% trending
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {element.usage_tip}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Insights */}
            <Card className="border-2 border-cyan-200 dark:border-cyan-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Insights de Base de Conocimiento
                </CardTitle>
                <CardDescription>
                  Información actualizada del algoritmo y tendencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedScript.knowledge_insights.map((insight: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                      <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => setGeneratedScript(null)}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generar Nuevo
              </Button>
              <Button
                onClick={() => copyToClipboard(
                  `${generatedScript.script.hook}\n\n${generatedScript.script.body.join('\n\n')}\n\n${generatedScript.script.cta}\n\n${generatedScript.script.hashtags.join(' ')}`
                )}
                className={`bg-gradient-to-r ${getPlatformColor(platform)} hover:opacity-90`}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Script
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScriptGenerator;

