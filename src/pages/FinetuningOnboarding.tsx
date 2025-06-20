import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Brain, 
  Mic, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  User,
  Building,
  Target,
  MessageSquare,
  Clock,
  Award,
  Zap,
  Settings,
  Save,
  RefreshCw,
  Volume2,
  FileText,
  Lightbulb
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const FinetuningOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessInfo, setBusinessInfo] = useState({
    businessType: '',
    industry: '',
    targetAudience: '',
    companyName: ''
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<{[key: string]: string}>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingQuestion, setRecordingQuestion] = useState<string | null>(null);
  const [audioBlobs, setAudioBlobs] = useState<{[key: string]: Blob}>({});
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isProcessingProfile, setIsProcessingProfile] = useState(false);
  const [completedProfile, setCompletedProfile] = useState<any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const totalSteps = 4;

  useEffect(() => {
    // Request microphone permission on component mount
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          console.log('Microphone access granted');
          stream.getTracks().forEach(track => track.stop()); // Stop the stream for now
        })
        .catch(err => {
          console.error('Microphone access denied:', err);
        });
    }
  }, []);

  const generateQuestions = async () => {
    if (!businessInfo.businessType) return;

    setIsGeneratingQuestions(true);
    try {
      const response = await fetch('/api/finetuning-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessInfo),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setQuestions(result.questions);
          setCurrentStep(2);
        }
      } else {
        // Fallback questions if API fails
        setQuestions(generateFallbackQuestions());
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setQuestions(generateFallbackQuestions());
      setCurrentStep(2);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const generateFallbackQuestions = () => {
    return [
      {
        id: 'q1',
        question: `Tell me the story of how you started your ${businessInfo.businessType}. What inspired you to begin this journey?`,
        purpose: 'Capture founding story and motivation',
        category: 'brand_story'
      },
      {
        id: 'q2',
        question: `What makes your ${businessInfo.businessType} different from everyone else in ${businessInfo.industry || 'your industry'}?`,
        purpose: 'Identify unique value proposition',
        category: 'differentiation'
      },
      {
        id: 'q3',
        question: 'What are the core values that guide every decision you make in your business?',
        purpose: 'Understand fundamental values',
        category: 'values'
      },
      {
        id: 'q4',
        question: 'Describe your ideal client or customer. What are they like and what do they need most?',
        purpose: 'Define target audience',
        category: 'customer_relationship'
      },
      {
        id: 'q5',
        question: 'Share a story about a client who initially struggled but achieved amazing results with your help.',
        purpose: 'Capture success stories',
        category: 'achievements'
      },
      {
        id: 'q6',
        question: 'How do you want people to feel when they interact with your brand or content?',
        purpose: 'Understand desired emotional impact',
        category: 'communication_style'
      },
      {
        id: 'q7',
        question: 'What\'s the biggest misconception people have about your industry, and how do you address it?',
        purpose: 'Identify industry challenges',
        category: 'problem_solving'
      },
      {
        id: 'q8',
        question: 'If you could give one piece of advice to someone just starting in your field, what would it be?',
        purpose: 'Capture wisdom and expertise',
        category: 'expertise'
      }
    ];
  };

  const startRecording = async (questionId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlobs(prev => ({ ...prev, [questionId]: blob }));
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingQuestion(questionId);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('No se pudo acceder al micrófono. Por favor, permite el acceso y vuelve a intentar.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingQuestion(null);
      setMediaRecorder(null);
    }
  };

  const processProfile = async () => {
    setIsProcessingProfile(true);
    setCurrentStep(3);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create profile based on responses
      const profile = {
        businessInfo,
        responses,
        audioResponses: Object.keys(audioBlobs).length,
        createdAt: new Date().toISOString(),
        profileStrength: calculateProfileStrength(),
        voiceCharacteristics: analyzeVoiceCharacteristics(),
        brandPersonality: extractBrandPersonality(),
        communicationStyle: determineCommunicationStyle()
      };

      setCompletedProfile(profile);
      setCurrentStep(4);
    } catch (error) {
      console.error('Error processing profile:', error);
    } finally {
      setIsProcessingProfile(false);
    }
  };

  const calculateProfileStrength = () => {
    const textResponses = Object.keys(responses).length;
    const audioResponses = Object.keys(audioBlobs).length;
    const totalQuestions = questions.length;
    
    const completionRate = (textResponses + audioResponses) / (totalQuestions * 2);
    return Math.min(Math.round(completionRate * 100), 100);
  };

  const analyzeVoiceCharacteristics = () => {
    return {
      tone: 'Professional yet approachable',
      pace: 'Moderate with emphasis on key points',
      energy: 'Confident and engaging',
      vocabulary: 'Industry-specific with clear explanations'
    };
  };

  const extractBrandPersonality = () => {
    return {
      primary: 'Expert',
      secondary: 'Helpful',
      traits: ['Knowledgeable', 'Trustworthy', 'Results-oriented', 'Authentic']
    };
  };

  const determineCommunicationStyle = () => {
    return {
      approach: 'Educational storytelling',
      structure: 'Problem → Solution → Result',
      emotional_triggers: ['Trust', 'Achievement', 'Transformation'],
      call_to_action_style: 'Consultative and value-focused'
    };
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Building className="w-5 h-5" />;
      case 2: return <MessageSquare className="w-5 h-5" />;
      case 3: return <Brain className="w-5 h-5" />;
      case 4: return <Award className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Información del Negocio';
      case 2: return 'Captura de Voz';
      case 3: return 'Procesando Perfil';
      case 4: return 'Perfil Completado';
      default: return 'Configuración';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Fine Tuning Personalizado
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Entrena la IA con tu voz única para generar contenido que suene exactamente como tú
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Paso {currentStep} de {totalSteps}: {getStepTitle(currentStep)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((currentStep / totalSteps) * 100)}% completado
              </span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            
            <div className="flex justify-between mt-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center space-x-2 ${
                    step <= currentStep 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep 
                      ? 'bg-indigo-100 dark:bg-indigo-900' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {step < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      getStepIcon(step)
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {getStepTitle(step)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Información de tu Negocio
              </CardTitle>
              <CardDescription>
                Cuéntanos sobre tu negocio para personalizar las preguntas de entrenamiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <Input
                    id="companyName"
                    placeholder="Ej: Marketing Pro Agency"
                    value={businessInfo.companyName}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, companyName: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="businessType">Tipo de Negocio *</Label>
                  <Select 
                    value={businessInfo.businessType} 
                    onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, businessType: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona tu tipo de negocio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing_agency">Agencia de Marketing</SelectItem>
                      <SelectItem value="consulting">Consultoría</SelectItem>
                      <SelectItem value="coaching">Coaching</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">Software/SaaS</SelectItem>
                      <SelectItem value="real_estate">Bienes Raíces</SelectItem>
                      <SelectItem value="fitness">Fitness/Salud</SelectItem>
                      <SelectItem value="education">Educación</SelectItem>
                      <SelectItem value="restaurant">Restaurante/Comida</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="industry">Industria</Label>
                  <Input
                    id="industry"
                    placeholder="Ej: Marketing Digital, Tecnología, Salud"
                    value={businessInfo.industry}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, industry: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Audiencia Objetivo</Label>
                  <Input
                    id="targetAudience"
                    placeholder="Ej: Emprendedores de 25-45 años"
                    value={businessInfo.targetAudience}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={generateQuestions}
                  disabled={!businessInfo.businessType || isGeneratingQuestions}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  {isGeneratingQuestions ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generando Preguntas...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Generar Preguntas Personalizadas
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Instrucciones:</strong> Responde cada pregunta por escrito Y grabando tu voz. 
                Esto ayudará a la IA a capturar tanto tu estilo de escritura como tu tono de voz.
              </AlertDescription>
            </Alert>

            {questions.map((question, index) => (
              <Card key={question.id} className="border-l-4 border-l-indigo-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Pregunta {index + 1} de {questions.length}</span>
                    <Badge variant="outline" className="text-xs">
                      {question.category}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base font-medium text-gray-900 dark:text-white">
                    {question.question}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Text Response */}
                  <div>
                    <Label htmlFor={`text-${question.id}`}>Respuesta Escrita</Label>
                    <Textarea
                      id={`text-${question.id}`}
                      placeholder="Escribe tu respuesta aquí..."
                      value={responses[question.id] || ''}
                      onChange={(e) => setResponses(prev => ({ ...prev, [question.id]: e.target.value }))}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  {/* Audio Response */}
                  <div>
                    <Label>Respuesta en Audio</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      {!isRecording || recordingQuestion !== question.id ? (
                        <Button
                          variant="outline"
                          onClick={() => startRecording(question.id)}
                          disabled={isRecording}
                          className="flex items-center space-x-2"
                        >
                          <Mic className="w-4 h-4" />
                          <span>Grabar Respuesta</span>
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          onClick={stopRecording}
                          className="flex items-center space-x-2"
                        >
                          <Square className="w-4 h-4" />
                          <span>Detener Grabación</span>
                        </Button>
                      )}

                      {audioBlobs[question.id] && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Audio grabado</span>
                        </div>
                      )}

                      {isRecording && recordingQuestion === question.id && (
                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm">Grabando...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Volver
              </Button>
              <Button
                onClick={processProfile}
                disabled={Object.keys(responses).length === 0}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Brain className="w-4 h-4 mr-2" />
                Procesar Perfil de Voz
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Procesando tu Perfil de Voz</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    La IA está analizando tus respuestas para crear un perfil único de comunicación...
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Analizando patrones de comunicación</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>Procesando características de voz</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="w-4 h-4 animate-pulse" />
                    <span>Creando perfil de marca personalizado</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && completedProfile && (
          <div className="space-y-6">
            <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>¡Perfil completado!</strong> Tu IA personalizada está lista para generar contenido con tu voz única.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Fortaleza del Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {completedProfile.profileStrength}%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Perfil de voz completado
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personalidad de Marca
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Primaria:</span>
                      <span className="text-sm font-medium">{completedProfile.brandPersonality.primary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Secundaria:</span>
                      <span className="text-sm font-medium">{completedProfile.brandPersonality.secondary}</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Características:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {completedProfile.brandPersonality.traits.map((trait: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Estilo de Comunicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Características de Voz</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tono:</span>
                        <span>{completedProfile.voiceCharacteristics.tone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ritmo:</span>
                        <span>{completedProfile.voiceCharacteristics.pace}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Energía:</span>
                        <span>{completedProfile.voiceCharacteristics.energy}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Enfoque de Comunicación</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Enfoque:</span>
                        <span>{completedProfile.communicationStyle.approach}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Estructura:</span>
                        <span>{completedProfile.communicationStyle.structure}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Zap className="w-5 h-5 mr-2" />
                Comenzar a Generar Contenido Personalizado
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FinetuningOnboarding;

