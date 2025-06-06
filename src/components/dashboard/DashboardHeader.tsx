
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
  
  const organizationName = userProfile?.organizacoes?.nome || profile?.organizacoes?.nome || 'Organização não encontrada';

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
        Usuário: {profile?.nome || user?.email}
      </p>
    </div>
  );
};

export default DashboardHeader;
