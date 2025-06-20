import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Users, Shield, AlertTriangle, Scale, Gavel } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Términos de Servicio
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Última actualización: 20 de junio de 2025
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Aceptación de los Términos
                </CardTitle>
                <CardDescription>
                  Al usar Genius Script Builder, aceptas estos términos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Al acceder y utilizar Genius Script Builder ("el Servicio"), aceptas estar 
                  legalmente vinculado por estos Términos de Servicio ("Términos"). Si no 
                  estás de acuerdo con alguna parte de estos términos, no puedes usar nuestro servicio.
                </p>
                
                <p className="text-gray-600 dark:text-gray-300">
                  Estos términos se aplican a todos los usuarios del servicio, incluyendo 
                  usuarios gratuitos, suscriptores de pago, y usuarios empresariales.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Descripción del Servicio
                </CardTitle>
                <CardDescription>
                  Qué ofrece Genius Script Builder
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Genius Script Builder es una plataforma de inteligencia artificial que proporciona:
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Análisis de Video:</strong> Análisis automatizado de contenido de video 
                      para redes sociales usando tecnología Gemini AI.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Generación de Scripts:</strong> Creación automatizada de scripts 
                      de marketing personalizados para diferentes plataformas.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Fine Tuning Personalizado:</strong> Entrenamiento de modelos de IA 
                      para reflejar tu voz y estilo de marca únicos.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Analytics y Reportes:</strong> Métricas de rendimiento y análisis 
                      de efectividad de contenido.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Uso Aceptable
                </CardTitle>
                <CardDescription>
                  Reglas para el uso responsable del servicio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Usos Permitidos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Puedes usar nuestro servicio para:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Crear contenido de marketing legítimo</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Analizar tu propio contenido de video</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Generar scripts para tu negocio o clientes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Uso comercial dentro de los límites de tu plan</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Usos Prohibidos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    No puedes usar nuestro servicio para:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Crear contenido ilegal, dañino o engañoso</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Violar derechos de autor o propiedad intelectual</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Hacer ingeniería inversa o copiar nuestro servicio</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Sobrecargar o interferir con nuestros sistemas</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-300">Compartir credenciales de cuenta con terceros</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="w-5 h-5 mr-2" />
                  Propiedad Intelectual
                </CardTitle>
                <CardDescription>
                  Derechos sobre el contenido y la tecnología
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Tu Contenido
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Mantienes todos los derechos sobre el contenido que subes y los scripts 
                    que generas usando nuestro servicio. Nos otorgas una licencia limitada 
                    para procesar tu contenido únicamente para proporcionarte el servicio.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Nuestro Servicio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Genius Script Builder, incluyendo su tecnología, algoritmos, interfaz 
                    y documentación, está protegido por derechos de autor, marcas registradas 
                    y otras leyes de propiedad intelectual.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Modelos de IA Personalizados
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Los modelos de IA personalizados creados a través del fine tuning son 
                    de tu propiedad exclusiva. No compartimos ni utilizamos estos modelos 
                    para otros usuarios o propósitos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="w-5 h-5 mr-2" />
                  Limitación de Responsabilidad
                </CardTitle>
                <CardDescription>
                  Límites de nuestra responsabilidad legal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Disponibilidad del Servicio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nos esforzamos por mantener el servicio disponible 24/7, pero no 
                    garantizamos un tiempo de actividad del 100%. Podemos experimentar 
                    interrupciones por mantenimiento, actualizaciones o circunstancias 
                    fuera de nuestro control.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Precisión del Contenido
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Aunque utilizamos tecnología de IA avanzada, no garantizamos la 
                    precisión, completitud o idoneidad del contenido generado. Es tu 
                    responsabilidad revisar y validar todo el contenido antes de su uso.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Límites de Daños
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    En ningún caso seremos responsables por daños indirectos, incidentales, 
                    especiales o consecuentes que surjan del uso de nuestro servicio, 
                    incluso si hemos sido advertidos de la posibilidad de tales daños.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modificaciones y Terminación</CardTitle>
                <CardDescription>
                  Cambios en el servicio y terminación de cuentas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Modificaciones del Servicio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nos reservamos el derecho de modificar, suspender o discontinuar 
                    cualquier parte del servicio en cualquier momento. Te notificaremos 
                    de cambios significativos con al menos 30 días de anticipación.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Terminación de Cuenta
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Puedes cancelar tu cuenta en cualquier momento desde la configuración. 
                    Podemos suspender o terminar tu cuenta si violas estos términos, 
                    con previo aviso cuando sea posible.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Efectos de la Terminación
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Al terminar tu cuenta, perderás acceso al servicio y tus datos 
                    serán eliminados según nuestra política de retención de datos, 
                    excepto cuando la ley requiera su conservación.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacto y Disputas</CardTitle>
                <CardDescription>
                  Cómo resolver problemas y contactarnos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Contacto
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Para preguntas sobre estos términos o el servicio:
                  </p>
                  <ul className="space-y-1">
                    <li className="text-gray-600 dark:text-gray-300">
                      <strong>Email:</strong> legal@geniusscriptbuilder.com
                    </li>
                    <li className="text-gray-600 dark:text-gray-300">
                      <strong>Soporte:</strong> support@geniusscriptbuilder.com
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Ley Aplicable
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Estos términos se rigen por las leyes del país donde está registrada 
                    nuestra empresa. Cualquier disputa se resolverá en los tribunales 
                    competentes de esa jurisdicción.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Estos términos pueden actualizarse. Los cambios significativos se notificarán con anticipación.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link to="/privacy-policy">Ver Política de Privacidad</Link>
                </Button>
                <Button asChild>
                  <Link to="/dashboard">Ir al Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;

