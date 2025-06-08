
import { useAuth } from "@/contexts/AuthContext"

interface DashboardHeaderProps {
  userProfile?: {
    organizacoes?: {
      nome: string;
    };
  } | null;
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

  return (
    <div className="border-b border-gray-200 pb-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Ninacare</h1>
      <p className="text-gray-600 mt-2">
        Acompanhamento em tempo real dos agentes IA e métricas de engajamento
      </p>
      <p className="text-sm text-gray-500">
        Organização: {organizationName}
      </p>
      <p className="text-xs text-gray-400">
        Usuário: {userName}
      </p>
    </div>
  );
};

export default DashboardHeader;
