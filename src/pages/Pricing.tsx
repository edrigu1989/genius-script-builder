import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Rocket,
  Users,
  BarChart3,
  Shield,
  Headphones,
  Globe,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Pricing: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfecto para emprendedores y pequeños negocios',
      icon: <Zap className="w-6 h-6" />,
      price: {
        monthly: 29,
        yearly: 290
      },
      features: [
        '50 scripts por mes',
        'Análisis básico de video',
        '3 plataformas conectadas',
        'Soporte por email',
        'Templates básicos',
        'Exportación PDF'
      ],
      limitations: [
        'Sin fine tuning personalizado',
        'Sin análisis avanzado',
        'Sin soporte prioritario'
      ],
      popular: false,
      cta: 'Comenzar Gratis'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal para agencias y marketers profesionales',
      icon: <Crown className="w-6 h-6" />,
      price: {
        monthly: 79,
        yearly: 790
      },
      features: [
        '500 scripts por mes',
        'Análisis avanzado con Gemini AI',
        'Todas las plataformas',
        'Fine tuning personalizado',
        'Soporte prioritario',
        'Analytics en tiempo real',
        'Templates premium',
        'Colaboración en equipo (5 usuarios)',
        'API access',
        'Exportación avanzada'
      ],
      limitations: [
        'Límite de 5 usuarios'
      ],
      popular: true,
      cta: 'Prueba 14 días gratis'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Para grandes empresas con necesidades específicas',
      icon: <Rocket className="w-6 h-6" />,
      price: {
        monthly: 299,
        yearly: 2990
      },
      features: [
        'Scripts ilimitados',
        'Análisis completo con IA',
        'Integraciones personalizadas',
        'Fine tuning avanzado',
        'Soporte 24/7 dedicado',
        'Manager de cuenta',
        'Usuarios ilimitados',
        'White-label disponible',
        'SLA garantizado',
        'Onboarding personalizado',
        'Reportes ejecutivos',
        'Integración con CRM'
      ],
      limitations: [],
      popular: false,
      cta: 'Contactar Ventas'
    }
  ];

  const addOns = [
    {
      name: 'Clonación de Voz',
      description: 'Genera audio con tu voz clonada usando ElevenLabs',
      price: { monthly: 19, yearly: 190 },
      icon: <Headphones className="w-5 h-5" />
    },
    {
      name: 'Análisis Competencia',
      description: 'Monitorea y analiza el contenido de tus competidores',
      price: { monthly: 39, yearly: 390 },
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      name: 'Usuarios Adicionales',
      description: 'Agrega más miembros a tu equipo',
      price: { monthly: 15, yearly: 150 },
      icon: <Users className="w-5 h-5" />
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Marketing Director",
      company: "TechStart",
      content: "Genius Script Builder revolucionó nuestra estrategia de contenido. +300% engagement en 3 meses.",
      rating: 5
    },
    {
      name: "Carlos Ruiz",
      role: "Agency Owner",
      company: "Digital Boost",
      content: "El fine tuning automático es increíble. Cada cliente tiene su voz única en todos los scripts.",
      rating: 5
    },
    {
      name: "Ana Martín",
      role: "Content Creator",
      company: "Freelancer",
      content: "Pasé de 2 horas por script a 5 minutos. La IA de Gemini es impresionante.",
      rating: 5
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Aquí se manejaría la selección del plan
    if (planId === 'enterprise') {
      // Redirigir a contacto
      window.open('mailto:sales@geniusscriptbuilder.com?subject=Enterprise Plan Inquiry', '_blank');
    } else {
      // Redirigir a checkout
      navigate('/checkout', { state: { plan: planId, billing: billingCycle } });
    }
  };

  const getDiscountPercentage = () => {
    return billingCycle === 'yearly' ? 17 : 0; // 2 meses gratis al año
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="pt-20 pb-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Powered by Gemini AI - La tecnología más avanzada
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Planes que se adaptan a tu
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> crecimiento</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Desde emprendedores hasta grandes empresas. Encuentra el plan perfecto para 
            revolucionar tu marketing con IA.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Mensual
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Anual
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Ahorra 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''} hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Más Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}>
                    {plan.icon}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 ml-1">
                        /{billingCycle === 'monthly' ? 'mes' : 'año'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Equivale a ${Math.round(plan.price.yearly / 12)}/mes
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Incluye:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-gray-900 dark:text-white mt-4">Limitaciones:</h4>
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Potencia tu plan con add-ons
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Funcionalidades adicionales para llevar tu marketing al siguiente nivel
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                      {addon.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{addon.name}</CardTitle>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${addon.price[billingCycle]}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          /{billingCycle === 'monthly' ? 'mes' : 'año'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {addon.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Agregar al Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Más de 2,500 agencias ya confían en nosotros
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gray-50 dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} en {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Preguntas Frecuentes
            </h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: "¿Puedo cambiar de plan en cualquier momento?",
                a: "Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplican inmediatamente y se prorratea el costo."
              },
              {
                q: "¿Qué incluye la prueba gratuita?",
                a: "La prueba gratuita de 14 días incluye acceso completo al plan Professional, sin limitaciones y sin necesidad de tarjeta de crédito."
              },
              {
                q: "¿Cómo funciona el fine tuning personalizado?",
                a: "Nuestro sistema analiza tu voz y estilo a través de un onboarding inteligente con preguntas personalizadas, creando un modelo único para tu marca."
              },
              {
                q: "¿Hay límites en el análisis de video?",
                a: "El plan Starter permite análisis básico, Professional incluye análisis avanzado con Gemini AI, y Enterprise no tiene límites."
              },
              {
                q: "¿Ofrecen soporte en español?",
                a: "Sí, ofrecemos soporte completo en español, inglés y otros 7 idiomas, con horarios extendidos para clientes Enterprise."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para revolucionar tu marketing?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a más de 2,500 agencias que ya están dominando el mercado con IA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleSelectPlan('professional')}
              >
                Comenzar Prueba Gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => window.open('mailto:sales@geniusscriptbuilder.com', '_blank')}
              >
                Hablar con Ventas
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;

