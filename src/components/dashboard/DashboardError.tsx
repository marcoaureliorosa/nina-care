import React, { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DashboardErrorProps {
  error?: Error | null;
}

const DashboardError = ({ error }: DashboardErrorProps) => {
  const { user } = useAuth();

  // Log de erro no useEffect para evitar problemas no JSX
  useEffect(() => {
    if (error) {
      console.error('Dashboard error:', error);
    }
  }, [error]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ninacare</h1>
          <p className="text-gray-600 mt-2">Usuário não autenticado.</p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Faça login para acessar o dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Ninacare</h1>
        <p className="text-gray-600 mt-2">Erro ao carregar dados do dashboard.</p>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Não foi possível carregar os dados do dashboard. Verifique sua conexão e tente novamente.
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DashboardError;
