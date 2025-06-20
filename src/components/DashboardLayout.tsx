import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './LanguageSelector';
import { 
  LayoutDashboard, 
  Plus, 
  Video, 
  BarChart3, 
  LogOut, 
  Sparkles,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Zap,
  Brain,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    {
      title: t('dashboard.title'),
      icon: LayoutDashboard,
      href: '/dashboard',
      active: location.pathname === '/dashboard',
      description: t('dashboard.description')
    },
    {
      title: t('dashboard.generate_script'),
      icon: Plus,
      href: '/script-generator',
      active: location.pathname === '/script-generator',
      description: t('dashboard.generate_script_desc')
    },
    {
      title: t('dashboard.video_analysis'),
      icon: Video,
      href: '/video-analysis',
      active: location.pathname === '/video-analysis',
      description: t('dashboard.video_analysis_desc')
    },
    {
      title: t('dashboard.finetuning'),
      icon: Brain,
      href: '/finetuning',
      active: location.pathname === '/finetuning',
      description: t('dashboard.finetuning_desc')
    },
    {
      title: t('dashboard.analytics'),
      icon: BarChart3,
      href: '/analytics',
      active: location.pathname === '/analytics',
      description: t('dashboard.analytics_desc')
    }
  ];

  const userInitials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.active);
    return currentItem?.title || 'Dashboard';
  };

  const getPageIcon = () => {
    const currentItem = menuItems.find(item => item.active);
    const IconComponent = currentItem?.icon || LayoutDashboard;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="flex h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Sidebar Header */}
          <div className="border-b p-6 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">Genius Script</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Builder 3.0</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-start space-x-3 p-4 rounded-xl transition-all duration-200
                  ${item.active 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-102'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 mt-0.5 ${item.active ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                <div className="text-left">
                  <div className={`font-medium ${item.active ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                    {item.title}
                  </div>
                  <div className={`text-xs ${item.active ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="p-4 mx-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
            <h3 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">{t('dashboard.system_status')}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1">
                  <Brain className="w-3 h-3 text-blue-500" />
                  <span>{t('dashboard.ai_active')}</span>
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">{t('dashboard.active')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-purple-500" />
                  <span>{t('dashboard.precision')}</span>
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">87.3%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span>{t('dashboard.last_update')}</span>
                </span>
                <span className="text-gray-600 dark:text-gray-400">{t('dashboard.today')}</span>
              </div>
            </div>
          </div>
          
          {/* User section */}
          <div className="mt-auto p-4 border-t dark:border-gray-700">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.premium_user')}</p>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-1 h-8 w-8"
                  title={theme === 'dark' ? t('dashboard.light_mode') : t('dashboard.dark_mode')}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="p-1 h-8 w-8 text-red-500 hover:text-red-600"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white shadow-md">
                    {getPageIcon()}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{getPageTitle()}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {menuItems.find(item => item.active)?.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Status Indicator */}
                <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    {t('dashboard.system_active')}
                  </span>
                </div>
                
                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <LanguageSelector />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={theme === 'dark' ? t('dashboard.light_mode') : t('dashboard.dark_mode')}
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                  
                  <div className="flex items-center space-x-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                      {user?.user_metadata?.full_name?.split(' ')[0] || 'Usuario'}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title={t('nav.logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

