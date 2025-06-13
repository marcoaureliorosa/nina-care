import type { Database } from '@/integrations/supabase/types';

export type UserRole = Database["public"]["Enums"]["user_role"];

// Definir estrutura de permissões
export interface PermissionConfig {
  canManageOrganizations: boolean;
  canAccessConfigurations: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canManagePatients: boolean;
  canManageProcedures: boolean;
  canManageConversations: boolean;
  canManageDoctors: boolean;
  roleDisplayName: string;
  roleDescription: string;
}

// Configuração de permissões por role
export const ROLE_PERMISSIONS: Record<string, PermissionConfig> = {
  admin: {
    canManageOrganizations: true,
    canAccessConfigurations: true,
    canManageUsers: true,
    canViewReports: true,
    canManagePatients: true,
    canManageProcedures: true,
    canManageConversations: true,
    canManageDoctors: true,
    roleDisplayName: 'Administrador',
    roleDescription: 'Acesso total + gestão de organizações'
  },
  doctor: {
    canManageOrganizations: false,
    canAccessConfigurations: true,
    canManageUsers: true,
    canViewReports: true,
    canManagePatients: true,
    canManageProcedures: true,
    canManageConversations: true,
    canManageDoctors: true,
    roleDisplayName: 'Médico',
    roleDescription: 'Acesso completo exceto criar/excluir organizações'
  },
  nurse: {
    canManageOrganizations: false,
    canAccessConfigurations: false,
    canManageUsers: false,
    canViewReports: false,
    canManagePatients: true,
    canManageProcedures: true,
    canManageConversations: true,
    canManageDoctors: false,
    roleDisplayName: 'Enfermeiro(a)',
    roleDescription: 'Equipe - sem acesso a configurações'
  },
  secretary: {
    canManageOrganizations: false,
    canAccessConfigurations: false,
    canManageUsers: false,
    canViewReports: false,
    canManagePatients: true,
    canManageProcedures: true,
    canManageConversations: true,
    canManageDoctors: false,
    roleDisplayName: 'Secretário(a)',
    roleDescription: 'Equipe - sem acesso a configurações'
  },
  recepcionista: {
    canManageOrganizations: false,
    canAccessConfigurations: false,
    canManageUsers: false,
    canViewReports: false,
    canManagePatients: true,
    canManageProcedures: true,
    canManageConversations: true,
    canManageDoctors: false,
    roleDisplayName: 'Recepcionista',
    roleDescription: 'Equipe - sem acesso a configurações'
  }
};

// Hook para verificar permissões
export const usePermissions = (userRole?: string) => {
  const permissions = userRole ? ROLE_PERMISSIONS[userRole] : null;
  
  return {
    permissions,
    canAccess: (permission: keyof PermissionConfig) => {
      if (!permissions) return false;
      return permissions[permission] as boolean;
    },
    isAdmin: () => userRole === 'admin',
    isDoctor: () => userRole === 'doctor',
    isTeamMember: () => userRole === 'nurse' || userRole === 'secretary' || userRole === 'recepcionista',
    getRoleInfo: () => permissions ? {
      name: permissions.roleDisplayName,
      description: permissions.roleDescription
    } : null
  };
};

// Lista de roles organizados para formulários - APENAS 3 PERFIS PRINCIPAIS
export const ROLE_OPTIONS = [
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Acesso total + gestão de organizações',
    canManageOrg: true
  },
  {
    value: 'doctor',
    label: 'Médico', 
    description: 'Acesso completo exceto criar/excluir organizações',
    canManageOrg: false
  },
  {
    value: 'recepcionista',
    label: 'Equipe',
    description: 'Acesso básico - sem configurações',
    canManageOrg: false
  }
] as const; 