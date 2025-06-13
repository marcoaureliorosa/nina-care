
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Users, Building2, Settings, Shield, AlertCircle } from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import OrganizationManagement from '@/components/admin/OrganizationManagement';
import OrganizationSwitcher from '@/components/admin/OrganizationSwitcher';

const AdminPage = () => {
  const { profile } = useAuth();
  const { isAdmin, isDoctor, canManageUsers, canManageOrganization, canAccessConfigurations, userRole } = usePermissions();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="w-8 h-8 text-ninacare-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verificar se o usuário tem permissão para acessar a página de admin
  if (!isAdmin() && !isDoctor()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-gray-500 mt-2">
            Apenas administradores e médicos podem acessar o painel administrativo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin() ? 'Painel Administrativo' : 'Painel de Gerenciamento'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin() 
              ? 'Gerencie usuários, organizações e configurações do sistema'
              : 'Gerencie usuários e configurações do sistema'
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            {userRole === 'admin' ? 'Administrador' : 
             userRole === 'doctor' ? 'Médico' : 
             userRole === 'recepcionista' ? 'Equipe' : userRole}
          </Badge>
          {canManageOrganization() && <OrganizationSwitcher />}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organização Atual</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.organizacoes?.nome || 'Sem organização'}</div>
            <p className="text-xs text-muted-foreground">
              CNPJ: {profile.organizacoes?.cnpj || 'Não informado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seu Papel</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRole === 'admin' ? 'Administrador' : 
               userRole === 'doctor' ? 'Médico' : 
               userRole === 'recepcionista' ? 'Equipe' : userRole}
            </div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'admin' ? 'Acesso completo ao sistema' :
               userRole === 'doctor' ? 'Acesso completo exceto organizações' :
               'Acesso básico - sem configurações'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              Sistema operacional
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Administração */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          {canManageUsers() && (
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários
            </TabsTrigger>
          )}
          {canManageOrganization() && (
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organização
            </TabsTrigger>
          )}
          {canAccessConfigurations() && (
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          )}
        </TabsList>

        {canManageUsers() && (
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                  Gerencie os usuários da sua organização, defina papéis e permissões.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canManageOrganization() && (
          <TabsContent value="organization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento da Organização</CardTitle>
                <CardDescription>
                  Configure as informações da sua organização.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrganizationManagement />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canAccessConfigurations() && (
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configure preferências e parâmetros do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  As configurações do sistema serão implementadas em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminPage;
