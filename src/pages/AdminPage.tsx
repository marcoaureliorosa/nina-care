
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import OrganizationManagement from '@/components/admin/OrganizationManagement';
import UserManagement from '@/components/admin/UserManagement';
import OrganizationSwitcher from '@/components/admin/OrganizationSwitcher';

const AdminPage = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 text-ninacare-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verificar se o usuário tem permissão de admin
  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-ninacare-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600">Gerencie organizações e usuários do sistema</p>
          </div>
        </div>
        <OrganizationSwitcher />
      </div>

      <Tabs defaultValue="organizations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="organizations" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Organizações
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organizations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Gerenciar Organizações
              </CardTitle>
              <CardDescription>
                Cadastre e gerencie as organizações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerenciar Usuários
              </CardTitle>
              <CardDescription>
                Cadastre e gerencie os usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
