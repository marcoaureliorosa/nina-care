import React, { useState, useMemo } from 'react';
import FollowUpsTable from '../components/follow-ups/FollowUpsTable';
import FollowUpsHeader from '../components/follow-ups/FollowUpsHeader';
import { usePacientesList } from '../hooks/usePacientesList';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const FollowUpsPage = () => {
  const [selectedPaciente, setSelectedPaciente] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: pacientes, isLoading: isLoadingPacientes } = usePacientesList();

  // Filtrar pacientes baseado no termo de busca
  const filteredPacientes = useMemo(() => {
    if (!pacientes || !searchTerm.trim()) {
      return pacientes || [];
    }
    
    return pacientes.filter(paciente =>
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pacientes, searchTerm]);

  // Quando o usuário digita, automaticamente seleciona o primeiro paciente correspondente
  // ou limpa a seleção se não houver correspondência
  React.useEffect(() => {
    if (searchTerm.trim()) {
      if (filteredPacientes.length > 0) {
        const firstMatch = filteredPacientes[0];
        setSelectedPaciente(firstMatch.id);
      } else {
        setSelectedPaciente(undefined);
      }
    } else {
      setSelectedPaciente(undefined);
    }
  }, [searchTerm, filteredPacientes]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col bg-zinc-50">
      <div className="w-full flex flex-col max-w-7xl mx-auto">
        <div className="w-full pt-8 pb-4">
          <FollowUpsHeader />
        </div>
        
        <div className="w-full flex flex-wrap gap-3 items-center bg-white/80 rounded-xl shadow p-4 md:p-6 mb-6">
          <div className="flex-1 min-w-[220px]">
            <Label htmlFor="paciente-search" className="text-sm font-medium text-zinc-700 mb-2 block">
              Buscar Paciente
            </Label>
            <Input
              id="paciente-search"
              placeholder="Digite o nome do paciente"
              className="h-11 rounded-lg border border-zinc-200 bg-white/90 shadow-sm focus:ring-2 focus:ring-ninacare-primary placeholder:text-zinc-400 text-base transition-all w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && filteredPacientes.length > 0 && (
              <p className="text-xs text-zinc-500 mt-1">
                Mostrando acompanhamentos para: <span className="font-medium">{filteredPacientes[0].nome}</span>
              </p>
            )}
            {searchTerm && filteredPacientes.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Nenhum paciente encontrado com este nome
              </p>
            )}
            {!searchTerm && (
              <p className="text-xs text-zinc-500 mt-1">
                Digite para buscar um paciente específico ou deixe em branco para ver todos
              </p>
            )}
          </div>
        </div>
        
        <div className="w-full flex-1">
          <FollowUpsTable pacienteId={selectedPaciente} />
        </div>
      </div>
    </div>
  );
};

export default FollowUpsPage; 