import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Página no encontrada</CardTitle>
            <CardDescription>
              La página que buscas no existe o ha sido movida.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir al Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)} 
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver atrás
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

