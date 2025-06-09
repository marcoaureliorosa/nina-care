import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import OrganizationManagement from '@/components/admin/OrganizationManagement';
import UserManagement from '@/components/admin/UserManagement';
import { useAuth } from '@/contexts/AuthContext';

const ConfiguracoesPage = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Dados da Organização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationManagement />
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Usuários da Organização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserManagement onlyCurrentOrganization />
          </CardContent>
        </Card>
      )}

      {!isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Você não tem permissão para acessar as configurações da organização.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConfiguracoesPage;
