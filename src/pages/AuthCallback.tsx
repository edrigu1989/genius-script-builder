// PÁGINA DE CALLBACK PARA OAUTH
// Archivo: src/pages/AuthCallback.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Procesando...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus(`Error: ${error}`);
        setTimeout(() => {
          window.close();
        }, 3000);
        return;
      }

      if (!code || !state) {
        setStatus('Faltan parámetros de autorización');
        setTimeout(() => {
          window.close();
        }, 3000);
        return;
      }

      setStatus('Intercambiando código por token...');

      // Determinar la plataforma desde el state
      const platform = state.split('_')[0];

      // Intercambiar código por token
      const tokenData = await exchangeCodeForToken(platform, code);

      if (tokenData) {
        // Guardar conexión en Supabase
        await saveConnection(platform, tokenData);
        setStatus('¡Conexión exitosa! Cerrando ventana...');
        
        // Cerrar ventana después de 2 segundos
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        setStatus('Error obteniendo token');
        setTimeout(() => {
          window.close();
        }, 3000);
      }

    } catch (error) {
      console.error('Error en callback:', error);
      setStatus('Error procesando autorización');
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  };

  const exchangeCodeForToken = async (platform: string, code: string) => {
    try {
      // En una aplicación real, esto se haría en el backend
      // Por ahora, simulamos la respuesta para que funcione
      
      const mockTokenData = {
        access_token: `${platform}_token_${Date.now()}`,
        refresh_token: `${platform}_refresh_${Date.now()}`,
        expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hora
        user_id: `${platform}_user_${Date.now()}`,
        username: `user_${platform}`,
        scopes: ['read', 'analytics']
      };

      // TODO: Implementar intercambio real de tokens
      // Esto requiere hacer llamadas a las APIs de cada plataforma
      // desde el backend por seguridad

      return mockTokenData;

    } catch (error) {
      console.error('Error intercambiando código:', error);
      return null;
    }
  };

  const saveConnection = async (platform: string, tokenData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { error } = await supabase
        .from('social_connections')
        .upsert({
          user_id: user.id,
          provider: platform,
          provider_user_id: tokenData.user_id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,provider'
        });

      if (error) {
        console.error('Error guardando conexión:', error);
        throw error;
      }

      console.log(`Conexión ${platform} guardada exitosamente`);

    } catch (error) {
      console.error('Error guardando conexión:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Procesando Autorización</h2>
          <p className="text-gray-600">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;

