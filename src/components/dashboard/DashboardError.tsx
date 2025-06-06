
import { useAuth } from "@/contexts/AuthContext"

interface DashboardErrorProps {
  error?: Error | null;
}

const DashboardError = ({ error }: DashboardErrorProps) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ninacare</h1>
          <p className="text-gray-600 mt-2">Usuário não autenticado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Ninacare</h1>
        <p className="text-gray-600 mt-2">Erro ao carregar dados do dashboard.</p>
        <p className="text-sm text-red-600">
          {error ? error.message : 'Erro desconhecido'}
        </p>
      </div>
    </div>
  );
};

export default DashboardError;
