import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings, Users, Building2, ShieldCheck, FileText, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminPage = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const userRole = profile?.role || 'Visitante';

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: 'Configurações Gerais',
      description: 'Ajustes globais da aplicação',
      icon: Settings,
      href: '/configuracoes',
      disabled: false,
    },
    {
      title: 'Gerenciar Organização',
      description: 'Edite os dados da sua organização',
      icon: Building2,
      href: '/configuracoes?tab=organization',
      disabled: false,
    },
    {
      title: 'Gerenciar Usuários',
      description: 'Adicione, remova e edite usuários',
      icon: Users,
      href: '/configuracoes?tab=users',
      disabled: false,
    },
    {
      title: 'Modelos e Documentos',
      description: 'Gerencie os modelos de documentos',
      icon: FileText,
      href: '#',
      disabled: true,
    },
    {
      title: 'Inteligência Artificial',
      description: 'Configurações do assistente de IA',
      icon: Bot,
      href: '#',
      disabled: true,
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Painel do Administrador</h1>
        <p className="text-muted-foreground">Bem-vindo, {profile?.nome || 'Admin'}.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <Link key={index} to={section.disabled ? '#' : section.href} className={section.disabled ? 'pointer-events-none' : ''}>
            <Card className={`h-full transition-all hover:shadow-lg hover:border-primary/50 ${section.disabled ? 'opacity-50 bg-muted/50' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <section.icon className="w-8 h-8 text-primary" />
                  {section.disabled && <Badge variant="outline">Em breve</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                {!section.disabled && (
                  <div className="text-sm font-medium text-primary flex items-center mt-4">
                    Acessar <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
