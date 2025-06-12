import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, InputMaskPhone } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Medico {
  id: string;
  nome: string;
}

interface PatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated?: (patient: any) => void;
}

interface CreatePatientWithProcedureResponse {
  patient: any;
  procedure: any;
}

const PatientDialog: React.FC<PatientDialogProps> = ({ isOpen, onClose, onPatientCreated }) => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const { data: medicos, isLoading: isLoadingMedicos } = useQuery<Medico[]>({
    queryKey: ['medicos', profile?.organizacao_id],
    queryFn: async () => {
      if (!profile?.organizacao_id) return [];
      const { data, error } = await supabase
        .from('medicos')
        .select('id, nome')
        .eq('organizacao_id', profile.organizacao_id);

      if (error) {
        console.error('Error fetching medicos:', error);
        toast.error('Erro ao carregar médicos');
        return [];
      }
      return data || [];
    },
    enabled: !!profile?.organizacao_id,
  });

  const createPatientMutation = useMutation({
    mutationFn: async (vars: {
      patientData: {
        nome: string;
        cpf: string;
        email: string;
        telefone: string;
        data_nascimento?: string;
        organizacao_id: string;
      },
      procedureData: {
        medico_id: string;
        data_procedimento: string;
        observacoes: string;
      }
    }) => {
      const { patientData, procedureData } = vars;
      const { data, error } = await supabase.rpc('create_patient_with_procedure', {
        patient_nome: patientData.nome,
        patient_cpf: patientData.cpf,
        patient_email: patientData.email,
        patient_telefone: patientData.telefone,
        patient_data_nascimento: patientData.data_nascimento,
        patient_organizacao_id: patientData.organizacao_id,
        proc_medico_id: procedureData.medico_id,
        proc_data_procedimento: procedureData.data_procedimento,
        proc_observacoes: procedureData.observacoes,
      });

      if (error) {
        console.error('Error creating patient with procedure:', error)
        throw error
      }

      return data as unknown as CreatePatientWithProcedureResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['procedimentos'] });
      onClose();
      toast.success('Paciente e procedimento cadastrados com sucesso!');
      if (onPatientCreated && data?.patient) {
        onPatientCreated(data.patient);
      }
    },
    onError: (error: any) => {
      console.error('Error creating patient with procedure:', error)
      toast.error('Erro ao cadastrar paciente e procedimento')
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    if (!profile?.organizacao_id) {
      toast.error('Não foi possível identificar a organização do usuário.');
      return;
    }

    const patientData = {
      nome: formData.get('name') as string,
      cpf: formData.get('cpf') as string,
      email: formData.get('email') as string,
      telefone: (formData.get('phone') as string)?.replace(/\\D/g, ''),
      data_nascimento: formData.get('birthDate') as string || undefined,
      organizacao_id: profile.organizacao_id,
    };

    const procedureData = {
      medico_id: formData.get('medico_id') as string,
      data_procedimento: formData.get('data_procedimento') as string,
      observacoes: formData.get('observacoes') as string,
    };

    if (!procedureData.medico_id || !procedureData.data_procedimento) {
      toast.error('Por favor, preencha os dados do procedimento.');
      return;
    }
    
    createPatientMutation.mutate({ patientData, procedureData });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Cadastro de Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 flex-1 min-h-0">
          <div className="overflow-y-auto pr-4 space-y-4 flex-1">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo <span className="text-red-500">*</span></Label>
              <Input id="name" name="name" placeholder="Digite o nome completo" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF <span className="text-gray-400">(opcional)</span></Label>
              <Input id="cpf" name="cpf" placeholder="000.000.000-00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail <span className="text-gray-400">(opcional)</span></Label>
              <Input id="email" name="email" type="email" placeholder="email@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone <span className="text-red-500">*</span></Label>
              <InputMaskPhone id="phone" name="phone" placeholder="(00) 00000-0000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento <span className="text-gray-400">(opcional)</span></Label>
              <Input id="birthDate" name="birthDate" type="date" />
            </div>
            <Card className="pt-4">
              <CardHeader>
                <CardTitle>Dados do Procedimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medico_id">Médico Responsável <span className="text-red-500">*</span></Label>
                  <Select name="medico_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingMedicos ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : (
                        medicos?.map((medico) => (
                          <SelectItem key={medico.id} value={medico.id}>{medico.nome}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_procedimento">Data do Procedimento <span className="text-red-500">*</span></Label>
                  <Input id="data_procedimento" name="data_procedimento" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea id="observacoes" name="observacoes" placeholder="Observações sobre o procedimento..." />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-ninacare-primary hover:bg-ninacare-primary/90"
              disabled={createPatientMutation.isPending}
            >
              {createPatientMutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDialog;
