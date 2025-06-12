import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Paciente } from '../types';

const fetchPacientesList = async (): Promise<Pick<Paciente, 'id' | 'nome'>[]> => {
  const { data, error } = await supabase
    .from('pacientes')
    .select('id, nome')
    .order('nome', { ascending: true });

  if (error) {
    console.error('Error fetching pacientes list:', error);
    throw new Error('Não foi possível buscar a lista de pacientes.');
  }

  return data || [];
};

export const usePacientesList = () => {
  return useQuery({
    queryKey: ['pacientesList'],
    queryFn: fetchPacientesList,
  });
}; 