
import {
  Calendar,
  Home,
  MessageCircle,
  Settings,
  Users,
  Activity,
  Shield,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePermissions } from "@/hooks/usePermissions"

// Menu items baseado em permissões
const useMenuItems = () => {
  const { isAdmin, canViewReports } = usePermissions();

  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      show: true,
    },
    {
      title: "Conversas",
      url: "/conversas",
      icon: MessageCircle,
      show: true,
    },
    {
      title: "Pacientes",
      url: "/pacientes",
      icon: Users,
      show: true,
    },
    {
      title: "Agenda",
      url: "/agenda",
      icon: Calendar,
      show: true,
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
      show: true,
    },
  ];

  const adminItems = [
    {
      title: "Administração",
      url: "/admin",
      icon: Shield,
      show: isAdmin(),
    },
  ];

  return {
    main: items.filter(item => item.show),
    admin: adminItems.filter(item => item.show),
  };
};

export function AppSidebar() {
  const menuItems = useMenuItems();

  return (
    <Sidebar>
      <SidebarContent>
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Administrativo - apenas para admins */}
        {menuItems.admin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.admin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
