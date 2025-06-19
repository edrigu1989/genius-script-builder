import React, { createContext, useContext, useState, useEffect } from 'react';

// Definir el tipo para el contexto
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  theme: 'light' | 'dark' | 'system';
}

// Crear el contexto con valores por defecto
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
  theme: 'system',
});

// Hook personalizado para usar el contexto
export const useTheme = () => useContext(ThemeContext);

// Proveedor del contexto
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para el tema actual
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  // Estado para si está en modo oscuro
  const [isDark, setIsDark] = useState(false);

  // Efecto para inicializar el tema desde localStorage
  useEffect(() => {
    // Función para aplicar el tema
    const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
      const root = window.document.documentElement;
      
      // Eliminar clases existentes
      root.classList.remove('light', 'dark');
      
      // Determinar si debe ser oscuro
      let shouldBeDark = false;
      
      if (newTheme === 'system') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        shouldBeDark = newTheme === 'dark';
      }
      
      // Aplicar clase
      root.classList.add(shouldBeDark ? 'dark' : 'light');
      setIsDark(shouldBeDark);
    };

    // Obtener tema guardado o usar sistema
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    setThemeState(savedTheme);
    applyTheme(savedTheme);

    // Escuchar cambios en preferencias del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Función para cambiar el tema
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  // Función para alternar entre claro y oscuro
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

