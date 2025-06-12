import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface ConsultationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenPatientDialog: () => void;
  editingProcedure?: any;
}

const PatientAutocomplete = ({ onSelect, initialPatient }: { onSelect: (patient: any) => void, initialPatient?: any }) => {
  const [search, setSearch] = useState(initialPatient?.nome || "");
  const [selected, setSelected] = useState<any>(initialPatient || null);

  useEffect(() => {
    if(initialPatient) {
      setSearch(initialPatient.nome);
      setSelected(initialPatient);
    }
  }, [initialPatient]);

  const { data: patients, isLoading } = useQuery({
    queryKey: ["autocomplete-patients", search],
    queryFn: async () => {
      if (search.length < 3) return [];
      let query = supabase
        .from("pacientes")
        .select("id, nome, cpf, email")
        .order("nome", { ascending: true });
      if (search) {
        query = query.or(`nome.ilike.%${search}%,cpf.ilike.%${search}%,email.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) return [];
      return data;
    },
    enabled: search.length >= 3,
  });

  return (
    <div className="relative">
      <Input
        value={selected ? selected.nome : search}
        onChange={e => {
          setSearch(e.target.value);
          setSelected(null);
          onSelect(null);
        }}
        placeholder="Digite ao menos 3 letras para buscar"
        required
        autoComplete="off"
        className="w-full"
      />
      {search.length >= 3 && !selected && (
        <div className="absolute z-10 bg-white border w-full rounded shadow max-h-48 overflow-auto">
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Buscando...</div>
          ) : patients && patients.length > 0 ? (
            patients.map((p: any) => (
              <div
                key={p.id}
                className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                onClick={() => {
                  setSelected(p);
                  onSelect(p);
                  setSearch(p.nome);
                }}
              >
                {p.nome} <span className="text-xs text-gray-400">{p.cpf}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">Nenhum paciente encontrado</div>
          )}
        </div>
      )}
    </div>
  );
};

const ConsultationDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit,
  onOpenPatientDialog,
  editingProcedure: initialData
}: ConsultationDialogProps) => {
  const [selectedPatient, setSelectedPatient] = useState<any>(initialData ? { id: initialData.paciente_id, nome: initialData.patient } : null);
  
  const handlePatientSelection = (patient: any) => {
    setSelectedPatient(patient);
  };
  
  const { data: medicos, isLoading: isLoadingMedicos } = useQuery({
    queryKey: ["medicos-dropdown"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medicos")
        .select("id, nome, especialidade");
      if (error) return [];
      return data;
    },
  });

  useEffect(() => {
    if (initialData) {
      setSelectedPatient({ id: initialData.paciente_id, nome: initialData.patient });
    } else {
      setSelectedPatient(null);
    }
  }, [initialData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Procedimento" : "Agendar Consulta/Procedimento"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            if (!selectedPatient) {
              e.preventDefault();
              alert("Selecione um paciente antes de agendar.");
              return;
            }
            const hidden = document.createElement("input");
            hidden.type = "hidden";
            hidden.name = "paciente_id";
            hidden.value = selectedPatient.id;
            e.currentTarget.appendChild(hidden);
            onSubmit(e);
            e.currentTarget.removeChild(hidden);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <PatientAutocomplete onSelect={handlePatientSelection} initialPatient={selectedPatient} />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={onOpenPatientDialog}
                title="Cadastrar novo paciente"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
            {selectedPatient && (
              <div className="text-xs text-gray-500 mt-1">Paciente selecionado: <span className="font-semibold">{selectedPatient.nome}</span></div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor">Dr./Dra.</Label>
            <Select name="medico_id" required defaultValue={initialData?.medico_id}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingMedicos ? "Carregando médicos..." : "Selecionar médico"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingMedicos ? (
                  <div className="p-2 text-sm text-gray-500">Carregando...</div>
                ) : medicos && medicos.length > 0 ? (
                  medicos.map((medico: any) => (
                    <SelectItem key={medico.id} value={medico.id}>
                      {medico.nome}
                      {medico.especialidade ? ` (${medico.especialidade})` : ""}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500">Nenhum médico encontrado</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <input type="hidden" name="status" value="agendado" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" name="date" required defaultValue={initialData ? initialData.date : undefined} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input id="time" name="time" type="time" required defaultValue={initialData ? initialData.time : undefined} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Input id="notes" name="notes" placeholder="Observações adicionais" defaultValue={initialData ? initialData.observacoes : undefined} />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-ninacare-primary hover:bg-ninacare-primary/90">
              {initialData ? "Salvar" : "Agendar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDialog;
