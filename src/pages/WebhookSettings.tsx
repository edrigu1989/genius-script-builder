import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../components/ui/use-toast';
import { Zap, Check, X, AlertCircle, Copy, RefreshCw, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WebhookConfig {
  id?: string;
  user_id: string;
  webhook_url: string;
  webhook_type: string;
  is_active: boolean;
  settings: {
    tone?: string;
    length?: string;
    platform?: string;
    niche?: string;
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
}

const WebhookSettings = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({
    user_id: user?.id || '',
    webhook_url: '',
    webhook_type: 'content_creator',
    is_active: true,
    settings: {
      tone: 'conversational',
      length: 'medium',
      platform: 'youtube',
      niche: 'technology',
    }
  });

  // Cargar configuración existente
  useEffect(() => {
    if (user) {
      loadWebhookConfig();
    }
  }, [user]);

  const loadWebhookConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error loading webhook config:', error);
      } else if (data) {
        setWebhookConfig(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveWebhookConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('webhook_configs')
        .upsert({
          ...webhookConfig,
          user_id: user?.id,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        toast({
          title: 'Error al guardar la configuración',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Configuración guardada',
          description: 'Tu configuración de webhook ha sido guardada correctamente.',
        });
        if (data && data[0]) {
          setWebhookConfig(data[0]);
        }
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Ha ocurrido un error al guardar la configuración.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testWebhook = async () => {
    setTestLoading(true);
    try {
      // Simular una prueba de webhook
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Conexión exitosa',
        description: 'El webhook respondió correctamente.',
      });
    } catch (err: any) {
      toast({
        title: 'Error de conexión',
        description: err.message || 'No se pudo conectar con el webhook.',
        variant: 'destructive',
      });
    } finally {
      setTestLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWebhookConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (name: string, value: string) => {
    setWebhookConfig(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: value
      }
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setWebhookConfig(prev => ({ ...prev, is_active: checked }));
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookConfig.webhook_url);
    toast({
      title: 'URL copiada',
      description: 'La URL del webhook ha sido copiada al portapapeles.',
    });
  };

  const webhookTypes = [
    { value: 'content_creator', label: 'Content Creator' },
    { value: 'sales_copy', label: 'Sales Copy' },
    { value: 'educational', label: 'Educational' },
  ];

  const toneOptions = [
    { value: 'conversational', label: 'Conversacional' },
    { value: 'professional', label: 'Profesional' },
    { value: 'casual', label: 'Casual' },
    { value: 'enthusiastic', label: 'Entusiasta' },
    { value: 'humorous', label: 'Humorístico' },
  ];

  const lengthOptions = [
    { value: 'short', label: 'Corto (30-60 seg)' },
    { value: 'medium', label: 'Medio (1-3 min)' },
    { value: 'long', label: 'Largo (3-5 min)' },
    { value: 'extended', label: 'Extendido (5+ min)' },
  ];

  const platformOptions = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Configuración de N8N</h1>
            <p className="text-muted-foreground">Configura tu webhook personalizado para la generación de scripts</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={webhookConfig.is_active}
                onCheckedChange={handleSwitchChange}
                id="webhook-active"
              />
              <Label htmlFor="webhook-active" className="cursor-pointer">
                {webhookConfig.is_active ? 'Activo' : 'Inactivo'}
              </Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadWebhookConfig}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Recargar
            </Button>
            <Button
              onClick={saveWebhookConfig}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-1" />
              Guardar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Configuración del Webhook</CardTitle>
                <CardDescription>
                  Configura tu webhook de N8N para la generación personalizada de scripts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook_url">URL del Webhook</Label>
                  <div className="flex">
                    <Input
                      id="webhook_url"
                      name="webhook_url"
                      value={webhookConfig.webhook_url}
                      onChange={handleInputChange}
                      placeholder="https://n8n.tudominio.com/webhook/..."
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyWebhookUrl}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ingresa la URL del webhook proporcionada por tu instancia de N8N
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook_type">Tipo de Asistente</Label>
                  <Select
                    value={webhookConfig.webhook_type}
                    onValueChange={(value) => setWebhookConfig(prev => ({ ...prev, webhook_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {webhookTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    El tipo de asistente determina el enfoque y estilo de los scripts generados
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={testWebhook}
                    disabled={testLoading || !webhookConfig.webhook_url}
                    className="w-full"
                  >
                    {testLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Probando conexión...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Probar Conexión
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`mt-6 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader>
                <CardTitle>Preferencias de Generación</CardTitle>
                <CardDescription>
                  Personaliza cómo se generarán tus scripts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tone">Tono</Label>
                        <Select
                          value={webhookConfig.settings.tone}
                          onValueChange={(value) => handleSettingsChange('tone', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tono" />
                          </SelectTrigger>
                          <SelectContent>
                            {toneOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="length">Duración</Label>
                        <Select
                          value={webhookConfig.settings.length}
                          onValueChange={(value) => handleSettingsChange('length', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una duración" />
                          </SelectTrigger>
                          <SelectContent>
                            {lengthOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="platform">Plataforma</Label>
                        <Select
                          value={webhookConfig.settings.platform}
                          onValueChange={(value) => handleSettingsChange('platform', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una plataforma" />
                          </SelectTrigger>
                          <SelectContent>
                            {platformOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="niche">Nicho</Label>
                        <Input
                          id="niche"
                          value={webhookConfig.settings.niche || ''}
                          onChange={(e) => handleSettingsChange('niche', e.target.value)}
                          placeholder="Ej: tecnología, fitness, finanzas..."
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom_instructions">Instrucciones Personalizadas</Label>
                      <Textarea
                        id="custom_instructions"
                        value={webhookConfig.settings.custom_instructions || ''}
                        onChange={(e) => handleSettingsChange('custom_instructions', e.target.value)}
                        placeholder="Instrucciones específicas para la generación de scripts..."
                        rows={4}
                      />
                      <p className="text-sm text-muted-foreground">
                        Estas instrucciones se enviarán junto con cada solicitud de generación de script
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max_tokens">Máximo de Tokens</Label>
                        <Input
                          id="max_tokens"
                          type="number"
                          value={webhookConfig.settings.max_tokens || 2000}
                          onChange={(e) => handleSettingsChange('max_tokens', e.target.value)}
                          min={100}
                          max={4000}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperatura</Label>
                        <Input
                          id="temperature"
                          type="number"
                          value={webhookConfig.settings.temperature || 0.7}
                          onChange={(e) => handleSettingsChange('temperature', e.target.value)}
                          min={0}
                          max={1}
                          step={0.1}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="templates" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="template">Template Personalizado</Label>
                      <Textarea
                        id="template"
                        value={webhookConfig.settings.template || ''}
                        onChange={(e) => handleSettingsChange('template', e.target.value)}
                        placeholder="Template personalizado para la generación de scripts..."
                        rows={8}
                      />
                      <p className="text-sm text-muted-foreground">
                        Puedes usar variables como {'{title}'}, {'{keywords}'}, {'{duration}'} en tu template
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={saveWebhookConfig}
                  disabled={loading}
                  className="ml-auto"
                >
                  {loading ? 'Guardando...' : 'Guardar Preferencias'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Guía de Configuración</CardTitle>
                <CardDescription>
                  Cómo configurar tu webhook en N8N
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">¿Qué es N8N?</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    N8N es una herramienta de automatización de flujos de trabajo que te permite conectar diferentes servicios y APIs.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      1
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Crea una cuenta en N8N</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Regístrate en n8n.io o configura tu propia instancia
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      2
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Crea un nuevo workflow</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Añade un nodo "Webhook" como trigger
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      3
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Configura el nodo OpenAI</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Conecta con tu API key de OpenAI
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      4
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Copia la URL del webhook</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pégala en el campo "URL del Webhook" en esta página
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      5
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Activa el workflow</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Asegúrate de que tu workflow esté activo en N8N
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full" onClick={() => window.open('https://docs.n8n.io/workflows/integrations/builtin/app-nodes/n8n-nodes-base.webhook/', '_blank')}>
                    Ver documentación de N8N
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`mt-6 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader>
                <CardTitle>Estado del Webhook</CardTitle>
                <CardDescription>
                  Monitorea el estado de tu conexión
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conexión</span>
                    <div className={`flex items-center ${webhookConfig.webhook_url ? 'text-green-500' : 'text-red-500'}`}>
                      {webhookConfig.webhook_url ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          <span>Configurado</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          <span>No configurado</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado</span>
                    <div className={`flex items-center ${webhookConfig.is_active ? 'text-green-500' : 'text-yellow-500'}`}>
                      {webhookConfig.is_active ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          <span>Activo</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>Inactivo</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tipo</span>
                    <span className="text-sm">
                      {webhookTypes.find(t => t.value === webhookConfig.webhook_type)?.label || 'No especificado'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Última actualización</span>
                    <span className="text-sm">
                      {webhookConfig.updated_at 
                        ? new Date(webhookConfig.updated_at).toLocaleString() 
                        : 'Nunca'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebhookSettings;

