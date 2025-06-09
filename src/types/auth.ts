import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  organizacao_id: string;
  nome: string;
  email: string;
  telefone?: string;
  role: 'admin' | 'doctor' | 'nurse' | 'secretary' | 'recepcionista';
  avatar_url?: string;
  is_active: boolean;
  organizacoes?: {
    nome: string;
    cnpj?: string;
    procedures_performed?: string | null;
  };
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
}
