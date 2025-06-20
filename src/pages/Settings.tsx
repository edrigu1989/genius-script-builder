import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useTranslation } from 'react-i18next';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Database,
  Key,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: true,
      analytics: true
    },
    privacy: {
      analytics: true,
      dataSharing: false,
      publicProfile: false
    },
    api: {
      geminiKey: 'AIzaSyD2n8eHRf4J8U3wcQI5ZMEAd6-VwfNRyfQ',
      rateLimit: '1000',
      autoRetry: true
    },
    preferences: {
      language: i18n.language,
      theme: theme,
      autoSave: true,
      compactMode: false
    }
  });

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, language: languageCode }
    }));
  };

  const handleSave = () => {
    // Aquí se guardarían las configuraciones
    console.log('Saving settings:', settings);
  };

  const handleDeleteAccount = () => {
    // Aquí se manejaría la eliminación de cuenta
    console.log('Delete account requested');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Personaliza tu experiencia y gestiona tu cuenta
              </p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-purple-500">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="privacy">Privacidad</TabsTrigger>
            <TabsTrigger value="api">API & Integraciones</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Actualiza tu información de perfil y preferencias de cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input 
                      id="name" 
                      defaultValue={user?.user_metadata?.full_name || ''} 
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue={user?.email || ''} 
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input 
                      id="company" 
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketer">Marketing Manager</SelectItem>
                        <SelectItem value="creator">Content Creator</SelectItem>
                        <SelectItem value="agency">Agency Owner</SelectItem>
                        <SelectItem value="freelancer">Freelancer</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Preferencias de Idioma
                </CardTitle>
                <CardDescription>
                  Selecciona tu idioma preferido para la interfaz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={settings.preferences.language === lang.code ? "default" : "outline"}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="justify-start"
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Apariencia
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo Oscuro</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Activa el tema oscuro para una mejor experiencia visual
                    </p>
                  </div>
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={toggleTheme}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo Compacto</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reduce el espaciado para mostrar más contenido
                    </p>
                  </div>
                  <Switch 
                    checked={settings.preferences.compactMode}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, compactMode: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Preferencias de Notificaciones
                </CardTitle>
                <CardDescription>
                  Controla qué notificaciones quieres recibir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recibe actualizaciones importantes por email
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones Push</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recibe notificaciones en tiempo real en tu navegador
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing y Promociones</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recibe información sobre nuevas funciones y ofertas
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifications.marketing}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, marketing: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reportes de Analytics</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recibe resúmenes semanales de tu performance
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifications.analytics}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, analytics: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Configuración de Privacidad
                </CardTitle>
                <CardDescription>
                  Controla cómo se usan y comparten tus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics de Uso</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ayúdanos a mejorar la aplicación compartiendo datos de uso anónimos
                    </p>
                  </div>
                  <Switch 
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, analytics: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compartir Datos con Terceros</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Permitir compartir datos agregados con socios para mejorar el servicio
                    </p>
                  </div>
                  <Switch 
                    checked={settings.privacy.dataSharing}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, dataSharing: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Perfil Público</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Hacer tu perfil visible para otros usuarios de la plataforma
                    </p>
                  </div>
                  <Switch 
                    checked={settings.privacy.publicProfile}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, publicProfile: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Configuración de API
                </CardTitle>
                <CardDescription>
                  Gestiona tus claves de API y configuraciones de integración
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gemini-key">Clave de API de Gemini</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input 
                        id="gemini-key"
                        type={showApiKey ? "text" : "password"}
                        value={settings.api.geminiKey}
                        onChange={(e) => 
                          setSettings(prev => ({
                            ...prev,
                            api: { ...prev.api, geminiKey: e.target.value }
                          }))
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Tu clave de API de Gemini para análisis de video y generación de contenido
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Límite de Requests por Minuto</Label>
                  <Input 
                    id="rate-limit"
                    type="number"
                    value={settings.api.rateLimit}
                    onChange={(e) => 
                      setSettings(prev => ({
                        ...prev,
                        api: { ...prev.api, rateLimit: e.target.value }
                      }))
                    }
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Número máximo de requests por minuto (recomendado: 1000)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-retry en Errores</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reintentar automáticamente requests fallidos
                    </p>
                  </div>
                  <Switch 
                    checked={settings.api.autoRetry}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        api: { ...prev.api, autoRetry: checked }
                      }))
                    }
                  />
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Estado de la API:</strong> Conectada y funcionando correctamente.
                    Última verificación: hace 2 minutos.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integraciones de Plataformas</CardTitle>
                <CardDescription>
                  Conecta tus cuentas de redes sociales para análisis automático
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        f
                      </div>
                      <div>
                        <p className="font-medium">Facebook</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">No conectado</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        IG
                      </div>
                      <div>
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm text-green-600 dark:text-green-400">Conectado</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Activo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Configuración Avanzada
                </CardTitle>
                <CardDescription>
                  Opciones avanzadas para usuarios expertos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-guardado</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Guardar automáticamente los cambios cada 30 segundos
                    </p>
                  </div>
                  <Switch 
                    checked={settings.preferences.autoSave}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, autoSave: checked }
                      }))
                    }
                  />
                </div>

                <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                  <h4 className="font-medium text-red-600 dark:text-red-400">Zona de Peligro</h4>
                  
                  <div className="space-y-2">
                    <Label>Exportar Datos</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Descarga todos tus datos en formato JSON
                    </p>
                    <Button variant="outline">
                      Exportar Datos
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Eliminar Cuenta</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Elimina permanentemente tu cuenta y todos los datos asociados
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar Cuenta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

