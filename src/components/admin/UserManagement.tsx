
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserFormDialog from './user-management/UserFormDialog';
import UserTable from './user-management/UserTable';
import { useUsers } from './user-management/hooks/useUsers';
import { useUserForm } from './user-management/hooks/useUserForm';

const UserManagement = () => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Usuários Cadastrados</h3>
        <UserFormDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          editingUser={editingUser}
          formData={formData}
          setFormData={setFormData}
          organizations={organizations}
          loading={loading}
          onSubmit={handleSubmit}
          onDialogClose={handleDialogClose}
        />
      </div>

      <UserTable
        users={users}
        currentUserId={profile?.id}
        onEdit={handleEdit}
        onDelete={deleteUser}
      />
    </div>
  );
};

export default UserManagement;
