import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  FileText, 
  Search, 
  Filter,
  Download,
  Edit,
  Trash2,
  Copy,
  Eye,
  Calendar,
  TrendingUp,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Plus,
  SortAsc,
  SortDesc
} from 'lucide-react';

const MyScriptsPage = () => {
  const { user } = useAuth();
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (user) {
      loadScripts();
    }
  }, [user]);

  const loadScripts = async () => {
    try {
      setLoading(true);
      
      // Simular scripts del usuario
      const mockScripts = [
        {
          id: 1,
          title: "Post para Instagram - Estrategias de Marketing Digital",
          content: "🚀 ¿Quieres dominar el marketing digital? Aquí tienes 5 estrategias que cambiarán tu negocio:\n\n1. Conoce a tu audiencia como si fuera tu mejor amigo\n2. Crea contenido que resuelva problemas reales\n3. Usa storytelling para conectar emocionalmente\n4. Optimiza para cada plataforma específica\n5. Mide, analiza y mejora constantemente\n\n¿Cuál implementarás primero? 👇\n\n#MarketingDigital #Emprendimiento #RedesSociales",
          platform: "Instagram",
          status: "Publicado",
          ai_model: "GPT-4",
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          metrics: {
            views: 15420,
            likes: 892,
            comments: 67,
            shares: 34,
            engagement_rate: 6.4
          }
        },
        {
          id: 2,
          title: "Thread de Twitter - Tips de Productividad",
          content: "🧵 THREAD: 10 hacks de productividad que uso todos los días\n\n1/10 La regla de los 2 minutos: Si algo toma menos de 2 minutos, hazlo ahora mismo. No lo pospongas.\n\n2/10 Time blocking: Asigna bloques específicos de tiempo para tareas similares. Tu cerebro te lo agradecerá.\n\n3/10 La técnica Pomodoro: 25 min de trabajo intenso + 5 min de descanso. Repite 4 veces y toma un descanso largo.",
          platform: "Twitter",
          status: "Borrador",
          ai_model: "Claude",
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          published_at: null,
          metrics: null
        },
        {
          id: 3,
          title: "Script para YouTube - Tutorial de Ventas",
          content: "¡Hola emprendedores! Soy [Tu Nombre] y en este video te voy a enseñar las 3 técnicas de ventas que me han ayudado a cerrar más del 80% de mis propuestas.\n\nAntes de empezar, dale like si quieres más contenido como este y suscríbete para no perderte ningún tip.\n\n[TÉCNICA 1: ESCUCHA ACTIVA]\nLa primera técnica es la escucha activa. Muchos vendedores cometen el error de hablar demasiado...",
          platform: "YouTube",
          status: "Programado",
          ai_model: "GPT-4",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          metrics: null
        },
        {
          id: 4,
          title: "Post LinkedIn - Networking Profesional",
          content: "💼 El networking no es solo intercambiar tarjetas de presentación.\n\nEs construir relaciones genuinas que beneficien a ambas partes.\n\nAquí tienes mi fórmula de networking que me ha abierto puertas increíbles:\n\n🎯 ANTES del evento:\n• Investiga quién asistirá\n• Define 3 objetivos claros\n• Prepara tu elevator pitch\n\n🤝 DURANTE el evento:\n• Escucha más de lo que hablas\n• Haz preguntas genuinas\n• Ofrece valor antes de pedir\n\n📱 DESPUÉS del evento:\n• Conecta en 24-48 horas\n• Personaliza tu mensaje\n• Propón una reunión específica\n\n¿Cuál es tu mejor tip de networking?",
          platform: "LinkedIn",
          status: "Publicado",
          ai_model: "Claude",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          metrics: {
            views: 8750,
            likes: 234,
            comments: 45,
            shares: 67,
            engagement_rate: 4.0
          }
        },
        {
          id: 5,
          title: "Story de Instagram - Behind the Scenes",
          content: "📱 STORY SEQUENCE:\n\nSlide 1: \"Buenos días emprendedores! ☀️ Hoy les voy a mostrar mi rutina matutina\"\n\nSlide 2: [Video] Preparando café + texto: \"Todo empieza con un buen café ☕\"\n\nSlide 3: [Foto] Escritorio organizado + texto: \"Workspace ready! 💻 ¿Cómo es el tuyo?\"\n\nSlide 4: [Video] Revisando agenda + texto: \"Planificando el día como un pro 📅\"\n\nSlide 5: Poll: \"¿Eres más productivo por la mañana o por la noche?\"\n\nSlide 6: CTA: \"¡Sígueme para más tips de productividad! 🚀\"",
          platform: "Instagram",
          status: "Borrador",
          ai_model: "GPT-4",
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          published_at: null,
          metrics: null
        }
      ];
      
      setScripts(mockScripts);
    } catch (error) {
      console.error('Error loading scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedScripts = scripts
    .filter(script => {
      const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           script.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || script.status.toLowerCase() === filterStatus.toLowerCase();
      const matchesPlatform = filterPlatform === 'all' || script.platform.toLowerCase() === filterPlatform.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesPlatform;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'published_at') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Publicado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Programado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Borrador':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Instagram':
        return 'text-pink-600 bg-pink-50';
      case 'Twitter':
        return 'text-blue-400 bg-blue-50';
      case 'YouTube':
        return 'text-red-600 bg-red-50';
      case 'LinkedIn':
        return 'text-blue-700 bg-blue-50';
      case 'Facebook':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No programado';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDuplicate = (script) => {
    const duplicatedScript = {
      ...script,
      id: Date.now(),
      title: `${script.title} (Copia)`,
      status: 'Borrador',
      published_at: null,
      metrics: null,
      created_at: new Date().toISOString()
    };
    setScripts([duplicatedScript, ...scripts]);
  };

  const handleDelete = (scriptId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este script?')) {
      setScripts(scripts.filter(script => script.id !== scriptId));
    }
  };

  const handleDownload = (script) => {
    const element = document.createElement('a');
    const file = new Blob([script.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${script.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Scripts</h1>
            <p className="text-gray-600">Gestiona y organiza todo tu contenido generado</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Script
          </Button>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar scripts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="publicado">Publicado</option>
                  <option value="programado">Programado</option>
                  <option value="borrador">Borrador</option>
                </select>
                
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las plataformas</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                </select>
                
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Scripts */}
        <div className="space-y-4">
          {filteredAndSortedScripts.map((script) => (
            <Card key={script.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{script.title}</h3>
                      <Badge className={getPlatformColor(script.platform)} variant="secondary">
                        {script.platform}
                      </Badge>
                      <Badge className={getStatusColor(script.status)} variant="outline">
                        {script.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {script.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Creado: {formatDate(script.created_at)}</span>
                      </div>
                      
                      {script.published_at && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>Publicado: {formatDate(script.published_at)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600">Modelo: {script.ai_model}</span>
                      </div>
                    </div>
                    
                    {script.metrics && (
                      <div className="flex items-center gap-6 mt-3 pt-3 border-t">
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span>{script.metrics.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Heart className="h-4 w-4 text-red-600" />
                          <span>{script.metrics.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                          <span>{script.metrics.comments}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Share className="h-4 w-4 text-purple-600" />
                          <span>{script.metrics.shares}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          <span>{script.metrics.engagement_rate}% engagement</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicate(script)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(script)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(script.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredAndSortedScripts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' || filterPlatform !== 'all' 
                    ? 'No se encontraron scripts' 
                    : 'No tienes scripts aún'
                  }
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== 'all' || filterPlatform !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Crea tu primer script para comenzar'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && filterPlatform === 'all' && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Script
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{scripts.length}</div>
              <p className="text-sm text-gray-600">Total Scripts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {scripts.filter(s => s.status === 'Publicado').length}
              </div>
              <p className="text-sm text-gray-600">Publicados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {scripts.filter(s => s.status === 'Borrador').length}
              </div>
              <p className="text-sm text-gray-600">Borradores</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {scripts.filter(s => s.metrics).reduce((acc, s) => acc + (s.metrics?.engagement_rate || 0), 0) / 
                 Math.max(scripts.filter(s => s.metrics).length, 1)}%
              </div>
              <p className="text-sm text-gray-600">Engagement Promedio</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyScriptsPage;
