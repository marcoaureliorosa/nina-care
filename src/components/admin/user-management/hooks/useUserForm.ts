
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserFormData } from '../types';

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
        toast({
          title: "Funcionalidade em desenvolvimento",
          description: "A criação de novos usuários será implementada em breve.",
          variant: "destructive",
        });
        return;
      }

      setDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
