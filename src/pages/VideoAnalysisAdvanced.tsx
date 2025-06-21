import React, { useState, useCallback, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { AnimatedIcon } from '../components/AnimatedIcons.jsx';
import { useTranslation } from 'react-i18next';
import { 
  Upload, 
  Play, 
  TrendingUp, 
  Target, 
  Brain, 
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  BarChart3,
  Clock,
  Users,
  Heart,
  Share,
  Eye,
  Camera,
  Volume2,
  Palette,
  Activity,
  Award,
  Lightbulb
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';

const VideoAnalysisAdvanced: React.FC = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const analyzeVideo = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep('Inicializando análisis con IA avanzada...');

    try {
      // Validar archivo
      if (selectedFile.size > 10 * 1024 * 1024) {
        throw new Error('El archivo es demasiado grande. Máximo 10MB.');
      }

      // Progreso de análisis real
      const steps = [
        'Conectando con IA avanzada...',
        'Subiendo video al servidor...',
        'Analizando contenido visual con IA...',
        'Procesando audio y transcripción...',
        'Evaluando elementos virales...',
        'Calculando predicciones de engagement...',
        'Generando insights únicos...',
        'Finalizando análisis...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setAnalysisProgress((i + 1) * (100 / steps.length));
        
        // En el paso 3, hacer la llamada real a la API
        if (i === 2) {
          try {
            const formData = new FormData();
            formData.append('video', selectedFile);
            formData.append('platform', selectedPlatform);

            const response = await fetch('/api/analyze-video', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success) {
                // Usar datos reales de la API
                setAnalysisResult(result.analysis);
                setIsAnalyzing(false);
                setAnalysisProgress(100);
                setCurrentStep('¡Análisis completado con IA avanzada!');
                return;
              }
            }
          } catch (apiError) {
            console.error('Error con la API:', apiError);
            throw new Error('Error al analizar el video con IA avanzada');
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }

    } catch (error) {
      console.error('Error analyzing video:', error);
      setCurrentStep('Error al analizar el video. Intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900';
    if (score >= 60) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
              <AnimatedIcon iconKey="video" size="w-6 h-6" className="filter brightness-0 invert" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Video Predictor
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analiza tu video con IA avanzada y predice su éxito antes de publicarlo
          </p>
        </div>

        {/* Upload Section */}
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
          <CardContent className="p-8">
            {!selectedFile ? (
              <div
                className="text-center cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Arrastra tu video aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Formatos soportados: MP4, MOV, AVI (máx. 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={analyzeVideo}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-pulse" />
                        Analizando con IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analizar Video
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setAnalysisResult(null);
                    }}
                  >
                    Cambiar Video
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress */}
        {isAnalyzing && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Analizando con IA Avanzada</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {analysisProgress.toFixed(0)}%
                  </span>
                </div>
                <Progress value={analysisProgress} className="w-full" />
                <p className="text-sm text-gray-600 dark:text-gray-300">{currentStep}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {analysisResult && (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Análisis completado con IA avanzada. Los resultados se basan en el análisis real de tu video.
              </AlertDescription>
            </Alert>

            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Puntuación General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(analysisResult.overall_score)} mb-2`}>
                    {analysisResult.overall_score}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Tu video tiene un potencial {analysisResult.overall_score >= 80 ? 'alto' : analysisResult.overall_score >= 60 ? 'medio' : 'bajo'} de viralidad
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Platform Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Predicciones por Plataforma
                </CardTitle>
                <CardDescription>
                  Análisis específico para cada red social
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(analysisResult.platform_predictions || {}).map(([platform, data]: [string, any]) => (
                    <div key={platform} className={`p-4 rounded-lg ${getScoreBg(data.viral_score)}`}>
                      <h4 className="font-semibold capitalize mb-2">{platform}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Score Viral:</span>
                          <span className={`font-bold ${getScoreColor(data.viral_score)}`}>
                            {data.viral_score}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Views Estimadas:</span>
                          <span className="font-bold">{formatNumber(data.estimated_views)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Engagement:</span>
                          <span className="font-bold">{(data.engagement_rate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mejor Hora:</span>
                          <span className="font-bold">{data.best_time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technical Analysis */}
            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="technical">Técnico</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="content">Contenido</TabsTrigger>
              </TabsList>
              
              <TabsContent value="technical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Análisis Técnico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(analysisResult.technical_analysis || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <span className={`font-bold ${getScoreColor(value)}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visual" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Análisis Visual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(analysisResult.visual_analysis || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <span className={`font-bold ${getScoreColor(value)}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Volume2 className="w-5 h-5 mr-2" />
                      Análisis de Audio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(analysisResult.audio_analysis || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <span className={`font-bold ${getScoreColor(value)}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Análisis de Contenido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(analysisResult.content_insights || {}).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <span className={`font-bold ${getScoreColor(value)}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Optimization Suggestions */}
            {analysisResult.optimization_suggestions && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                    Sugerencias de Optimización
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.optimization_suggestions.map((suggestion: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{suggestion.category}</Badge>
                          <div className="flex space-x-2">
                            <Badge variant={suggestion.impact === 'Alto' ? 'destructive' : suggestion.impact === 'Medio' ? 'default' : 'secondary'}>
                              {suggestion.impact}
                            </Badge>
                            <Badge variant="outline">Prioridad {suggestion.priority}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Unique Insights */}
            {analysisResult.unique_insights && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-600" />
                    Insights Únicos de IA Avanzada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.unique_insights.map((insight: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VideoAnalysisAdvanced;

