import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  Upload, 
  Video, 
  Play, 
  Pause, 
  Download,
  Eye,
  Heart,
  MessageCircle,
  Share,
  TrendingUp,
  Clock,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  FileVideo,
  Link,
  BarChart3,
  Brain,
  Lightbulb
} from 'lucide-react';

const VideoAnalysisPage = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState([]);

  // Simular análisis de video
  const analyzeVideo = async (source, type) => {
    try {
      setAnalyzing(true);
      setProgress(0);
      setError('');
      setSuccess('');

      // Simular progreso
      const progressSteps = [
        { step: 10, message: 'Subiendo video...' },
        { step: 25, message: 'Extrayendo audio...' },
        { step: 40, message: 'Transcribiendo contenido...' },
        { step: 60, message: 'Analizando sentimientos...' },
        { step: 80, message: 'Calculando métricas...' },
        { step: 95, message: 'Generando insights...' },
        { step: 100, message: 'Análisis completado!' }
      ];

      for (const { step, message } of progressSteps) {
        setProgress(step);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Generar análisis simulado
      const mockAnalysis = {
        id: Date.now(),
        source: source,
        type: type,
        duration: Math.floor(Math.random() * 300) + 60, // 1-5 minutos
        transcription: generateMockTranscription(),
        sentiment: generateMockSentiment(),
        metrics: generateMockMetrics(),
        insights: generateMockInsights(),
        recommendations: generateMockRecommendations(),
        hashtags: generateMockHashtags(),
        bestTimeToPost: generateBestTime(),
        viralPotential: Math.floor(Math.random() * 100) + 1,
        analyzedAt: new Date().toISOString()
      };

      setAnalysis(mockAnalysis);
      
      // Guardar en historial
      const newHistory = [mockAnalysis, ...analysisHistory].slice(0, 10);
      setAnalysisHistory(newHistory);
      
      setSuccess('¡Análisis completado exitosamente!');
    } catch (err) {
      console.error('Error analyzing video:', err);
      setError('Error analizando el video. Inténtalo de nuevo.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Por favor selecciona un archivo de video válido.');
      }
    }
  }, []);

  const handleUrlAnalysis = () => {
    if (!videoUrl.trim()) {
      setError('Por favor ingresa una URL válida.');
      return;
    }
    analyzeVideo(videoUrl, 'url');
  };

  const handleFileAnalysis = () => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo de video.');
      return;
    }
    analyzeVideo(selectedFile.name, 'file');
  };

  // Funciones para generar datos simulados
  const generateMockTranscription = () => {
    const transcriptions = [
      "Hola a todos, bienvenidos a mi canal. Hoy vamos a hablar sobre marketing digital y cómo pueden mejorar sus estrategias de contenido. Es importante entender que el marketing no es solo vender, sino crear valor para su audiencia...",
      "En este video les voy a mostrar las mejores técnicas para crear contenido viral en redes sociales. Primero, necesitan entender a su audiencia y qué tipo de contenido les gusta consumir...",
      "¿Quieren saber cómo generar más engagement en sus posts? Les voy a compartir 5 estrategias que han funcionado increíblemente bien para mi negocio y mis clientes..."
    ];
    return transcriptions[Math.floor(Math.random() * transcriptions.length)];
  };

  const generateMockSentiment = () => ({
    overall: ['Positivo', 'Neutral', 'Muy Positivo'][Math.floor(Math.random() * 3)],
    confidence: Math.floor(Math.random() * 30) + 70,
    emotions: {
      alegría: Math.floor(Math.random() * 40) + 30,
      confianza: Math.floor(Math.random() * 35) + 25,
      entusiasmo: Math.floor(Math.random() * 30) + 20,
      calma: Math.floor(Math.random() * 25) + 15
    }
  });

  const generateMockMetrics = () => ({
    predictedViews: Math.floor(Math.random() * 50000) + 10000,
    predictedLikes: Math.floor(Math.random() * 2000) + 500,
    predictedComments: Math.floor(Math.random() * 200) + 50,
    predictedShares: Math.floor(Math.random() * 500) + 100,
    engagementRate: (Math.random() * 8 + 2).toFixed(2),
    retentionRate: Math.floor(Math.random() * 30) + 60
  });

  const generateMockInsights = () => [
    "El tono positivo y entusiasta del video puede generar alta engagement",
    "La duración es óptima para mantener la atención de la audiencia",
    "El contenido educativo tiende a tener mejor rendimiento orgánico",
    "Se detectaron palabras clave relevantes para el nicho de marketing"
  ];

  const generateMockRecommendations = () => [
    "Agregar una llamada a la acción más clara al final del video",
    "Incluir subtítulos para mejorar la accesibilidad",
    "Optimizar la miniatura con colores más llamativos",
    "Publicar entre las 7-9 PM para mayor alcance"
  ];

  const generateMockHashtags = () => [
    "#MarketingDigital", "#ContentCreator", "#Emprendimiento", 
    "#RedesSociales", "#Viral", "#Engagement", "#Estrategia", "#Negocio"
  ];

  const generateBestTime = () => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const times = ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '8:00 PM'];
    return {
      day: days[Math.floor(Math.random() * days.length)],
      time: times[Math.floor(Math.random() * times.length)]
    };
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Análisis de Videos con IA</h1>
            <p className="text-gray-600">Analiza tus videos para optimizar el rendimiento y engagement</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Historial
            </Button>
          </div>
        </div>

        {/* Alerts */}
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

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Subir Video</TabsTrigger>
            <TabsTrigger value="url">Desde URL</TabsTrigger>
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
                  Sube tu video y obtén insights detallados sobre su potencial de rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Arrastra tu video aquí o haz clic para seleccionar</p>
                    <p className="text-sm text-gray-600">Formatos soportados: MP4, MOV, AVI, MKV (máx. 500MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload">
                    <Button className="mt-4" asChild>
                      <span>Seleccionar Video</span>
                    </Button>
                  </label>
                </div>

                {selectedFile && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Video className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-gray-600">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleFileAnalysis}
                        disabled={analyzing}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {analyzing ? (
                          <>
                            <Brain className="h-4 w-4 mr-2 animate-pulse" />
                            Analizando...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Analizar Video
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="url" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  Analizar desde URL
                </CardTitle>
                <CardDescription>
                  Analiza videos de YouTube, TikTok, Instagram y otras plataformas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">URL del Video</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleUrlAnalysis}
                    disabled={analyzing || !videoUrl.trim( )}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {analyzing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-pulse" />
                        Analizando Video...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Analizar desde URL
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Video className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-sm font-medium">YouTube</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-medium">TikTok</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Video className="h-6 w-6 text-pink-600" />
                    </div>
                    <p className="text-sm font-medium">Instagram</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Video className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">Facebook</p>
                  </div>
                </div>
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
                      {progress < 100 ? `Progreso: ${progress}%` : '¡Análisis completado!'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Resumen General */}
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
                        <p className="text-sm text-gray-600">Duración</p>
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
                      <CardTitle>Hashtags Recomendados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="secondary" className="text-blue-600">
                            {hashtag}
                          </Badge>
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
                        <p className="text-2xl font-bold text-green-600">
                          {analysis.bestTimeToPost.day}
                        </p>
                        <p className="text-lg text-gray-600">
                          {analysis.bestTimeToPost.time}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Basado en análisis de audiencia y engagement
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Transcripción */}
                <Card>
                  <CardHeader>
                    <CardTitle>Transcripción Automática</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">{analysis.transcription}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!analysis && !analyzing && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay análisis disponibles</h3>
                  <p className="text-gray-600 mb-4">
                    Sube un video o ingresa una URL para comenzar el análisis
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VideoAnalysisPage;
