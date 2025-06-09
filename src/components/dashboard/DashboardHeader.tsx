import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

interface DashboardHeaderProps {
  userProfile?: {
    organizacoes?: {
      nome: string;
    };
  } | null;
}

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  doctor: 'Médico',
  nurse: 'Enfermeiro',
  secretary: 'Secretária',
  recepcionista: 'Recepcionista',
}

const DashboardHeader = ({ userProfile }: DashboardHeaderProps) => {
  const { user, profile } = useAuth();
  
  // Usar dados do perfil completo, fallback para dados básicos do auth, ou mensagem padrão
  const organizationName = userProfile?.organizacoes?.nome || 
                          profile?.organizacoes?.nome || 
                          'Carregando organização...';
  
  const userName = profile?.nome || 
                   user?.email?.split('@')[0] || 
                   'Usuário';

  const userRole = profile?.role || 'user';
  const avatarUrl = profile?.avatar_url;
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="ninacare-gradient rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end justify-between shadow-lg mb-6">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Avatar className="h-16 w-16 shadow-md border-4 border-white bg-white">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={userName} />
          ) : (
            <AvatarFallback className="bg-ninacare-primary text-white text-xl font-bold">{initials}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            {userName}
            {userRole && (
              <Badge className="ml-2 bg-white/20 text-white border-white/30" variant="secondary">
                {roleLabels[userRole] || userRole}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-white/80 mt-1 font-medium">{organizationName}</p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 text-right w-full md:w-auto">
        <p className="text-base text-white/90 font-medium">Dashboard Ninacare</p>
        <p className="text-xs text-white/70 mt-1">Acompanhamento em tempo real dos agentes IA e métricas de engajamento</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
