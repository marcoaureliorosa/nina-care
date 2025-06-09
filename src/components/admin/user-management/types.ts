import type { Database } from '@/integrations/supabase/types';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  role: 'admin' | 'doctor' | 'nurse' | 'secretary' | 'recepcionista';
  is_active: boolean;
  organizacao_id: string;
  avatar_url?: string;
  can_manage_organizations?: boolean;
  created_at: string;
  organizacoes?: {
    nome: string;
  };
}

export interface Organization {
  id: string;
  nome: string;
}

export interface UserFormData {
  nome: string;
  email: string;
  telefone: string;
  role: string;
  organizacao_id: string;
  is_active: boolean;
  avatar_url?: string;
  can_manage_organizations?: boolean;
}
