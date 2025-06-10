import React, { useState, useEffect } from 'react';
import { Mail, RotateCcw, X, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface PendingUser {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'secretary' | 'recepcionista';
  created_at: string;
  organizacoes?: {
    nome: string;
  };
}

const PendingInvitations: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const roleLabels = {
    admin: 'Administrador',
    doctor: 'Médico',
    nurse: 'Enfermeiro',
    secretary: 'Secretário',
    recepcionista: 'Recepcionista'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      // Buscar profiles criados nas últimas 48 horas (convites recentes)
      const { data: recentProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          nome,
          email,
          role,
          created_at,
          organizacoes (
            nome
          )
        `)
        .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()) // Últimas 48 horas
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      setPendingUsers((recentProfiles as unknown as PendingUser[]) || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os convites pendentes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendInvitation = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`
      });
      
      if (error) throw error;

      toast({
        title: "Convite reenviado",
        description: `Um novo link foi enviado para ${email}.`,
      });
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Erro ao reenviar",
        description: error.message || "Não foi possível reenviar o convite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      await fetchPendingUsers();
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h atrás`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}min atrás`;
    } else {
      return 'Agora mesmo';
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  if (pendingUsers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Mail className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum convite pendente</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Convites Pendentes
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {pendingUsers.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {getInitials(user.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{user.nome}</h4>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {roleLabels[user.role as keyof typeof roleLabels] || user.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(user.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resendInvitation(user.email)}
                  disabled={loading}
                  className="text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reenviar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUser(user.id, user.nome)}
                  disabled={loading}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPendingUsers}
            disabled={loading}
            className="w-full"
          >
            <RotateCcw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Atualizar Lista
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingInvitations; 