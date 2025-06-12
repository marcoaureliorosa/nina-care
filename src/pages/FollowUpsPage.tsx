import React, { useState } from 'react';
import FollowUpsTable from '../components/follow-ups/FollowUpsTable';
import { usePacientesList } from '../hooks/usePacientesList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import FollowUpsHeader from '../components/follow-ups/FollowUpsHeader';

const FollowUpsPage = () => {
  const [selectedPaciente, setSelectedPaciente] = useState<string | undefined>(undefined);
  const { data: pacientes, isLoading: isLoadingPacientes } = usePacientesList();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center bg-zinc-50">
      <div className="w-full flex flex-col items-center max-w-7xl mx-auto">
        <div className="w-full pt-8 pb-4">
          <FollowUpsHeader />
        </div>
        <div className="w-full flex flex-wrap gap-3 items-center bg-white/80 rounded-xl shadow p-4 md:p-6 mb-6">
          <div className="flex-1 min-w-[220px]">
            <Label htmlFor="paciente-filter">Filtrar por Paciente</Label>
            <Select
              onValueChange={(value) => setSelectedPaciente(value === 'all' ? undefined : value)}
              defaultValue="all"
            >
              <SelectTrigger id="paciente-filter" className="h-11 rounded-lg border border-zinc-200 bg-white/90 shadow-sm focus:ring-2 focus:ring-ninacare-primary text-base transition-all w-full">
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Pacientes</SelectItem>
                {!isLoadingPacientes && pacientes && pacientes.map((paciente) => (
                  <SelectItem key={paciente.id} value={paciente.id}>
                    {paciente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full">
          <FollowUpsTable pacienteId={selectedPaciente} />
        </div>
      </div>
    </div>
  );
};

export default FollowUpsPage; 