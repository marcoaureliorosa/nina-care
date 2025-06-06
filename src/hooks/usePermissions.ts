
import { useAuth } from '@/contexts/AuthContext';

export const usePermissions = () => {
  const { profile } = useAuth();

  const isAdmin = () => profile?.role === 'admin';
  const isDoctor = () => profile?.role === 'doctor';
  const isNurse = () => profile?.role === 'nurse';
  const isSecretary = () => profile?.role === 'secretary';
  const isReceptionist = () => profile?.role === 'recepcionista';

  const canManageUsers = () => isAdmin();
  const canManageOrganization = () => isAdmin();
  const canDeletePatients = () => isAdmin() || isDoctor() || isNurse();
  const canManageDoctors = () => isAdmin();
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
