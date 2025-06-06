
import { MessageSquare, Users, Activity, Settings, Home, Calendar, User, Shield } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Conversas",
    url: "/conversas",
    icon: MessageSquare,
  },
  {
    title: "Pacientes",
    url: "/pacientes",
    icon: Users,
  },
  {
    title: "Agenda",
    url: "/agenda",
    icon: Calendar,
  },
  {
    title: "Meu Perfil",
    url: "/perfil",
    icon: User,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
]

const adminMenuItems = [
  {
    title: "Painel Admin",
    url: "/admin",
    icon: Shield,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { profile } = useAuth()

  const allMenuItems = [
    ...menuItems,
    ...(profile?.role === 'admin' ? adminMenuItems : [])
  ]

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-ninacare-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">Ninacare</h2>
            <p className="text-xs text-sidebar-foreground/70">Central de Monitoramento</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider px-6 py-2">
            Navegação Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                  >
                    <a href={item.url} className="flex items-center gap-3 px-6 py-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-6">
        <div className="text-xs text-sidebar-foreground/50">
          © 2024 Ninacare Platform
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
