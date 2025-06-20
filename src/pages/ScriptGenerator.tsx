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
  const [duration, setDuration] = useState('30');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const generateScript = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep(t('script_generator.generating'));
    
    try {
      // Progreso de generación
      const steps = [
        'Conectando con IA avanzada...',
        'Analizando el tema proporcionado...',
        'Generando estructura optimizada...',
        'Aplicando técnicas de engagement...',
        'Calculando predicciones de performance...',
        'Optimizando para plataforma seleccionada...',
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
                // Usar datos reales de la API
                setGeneratedScript(result.scripts);
                setIsGenerating(false);
                setGenerationProgress(100);
                setCurrentStep('¡Scripts generados con IA avanzada!');
                return;
              }
            }
          } catch (apiError) {
            console.log('Error con la API:', apiError);
            throw apiError;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }

    } catch (error) {
      console.error('Error generando script:', error);
      setIsGenerating(false);
      setCurrentStep('Error al generar scripts. Intenta de nuevo.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadScript = (script: any) => {
    const content = `
SCRIPT GENERADO CON GEMINI AI
=============================

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

MÉTRICAS PREDICHAS:
- Score de Optimización: ${script.optimizationScore || 'N/A'}%
- Potencial Viral: ${script.viralityPotential || 'N/A'}%
- Emoción Objetivo: ${script.targetEmotion || 'N/A'}

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
              {t('script_generator.title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('script_generator.description')}
          </p>
        </div>

        {/* Formulario de Generación */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              {t('script_generator.config_title')}
            </CardTitle>
            <CardDescription>
              {t('script_generator.config_desc')}
            </CardDescription>          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="platform">{t('script_generator.platform')}</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('script_generator.select_platform')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">{t('script_generator.tone')}</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('script_generator.select_tone')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">{t('script_generator.professional')}</SelectItem>
                    <SelectItem value="casual">{t('script_generator.casual')}</SelectItem>
                    <SelectItem value="humorous">{t('script_generator.humorous')}</SelectItem>
                    <SelectItem value="urgent">{t('script_generator.urgent')}</SelectItem>
                    <SelectItem value="inspirational">{t('script_generator.inspirational')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">{t('script_generator.topic')}</Label>
              <Textarea
                id="topic"
                placeholder={t('script_generator.topic_placeholder')}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">{t('script_generator.audience')}</Label>
              <Input
                id="audience"
                placeholder={t('script_generator.audience_placeholder')}
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <Button 
              onClick={generateScript}
              disabled={!topic.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t('script_generator.generating')}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  {t('script_generator.generate')}
                </>
              )}
            </Button>

            {/* Progreso de Generación */}
            {isGenerating && (
              <div className="space-y-4">
                <Progress value={generationProgress} className="w-full" />
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{currentStep}</p>
                  <p className="text-xs text-gray-500">{generationProgress.toFixed(0)}% completado</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados */}
        {generatedScript && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">{t('script_generator.results')}</h2>
            
            <div className="grid gap-6">
              {Array.isArray(generatedScript) ? generatedScript.map((script, index) => (
                <Card key={index} className="border-2 hover:border-purple-300 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {script.type || `Versión ${index + 1}`}
                          </Badge>
                          <span className="text-lg">Script para {platform.toUpperCase()}</span>
                        </CardTitle>
                        <CardDescription>
                          Generado con Gemini AI • {script.characterCount || script.script?.length || 0} caracteres
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(script.script || '')}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          {t('script_generator.copy')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadScript(script)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="script" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="script">Script</TabsTrigger>
                        <TabsTrigger value="elements">Elementos</TabsTrigger>
                        <TabsTrigger value="metrics">Métricas</TabsTrigger>
                        <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="script" className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Script Completo:</h4>
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
                        {script.targetEmotion && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Heart className="w-4 h-4 mr-1 text-purple-600" />
                              Emoción Objetivo:
                            </h4>
                            <p>{script.targetEmotion}</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="metrics" className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          {script.optimizationScore && (
                            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{script.optimizationScore}%</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">Score de Optimización</div>
                            </div>
                          )}
                          {script.viralityPotential && (
                            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">{script.viralityPotential}%</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">Potencial Viral</div>
                            </div>
                          )}
                          {script.predictedPerformance && (
                            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">{script.predictedPerformance.estimatedEngagementRate}%</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">Engagement Estimado</div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="hashtags" className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {script.hashtags?.map((hashtag: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-sm">
                              #{hashtag}
                            </Badge>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )) : (
                <Card className="border-2 hover:border-purple-300 transition-colors">
                  <CardHeader>
                    <CardTitle>Script Generado</CardTitle>
                    <CardDescription>Generado con Gemini AI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{generatedScript}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScriptGenerator;

