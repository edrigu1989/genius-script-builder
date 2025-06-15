import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

const MyScripts = () => {
  const { user } = useAuth();
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Datos de ejemplo para mostrar
  const exampleScripts = [
    {
      id: 1,
      title: "Lanzamiento de producto",
      type: "Redes Sociales",
      status: "Aprobado",
      created_at: "2024-06-14",
      ai_model: "OpenAI",
      content: "🚀 ¡Revoluciona tu marketing con nuestro nuevo producto! Diseñado especialmente para agencias que buscan resultados extraordinarios...",
      engagement: 1250,
      clicks: 89
    },
    {
      id: 2,
      title: "Newsletter semanal",
      type: "Email Marketing",
      status: "Pendiente",
      created_at: "2024-06-13",
      ai_model: "Claude",
      content: "Estimados suscriptores, esta semana traemos las últimas tendencias en marketing digital que están transformando la industria...",
      engagement: 890,
      clicks: 67
    },
    {
      id: 3,
      title: "Página de servicios",
      type: "Landing Page",
      status: "Generado",
      created_at: "2024-06-12",
      ai_model: "Gemini",
      content: "Nuestros servicios están diseñados para impulsar tu negocio al siguiente nivel. Con más de 10 años de experiencia...",
      engagement: 2100,
      clicks: 156
    },
    {
      id: 4,
      title: "Campaña Black Friday",
      type: "Publicidad",
      status: "Aprobado",
      created_at: "2024-06-11",
      ai_model: "OpenAI",
      content: "¡Black Friday está aquí! Descuentos increíbles que no puedes dejar pasar. Solo por tiempo limitado...",
      engagement: 3400,
      clicks: 234
    },
    {
      id: 5,
      title: "Post motivacional",
      type: "Redes Sociales",
      status: "Borrador",
      created_at: "2024-06-10",
      ai_model: "Claude",
      content: "El éxito no es casualidad. Es trabajo duro, perseverancia, aprendizaje, estudio, sacrificio y sobre todo...",
      engagement: 567,
      clicks: 43
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setScripts(exampleScripts);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Generado':
        return 'bg-blue-100 text-blue-800';
      case 'Borrador':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprobado':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pendiente':
        return <Clock className="h-4 w-4" />;
      case 'Generado':
        return <FileText className="h-4 w-4" />;
      case 'Borrador':
        return <Edit className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || script.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Scripts</h1>
              <p className="text-gray-600">Gestiona y organiza todo tu contenido generado</p>
            </div>
          </div>
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
            <FileText className="h-4 w-4 mr-2" />
            Nuevo Script
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Scripts</p>
                  <p className="text-2xl font-bold text-gray-900">{scripts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aprobados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {scripts.filter(s => s.status === 'Aprobado').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {scripts.filter(s => s.status === 'Pendiente').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Vistas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {scripts.reduce((acc, script) => acc + script.engagement, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar scripts por título o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filterStatus === 'Aprobado' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('Aprobado')}
              size="sm"
            >
              Aprobados
            </Button>
            <Button
              variant={filterStatus === 'Pendiente' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('Pendiente')}
              size="sm"
            >
              Pendientes
            </Button>
            <Button
              variant={filterStatus === 'Borrador' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('Borrador')}
              size="sm"
            >
              Borradores
            </Button>
          </div>
        </div>

        {/* Scripts List */}
        <div className="space-y-4">
          {filteredScripts.map((script) => (
            <Card key={script.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{script.title}</h3>
                      <Badge variant="outline" className={getStatusColor(script.status)}>
                        {getStatusIcon(script.status)}
                        <span className="ml-1">{script.status}</span>
                      </Badge>
                      <Badge variant="outline">{script.type}</Badge>
                      <Badge variant="outline">{script.ai_model}</Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {script.content}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(script.created_at).toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {script.engagement.toLocaleString()} vistas
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {script.clicks} clicks
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScripts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron scripts</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Intenta ajustar tus filtros de búsqueda'
                  : 'Aún no has creado ningún script. ¡Comienza generando tu primer contenido!'
                }
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <FileText className="h-4 w-4 mr-2" />
                Crear Primer Script
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyScripts;

