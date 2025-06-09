import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input, InputMaskPhone } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Building2, Mail, Phone, Shield, Save, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProfilePage = () => {
  const { user, profile, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [formData, setFormData] = useState({
    nome: profile?.nome || '',
    telefone: profile?.telefone || '',
  });

  // Atualizar formData quando o profile carregar
  React.useEffect(() => {
    console.log('ProfilePage: Profile effect triggered');
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        telefone: profile.telefone || '',
      });
    }
  }, [profile]);

  // Log do estado atual (apenas para debug, sem dados sensíveis)
  React.useEffect(() => {
    console.log('ProfilePage: Current state', {
      loading,
      hasUser: !!user,
      hasProfile: !!profile,
      userEmail: user?.email // Email não é sensível como ID
    });
  }, [loading, user, profile]);

  const handleSave = async () => {
    const { error } = await updateProfile({
      ...formData,
      telefone: formData.telefone.replace(/\D/g, '')
    });
    if (!error) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: profile?.nome || '',
      telefone: profile?.telefone || '',
    });
    setIsEditing(false);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    window.location.reload(); // Força recarregamento completo
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      doctor: 'Médico',
      nurse: 'Enfermeiro',
      secretary: 'Secretário',
      recepcionista: 'Recepcionista'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      doctor: 'bg-blue-100 text-blue-800',
      nurse: 'bg-green-100 text-green-800',
      secretary: 'bg-yellow-100 text-yellow-800',
      recepcionista: 'bg-purple-100 text-purple-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="w-8 h-8 text-ninacare-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Usuário não autenticado</h2>
          <p className="text-gray-600">Faça login para acessar seu perfil.</p>
        </div>
      </div>
    );
  }

  // Se não há perfil mas há usuário, usar dados básicos do auth.users
  if (!profile && user) {
    const displayName = user.email?.split('@')[0] || 'Usuário';
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e configurações</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Não foi possível carregar todas as informações do seu perfil. Algumas funcionalidades podem estar limitadas.
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="ml-2"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card básico com dados do auth.users */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-lg font-semibold bg-ninacare-primary text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{displayName}</CardTitle>
              <CardDescription>
                Dados básicos disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de mensagem */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Perfil Incompleto
              </CardTitle>
              <CardDescription>
                Entre em contato com o administrador para completar seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Algumas informações do seu perfil não puderam ser carregadas. 
                Isso pode acontecer se seu perfil ainda não foi configurado completamente pelo administrador.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleRetry} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Recarregar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Se há profile, mostrar interface completa
  const initials = profile.nome
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e configurações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card do Avatar e Informações Básicas */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-lg font-semibold bg-ninacare-primary text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{profile.nome}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Badge className={getRoleColor(profile.role)}>
                <Shield className="w-3 h-3 mr-1" />
                {getRoleLabel(profile.role)}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{profile.email}</span>
              </div>
              {profile.telefone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{profile.telefone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{profile.organizacoes?.nome || 'Sem organização'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Edição */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </div>
              {!isEditing && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                {isEditing ? (
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Digite seu nome completo"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {profile.nome}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-500">
                  {profile.email}
                  <span className="text-xs block text-gray-400 mt-1">
                    Email não pode ser alterado
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                {isEditing ? (
                  <InputMaskPhone
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value.replace(/\D/g, '') })}
                    placeholder="(11) 99999-9999"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {profile.telefone || 'Não informado'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <div className="px-3 py-2 bg-gray-50 rounded-md">
                  <Badge className={getRoleColor(profile.role)}>
                    {getRoleLabel(profile.role)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Organização</Label>
              <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                <div className="font-medium">{profile.organizacoes?.nome || 'Sem organização'}</div>
                {profile.organizacoes?.cnpj && (
                  <div className="text-sm text-gray-500 mt-1">
                    CNPJ: {profile.organizacoes.cnpj}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="bg-ninacare-primary hover:bg-ninacare-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
