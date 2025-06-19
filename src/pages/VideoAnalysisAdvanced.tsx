// COMPONENTE DE ANÁLISIS DE VIDEO REVOLUCIONARIO
// Archivo: src/pages/VideoAnalysisAdvanced.tsx

import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AdvancedVideoAnalyzer } from '../utils/advancedVideoAnalysis';
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
  Download,
  Star,
  Trophy,
  Microscope,
  Palette,
  Volume2,
  Users,
  BarChart3,
  Sparkles,
  Shield,
  Rocket
} from 'lucide-react';

export default function VideoAnalysisAdvanced() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  // Función principal de análisis revolucionario
  const analyzeVideo = async (file) => {
    setAnalyzing(true);
    setError('');
    setSuccess('');
    setProgress(0);
    setProgressMessage('Iniciando análisis revolucionario...');
    setActiveTab('results'); // Cambiar automáticamente a resultados
    
    try {
      const analyzer = new AdvancedVideoAnalyzer();
      
      // Función de progreso que actualiza la UI
      const onProgress = (percent, message) => {
        setProgress(percent);
        setProgressMessage(message);
      };
      
      // Realizar análisis revolucionario multi-dimensional
      const revolutionaryAnalysis = await analyzer.analyzeVideo(file, onProgress);
      
      setAnalysis(revolutionaryAnalysis);
      setSuccess('¡Análisis revolucionario completado! Insights únicos generados.');
      
      // Guardar en Supabase (opcional)
      if (user) {
        await saveAnalysisToDatabase(revolutionaryAnalysis);
      }
      
    } catch (err) {
      console.error('Error analyzing video:', err);
      setError(`Error en análisis revolucionario: ${err.message}`);
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
          viral_potential: analysisData.viralPotential,
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

  // Renderizar score con color
  const renderScore = (score, label) => {
    const getScoreColor = (score) => {
      if (score >= 80) return 'text-green-600 bg-green-100';
      if (score >= 60) return 'text-yellow-600 bg-yellow-100';
      return 'text-red-600 bg-red-100';
    };

    return (
      <div className="text-center">
        <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(score)}`}>
          {score}
        </div>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Microscope className="h-8 w-8 mr-3 text-purple-600" />
            Análisis de Video Revolucionario
          </h1>
          <p className="text-gray-600 mt-2">
            Sistema de análisis multi-dimensional con IA que genera insights únicos y profundos
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Subir Video</TabsTrigger>
            <TabsTrigger value="results">Resultados Revolucionarios</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Subir Video para Análisis Revolucionario
                </CardTitle>
                <CardDescription>
                  Sube tu video y obtén un análisis multi-dimensional con insights únicos
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
                    style={selectedFile ? { pointerEvents: 'none' } : {}}
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
                      <Microscope className="h-4 w-4 mr-2" />
                      Iniciar Análisis Revolucionario
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
                      <h3 className="text-lg font-semibold">Análisis Revolucionario en Progreso...</h3>
                      <Badge variant="outline" className="animate-pulse">
                        <Sparkles className="h-3 w-3 mr-1" />
                        IA Multi-Dimensional
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
                        <p className="text-sm text-gray-600">Duración Real</p>
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

                {/* Scores Multi-Dimensionales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Análisis Multi-Dimensional
                    </CardTitle>
                    <CardDescription>
                      Scores calculados por nuestro sistema de IA revolucionario
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                      {renderScore(analysis.viralPotential || 75, "Potencial Viral")}
                      {analysis.technicalAnalysis && renderScore(analysis.technicalAnalysis.qualityMetrics?.resolution?.score || 80, "Calidad Técnica")}
                      {analysis.visualAnalysis && renderScore(analysis.visualAnalysis.aggregatedScores?.visualScore || 70, "Impacto Visual")}
                      {analysis.audioAnalysis && renderScore(analysis.audioAnalysis.speechAnalysis?.engagement * 100 || 65, "Engagement Audio")}
                      {analysis.psychologicalAnalysis && renderScore((1 - analysis.psychologicalAnalysis.cognitiveLoad) * 100 || 75, "Claridad Mental")}
                      {analysis.competitiveAnalysis && renderScore(analysis.competitiveAnalysis.uniqueAdvantages?.length * 20 || 60, "Ventaja Competitiva")}
                    </div>
                  </CardContent>
                </Card>

                {/* Insights Únicos */}
                {analysis.uniqueInsights && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                        Insights Únicos y Profundos
                      </CardTitle>
                      <CardDescription>
                        Patrones ocultos y oportunidades no obvias identificadas por IA
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Patrones Ocultos */}
                      {analysis.uniqueInsights.hiddenPatterns && analysis.uniqueInsights.hiddenPatterns.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Sparkles className="h-4 w-4 mr-1" />
                            Patrones Ocultos Identificados
                          </h4>
                          <div className="space-y-2">
                            {analysis.uniqueInsights.hiddenPatterns.map((pattern, index) => (
                              <div key={index} className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-purple-800">{pattern.type}</span>
                                  <Badge variant="outline" className="text-xs">
                                    Confianza: {Math.round(pattern.confidence * 100)}%
                                  </Badge>
                                </div>
                                <p className="text-sm text-purple-700">{pattern.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Oportunidades No Obvias */}
                      {analysis.uniqueInsights.nonObviousOpportunities && analysis.uniqueInsights.nonObviousOpportunities.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            Oportunidades No Obvias
                          </h4>
                          <div className="space-y-2">
                            {analysis.uniqueInsights.nonObviousOpportunities.map((opportunity, index) => (
                              <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-green-800">{opportunity.type}</span>
                                  <Badge variant="outline" className="text-xs text-green-600">
                                    {opportunity.potentialImpact}
                                  </Badge>
                                </div>
                                <p className="text-sm text-green-700 mb-1">{opportunity.description}</p>
                                <p className="text-xs text-green-600 font-medium">Acción: {opportunity.actionable}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Triggers Psicológicos */}
                      {analysis.uniqueInsights.psychologicalTriggers && analysis.uniqueInsights.psychologicalTriggers.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Brain className="h-4 w-4 mr-1" />
                            Triggers Psicológicos Detectados
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {analysis.uniqueInsights.psychologicalTriggers.map((trigger, index) => (
                              <div key={index} className="p-2 bg-blue-50 rounded border">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-blue-800 text-sm">{trigger.type}</span>
                                  <Badge variant="outline" size="sm" className="text-xs">
                                    {trigger.strength}
                                  </Badge>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">{trigger.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Predicciones de Engagement */}
                {analysis.engagementPrediction && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Predicciones Inteligentes de Engagement
                      </CardTitle>
                      <CardDescription>
                        Métricas predichas específicas por plataforma con intervalos de confianza
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="youtube" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="youtube">YouTube</TabsTrigger>
                          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                          <TabsTrigger value="instagram">Instagram</TabsTrigger>
                          <TabsTrigger value="summary">Resumen</TabsTrigger>
                        </TabsList>

                        <TabsContent value="youtube" className="space-y-4">
                          {analysis.engagementPrediction.youtube && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-3 bg-red-50 rounded">
                                <Eye className="h-6 w-6 mx-auto text-red-600 mb-1" />
                                <div className="text-lg font-bold text-red-800">
                                  {analysis.engagementPrediction.youtube.predictedViews?.estimate?.toLocaleString() || 'N/A'}
                                </div>
                                <div className="text-xs text-red-600">
                                  Views Estimadas
                                </div>
                                {analysis.engagementPrediction.youtube.predictedViews?.confidence && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {analysis.engagementPrediction.youtube.predictedViews.confidence}% confianza
                                  </Badge>
                                )}
                              </div>
                              <div className="text-center p-3 bg-blue-50 rounded">
                                <Clock className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                                <div className="text-lg font-bold text-blue-800">
                                  {analysis.engagementPrediction.youtube.avgWatchTime?.percentage || 'N/A'}
                                </div>
                                <div className="text-xs text-blue-600">
                                  Retención Promedio
                                </div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded">
                                <Heart className="h-6 w-6 mx-auto text-green-600 mb-1" />
                                <div className="text-lg font-bold text-green-800">
                                  {analysis.engagementPrediction.youtube.engagement?.likes?.toLocaleString() || 'N/A'}
                                </div>
                                <div className="text-xs text-green-600">
                                  Likes Estimados
                                </div>
                              </div>
                              <div className="text-center p-3 bg-purple-50 rounded">
                                <MessageCircle className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                                <div className="text-lg font-bold text-purple-800">
                                  {analysis.engagementPrediction.youtube.engagement?.comments?.toLocaleString() || 'N/A'}
                                </div>
                                <div className="text-xs text-purple-600">
                                  Comentarios
                                </div>
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="tiktok" className="space-y-4">
                          {analysis.engagementPrediction.tiktok && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-3 bg-pink-50 rounded">
                                <Eye className="h-6 w-6 mx-auto text-pink-600 mb-1" />
                                <div className="text-lg font-bold text-pink-800">
                                  {analysis.engagementPrediction.tiktok.predictedViews?.estimate?.toLocaleString() || 'N/A'}
                                </div>
                                <div className="text-xs text-pink-600">
                                  Views TikTok
                                </div>
                              </div>
                              <div className="text-center p-3 bg-orange-50 rounded">
                                <Zap className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                                <div className="text-lg font-bold text-orange-800">
                                  {analysis.engagementPrediction.tiktok.viralPotential?.score || 'N/A'}
                                </div>
                                <div className="text-xs text-orange-600">
                                  Potencial Viral
                                </div>
                              </div>
                              <div className="text-center p-3 bg-cyan-50 rounded">
                                <Play className="h-6 w-6 mx-auto text-cyan-600 mb-1" />
                                <div className="text-lg font-bold text-cyan-800">
                                  {analysis.engagementPrediction.tiktok.completionRate || 'N/A'}
                                </div>
                                <div className="text-xs text-cyan-600">
                                  Tasa Completado
                                </div>
                              </div>
                              <div className="text-center p-3 bg-indigo-50 rounded">
                                <Share className="h-6 w-6 mx-auto text-indigo-600 mb-1" />
                                <div className="text-lg font-bold text-indigo-800">
                                  {analysis.engagementPrediction.tiktok.engagement?.shares?.toLocaleString() || 'N/A'}
                                </div>
                                <div className="text-xs text-indigo-600">
                                  Shares Estimados
                                </div>
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="instagram" className="space-y-4">
                          {analysis.engagementPrediction.instagram && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded">
                                <Eye className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                                <div className="text-lg font-bold text-purple-800">
                                  {analysis.engagementPrediction.instagram.reels?.views?.toLocaleString() || 'N/A'}
                                </div>
                                <div className="text-xs text-purple-600">
                                  Views Reels
                                </div>
                              </div>
                              <div className="text-center p-3 bg-gradient-to-r from-pink-50 to-red-50 rounded">
                                <Users className="h-6 w-6 mx-auto text-pink-600 mb-1" />
                                <div className="text-lg font-bold text-pink-800">
                                  {analysis.engagementPrediction.instagram.reels?.reach?.toLocaleString() || 'N/A'}
                                </div>
                                <div className="text-xs text-pink-600">
                                  Alcance
                                </div>
                              </div>
                              <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded">
                                <Star className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                                <div className="text-lg font-bold text-orange-800">
                                  {analysis.engagementPrediction.instagram.engagement?.rate || 'N/A'}
                                </div>
                                <div className="text-xs text-orange-600">
                                  Engagement Rate
                                </div>
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="summary" className="space-y-4">
                          {analysis.engagementPrediction.summary && (
                            <div className="space-y-4">
                              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                <Trophy className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                                <h3 className="text-xl font-bold mb-2">Mejor Plataforma Predicha</h3>
                                <div className="text-2xl font-bold text-purple-800">
                                  {analysis.engagementPrediction.summary.bestPlatform}
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                  Total estimado: {analysis.engagementPrediction.summary.totalEstimatedViews?.toLocaleString()} views
                                </div>
                              </div>
                              
                              {analysis.engagementPrediction.summary.keyInsights && (
                                <div>
                                  <h4 className="font-semibold mb-2">Insights Clave:</h4>
                                  <ul className="space-y-1">
                                    {analysis.engagementPrediction.summary.keyInsights.map((insight, index) => (
                                      <li key={index} className="flex items-center text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        {insight}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}

                {/* Recomendaciones Priorizadas */}
                {analysis.uniqueInsights?.prioritizedRecommendations && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Rocket className="h-5 w-5 mr-2" />
                        Recomendaciones Priorizadas
                      </CardTitle>
                      <CardDescription>
                        Acciones específicas ordenadas por impacto vs esfuerzo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.uniqueInsights.prioritizedRecommendations.slice(0, 6).map((rec, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <Badge variant="outline" className="mr-2 text-xs">
                                  {rec.category}
                                </Badge>
                                <Badge 
                                  variant={rec.priority >= 80 ? "default" : rec.priority >= 60 ? "secondary" : "outline"}
                                  className="text-xs"
                                >
                                  Prioridad: {rec.priority}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">{rec.recommendation}</p>
                              <p className="text-xs text-gray-600">
                                Impacto: {rec.impact} | Esfuerzo: {rec.effort}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Transcripción y Sentimientos */}
                {analysis.transcription && analysis.transcription.text && analysis.transcription.text !== 'Sin audio detectado' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Volume2 className="h-5 w-5 mr-2" />
                        Análisis de Audio y Sentimientos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Transcripción:</h4>
                        <div className="p-3 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto">
                          {analysis.transcription.text}
                        </div>
                      </div>
                      
                      {analysis.sentiment && (
                        <div>
                          <h4 className="font-semibold mb-2">Análisis de Sentimientos:</h4>
                          <div className="flex items-center space-x-4">
                            <Badge 
                              variant={analysis.sentiment.overall === 'Positivo' ? 'default' : 
                                      analysis.sentiment.overall === 'Negativo' ? 'destructive' : 'secondary'}
                            >
                              {analysis.sentiment.overall}
                            </Badge>
                            {analysis.sentiment.confidence && (
                              <span className="text-sm text-gray-600">
                                Confianza: {Math.round(analysis.sentiment.confidence * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Hashtags Optimizados */}
                {analysis.hashtags && analysis.hashtags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2" />
                        Hashtags Optimizados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

