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
  const getCanManageOrganizations = (role: string): boolean => {
    // Apenas admins podem gerenciar organizações
    return role === 'admin';
  };

  const handleRoleChange = (newRole: string) => {
    setFormData(prev => ({
      ...prev,
      role: newRole,
      can_manage_organizations: getCanManageOrganizations(newRole)
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

  // Atualizar can_manage_organizations automaticamente quando o role mudar
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      can_manage_organizations: getCanManageOrganizations(prev.role)
    }));
  }, [formData.role]);

  const resetForm = () => {
    const defaultRole = 'recepcionista';
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      role: defaultRole,
      organizacao_id: profile?.organizacao_id || '',
      is_active: true,
      avatar_url: '',
      can_manage_organizations: getCanManageOrganizations(defaultRole)
    });
    setEditingUser(null);
  };

  // Função para abrir o dialog de novo usuário
  const openNewUserDialog = () => {
    setEditingUser(null);
    const defaultRole = 'recepcionista';
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      role: defaultRole,
      organizacao_id: profile?.organizacao_id || '',
      is_active: true,
      avatar_url: '',
      can_manage_organizations: getCanManageOrganizations(defaultRole)
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
      can_manage_organizations: getCanManageOrganizations(user.role)
    });
    setDialogOpen(true);
  };

  const validateForm = (data: UserFormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validação de nome
    if (!data.nome.trim()) {
      errors.push("Nome é obrigatório");
    } else if (!validateName(data.nome)) {
      errors.push("Nome deve conter pelo menos nome e sobrenome");
    }

    // Validação de email
    if (!data.email.trim()) {
      errors.push("Email é obrigatório");
    } else if (!validateEmail(data.email)) {
      errors.push("Email deve ter um formato válido");
    }

    // Validação de telefone (se preenchido)
    if (data.telefone && !validatePhone(data.telefone)) {
      errors.push("Telefone deve ter entre 10 e 11 dígitos");
    }

    // Validação de URL do avatar (se preenchida)
    if (data.avatar_url && !validateUrl(data.avatar_url)) {
      errors.push("URL do avatar deve ser válida");
    }

    // Validação de organização
    if (!data.organizacao_id) {
      errors.push("Organização é obrigatória");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Obter a organização do usuário logado diretamente do banco de dados
    const { data: orgData, error: orgError } = await supabase.rpc('get_current_user_org');
    
    if (orgError || !orgData) {
      toast({
        title: "Erro de permissão",
        description: "Não foi possível verificar sua organização. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }
    
    const currentUserOrgId = orgData;

    // 2. Garantir que a organizacao_id do formulário esteja correta
    const finalOrgId = formData.organizacao_id || currentUserOrgId;

    if (!finalOrgId) {
      toast({
        title: "Erro de configuração",
        description: "A organização do novo usuário não pôde ser determinada.",
        variant: "destructive",
      });
      return;
    }
    
    const finalFormData = {
      ...formData,
      organizacao_id: finalOrgId,
    };

    // 3. Validar formulário com os dados finais
    const validation = validateForm(finalFormData);
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
        // ATUALIZAR USUÁRIO
        const { error } = await supabase
          .from('profiles')
          .update({
            nome: finalFormData.nome,
            telefone: finalFormData.telefone,
            role: finalFormData.role as any,
            organizacao_id: finalFormData.organizacao_id,
            is_active: finalFormData.is_active,
            avatar_url: finalFormData.avatar_url,
            can_manage_organizations: finalFormData.can_manage_organizations
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        
        toast({
          title: "Usuário atualizado",
          description: "O usuário foi atualizado com sucesso.",
        });
      } else {
        // CRIAR NOVO USUÁRIO
        const { data, error: inviteError } = await supabase.auth.signUp({
          email: finalFormData.email,
          password: generateTemporaryPassword(),
          options: {
            data: {
              nome: finalFormData.nome,
              role: finalFormData.role,
              organizacao_id: finalFormData.organizacao_id,
              telefone: finalFormData.telefone,
              avatar_url: finalFormData.avatar_url,
              can_manage_organizations: finalFormData.can_manage_organizations
            }
          }
        });

        if (inviteError) throw inviteError;
        if (!data.user) throw new Error('Criação do usuário falhou.');
        
        toast({
          title: "Convite Enviado",
          description: `O convite para ${finalFormData.email} foi enviado com sucesso.`,
        });
      }
      
      await fetchUsers();
      handleDialogClose();

    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro inesperado.",
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
