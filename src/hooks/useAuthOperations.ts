
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/auth';
import { cleanupAuthState } from '@/utils/authCleanup';

export const useAuthOperations = () => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Global signout failed, continuing:', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting signout process...');
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) {
          console.error('Supabase signout error:', error);
        }
      } catch (err) {
        console.error('Global signout failed:', err);
        // Continue with cleanup even if this fails
      }
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });

      // Force page reload for a clean state
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
      
      // Force page reload even on error
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
  };

  const updateProfile = async (user: User, updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  return {
    signIn,
    signOut,
    updateProfile,
  };
};
