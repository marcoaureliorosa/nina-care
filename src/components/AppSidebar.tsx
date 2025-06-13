import {
  Calendar,
  Home,
  MessageCircle,
  Settings,
  Users,
  Activity,
  Shield,
  ChevronDown,
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import React from "react"

// Menu items baseado em permissões
const useMenuItems = () => {
  const { isAdmin, isDoctor, canViewReports } = usePermissions();

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
      badge: 2, // Exemplo: 2 novas conversas
    },
    {
      title: "Pacientes",
      url: "/pacientes",
      icon: Users,
      show: true,
      badge: 5, // Exemplo: 5 novos pacientes
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
      title: isAdmin() ? "Administração" : "Gerenciamento",
      url: "/admin",
      icon: Shield,
      show: isAdmin() || isDoctor(),
    },
  ];

  return {
    main: items.filter(item => item.show),
    admin: adminItems.filter(item => item.show),
  };
};

export function AppSidebar() {
  const menuItems = useMenuItems();
  const { profile, user, signOut } = useAuth();
  const { isAdmin } = usePermissions();
  const navigate = useNavigate();

  // Dados do usuário e organização
  const userName = profile?.nome || user?.email?.split("@")[0] || "Usuário";
  const organizationName = profile?.organizacoes?.nome || "Organização";
  const avatarUrl = profile?.avatar_url;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Dropdown de organização
  const OrganizationDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-ninacare-primary/10 transition font-semibold text-ninacare-primary text-base">
          <span className="truncate max-w-[120px]">{organizationName}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem disabled>{organizationName}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/organizacoes")}>Trocar organização</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/organizacoes/nova")}>Nova organização</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Avatar do usuário fixo no rodapé
  const UserAvatarMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-ninacare-primary/10 transition">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="bg-ninacare-primary text-white text-base font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-zinc-800 text-sm leading-tight">{userName}</span>
            <span className="text-xs text-zinc-500 leading-tight">Conta</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => navigate("/perfil")}>Meu Perfil</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/configuracoes")}>Configurações</DropdownMenuItem>
        <DropdownMenuItem onClick={async () => { await signOut(); navigate("/login"); }} className="text-red-600 focus:text-red-600">Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Sidebar className="bg-white/90 shadow-lg border-0 rounded-2xl m-2 flex flex-col h-[98vh]">
      <div className="mb-2 mt-4">{OrganizationDropdown}</div>
      <SidebarContent className="flex-1">
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-ninacare-primary/10 transition font-medium text-zinc-700">
                      <item.icon className="w-5 h-5" />
                      <span className="truncate max-w-[110px]">{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-ninacare-primary text-white px-2 py-0.5 text-xs font-semibold rounded-full">{item.badge}</Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Administrativo - para admins e médicos */}
        {menuItems.admin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{isAdmin() ? "Administração" : "Gerenciamento"}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.admin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-ninacare-primary/10 transition font-medium text-zinc-700">
                        <item.icon className="w-5 h-5" />
                        <span className="truncate max-w-[110px]">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <div className="mt-auto mb-4">{UserAvatarMenu}</div>
    </Sidebar>
  )
}
