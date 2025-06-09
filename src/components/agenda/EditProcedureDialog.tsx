import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EditProcedureDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  procedure: any;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (id: number) => void;
}

const EditProcedureDialog = ({ isOpen, onOpenChange, procedure, onSubmit, onDelete }: EditProcedureDialogProps) => {
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

  if (!procedure) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Procedimento</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Input value={procedure.patient} readOnly className="bg-gray-100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor">Dr./Dra.</Label>
            <Select name="medico_id" required defaultValue={procedure.medico_id}>
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
            <input type="hidden" name="paciente_id" value={procedure.paciente_id} />
            <input type="hidden" name="status" value={procedure.status} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" name="date" required defaultValue={procedure.date} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input id="time" name="time" type="time" required defaultValue={procedure.time} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Input id="notes" name="notes" placeholder="Observações adicionais" defaultValue={procedure.observacoes} />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-ninacare-primary hover:bg-ninacare-primary/90">
              Salvar
            </Button>
            <Button type="button" variant="destructive" onClick={() => onDelete(procedure.id)}>
              Excluir
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

export default EditProcedureDialog; 