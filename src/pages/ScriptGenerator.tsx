import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [tone, setTone] = useState('casual');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScripts, setGeneratedScripts] = useState<any[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState('');

  const generateScript = async () => {
    if (!topic.trim()) {
      setError('Por favor ingresa un tema para el script');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Iniciando generación...');
    setError('');
    setGeneratedScripts([]);
    
    try {
      // Progreso de generación
      const steps = [
        'Conectando con IA avanzada...',
        'Analizando el tema proporcionado...',
        'Generando estructura optimizada...',
        'Aplicando técnicas de engagement...',
        'Finalizando scripts...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setGenerationProgress((i + 1) * (100 / steps.length));
        
        // En el paso 3, hacer la llamada real a la API
        if (i === 2) {
          try {
            const response = await fetch('/api/generate-scripts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                topic,
                platform,
                tone,
                targetAudience
              }),
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success && result.scripts) {
                setGeneratedScripts(result.scripts);
                setIsGenerating(false);
                setGenerationProgress(100);
                setCurrentStep('¡Scripts generados exitosamente!');
                return;
              }
            } else {
              throw new Error('Error en la respuesta del servidor');
            }
          } catch (apiError) {
            console.error('Error con la API:', apiError);
            throw apiError;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }

    } catch (error) {
      console.error('Error generando script:', error);
      setIsGenerating(false);
      setError('Error al generar scripts. Por favor intenta de nuevo.');
      setCurrentStep('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const saveScript = async (script: any) => {
    try {
      console.log('💾 Guardando script...');
      
      const response = await fetch('/api/save-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          platform,
          tone,
          targetAudience,
          script: script.script,
          hook: script.hook,
          cta: script.cta,
          hashtags: script.hashtags,
          engagementScore: script.engagementScore,
          userId: null // TODO: Agregar user ID cuando esté autenticado
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Script guardado:', result);
        // TODO: Mostrar notificación de éxito
      } else {
        throw new Error('Error al guardar script');
      }
    } catch (error) {
      console.error('❌ Error guardando script:', error);
      // TODO: Mostrar notificación de error
    }
  };

  const downloadScript = (script: any) => {
    const content = `
SCRIPT GENERADO CON IA AVANZADA
===============================

Plataforma: ${platform.toUpperCase()}
Tema: ${topic}
Tono: ${tone}

SCRIPT:
${script.script}

HOOK:
${script.hook}

CALL TO ACTION:
${script.cta}

HASHTAGS:
${script.hashtags?.join(' #') || ''}

SCORE DE ENGAGEMENT: ${script.engagementScore || 'N/A'}%

Generado el: ${new Date().toLocaleString()}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script_${platform}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Script Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create viral scripts with advanced AI
          </p>
        </div>

        {/* Formulario de Generación */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Configuración del Script
            </CardTitle>
            <CardDescription>
              Configura los parámetros para generar scripts optimizados con IA avanzada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tono" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Script Topic</Label>
              <Textarea
                id="topic"
                placeholder="Describe el tema o producto para tu script..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="Ej: Jóvenes de 18-25 años interesados en tecnología"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={generateScript}
              disabled={isGenerating || !topic.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Scripts
                </>
              )}
            </Button>

            {/* Progreso de Generación */}
            {isGenerating && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {currentStep}
                  </p>
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(generationProgress)}% completado
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados */}
        {generatedScripts.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Scripts Generados</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {generatedScripts.length} scripts únicos creados para {platform}
              </p>
            </div>

            <div className="grid gap-6">
              {generatedScripts.map((script, index) => (
                <Card key={script.id || index} className="max-w-4xl mx-auto">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="outline">Script {index + 1}</Badge>
                          <span className="text-lg">Optimizado para {platform}</span>
                        </CardTitle>
                        <CardDescription>
                          Generado con IA avanzada • {script.script?.length || 0} caracteres
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(script.script || '')}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadScript(script)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => saveScript(script)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="script" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="script">Script</TabsTrigger>
                        <TabsTrigger value="elements">Elements</TabsTrigger>
                        <TabsTrigger value="metrics">Metrics</TabsTrigger>
                        <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="script" className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Complete Script:</h4>
                          <p className="whitespace-pre-wrap">{script.script}</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="elements" className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Zap className="w-4 h-4 mr-1 text-blue-600" />
                              Hook:
                            </h4>
                            <p>{script.hook}</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Target className="w-4 h-4 mr-1 text-green-600" />
                              Call to Action:
                            </h4>
                            <p>{script.cta}</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="metrics" className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {script.engagementScore || 'N/A'}%
                            </div>
                            <div className="text-sm text-gray-600">Engagement Score</div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {script.platform || platform}
                            </div>
                            <div className="text-sm text-gray-600">Platform</div>
                          </div>
                          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-pink-600">
                              {script.tone || tone}
                            </div>
                            <div className="text-sm text-gray-600">Tone</div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="hashtags" className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Recommended Hashtags:</h4>
                          <div className="flex flex-wrap gap-2">
                            {script.hashtags?.map((hashtag: string, idx: number) => (
                              <Badge key={idx} variant="secondary">
                                #{hashtag}
                              </Badge>
                            )) || <p className="text-gray-500">No hashtags available</p>}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScriptGenerator;

