import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { ThemeToggle } from './ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../components/ui/sidebar'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  User,
  Menu,
  Plus,
  Globe,
  TrendingUp,
  Video,
  Zap
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/',
      active: location.pathname === '/'
    },
    {
      title: 'Generar Script',
      icon: Plus,
      href: '/script-generator',
      active: location.pathname === '/script-generator'
    },
    {
      title: 'Mis Scripts',
      icon: FileText,
      href: '/my-scripts',
      active: location.pathname === '/my-scripts'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
      active: location.pathname === '/analytics'
    },
    {
      title: 'Rendimiento',
      icon: TrendingUp,
      href: '/rendimiento',
      active: location.pathname === '/rendimiento'
    },
    {
      title: 'Análisis de Videos',
      icon: Video,
      href: '/video-analysis',
      active: location.pathname === '/video-analysis'
    },
    {
      title: 'Análisis Avanzado',
      icon: Sparkles,
      href: '/video-analysis-advanced',
      active: location.pathname === '/video-analysis-advanced',
      premium: true
    },
    {
      title: 'Conexiones',
      icon: Globe,
      href: '/conexiones',
      active: location.pathname === '/conexiones'
    },
    {
      title: 'Configuración N8N',
      icon: Zap,
      href: '/webhook-settings',
      active: location.pathname === '/webhook-settings'
    },
    {
      title: 'WordPress Generator',
      icon: Globe,
      href: '/wordpress-generator',
      active: location.pathname === '/wordpress-generator',
      premium: true
    },
    {
      title: 'Configuración',
      icon: Settings,
      href: '/settings',
      active: location.pathname === '/settings'
    }
  ]

  const userInitials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <SidebarProvider>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar className="border-r bg-white dark:bg-gray-800 dark:border-gray-700">
            <SidebarHeader className="border-b p-4 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">MarketingGenius</span>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.href)}
                      className={`w-full justify-start ${
                        item.active 
                          ? isDark 
                            ? 'bg-gray-700 text-blue-400 border-blue-800' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                          : isDark
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                        {item.premium && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded">PRO</span>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            
            <SidebarFooter className="border-t p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{userInitials}</AvatarFallback>
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SidebarTrigger>
                <h1 className="text-xl font-bold ml-2">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button variant="gradient" size="sm" onClick={() => navigate('/script-generator')}>
                  <Plus className="h-4 w-4 mr-1" /> Nuevo Script
                </Button>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardLayout

