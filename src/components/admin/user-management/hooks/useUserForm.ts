import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserFormData } from '../types';
import type { Database } from '@/integrations/supabase/types';

export const useUserForm = (
  profile: any,
  fetchUsers: () => void,
  setLoading: (loading: boolean) => void,
  toast: any
) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    telefone: '',
    role: 'recepcionista',
    organizacao_id: '',
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      role: 'recepcionista',
      organizacao_id: profile?.organizacao_id || '',
      is_active: true
    });
    setEditingUser(null);
  };

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone || '',
      role: user.role,
      organizacao_id: user.organizacao_id,
      is_active: user.is_active
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Cadastro de novo usuário
    if (!editingUser) {
      if (!formData.password || formData.password.length < 6) {
        toast({
          title: "Senha obrigatória",
          description: "A senha deve ter pelo menos 6 caracteres.",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      if (editingUser) {
        const { error } = await supabase
          .from('profiles')
          .update({
            nome: formData.nome,
            telefone: formData.telefone,
            role: formData.role,
            organizacao_id: formData.organizacao_id,
            is_active: formData.is_active
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        
        toast({
          title: "Usuário atualizado",
          description: "O usuário foi atualizado com sucesso.",
        });
      } else {
        // 1. Criar usuário no Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password!,
        });
        if (signUpError) throw signUpError;
        const userId = data.user?.id;
        if (!userId) throw new Error('Erro ao obter o ID do usuário criado.');

        // 2. Inserir perfil na tabela 'profiles'
        const roleEnum = formData.role as unknown as Database["public"]["Enums"]["user_role"];
        const profileInsert: Database["public"]["Tables"]["profiles"]["Insert"] = {
          id: userId,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          role: roleEnum,
          organizacao_id: formData.organizacao_id,
          is_active: formData.is_active
        };
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileInsert);
        if (profileError) throw profileError;

        toast({
          title: "Usuário criado",
          description: "O usuário foi cadastrado com sucesso.",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      // Limpar senha do formData por segurança
      setFormData((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  return {
    dialogOpen,
    setDialogOpen,
    editingUser,
    formData,
    setFormData,
    handleEdit,
    handleSubmit,
    handleDialogClose
  };
};
