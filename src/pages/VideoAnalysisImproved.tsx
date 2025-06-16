// COMPONENTE DE ANÁLISIS DE VIDEO MEJORADO
// Archivo: src/pages/VideoAnalysisImproved.tsx

import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { RealVideoAnalyzer } from '../utils/videoAnalysis';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
  Download
} from 'lucide-react';

export default function VideoAnalysisImproved() {
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

  // Función principal de análisis con RealVideoAnalyzer
  const analyzeVideo = async (file) => {
    setAnalyzing(true);
    setError('');
    setSuccess('');
    setProgress(0);
    setProgressMessage('Iniciando análisis...');
    
    try {
      const analyzer = new RealVideoAnalyzer();
      
      // Función de progreso que actualiza la UI
      const onProgress = (percent, message) => {
        setProgress(percent);
        setProgressMessage(message);
      };
      
      // Realizar análisis real del video
      const realAnalysis = await analyzer.analyzeVideo(file, onProgress);
      
      // Calcular métricas predichas basadas en el análisis real
      const predictedMetrics = calculatePredictedMetrics(realAnalysis);
      
      const finalAnalysis = {
        ...realAnalysis,
        metrics: predictedMetrics
      };

      setAnalysis(finalAnalysis);
      
      // Guardar en historial
      const newHistory = [finalAnalysis, ...analysisHistory].slice(0, 10);
      setAnalysisHistory(newHistory);
      
      setSuccess('¡Análisis completado exitosamente!');
      
      // Guardar en Supabase (opcional)
      if (user) {
        await saveAnalysisToDatabase(finalAnalysis);
      }
      
    } catch (err) {
      console.error('Error analyzing video:', err);
      setError(`Error analizando el video: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  // Calcular métricas predichas basadas en análisis real
  const calculatePredictedMetrics = (analysis) => {
    const baseViews = 1000;
    
    // Factores que afectan las predicciones
    const durationMultiplier = analysis.duration < 30 ? 1.8 : // Videos cortos
                              analysis.duration < 60 ? 1.5 : 
                              analysis.duration < 180 ? 1.2 : 
                              0.7; // Videos largos
    
    const sentimentMultiplier = analysis.sentiment.overall === 'Positivo' ? 1.4 : 
                               analysis.sentiment.overall === 'Negativo' ? 0.6 : 1.0;
    
    const qualityMultiplier = analysis.metadata.width >= 1280 ? 1.3 : 
                             analysis.metadata.width >= 720 ? 1.1 : 0.8;
    
    const aspectRatioMultiplier = parseFloat(analysis.metadata.aspectRatio) < 1 ? 1.2 : 1.0; // Vertical mejor para móvil
    
    const transcriptionMultiplier = analysis.transcription.length > 100 ? 1.2 : 0.9;
    
    const predictedViews = Math.round(
      baseViews * 
      durationMultiplier * 
      sentimentMultiplier * 
      qualityMultiplier * 
      aspectRatioMultiplier * 
      transcriptionMultiplier * 
      (analysis.viralPotential / 100)
    );
    
    return {
      predictedViews,
      predictedLikes: Math.round(predictedViews * 0.06), // 6% engagement típico
      predictedComments: Math.round(predictedViews * 0.025), // 2.5%
      predictedShares: Math.round(predictedViews * 0.015), // 1.5%
      engagementRate: Math.round(((predictedViews * 0.1) / predictedViews) * 100 * 100) / 100
    };
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
          viral_potential: analysisData.viralPotential,
          sentiment: analysisData.sentiment.overall,
          predicted_views: analysisData.metrics.predictedViews,
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Análisis de Video con IA</h1>
          <p className="text-gray-600 mt-2">
            Analiza tus videos para obtener insights sobre rendimiento, sentimientos y optimización
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="upload" className="space-y-6" value={analyzing || analysis ? 'results' : 'upload'}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Subir Video</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Subir Video para Análisis
                </CardTitle>
                <CardDescription>
                  Sube tu video y obtén un análisis completo con IA
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
                  <p className="text-sm text-gray-500">
                    Formatos soportados: MP4, MOV, AVI, WebM (máx. 100MB)
                  </p>
                </div>

                {selectedFile && (
                  <div className="p-4 bg-gray-50 rounded-lg">
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
                    <p className="text-sm text-gray-600 text-center">
                      {progressMessage}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Información del Video */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Video className="h-5 w-5 mr-2" />
                      Información del Video
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Duración</p>
                        <p className="text-lg font-semibold">{formatDuration(analysis.duration)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Resolución</p>
                        <p className="text-lg font-semibold">{analysis.metadata.width}x{analysis.metadata.height}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Aspecto</p>
                        <p className="text-lg font-semibold">{analysis.metadata.aspectRatio}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tamaño</p>
                        <p className="text-lg font-semibold">{formatFileSize(analysis.metadata.size)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Resumen del Análisis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Resumen del Análisis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{analysis.viralPotential}%</div>
                        <p className="text-sm text-gray-600">Potencial Viral</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analysis.metrics.engagementRate}%</div>
                        <p className="text-sm text-gray-600">Engagement Predicho</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{formatDuration(analysis.duration)}</div>
                        <p className="text-sm text-gray-600">Duración Real</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{analysis.sentiment.overall}</div>
                        <p className="text-sm text-gray-600">Sentimiento</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Métricas Predichas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Métricas Predichas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-3">
                        <Eye className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-lg font-semibold">{analysis.metrics.predictedViews.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Visualizaciones</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Heart className="h-8 w-8 text-red-600" />
                        <div>
                          <p className="text-lg font-semibold">{analysis.metrics.predictedLikes.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Me Gusta</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-lg font-semibold">{analysis.metrics.predictedComments.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Comentarios</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Share className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-lg font-semibold">{analysis.metrics.predictedShares.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Compartidos</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transcripción */}
                {analysis.transcription && analysis.transcription !== 'Sin audio detectado' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Transcripción del Audio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.transcription}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Insights y Recomendaciones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        Insights Clave
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.insights.map((insight, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Recomendaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Hashtags y Mejor Momento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hashtags Sugeridos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.hashtags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Mejor Momento para Publicar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{analysis.bestTimeToPost.day}</p>
                        <p className="text-sm text-gray-600">{analysis.bestTimeToPost.time}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

