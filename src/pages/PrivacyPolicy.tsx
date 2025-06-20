import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, UserCheck, Globe, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy: React.FC = () => {
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
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Política de Privacidad
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
                  <Eye className="w-5 h-5 mr-2" />
                  Información que Recopilamos
                </CardTitle>
                <CardDescription>
                  Tipos de datos que recolectamos para brindarte el mejor servicio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Información Personal
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Recopilamos información que nos proporcionas directamente, como tu nombre, 
                    dirección de correo electrónico, información de la empresa y preferencias de cuenta 
                    cuando te registras en Genius Script Builder.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Datos de Uso
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Recopilamos información sobre cómo utilizas nuestro servicio, incluyendo 
                    los scripts generados, análisis de video realizados, y patrones de uso 
                    para mejorar nuestros algoritmos de IA.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Contenido de Usuario
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Almacenamos el contenido que subes para análisis (videos, audio, texto) 
                    y los scripts generados. Este contenido se utiliza exclusivamente para 
                    proporcionarte el servicio y mejorar tu experiencia personalizada.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Cómo Utilizamos tu Información
                </CardTitle>
                <CardDescription>
                  Propósitos para los cuales procesamos tus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Prestación del Servicio:</strong> Generar scripts personalizados, 
                      analizar videos y proporcionar insights de marketing con IA.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Personalización:</strong> Crear modelos de IA únicos que reflejen 
                      tu voz y estilo de marca a través de nuestro sistema de fine tuning.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Mejora del Servicio:</strong> Analizar patrones de uso agregados 
                      para mejorar nuestros algoritmos y desarrollar nuevas funcionalidades.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Comunicación:</strong> Enviarte actualizaciones del servicio, 
                      soporte técnico y información relevante sobre nuevas funcionalidades.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Compartir de Información
                </CardTitle>
                <CardDescription>
                  Cuándo y con quién compartimos tus datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    No Vendemos tus Datos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nunca vendemos, alquilamos o comercializamos tu información personal 
                    a terceros. Tus datos son tuyos y los protegemos como tal.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Proveedores de Servicios
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Compartimos información con proveedores de servicios de confianza que nos 
                    ayudan a operar nuestro servicio, como Google (Gemini AI), Supabase (base de datos), 
                    y Vercel (hosting). Todos están sujetos a estrictos acuerdos de confidencialidad.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Cumplimiento Legal
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Podemos divulgar información si es requerido por ley, orden judicial, 
                    o para proteger nuestros derechos, propiedad o seguridad.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Tus Derechos
                </CardTitle>
                <CardDescription>
                  Control que tienes sobre tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Acceso:</strong> Solicitar una copia de toda la información 
                      personal que tenemos sobre ti.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Rectificación:</strong> Corregir información inexacta o 
                      incompleta en tu perfil.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Eliminación:</strong> Solicitar la eliminación de tu cuenta 
                      y todos los datos asociados.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Portabilidad:</strong> Exportar tus datos en un formato 
                      estructurado y legible.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Oposición:</strong> Oponerte al procesamiento de tus datos 
                      para ciertos propósitos.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Seguridad de Datos
                </CardTitle>
                <CardDescription>
                  Cómo protegemos tu información
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Implementamos medidas de seguridad técnicas y organizativas apropiadas para 
                  proteger tu información personal contra acceso no autorizado, alteración, 
                  divulgación o destrucción, incluyendo:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Cifrado en tránsito y en reposo</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Autenticación multifactor</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Auditorías de seguridad regulares</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Acceso limitado basado en roles</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contacto
                </CardTitle>
                <CardDescription>
                  Cómo ponerte en contacto con nosotros sobre privacidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Si tienes preguntas sobre esta Política de Privacidad o quieres ejercer 
                  tus derechos, puedes contactarnos:
                </p>
                
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Email:</strong> privacy@geniusscriptbuilder.com
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Respuesta:</strong> Dentro de 30 días hábiles
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Esta política se actualiza periódicamente. Te notificaremos de cambios significativos.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link to="/terms-of-service">Ver Términos de Servicio</Link>
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

export default PrivacyPolicy;

