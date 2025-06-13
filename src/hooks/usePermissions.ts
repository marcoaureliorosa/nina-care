
import { useAuth } from '@/contexts/AuthContext';

export const usePermissions = () => {
  const { profile } = useAuth();

  const isAdmin = () => profile?.role === 'admin';
  const isDoctor = () => profile?.role === 'doctor';
  const isNurse = () => profile?.role === 'nurse';
  const isSecretary = () => profile?.role === 'secretary';
  const isReceptionist = () => profile?.role === 'recepcionista';

  // Regras de permissão baseadas nos roles definidos:
  // - Admin: pode fazer tudo, incluindo gerenciar organizações
  // - Médico: pode fazer tudo exceto criar/excluir organizações
  // - Equipe: pode fazer tudo exceto acessar configurações
  
  const canManageUsers = () => isAdmin() || isDoctor();
  const canManageOrganization = () => isAdmin(); // Apenas admins podem criar/excluir organizações
  const canAccessConfigurations = () => isAdmin() || isDoctor(); // Equipe não pode acessar configurações
  const canDeletePatients = () => isAdmin() || isDoctor() || isNurse();
  const canManageDoctors = () => isAdmin() || isDoctor();
  const canManageProcedures = () => isAdmin() || isDoctor() || isNurse();
  const canViewReports = () => isAdmin() || isDoctor();

  const hasRole = (role: string) => profile?.role === role;
  const hasAnyRole = (roles: string[]) => profile?.role ? roles.includes(profile.role) : false;

  return {
    isAdmin,
    isDoctor,
    isNurse,
    isSecretary,
    isReceptionist,
    canManageUsers,
    canManageOrganization,
    canAccessConfigurations,
    canDeletePatients,
    canManageDoctors,
    canManageProcedures,
    canViewReports,
    hasRole,
    hasAnyRole,
    userRole: profile?.role,
    organizationId: profile?.organizacao_id
  };
};
