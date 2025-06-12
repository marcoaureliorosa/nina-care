
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export interface FollowUpWithPaciente {
  id: number;
  created_at: string | null;
  dt_envio: string | null;
  status: string;
  tag: string;
  user_number: string | null;
  userid: string;
  pacientes: {
    nome: string;
  } | null;
}

const fetchFollowUps = async (pacienteId?: string): Promise<FollowUpWithPaciente[]> => {
  let query = supabase
    .from('follow_up')
    .select(`
      *,
      pacientes (
        nome
      )
    `)
    .eq('status', 'pendente');

  if (pacienteId) {
    query = query.eq('userid', pacienteId);
  }
  
  const { data, error } = await query.order('dt_envio', { ascending: true });

  if (error) {
    console.error('Error fetching follow-ups:', error);
    return [];
  }

  return data || [];
};

export const useFollowUps = (pacienteId?: string) => {
  return useQuery<FollowUpWithPaciente[], Error>({
    queryKey: ['followUps', pacienteId],
    queryFn: () => fetchFollowUps(pacienteId),
  });
};
