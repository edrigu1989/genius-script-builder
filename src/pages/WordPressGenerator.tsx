import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import DashboardLayout from '../components/DashboardLayout'
import { 
  Globe,
  Palette,
  Code,
  Sparkles,
  Download,
  Eye,
  Settings,
  Zap,
  Layout,
  Image,
  Type,
  Smartphone
} from 'lucide-react'

const WordPressGenerator = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('generator')
  const [loading, setLoading] = useState(false)
  const [generatedSite, setGeneratedSite] = useState(null)

  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    description: '',
    targetAudience: '',
    goals: '',
    style: 'modern',
    colors: 'blue',
    pages: ['home', 'about', 'services', 'contact'],
    features: ['contact-form', 'gallery', 'testimonials']
  })

  const handleGenerate = async () => {
    setLoading(true)
    
    // Simular generación de sitio web
    setTimeout(() => {
      const mockSite = {
        id: 'wp_' + Date.now(),
        name: formData.businessName || 'Mi Sitio Web',
        url: `https://${(formData.businessName || 'mi-sitio').toLowerCase().replace(/\s+/g, '-')}.demo.com`,
        preview_url: '/preview/wordpress-site',
        pages: formData.pages.length,
        theme: formData.style,
        status: 'generated',
        created_at: new Date().toISOString()
      }
      
      setGeneratedSite(mockSite)
      setLoading(false)
    }, 3000)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(item)
        ? prev[field as keyof typeof prev].filter((i: string) => i !== item)
        : [...prev[field as keyof typeof prev], item]
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WordPress Generator</h1>
              <p className="text-gray-600">Crea sitios web completos con IA en minutos</p>
            </div>
          </div>
          
          {/* Feature Premium Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Función Premium - Generación Automática con IA
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator">Generador</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          {/* Tab Generador */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulario de configuración */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración del Sitio
                  </CardTitle>
                  <CardDescription>
                    Define los detalles de tu sitio web y la IA generará todo automáticamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Nombre del Negocio *</Label>
                      <Input
                        id="businessName"
                        placeholder="Ej: Agencia Digital Pro"
                        value={formData.businessName}
                        onChange={(e) => updateFormData('businessName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industria *</Label>
                      <select
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => updateFormData('industry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecciona tu industria</option>
                        <option value="marketing">Marketing y Publicidad</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="saas">SaaS/Tecnología</option>
                        <option value="consulting">Consultoría</option>
                        <option value="education">Educación</option>
                        <option value="healthcare">Salud</option>
                        <option value="finance">Finanzas</option>
                        <option value="real-estate">Bienes Raíces</option>
                        <option value="restaurant">Restaurante</option>
                        <option value="fitness">Fitness</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción del Negocio *</Label>
                      <textarea
                        id="description"
                        placeholder="Describe qué hace tu negocio, tus servicios principales..."
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetAudience">Audiencia Objetivo</Label>
                      <Input
                        id="targetAudience"
                        placeholder="Ej: Empresas medianas, emprendedores, jóvenes profesionales..."
                        value={formData.targetAudience}
                        onChange={(e) => updateFormData('targetAudience', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goals">Objetivos del Sitio</Label>
                      <Input
                        id="goals"
                        placeholder="Ej: Generar leads, vender productos, mostrar portfolio..."
                        value={formData.goals}
                        onChange={(e) => updateFormData('goals', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Estilo y diseño */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Estilo y Diseño
                    </h3>

                    <div className="space-y-2">
                      <Label>Estilo del Sitio</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'modern', label: 'Moderno' },
                          { value: 'classic', label: 'Clásico' },
                          { value: 'minimal', label: 'Minimalista' },
                          { value: 'creative', label: 'Creativo' }
                        ].map((style) => (
                          <button
                            key={style.value}
                            onClick={() => updateFormData('style', style.value)}
                            className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                              formData.style === style.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {style.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Esquema de Colores</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'blue', label: 'Azul', color: 'bg-blue-500' },
                          { value: 'green', label: 'Verde', color: 'bg-green-500' },
                          { value: 'purple', label: 'Morado', color: 'bg-purple-500' },
                          { value: 'orange', label: 'Naranja', color: 'bg-orange-500' },
                          { value: 'red', label: 'Rojo', color: 'bg-red-500' },
                          { value: 'gray', label: 'Gris', color: 'bg-gray-500' }
                        ].map((color) => (
                          <button
                            key={color.value}
                            onClick={() => updateFormData('colors', color.value)}
                            className={`p-2 border rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                              formData.colors === color.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full ${color.color}`}></div>
                            {color.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Páginas y características */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      Páginas y Características
                    </h3>

                    <div className="space-y-2">
                      <Label>Páginas a Incluir</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'home', label: 'Inicio' },
                          { value: 'about', label: 'Nosotros' },
                          { value: 'services', label: 'Servicios' },
                          { value: 'portfolio', label: 'Portfolio' },
                          { value: 'blog', label: 'Blog' },
                          { value: 'contact', label: 'Contacto' }
                        ].map((page) => (
                          <button
                            key={page.value}
                            onClick={() => toggleArrayItem('pages', page.value)}
                            className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                              formData.pages.includes(page.value)
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {page.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Características Especiales</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { value: 'contact-form', label: 'Formulario de Contacto' },
                          { value: 'gallery', label: 'Galería de Imágenes' },
                          { value: 'testimonials', label: 'Testimonios' },
                          { value: 'social-media', label: 'Integración Redes Sociales' },
                          { value: 'newsletter', label: 'Newsletter' },
                          { value: 'chat', label: 'Chat en Vivo' }
                        ].map((feature) => (
                          <button
                            key={feature.value}
                            onClick={() => toggleArrayItem('features', feature.value)}
                            className={`p-2 border rounded-lg text-sm font-medium transition-colors text-left ${
                              formData.features.includes(feature.value)
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {feature.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botón de generación */}
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !formData.businessName || !formData.industry || !formData.description}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generando Sitio Web...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generar Sitio Web con IA
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Preview y resultado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Vista Previa
                  </CardTitle>
                  <CardDescription>
                    Aquí aparecerá tu sitio web generado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900">Generando tu sitio web...</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          La IA está creando páginas, contenido y diseño personalizado
                        </p>
                      </div>
                    </div>
                  ) : generatedSite ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">
                          ¡Sitio Web Generado Exitosamente!
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nombre:</span>
                            <span className="font-medium">{generatedSite.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Páginas:</span>
                            <span className="font-medium">{generatedSite.pages}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tema:</span>
                            <span className="font-medium capitalize">{generatedSite.theme}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">URL:</span>
                            <span className="font-medium text-blue-600">{generatedSite.url}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Sitio
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Próximos Pasos:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Personaliza colores y fuentes</li>
                          <li>• Agrega tu contenido específico</li>
                          <li>• Configura dominio personalizado</li>
                          <li>• Publica en WordPress</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Globe className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Completa el formulario</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Llena los campos requeridos para generar tu sitio web
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Templates */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Templates Prediseñados</CardTitle>
                <CardDescription>
                  Elige un template base y personalízalo con IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Agencia Digital', industry: 'marketing', preview: '/templates/agency.jpg' },
                    { name: 'E-commerce', industry: 'ecommerce', preview: '/templates/ecommerce.jpg' },
                    { name: 'SaaS Startup', industry: 'saas', preview: '/templates/saas.jpg' },
                    { name: 'Consultoría', industry: 'consulting', preview: '/templates/consulting.jpg' },
                    { name: 'Restaurante', industry: 'restaurant', preview: '/templates/restaurant.jpg' },
                    { name: 'Portfolio', industry: 'creative', preview: '/templates/portfolio.jpg' }
                  ].map((template, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{template.industry}</p>
                        <Button className="w-full mt-3" variant="outline">
                          Usar Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Historial */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sitios Generados</CardTitle>
                <CardDescription>
                  Historial de sitios web creados con IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedSite ? (
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{generatedSite.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{generatedSite.pages} páginas</span>
                          <span>•</span>
                          <span className="capitalize">{generatedSite.theme}</span>
                          <span>•</span>
                          <span>{new Date(generatedSite.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        No hay sitios generados
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Crea tu primer sitio web con IA usando el generador
                      </p>
                      <Button 
                        onClick={() => setActiveTab('generator')}
                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Generar Sitio Web
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default WordPressGenerator

