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
    handleDialogClose
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

  // Filtrar usuários e organizações se for só da organização atual
  const filteredUsers = onlyCurrentOrganization
    ? users.filter(u => u.organizacao_id === profile?.organizacao_id)
    : users;
  const filteredOrganizations = onlyCurrentOrganization
    ? organizations.filter(o => o.id === profile?.organizacao_id)
    : organizations;

  return (
    <div className="space-y-4">
      <UserFormDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        organizations={filteredOrganizations}
        loading={loading}
        onSubmit={handleSubmit}
        onDialogClose={handleDialogClose}
        onDelete={handleDeleteUser}
        hideOrganizationSelect={onlyCurrentOrganization}
      />

      <UserTable
        users={filteredUsers}
        currentUserId={profile?.id}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default UserManagement;
