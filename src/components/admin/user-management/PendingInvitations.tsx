import React, { useState, useEffect } from 'react';
import { Mail, RotateCcw, X, Clock, Users, User, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { timeAgo } from '../../../utils/time';
import { UserProfile } from '../user-management/types';
import { getInitials } from '../../../utils/string';

type UserRole = 'admin' | 'doctor' | 'equipe';

const roleDisplay: Record<string, string> = {
  admin: 'Administrador',
  doctor: 'Médico',
  equipe: 'Equipe',
};

const PendingInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvitations = async () => {
    setLoading(true);
    
    // Buscar usuários que ainda não confirmaram o email
    const { data, error } = await supabase
      .from('profiles')
      .select(`*, organizacoes ( nome )`)
      .is('email_confirmed_at', null);

    if (error) {
      console.error('Erro ao buscar convites pendentes:', error);
      toast({
        title: 'Erro ao buscar convites',
        description: 'Não foi possível carregar os usuários pendentes.',
        variant: 'destructive',
      });
      setInvitations([]);
    } else {
      // Filtrar apenas usuários que realmente estão pendentes
      // Um usuário é considerado pendente se não tem email_confirmed_at
      const pendingUsers = data?.filter(profile => 
        !profile.email_confirmed_at
      ) || [];
      
      setInvitations(pendingUsers as UserProfile[]);
    }
    
    setLoading(false);
  };

  const resendInvitation = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    
    if (error) {
      toast({ title: 'Erro ao reenviar convite', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Convite Reenviado', description: `Um novo link de definição de senha foi enviado para ${email}.` });
    }
  };

  const removeUser = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${userName}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso.",
      });

      // Atualizar lista
      await fetchInvitations();
    } catch (error: any) {
      console.error('Error removing user:', error);
      toast({
        title: "Erro ao remover",
        description: error.message || "Não foi possível remover o usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  if (loading) {
    return (
      <Card className="border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5" />
            Convites Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Convites Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invitations.length > 0 ? (
          <ul className="space-y-4">
            {invitations.map((invitation) => (
              <li key={invitation.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(invitation.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{invitation.nome}</p>
                    <p className="text-sm text-muted-foreground">{invitation.email}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="outline">{roleDisplay[invitation.role] || invitation.role}</Badge>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {timeAgo(invitation.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => resendInvitation(invitation.email)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reenviar
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum convite pendente.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingInvitations; 