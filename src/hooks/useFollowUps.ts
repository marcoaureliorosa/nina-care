import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { FollowUp } from '../types';

export interface FollowUpWithPaciente extends FollowUp {
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
    query = query.eq('paciente_id', pacienteId);
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