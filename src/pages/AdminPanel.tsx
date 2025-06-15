import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Download,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const AdminPanel = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('clients')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estados para datos
  const [clients, setClients] = useState([])
  const [scripts, setScripts] = useState([])
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      
      // Datos mock para el panel de administración
      const mockClients = [
        {
          id: '1',
          full_name: 'Juan Pérez',
          email: 'juan@empresa.com',
          company_name: 'Empresa ABC',
          industry: 'marketing',
          subscription_plan: 'pro',
          created_at: '2024-06-01T10:00:00Z',
          last_login: '2024-06-14T15:30:00Z',
          scripts_count: 15,
          status: 'active'
        },
        {
          id: '2',
          full_name: 'María García',
          email: 'maria@startup.com',
          company_name: 'StartupXYZ',
          industry: 'saas',
          subscription_plan: 'basic',
          created_at: '2024-05-15T09:00:00Z',
          last_login: '2024-06-13T11:20:00Z',
          scripts_count: 8,
          status: 'active'
        },
        {
          id: '3',
          full_name: 'Carlos López',
          email: 'carlos@agencia.com',
          company_name: 'Agencia Digital',
          industry: 'marketing',
          subscription_plan: 'enterprise',
          created_at: '2024-04-20T14:00:00Z',
          last_login: '2024-06-12T16:45:00Z',
          scripts_count: 32,
          status: 'active'
        }
      ]

      const mockScripts = [
        {
          id: '1',
          client_id: '1',
          client_name: 'Juan Pérez',
          script_type: 'social_media',
          topic: 'Lanzamiento de producto',
          status: 'pending',
          created_at: '2024-06-14T10:00:00Z',
          ai_model_used: 'openai',
          word_count: 150
        },
        {
          id: '2',
          client_id: '2',
          client_name: 'María García',
          script_type: 'email',
          topic: 'Newsletter semanal',
          status: 'approved',
          created_at: '2024-06-13T15:30:00Z',
          ai_model_used: 'claude',
          word_count: 280
        },
        {
          id: '3',
          client_id: '3',
          client_name: 'Carlos López',
          script_type: 'landing_page',
          topic: 'Página de servicios',
          status: 'rejected',
          created_at: '2024-06-12T09:15:00Z',
          ai_model_used: 'gemini',
          word_count: 450
        }
      ]

      const mockAnalytics = {
        total_clients: 3,
        active_clients: 3,
        total_scripts: 55,
        pending_scripts: 8,
        approved_scripts: 42,
        rejected_scripts: 5,
        revenue_month: 2450,
        avg_scripts_per_client: 18.3
      }

      setClients(mockClients)
      setScripts(mockScripts)
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { label: 'Aprobado', variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      pending: { label: 'Pendiente', variant: 'secondary', icon: Clock, color: 'text-yellow-600' },
      rejected: { label: 'Rechazado', variant: 'destructive', icon: XCircle, color: 'text-red-600' },
      active: { label: 'Activo', variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      inactive: { label: 'Inactivo', variant: 'secondary', icon: XCircle, color: 'text-gray-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      basic: { label: 'Básico', color: 'bg-blue-100 text-blue-800' },
      pro: { label: 'Pro', color: 'bg-purple-100 text-purple-800' },
      enterprise: { label: 'Enterprise', color: 'bg-gold-100 text-gold-800' }
    }

    const config = planConfig[plan as keyof typeof planConfig] || planConfig.basic

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredScripts = scripts.filter(script =>
    script.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">
            Gestiona clientes, scripts y métricas de la plataforma
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.total_clients || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.active_clients || 0} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scripts Totales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.total_scripts || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.pending_scripts || 0} pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${analytics?.revenue_month || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Scripts</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {analytics?.avg_scripts_per_client || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Por cliente/mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab de Clientes */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Clientes</CardTitle>
                    <CardDescription>
                      Administra usuarios y sus suscripciones
                    </CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Cliente
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Barra de búsqueda */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar clientes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>

                {/* Lista de clientes */}
                <div className="space-y-4">
                  {filteredClients.map((client: any) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{client.full_name}</h4>
                          {getStatusBadge(client.status)}
                          {getPlanBadge(client.subscription_plan)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{client.email}</span>
                          <span>•</span>
                          <span>{client.company_name}</span>
                          <span>•</span>
                          <span>{client.scripts_count} scripts</span>
                          <span>•</span>
                          <span>Último login: {new Date(client.last_login).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Scripts */}
          <TabsContent value="scripts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Scripts</CardTitle>
                    <CardDescription>
                      Revisa y aprueba scripts generados por IA
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {analytics?.pending_scripts || 0} Pendientes
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Barra de búsqueda */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar scripts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>

                {/* Lista de scripts */}
                <div className="space-y-4">
                  {filteredScripts.map((script: any) => (
                    <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{script.topic}</h4>
                          {getStatusBadge(script.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Cliente: {script.client_name}</span>
                          <span>•</span>
                          <span>Tipo: {script.script_type}</span>
                          <span>•</span>
                          <span>{script.word_count} palabras</span>
                          <span>•</span>
                          <span>IA: {script.ai_model_used}</span>
                          <span>•</span>
                          <span>{new Date(script.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Revisar
                        </Button>
                        {script.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Uso</CardTitle>
                  <CardDescription>Estadísticas de la plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Scripts Aprobados</span>
                      <span className="text-sm text-green-600 font-semibold">
                        {analytics?.approved_scripts || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Scripts Pendientes</span>
                      <span className="text-sm text-yellow-600 font-semibold">
                        {analytics?.pending_scripts || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Scripts Rechazados</span>
                      <span className="text-sm text-red-600 font-semibold">
                        {analytics?.rejected_scripts || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ingresos</CardTitle>
                  <CardDescription>Métricas financieras</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Ingresos del Mes</span>
                      <span className="text-sm text-green-600 font-semibold">
                        ${analytics?.revenue_month || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Clientes Activos</span>
                      <span className="text-sm font-semibold">
                        {analytics?.active_clients || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Promedio por Cliente</span>
                      <span className="text-sm font-semibold">
                        ${analytics?.revenue_month && analytics?.active_clients ? 
                          Math.round(analytics.revenue_month / analytics.active_clients) : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab de Configuración */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>
                  Ajustes generales de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="api-keys">APIs de IA Configuradas</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">OpenAI</span>
                          <Badge variant="default">Activo</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">GPT-4, GPT-3.5</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Claude</span>
                          <Badge variant="default">Activo</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Claude-3</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Gemini</span>
                          <Badge variant="secondary">Inactivo</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Gemini Pro</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhooks">Webhooks N8N</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Script Generator</span>
                        <Badge variant="default">Conectado</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Client Management</span>
                        <Badge variant="default">Conectado</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Analytics Processor</span>
                        <Badge variant="secondary">Desconectado</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Guardar Configuración
                    </Button>
                    <Button variant="outline">
                      Probar Conexiones
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default AdminPanel

