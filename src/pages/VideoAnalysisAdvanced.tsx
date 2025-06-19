// COMPONENTE DE ANÁLISIS DE VIDEO AVANZADO
// Archivo: src/pages/VideoAnalysisAdvanced.tsx

import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AdvancedVideoAnalyzer } from '../utils/advancedVideoAnalysis';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { 
  Upload, 
  Play, 
  Brain, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Clock, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  Zap,
  Video,
  AlertCircle,
  Download,
  BarChart,
  Users,
  Sparkles,
  LineChart,
  PieChart,
  Layers,
  Flame,
  Award,
  Bookmark,
  Repeat,
  Scissors
} from 'lucide-react';

export default function VideoAnalysisAdvanced() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  // Función principal de análisis con AdvancedVideoAnalyzer
  const analyzeVideo = async (file) => {
    setAnalyzing(true);
    setError('');
    setSuccess('');
    setProgress(0);
    setProgressMessage('Iniciando análisis...');
    setActiveTab('results');
    
    try {
      const analyzer = new AdvancedVideoAnalyzer();
      
      // Función de progreso que actualiza la UI
      const onProgress = (percent, message) => {
        setProgress(percent);
        setProgressMessage(message);
      };
      
      // Realizar análisis avanzado del video
      const advancedAnalysis = await analyzer.analyzeVideo(file, onProgress);
      
      setAnalysis(advancedAnalysis);
      
      // Guardar en historial
      const newHistory = [advancedAnalysis, ...analysisHistory].slice(0, 10);
      setAnalysisHistory(newHistory);
      
      setSuccess('¡Análisis completado exitosamente!');
      
      // Guardar en Supabase (opcional)
      if (user) {
        await saveAnalysisToDatabase(advancedAnalysis);
      }
      
    } catch (err) {
      console.error('Error analyzing video:', err);
      setError(`Error analizando el video: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  // Guardar análisis en base de datos
  const saveAnalysisToDatabase = async (analysisData) => {
    try {
      const { error } = await supabase
        .from('video_analyses')
        .insert([{
          user_id: user.id,
          video_name: analysisData.source,
          duration: analysisData.duration,
          viral_potential: analysisData.engagementPrediction.viralPotential,
          sentiment: analysisData.sentiment.overall,
          predicted_views: analysisData.engagementPrediction.predictedViews,
          analysis_data: analysisData,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error saving analysis:', error);
      }
    } catch (err) {
      console.error('Error saving to database:', err);
    }
  };

  // Manejar subida de archivo
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError('');
        // Crear URL para previsualización
        const objectUrl = URL.createObjectURL(file);
        setVideoUrl(objectUrl);
      } else {
        setError('Por favor selecciona un archivo de video válido (MP4, MOV, AVI, etc.).');
      }
    }
  }, []);

  // Iniciar análisis de archivo
  const handleFileAnalysis = () => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo de video.');
      return;
    }
    analyzeVideo(selectedFile);
  };

  // Formatear duración
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Formatear número con separadores de miles
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Análisis Avanzado de Video</h1>
            <p className="text-muted-foreground mt-2">
              Análisis profundo con IA para optimizar tu contenido y maximizar engagement
            </p>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1">
            <Sparkles className="h-4 w-4 mr-1" />
            PRO
          </Badge>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs 
          defaultValue="upload" 
          className="space-y-6" 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Subir Video</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysis && !analyzing}>Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Subir Video para Análisis
                </CardTitle>
                <CardDescription>
                  Sube tu video y obtén un análisis completo con IA avanzada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-upload">Seleccionar Video</Label>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Formatos soportados: MP4, MOV, AVI, WebM (máx. 100MB)
                  </p>
                </div>

                {videoUrl && (
                  <div className="mt-4">
                    <Label>Previsualización</Label>
                    <div className="mt-2 rounded-md overflow-hidden bg-black aspect-video">
                      <video 
                        src={videoUrl} 
                        controls 
                        className="w-full h-full"
                        onError={() => setError('Error al cargar la previsualización del video')}
                      />
                    </div>
                  </div>
                )}

                {selectedFile && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Archivo seleccionado:</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nombre:</strong> {selectedFile.name}</p>
                      <p><strong>Tamaño:</strong> {formatFileSize(selectedFile.size)}</p>
                      <p><strong>Tipo:</strong> {selectedFile.type}</p>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleFileAnalysis}
                  disabled={!selectedFile || analyzing}
                  className="w-full"
                  variant="gradient"
                >
                  {analyzing ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Analizar Video
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {analyzing && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Analizando Video...</h3>
                      <Badge variant="outline" className="animate-pulse">
                        <Brain className="h-3 w-3 mr-1" />
                        IA Procesando
                      </Badge>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      {progressMessage}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Panel de Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Información del Video */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        Información del Video
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duración</span>
                          <span className="font-medium">{formatDuration(analysis.duration)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resolución</span>
                          <span className="font-medium">{analysis.metadata.width}x{analysis.metadata.height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Aspecto</span>
                          <span className="font-medium">{analysis.metadata.aspectRatio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tamaño</span>
                          <span className="font-medium">{formatFileSize(analysis.metadata.size)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bitrate</span>
                          <span className="font-medium">{analysis.metadata.bitrate} kbps</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Potencial Viral */}
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Flame className="h-4 w-4 mr-2 text-orange-500" />
                        Potencial Viral
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-center py-4">
                        <div className="relative w-32 h-32">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                              {analysis.engagementPrediction.viralPotential}%
                            </span>
                          </div>
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#eee"
                              strokeWidth="3"
                              strokeDasharray="100, 100"
                              className="dark:stroke-gray-700"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="url(#gradient)"
                              strokeWidth="3"
                              strokeDasharray={`${analysis.engagementPrediction.viralPotential}, 100`}
                              className="animate-pulse"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ff7e5f" />
                                <stop offset="100%" stopColor="#feb47b" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-sm text-muted-foreground">Audiencia Objetivo</p>
                        <p className="font-medium">{analysis.deepInsights.targetAudience}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Métricas Predichas */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                        Métricas Predichas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                          <Eye className="h-4 w-4 mx-auto text-blue-500" />
                          <p className="text-lg font-semibold mt-1">{formatNumber(analysis.engagementPrediction.predictedViews)}</p>
                          <p className="text-xs text-muted-foreground">Vistas</p>
                        </div>
                        <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                          <Heart className="h-4 w-4 mx-auto text-red-500" />
                          <p className="text-lg font-semibold mt-1">{formatNumber(analysis.engagementPrediction.predictedLikes)}</p>
                          <p className="text-xs text-muted-foreground">Me Gusta</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <MessageCircle className="h-4 w-4 mx-auto text-green-500" />
                          <p className="text-lg font-semibold mt-1">{formatNumber(analysis.engagementPrediction.predictedComments)}</p>
                          <p className="text-xs text-muted-foreground">Comentarios</p>
                        </div>
                        <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                          <Share className="h-4 w-4 mx-auto text-purple-500" />
                          <p className="text-lg font-semibold mt-1">{formatNumber(analysis.engagementPrediction.predictedShares)}</p>
                          <p className="text-xs text-muted-foreground">Compartidos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Análisis Detallado */}
                <Tabs defaultValue="insights" className="space-y-4">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="insights">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Insights
                    </TabsTrigger>
                    <TabsTrigger value="audience">
                      <Users className="h-4 w-4 mr-2" />
                      Audiencia
                    </TabsTrigger>
                    <TabsTrigger value="content">
                      <Layers className="h-4 w-4 mr-2" />
                      Contenido
                    </TabsTrigger>
                    <TabsTrigger value="engagement">
                      <LineChart className="h-4 w-4 mr-2" />
                      Engagement
                    </TabsTrigger>
                    <TabsTrigger value="transcript">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Transcripción
                    </TabsTrigger>
                  </TabsList>

                  {/* Pestaña de Insights */}
                  <TabsContent value="insights" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Pilares de Contenido */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Layers className="h-4 w-4 mr-2 text-blue-500" />
                            Pilares de Contenido
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.deepInsights.contentPillars.map((pillar, index) => (
                              <li key={index} className="flex items-start">
                                <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                                <span>{pillar}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Disparadores Psicológicos */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Brain className="h-4 w-4 mr-2 text-purple-500" />
                            Disparadores Psicológicos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {analysis.deepInsights.psychologicalTriggers.map((trigger, index) => (
                              <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Viaje Emocional */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <LineChart className="h-4 w-4 mr-2 text-green-500" />
                            Viaje Emocional
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                            <ul className="space-y-4 relative">
                              {analysis.deepInsights.emotionalJourney.map((emotion, index) => (
                                <li key={index} className="ml-6 relative">
                                  <div className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full bg-green-500"></div>
                                  <span>{emotion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Momentos Clave */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Bookmark className="h-4 w-4 mr-2 text-orange-500" />
                            Momentos Clave
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.deepInsights.keyMoments.map((moment, index) => (
                              <li key={index} className="flex items-start">
                                <Badge variant="outline" className="mr-2 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                  {moment.time ? formatDuration(moment.time) : 'N/A'}
                                </Badge>
                                <span>{moment.description}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Ventaja Competitiva */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Award className="h-4 w-4 mr-2 text-yellow-500" />
                          Ventaja Competitiva
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Puntos de Venta Únicos:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {analysis.deepInsights.uniqueSellingPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Ventaja Competitiva:</h4>
                            <p>{analysis.deepInsights.competitiveAdvantage}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Pestaña de Audiencia */}
                  <TabsContent value="audience" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-500" />
                          Análisis de Audiencia
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium mb-2">Audiencia Objetivo:</h4>
                            <p className="text-lg">{analysis.deepInsights.targetAudience}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Mejor Momento para Publicar:</h4>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {analysis.bestTimeToPost.day}
                              </Badge>
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                {analysis.bestTimeToPost.time}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Hashtags Recomendados:</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.hashtags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Seguridad de Marca:</h4>
                            <Badge 
                              variant="outline" 
                              className={
                                analysis.deepInsights.brandSafety === "Alta" ? 
                                "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : 
                                analysis.deepInsights.brandSafety === "Media" ?
                                "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              }
                            >
                              {analysis.deepInsights.brandSafety}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Pestaña de Contenido */}
                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Análisis Visual */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Eye className="h-4 w-4 mr-2 text-blue-500" />
                            Análisis Visual
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="summary">
                              <AccordionTrigger>Resumen Visual</AccordionTrigger>
                              <AccordionContent>
                                <p className="text-sm">{analysis.visualAnalysis.summary}</p>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="objects">
                              <AccordionTrigger>Objetos Detectados</AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-wrap gap-2">
                                  {analysis.visualAnalysis.keyObjects.map((obj, index) => (
                                    <Badge key={index} variant="outline">
                                      {obj.name || obj}
                                    </Badge>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="colors">
                              <AccordionTrigger>Colores Dominantes</AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-wrap gap-2">
                                  {analysis.visualAnalysis.dominantColors.map((color, index) => (
                                    <div key={index} className="flex items-center">
                                      <div 
                                        className="w-4 h-4 rounded-full mr-1" 
                                        style={{backgroundColor: color.toLowerCase()}}
                                      ></div>
                                      <span>{color}</span>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="shots">
                              <AccordionTrigger>Tipos de Plano</AccordionTrigger>
                              <AccordionContent>
                                <ul className="list-disc pl-5">
                                  {analysis.visualAnalysis.shotTypes.map((shot, index) => (
                                    <li key={index}>{shot}</li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>

                      {/* Análisis de Sentimiento */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Heart className="h-4 w-4 mr-2 text-red-500" />
                            Análisis de Sentimiento
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span>Sentimiento General:</span>
                              <Badge 
                                variant="outline" 
                                className={
                                  analysis.sentiment.overall === "Positivo" ? 
                                  "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : 
                                  analysis.sentiment.overall === "Negativo" ?
                                  "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                                  "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                }
                              >
                                {analysis.sentiment.overall}
                              </Badge>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Confianza:</h4>
                              <Progress value={analysis.sentiment.confidence * 100} className="h-2" />
                              <div className="flex justify-between mt-1 text-xs">
                                <span>0%</span>
                                <span>{Math.round(analysis.sentiment.confidence * 100)}%</span>
                                <span>100%</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Emociones Detectadas:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(analysis.sentiment.emotions || {}).map(([emotion, value], index) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <span>{emotion}</span>
                                    <Progress value={value * 100} className="w-20 h-2" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Estructura Narrativa */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Scissors className="h-4 w-4 mr-2 text-purple-500" />
                            Estructura Narrativa
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Tipo de Estructura:</h4>
                              <p>{analysis.deepInsights.narrativeStructure}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Efectividad del Call to Action:</h4>
                              <Badge 
                                variant="outline" 
                                className={
                                  analysis.deepInsights.callToActionEffectiveness.toLowerCase().includes("alta") ? 
                                  "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : 
                                  analysis.deepInsights.callToActionEffectiveness.toLowerCase().includes("baja") ?
                                  "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                                  "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                }
                              >
                                {analysis.deepInsights.callToActionEffectiveness}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Pestaña de Engagement */}
                  <TabsContent value="engagement" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Métricas de Engagement */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                            Métricas de Engagement
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span>Tasa de Engagement:</span>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {analysis.engagementPrediction.engagementRate}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Tasa de Retención:</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                {analysis.engagementPrediction.retentionRate}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>CTR Estimado:</span>
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                {analysis.engagementPrediction.ctr}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Tiempo de Visualización:</span>
                              <Badge variant="outline">
                                {Math.round(analysis.engagementPrediction.watchTime / 60)} minutos
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Predicciones Detalladas */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                            Predicciones Detalladas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Vistas</span>
                                <span className="text-sm font-medium">{formatNumber(analysis.engagementPrediction.predictedViews)}</span>
                              </div>
                              <Progress value={100} className="h-2 bg-blue-100 dark:bg-blue-900/30" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Me Gusta</span>
                                <span className="text-sm font-medium">{formatNumber(analysis.engagementPrediction.predictedLikes)}</span>
                              </div>
                              <Progress 
                                value={(analysis.engagementPrediction.predictedLikes / analysis.engagementPrediction.predictedViews) * 100} 
                                className="h-2 bg-red-100 dark:bg-red-900/30" 
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Comentarios</span>
                                <span className="text-sm font-medium">{formatNumber(analysis.engagementPrediction.predictedComments)}</span>
                              </div>
                              <Progress 
                                value={(analysis.engagementPrediction.predictedComments / analysis.engagementPrediction.predictedViews) * 100} 
                                className="h-2 bg-green-100 dark:bg-green-900/30" 
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Compartidos</span>
                                <span className="text-sm font-medium">{formatNumber(analysis.engagementPrediction.predictedShares)}</span>
                              </div>
                              <Progress 
                                value={(analysis.engagementPrediction.predictedShares / analysis.engagementPrediction.predictedViews) * 100} 
                                className="h-2 bg-purple-100 dark:bg-purple-900/30" 
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Pestaña de Transcripción */}
                  <TabsContent value="transcript" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                          Transcripción del Video
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {analysis.transcription.text === "Sin audio detectado" ? (
                          <div className="p-4 text-center bg-muted rounded-md">
                            <p>No se detectó audio en este video</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {analysis.transcription.segments && analysis.transcription.segments.length > 0 ? (
                              <div className="space-y-2">
                                {analysis.transcription.segments.map((segment, index) => (
                                  <div key={index} className="flex">
                                    <Badge variant="outline" className="mr-2 shrink-0">
                                      {formatDuration(segment.start)}
                                    </Badge>
                                    <p>{segment.text}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>{analysis.transcription.text}</p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Acciones */}
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('upload')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Analizar Otro Video
                  </Button>
                  <Button 
                    variant="gradient"
                    onClick={() => {
                      // Aquí se podría implementar la descarga del informe
                      setSuccess('Informe guardado correctamente');
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Guardar Informe
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

