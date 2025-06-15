import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  BarChart3, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  Download,
  Eye,
  Sparkles,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const Dashboard = () => {
  const { user } = useAuth()
  const [scripts, setScripts] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Simular datos mientras no tengamos la integración completa
      const mockScripts = [
        {
          id: '1',
          script_type: 'social_media',
          topic: 'Lanzamiento de producto',
          status: 'approved',
          created_at: '2024-06-14T10:00:00Z',
          ai_model_used: 'openai'
        },
        {
          id: '2',
          script_type: 'email',
          topic: 'Newsletter semanal',
          status: 'pending',
          created_at: '2024-06-13T15:30:00Z',
          ai_model_used: 'claude'
        },
        {
          id: '3',
          script_type: 'landing_page',
          topic: 'Página de servicios',
          status: 'generated',
          created_at: '2024-06-12T09:15:00Z',
          ai_model_used: 'gemini'
        }
      ]

      const mockAnalytics = {
        scripts_generated: 15,
        scripts_approved: 12,
        scripts_pending: 2,
        avg_generation_time: 28
      }

      setScripts(mockScripts)
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { label: 'Aprobado', variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      pending: { label: 'Pendiente', variant: 'secondary', icon: Clock, color: 'text-yellow-600' },
      generated: { label: 'Generado', variant: 'outline', icon: Sparkles, color: 'text-blue-600' },
      rejected: { label: 'Rechazado', variant: 'destructive', icon: XCircle, color: 'text-red-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.generated
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getScriptTypeLabel = (type: string) => {
    const types = {
      social_media: 'Redes Sociales',
      email: 'Email Marketing',
      landing_page: 'Landing Page',
      blog_post: 'Blog Post',
      ad_copy: 'Publicidad'
    }
    return types[type as keyof typeof types] || type
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user?.user_metadata?.full_name || user?.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Aquí tienes un resumen de tu actividad en MarketingGenius
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scripts Generados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.scripts_generated || 0}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scripts Aprobados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{analytics?.scripts_approved || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.scripts_generated ? 
                  `${Math.round((analytics.scripts_approved / analytics.scripts_generated) * 100)}% de éxito` : 
                  '0% de éxito'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{analytics?.scripts_pending || 0}</div>
              <p className="text-xs text-muted-foreground">En revisión</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{analytics?.avg_generation_time || 0}s</div>
              <p className="text-xs text-muted-foreground">Por script</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Genera nuevo contenido o gestiona tus scripts existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.location.href = '/generator'}
              >
                <div className="text-center">
                  <Sparkles className="h-6 w-6 mx-auto mb-1" />
                  <div className="font-semibold">Generar Script</div>
                  <div className="text-xs opacity-90">Con IA avanzada</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20"
                onClick={() => window.location.href = '/analytics'}
              >
                <div className="text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-1" />
                  <div className="font-semibold">Ver Analytics</div>
                  <div className="text-xs text-gray-600">Métricas detalladas</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20"
                onClick={() => window.location.href = '/my-scripts'}
              >
                <div className="text-center">
                  <FileText className="h-6 w-6 mx-auto mb-1" />
                  <div className="font-semibold">Mis Scripts</div>
                  <div className="text-xs text-gray-600">Gestionar contenido</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scripts recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Scripts Recientes
            </CardTitle>
            <CardDescription>
              Tus últimos scripts generados y su estado actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scripts.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Comienza a generar scripts!
                </h3>
                <p className="text-gray-600 mb-4">
                  Aún no tienes scripts generados. Crea tu primer script con IA.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => window.location.href = '/generator'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generar Primer Script
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {scripts.map((script: any) => (
                  <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{script.topic}</h4>
                        {getStatusBadge(script.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{getScriptTypeLabel(script.script_type)}</span>
                        <span>•</span>
                        <span>{new Date(script.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      {script.status === 'approved' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips y recursos */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <TrendingUp className="h-5 w-5" />
              Tips para Maximizar Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">🎯 Optimiza tus prompts</h4>
                <p className="text-sm text-blue-800">
                  Sé específico con tu audiencia objetivo y el tono deseado para obtener mejores resultados.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">⚡ Prueba diferentes estilos</h4>
                <p className="text-sm text-blue-800">
                  Experimenta con diferentes tonos y formatos para encontrar lo que mejor funciona.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">📊 Revisa tus analytics</h4>
                <p className="text-sm text-blue-800">
                  Analiza qué tipos de scripts funcionan mejor para optimizar tu estrategia.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">🚀 Automatiza tu flujo</h4>
                <p className="text-sm text-blue-800">
                  Configura templates y workflows para generar contenido más eficientemente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard

