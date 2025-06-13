import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input, InputMaskPhone } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Building2, Mail, Phone, Shield, Save, Activity, RefreshCw, AlertCircle, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getInitials } from '@/utils/string';

const roleConfig = {
  admin: { label: 'Administrador', icon: ShieldCheck, color: 'bg-red-100 text-red-800' },
  doctor: { label: 'Médico', icon: Stethoscope, color: 'bg-blue-100 text-blue-800' },
  equipe: { label: 'Equipe', icon: Users, color: 'bg-purple-100 text-purple-800' },
};

const ProfilePage = () => {
  const { profile, loading: authLoading, updateProfile } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ nome: '', telefone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        telefone: profile.telefone || '',
      });
    }
  }, [profile]);
  
  const handleUpdate = async () => {
    if (!profile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await updateProfile({
        nome: formData.nome,
        telefone: formData.telefone,
      });

      if (error) throw new Error(error);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao salvar as alterações. Tente novamente.');
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading) return <div className="p-4">Carregando perfil...</div>;
  if (!profile) return <div className="p-4">Perfil não encontrado.</div>;

  const { icon: Icon, color, label } = roleConfig[profile.role] || { icon: Users, color: 'bg-gray-200', label: 'Indefinido'};

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.nome} />
            <AvatarFallback>{getInitials(profile.nome)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{profile.nome}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
            <Badge className={cn("flex items-center gap-2", color)}>
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </Label>
                <InputMaskPhone
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Organização
                </Label>
                <Input
                  value={profile.organizacoes?.nome || 'Sem organização'}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>Status: {profile.is_active ? 'Ativo' : 'Inativo'}</span>
            </div>
            
            <Button 
              onClick={handleUpdate} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
