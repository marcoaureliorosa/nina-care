import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '../types';
import type { Database } from '@/integrations/supabase/types';
import { validateEmail, validateName, validatePhone, validateUrl } from '@/utils/validations';
import { ROLE_OPTIONS } from '@/utils/permissions';

// Definir o tipo para FormData
interface UserFormData {
  nome: string;
  email: string;
  telefone: string;
  role: string;
  organizacao_id: string;
  is_active: boolean;
  avatar_url: string;
  can_manage_organizations: boolean;
}

// Função para gerar senha temporária que atende aos requisitos do Supabase
const generateTemporaryPassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;\':",./<>?';
  
  // Garantir pelo menos um caractere de cada tipo
  const password = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];
  
  // Adicionar mais caracteres aleatórios para completar uma senha de 16 caracteres
  const allChars = lowercase + uppercase + numbers + symbols;
  for (let i = 4; i < 16; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }
  
  // Embaralhar o array para randomizar a posição dos caracteres obrigatórios
  return password.sort(() => Math.random() - 0.5).join('');
};

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
    organizacao_id: profile?.organizacao_id || '',
    is_active: true,
    avatar_url: '',
    can_manage_organizations: false
  });

  // Atualizar automaticamente can_manage_organizations baseado no role
  const handleRoleChange = (newRole: string) => {
    const roleOption = ROLE_OPTIONS.find(r => r.value === newRole);
    setFormData(prev => ({
      ...prev,
      role: newRole,
      can_manage_organizations: roleOption?.canManageOrg || false
    }));
  };

  // Atualizar organizacao_id quando o profile for carregado
  useEffect(() => {
    if (profile?.organizacao_id) {
      setFormData(prev => ({
        ...prev,
        organizacao_id: profile.organizacao_id
      }));
    }
  }, [profile?.organizacao_id]);

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      role: 'recepcionista',
      organizacao_id: profile?.organizacao_id || '',
      is_active: true,
      avatar_url: '',
      can_manage_organizations: false
    });
    setEditingUser(null);
  };

  // Função para abrir o dialog de novo usuário
  const openNewUserDialog = () => {
    setEditingUser(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      role: 'recepcionista',
      organizacao_id: profile?.organizacao_id || '',
      is_active: true,
      avatar_url: '',
      can_manage_organizations: false
    });
    setDialogOpen(true);
  };

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone || '',
      role: user.role,
      organizacao_id: user.organizacao_id,
      is_active: user.is_active,
      avatar_url: user.avatar_url || '',
      can_manage_organizations: user.can_manage_organizations || false
    });
    setDialogOpen(true);
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validação de nome
    if (!formData.nome.trim()) {
      errors.push("Nome é obrigatório");
    } else if (!validateName(formData.nome)) {
      errors.push("Nome deve conter pelo menos nome e sobrenome");
    }

    // Validação de email
    if (!formData.email.trim()) {
      errors.push("Email é obrigatório");
    } else if (!validateEmail(formData.email)) {
      errors.push("Email deve ter um formato válido");
    }

    // Validação de telefone (se preenchido)
    if (formData.telefone && !validatePhone(formData.telefone)) {
      errors.push("Telefone deve ter entre 10 e 11 dígitos");
    }

    // Validação de URL do avatar (se preenchida)
    if (formData.avatar_url && !validateUrl(formData.avatar_url)) {
      errors.push("URL do avatar deve ser válida");
    }

    // Validação de organização
    if (!formData.organizacao_id) {
      errors.push("Organização é obrigatória");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Garantir que a organizacao_id está sempre presente
    const finalOrgId = formData.organizacao_id || profile?.organizacao_id;
    if (!finalOrgId) {
      toast({
        title: "Erro de configuração",
        description: "Não foi possível determinar a organização. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    // Validar formulário
    const validation = validateForm();
    if (!validation.isValid) {
      toast({
        title: "Dados inválidos",
        description: validation.errors.join('. '),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingUser) {
        // Atualizar usuário existente
        const { error } = await supabase
          .from('profiles')
          .update({
            nome: formData.nome,
            telefone: formData.telefone,
            role: formData.role as any,
            organizacao_id: finalOrgId,
            is_active: formData.is_active,
            avatar_url: formData.avatar_url,
            can_manage_organizations: formData.can_manage_organizations
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        
        toast({
          title: "Usuário atualizado",
          description: "O usuário foi atualizado com sucesso.",
        });
      } else {
        // Criar novo usuário - passar organizacao_id no metadata
        const { data, error: inviteError } = await supabase.auth.signUp({
          email: formData.email,
          password: generateTemporaryPassword(),
          options: {
            data: {
              name: formData.nome,
              nome: formData.nome,
              role: formData.role,
              organizacao_id: finalOrgId, // Garantir que seja passado
              telefone: formData.telefone,
              avatar_url: formData.avatar_url,
              can_manage_organizations: formData.can_manage_organizations
            }
          }
        });

        if (inviteError) throw inviteError;
        
        const userId = data.user?.id;
        if (!userId) throw new Error('Erro ao criar usuário.');

        // Aguardar para o trigger ser executado
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar se o profile foi criado corretamente
        const { data: profileCheck } = await supabase
          .from('profiles')
          .select('organizacao_id')
          .eq('id', userId)
          .single();

        // Se a organização não foi definida corretamente, forçar update
        if (!profileCheck?.organizacao_id || profileCheck.organizacao_id !== finalOrgId) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              nome: formData.nome,
              telefone: formData.telefone,
              role: formData.role as any,
              organizacao_id: finalOrgId, // Forçar a organização correta
              is_active: formData.is_active,
              avatar_url: formData.avatar_url,
              can_manage_organizations: formData.can_manage_organizations
            })
            .eq('id', userId);

          if (updateError) {
            console.error('Erro ao atualizar perfil:', updateError);
          }
        }

        toast({
          title: "Convite enviado",
          description: `Um convite foi enviado para ${formData.email}. O usuário será vinculado à sua organização.`,
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
    handleDialogClose,
    handleRoleChange,
    roleOptions: ROLE_OPTIONS,
    openNewUserDialog
  };
};
