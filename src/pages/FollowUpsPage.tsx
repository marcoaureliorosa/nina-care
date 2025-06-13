import React, { useState } from 'react';
import FollowUpsTable from '../components/follow-ups/FollowUpsTable';
import { usePacientesList } from '../hooks/usePacientesList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';

const FollowUpsPage = () => {
  const [selectedPaciente, setSelectedPaciente] = useState<string | undefined>(undefined);
  const { data: pacientes, isLoading: isLoadingPacientes } = usePacientesList();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Acompanhamentos Agendados</h1>
          <p className="text-gray-600">
            Filtre por paciente ou veja todos os envios programados.
          </p>
        </div>
        <div className="w-64">
          <Label htmlFor="paciente-filter">Filtrar por Paciente</Label>
          <Select
            onValueChange={(value) => setSelectedPaciente(value === 'all' ? undefined : value)}
            defaultValue="all"
          >
            <SelectTrigger id="paciente-filter">
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
      <FollowUpsTable pacienteId={selectedPaciente} />
    </div>
  );
};

export default FollowUpsPage; 