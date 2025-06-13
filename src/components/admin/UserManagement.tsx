import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserFormDialog from './user-management/UserFormDialog';
import UserTable from './user-management/UserTable';
import { useUsers } from './user-management/hooks/useUsers';
import { useUserForm } from './user-management/hooks/useUserForm';

interface UserManagementProps {
  onlyCurrentOrganization?: boolean;
}

const UserManagement = ({ onlyCurrentOrganization }: UserManagementProps) => {
  const { profile } = useAuth();
  const { users, organizations, loading, setLoading, fetchUsers, deleteUser, toast } = useUsers();
  
  const {
    dialogOpen,
    setDialogOpen,
    editingUser,
    formData,
    setFormData,
    handleEdit,
    handleSubmit,
    handleDialogClose,
    openNewUserDialog
  } = useUserForm(profile, fetchUsers, setLoading, toast);

  // Função para deletar usuário e fechar modal
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }
    
    try {
      await deleteUser(id);
      // Se chegou até aqui, a exclusão foi bem-sucedida
      setDialogOpen(false);
      handleDialogClose();
    } catch (error) {
      // Erro já tratado no deleteUser
      console.error('Erro na exclusão:', error);
    }
  };

  const isAdmin = profile?.role === 'admin';

  // Admin sempre vê todos os usuários e organizações, independentemente do filtro.
  // O filtro se aplica apenas para visualização na tabela.
  const usersForTable = onlyCurrentOrganization && !isAdmin 
    ? users.filter(u => u.organizacao_id === profile?.organizacao_id)
    : users;

  // O formulário de diálogo para um admin sempre terá todas as organizações.
  const organizationsForDialog = isAdmin ? organizations : organizations.filter(o => o.id === profile?.organizacao_id);

  return (
    <div className="space-y-4">
      <UserFormDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        organizations={organizationsForDialog}
        loading={loading}
        onSubmit={handleSubmit}
        onDialogClose={handleDialogClose}
        onDelete={handleDeleteUser}
        // Admin sempre pode selecionar a organização.
        hideOrganizationSelect={!isAdmin && onlyCurrentOrganization}
        openNewUserDialog={openNewUserDialog}
      />

      <UserTable
        users={usersForTable}
        currentUserId={profile?.id}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default UserManagement;
