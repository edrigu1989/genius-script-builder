import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';
import DashboardLayout from '../components/DashboardLayout';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    language: 'es',
    preferred_ai_model: 'scriptmaster',
    email_notifications: true,
    marketing_emails: false,
    timezone: 'America/Mexico_City',
    auto_save: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        try {
          const userPrefs = await getUserPreferences(user.id);
          if (userPrefs) {
            setPreferences(userPrefs);
          }
        } catch (error) {
          console.error('Error loading preferences:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPreferences();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserPreferences(user.id, preferences);
      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar las configuraciones.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-gray-600 mt-2">Personaliza tu experiencia en MarketingGenius</p>
        </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai-models">Modelos IA</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="account">Cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Ajusta las preferencias básicas de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select 
                    value={preferences.language} 
                    onValueChange={(value) => setPreferences({...preferences, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select 
                    value={preferences.timezone} 
                    onValueChange={(value) => setPreferences({...preferences, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                      <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                      <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-save" 
                  checked={preferences.auto_save}
                  onCheckedChange={(checked) => setPreferences({...preferences, auto_save: checked})}
                />
                <Label htmlFor="auto-save">Guardar automáticamente los scripts</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Modelos IA</CardTitle>
              <CardDescription>Personaliza el comportamiento de los modelos de inteligencia artificial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="preferred-model">Modelo IA Preferido</Label>
                <Select 
                  value={preferences.preferred_ai_model} 
                  onValueChange={(value) => setPreferences({...preferences, preferred_ai_model: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona modelo preferido" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scriptmaster">🎯 ScriptMaster Pro - Contenido viral</SelectItem>
                    <SelectItem value="analyticsbrain">🧠 AnalyticsBrain - Estratega de datos</SelectItem>
                    <SelectItem value="trendhunter">🔥 TrendHunter AI - Detector de tendencias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center space-y-2">
                    <span className="text-2xl">🎯</span>
                    <h3 className="font-semibold">ScriptMaster Pro</h3>
                    <p className="text-sm text-gray-600">Especialista en contenido viral y persuasivo</p>
                    <div className="text-xs text-green-600">94% tasa de éxito</div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-center space-y-2">
                    <span className="text-2xl">🧠</span>
                    <h3 className="font-semibold">AnalyticsBrain</h3>
                    <p className="text-sm text-gray-600">Estratega basado en datos y métricas</p>
                    <div className="text-xs text-blue-600">92% precisión B2B</div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="text-center space-y-2">
                    <span className="text-2xl">🔥</span>
                    <h3 className="font-semibold">TrendHunter AI</h3>
                    <p className="text-sm text-gray-600">Detector de tendencias virales</p>
                    <div className="text-xs text-purple-600">89% detección trends</div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Controla qué notificaciones quieres recibir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Notificaciones por email</Label>
                    <p className="text-sm text-gray-600">Recibe notificaciones sobre scripts completados y actualizaciones</p>
                  </div>
                  <Switch 
                    id="email-notifications"
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) => setPreferences({...preferences, email_notifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Emails de marketing</Label>
                    <p className="text-sm text-gray-600">Recibe tips, casos de éxito y nuevas funcionalidades</p>
                  </div>
                  <Switch 
                    id="marketing-emails"
                    checked={preferences.marketing_emails}
                    onCheckedChange={(checked) => setPreferences({...preferences, marketing_emails: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Cuenta</CardTitle>
              <CardDescription>Gestiona tu información personal y configuración de seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ''} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan">Plan Actual</Label>
                  <Input id="plan" value="Pro Plan" disabled />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Zona de Peligro</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Cambiar Contraseña
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Descargar Datos
                  </Button>
                  <Button variant="destructive">
                    Eliminar Cuenta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Settings;

