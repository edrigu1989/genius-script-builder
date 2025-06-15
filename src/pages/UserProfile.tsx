import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, userPreferences } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import DashboardLayout from '../components/DashboardLayout';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  CreditCard,
  Zap,
  CheckCircle,
  AlertCircle,
  Crown,
  Target,
  Palette,
  Globe
} from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    full_name: '',
    company_name: '',
    industry: '',
    website: '',
    bio: '',
    timezone: '',
    language: 'es',
    avatar_url: ''
  });

  const [preferencesData, setPreferencesData] = useState({
    default_tone: 'professional',
    default_platform: 'facebook',
    preferred_ai_model: 'openai',
    auto_save_scripts: true,
    email_notifications: true,
    marketing_emails: false,
    weekly_reports: true,
    brand_voice: '',
    target_audience_default: '',
    content_categories: [],
    custom_prompts: []
  });

  const [usageLimits, setUsageLimits] = useState({
    plan_type: 'free',
    scripts_generated: 0,
    scripts_limit: 10,
    ai_calls_this_month: 0,
    ai_calls_limit: 50,
    storage_used: 0,
    storage_limit: 100, // MB
    team_members: 1,
    team_limit: 1
  });

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Cargar preferencias del usuario
      const prefs = await userPreferences.get(user.id);
      if (prefs) {
        setPreferences(prefs);
        setPreferencesData({ ...preferencesData, ...prefs });
      }

      // Cargar estadísticas del usuario
      const scripts = await api.getClientScripts(user.id);
      const analytics = await api.getClientAnalytics(user.id);
      
      setUserStats({
        total_scripts: scripts?.length || 0,
        total_views: analytics?.reduce((sum, a) => sum + (a.total_views || 0), 0) || 0,
        avg_engagement: analytics?.length > 0 
          ? analytics.reduce((sum, a) => sum + (a.avg_engagement_rate || 0), 0) / analytics.length 
          : 0,
        best_platform: 'Facebook', // Calcular dinámicamente
        member_since: user.created_at
      });

      // Simular datos de uso (en producción vendría de Supabase)
      setUsageLimits({
        ...usageLimits,
        scripts_generated: scripts?.length || 0,
        ai_calls_this_month: scripts?.length * 2 || 0
      });

    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Error cargando datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Guardar preferencias en Supabase
      await userPreferences.upsert(user.id, {
        ...preferencesData,
        profile_data: profileData
      });

      setSuccess('Perfil actualizado exitosamente');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Error guardando el perfil');
    } finally {
      setSaving(false);
    }
  };

  const getPlanBadge = (plan) => {
    const badges = {
      free: { label: 'Gratis', color: 'bg-gray-100 text-gray-800' },
      pro: { label: 'Pro', color: 'bg-blue-100 text-blue-800' },
      enterprise: { label: 'Enterprise', color: 'bg-purple-100 text-purple-800' }
    };
    return badges[plan] || badges.free;
  };

  const getUsagePercentage = (used, limit) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Perfil de Usuario</h1>
            <p className="text-gray-600">Gestiona tu cuenta y preferencias</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPlanBadge(usageLimits.plan_type).color}>
              <Crown className="h-3 w-3 mr-1" />
              {getPlanBadge(usageLimits.plan_type).label}
            </Badge>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estadísticas del Usuario */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-white">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{user?.email}</h3>
                  <p className="text-sm text-gray-600">
                    Miembro desde {new Date(userStats?.member_since || Date.now()).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Scripts Generados</span>
                    <span className="font-semibold">{userStats?.total_scripts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total de Vistas</span>
                    <span className="font-semibold">{(userStats?.total_views || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Engagement Promedio</span>
                    <span className="font-semibold">{(userStats?.avg_engagement || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mejor Plataforma</span>
                    <span className="font-semibold">{userStats?.best_platform || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Límites de Uso */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Uso del Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Scripts */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Scripts este mes</span>
                    <span>{usageLimits.scripts_generated}/{usageLimits.scripts_limit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usageLimits.scripts_generated, usageLimits.scripts_limit))}`}
                      style={{ width: `${getUsagePercentage(usageLimits.scripts_generated, usageLimits.scripts_limit)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Llamadas IA */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Llamadas IA</span>
                    <span>{usageLimits.ai_calls_this_month}/{usageLimits.ai_calls_limit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usageLimits.ai_calls_this_month, usageLimits.ai_calls_limit))}`}
                      style={{ width: `${getUsagePercentage(usageLimits.ai_calls_this_month, usageLimits.ai_calls_limit)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Almacenamiento */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Almacenamiento</span>
                    <span>{usageLimits.storage_used}MB/{usageLimits.storage_limit}MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usageLimits.storage_used, usageLimits.storage_limit))}`}
                      style={{ width: `${getUsagePercentage(usageLimits.storage_used, usageLimits.storage_limit)}%` }}
                    ></div>
                  </div>
                </div>

                <Button className="w-full mt-4" variant="outline">
                  <Crown className="h-4 w-4 mr-2" />
                  Actualizar Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Configuraciones */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="preferences">Preferencias</TabsTrigger>
                <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
              </TabsList>

              {/* Tab Perfil */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Perfil</CardTitle>
                    <CardDescription>
                      Actualiza tu información personal y de empresa
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Nombre Completo</Label>
                        <Input
                          id="full_name"
                          value={profileData.full_name}
                          onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company_name">Empresa</Label>
                        <Input
                          id="company_name"
                          value={profileData.company_name}
                          onChange={(e) => setProfileData({...profileData, company_name: e.target.value})}
                          placeholder="Nombre de tu empresa"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="industry">Industria</Label>
                        <Select value={profileData.industry} onValueChange={(value) => setProfileData({...profileData, industry: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu industria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Tecnología</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="healthcare">Salud</SelectItem>
                            <SelectItem value="education">Educación</SelectItem>
                            <SelectItem value="finance">Finanzas</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="website">Sitio Web</Label>
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                          placeholder="https://tuempresa.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Cuéntanos sobre ti y tu empresa..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timezone">Zona Horaria</Label>
                        <Select value={profileData.timezone} onValueChange={(value) => setProfileData({...profileData, timezone: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu zona horaria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                            <SelectItem value="America/Argentina/Buenos_Aires">Argentina (GMT-3)</SelectItem>
                            <SelectItem value="America/Bogota">Colombia (GMT-5)</SelectItem>
                            <SelectItem value="Europe/Madrid">España (GMT+1)</SelectItem>
                            <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language">Idioma</Label>
                        <Select value={profileData.language} onValueChange={(value) => setProfileData({...profileData, language: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="pt">Português</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Preferencias */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de Contenido</CardTitle>
                    <CardDescription>
                      Configura tus preferencias por defecto para la generación de contenido
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="default_tone">Tono por Defecto</Label>
                        <Select value={preferencesData.default_tone} onValueChange={(value) => setPreferencesData({...preferencesData, default_tone: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Profesional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="friendly">Amigable</SelectItem>
                            <SelectItem value="authoritative">Autoritativo</SelectItem>
                            <SelectItem value="conversational">Conversacional</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                            <SelectItem value="inspiring">Inspirador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="default_platform">Plataforma por Defecto</Label>
                        <Select value={preferencesData.default_platform} onValueChange={(value) => setPreferencesData({...preferencesData, default_platform: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="twitter">Twitter/X</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="preferred_ai_model">Modelo de IA Preferido</Label>
                      <Select value={preferencesData.preferred_ai_model} onValueChange={(value) => setPreferencesData({...preferencesData, preferred_ai_model: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI GPT-4 (Más creativo)</SelectItem>
                          <SelectItem value="claude">Claude (Más analítico)</SelectItem>
                          <SelectItem value="auto">Automático (Mejor para cada caso)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="brand_voice">Voz de Marca</Label>
                      <Textarea
                        id="brand_voice"
                        value={preferencesData.brand_voice}
                        onChange={(e) => setPreferencesData({...preferencesData, brand_voice: e.target.value})}
                        placeholder="Describe el tono y estilo de tu marca..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="target_audience_default">Audiencia Objetivo por Defecto</Label>
                      <Input
                        id="target_audience_default"
                        value={preferencesData.target_audience_default}
                        onChange={(e) => setPreferencesData({...preferencesData, target_audience_default: e.target.value})}
                        placeholder="Ej: Empresarios de 25-45 años interesados en tecnología"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Guardar Scripts Automáticamente</Label>
                          <p className="text-sm text-gray-600">Los scripts se guardarán automáticamente al generarse</p>
                        </div>
                        <Switch
                          checked={preferencesData.auto_save_scripts}
                          onCheckedChange={(checked) => setPreferencesData({...preferencesData, auto_save_scripts: checked})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Notificaciones */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Notificaciones</CardTitle>
                    <CardDescription>
                      Controla qué notificaciones quieres recibir
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Notificaciones por Email</Label>
                          <p className="text-sm text-gray-600">Recibir notificaciones importantes por email</p>
                        </div>
                        <Switch
                          checked={preferencesData.email_notifications}
                          onCheckedChange={(checked) => setPreferencesData({...preferencesData, email_notifications: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Emails de Marketing</Label>
                          <p className="text-sm text-gray-600">Recibir tips, novedades y ofertas especiales</p>
                        </div>
                        <Switch
                          checked={preferencesData.marketing_emails}
                          onCheckedChange={(checked) => setPreferencesData({...preferencesData, marketing_emails: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Reportes Semanales</Label>
                          <p className="text-sm text-gray-600">Resumen semanal de tu actividad y rendimiento</p>
                        </div>
                        <Switch
                          checked={preferencesData.weekly_reports}
                          onCheckedChange={(checked) => setPreferencesData({...preferencesData, weekly_reports: checked})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Seguridad */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Seguridad</CardTitle>
                    <CardDescription>
                      Gestiona la seguridad de tu cuenta
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Email de la Cuenta</Label>
                        <Input value={user?.email || ''} disabled className="bg-gray-50" />
                        <p className="text-sm text-gray-600 mt-1">
                          Para cambiar tu email, contacta con soporte
                        </p>
                      </div>

                      <div>
                        <Label>Cambiar Contraseña</Label>
                        <Button variant="outline" className="mt-2">
                          <Shield className="h-4 w-4 mr-2" />
                          Actualizar Contraseña
                        </Button>
                      </div>

                      <div>
                        <Label>Autenticación de Dos Factores</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            No Configurado
                          </Badge>
                          <Button variant="outline" size="sm">
                            Configurar 2FA
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Sesiones Activas</Label>
                        <div className="mt-2 p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Sesión Actual</p>
                              <p className="text-sm text-gray-600">Navegador Web • Ahora</p>
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Activa
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Botón Guardar */}
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;

