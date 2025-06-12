import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, InputMaskPhone } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import PatientsHeader from "@/components/patients/PatientsHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PatientDialog from "@/components/patients/PatientDialog";
import { Switch } from "@/components/ui/switch";

interface Medico {
  id: string;
  nome: string;
}

const PacientesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const { profile } = useAuth();

  // Buscar médicos
  const { data: medicos, isLoading: isLoadingMedicos } = useQuery<Medico[]>({
    queryKey: ['medicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medicos')
        .select('id, nome')
        .eq('organizacao_id', profile?.organizacao_id);

      if (error) {
        console.error('Error fetching medicos:', error);
        toast.error('Erro ao carregar médicos');
        return [];
      }
      return data || [];
    },
    enabled: !!profile?.organizacao_id,
  });

  // Buscar pacientes do Supabase
  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: async () => {
      console.log('Fetching patients...')
      
      let query = supabase
        .from('pacientes')
        .select(`
          *,
          procedimentos (id)
        `)
        .order('created_at', { ascending: false })

      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching patients:', error)
        toast.error('Erro ao carregar pacientes')
        return []
      }

      console.log('Patients data:', data)
      return data
    }
  });

  // Mutation para deletar paciente
  const deletePatientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting patient:', error);
        throw error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente excluído com sucesso!');
      setDeletingPatientId(null);
    },
    onError: (error: any) => {
      console.error('Error deleting patient:', error);
      toast.error('Erro ao excluir paciente');
      setDeletingPatientId(null);
    }
  });

  // Mutation para editar paciente
  const updatePatientMutation = useMutation({
    mutationFn: async (patientData: any) => {
      const { id, ...updateData } = patientData;
      const { data, error } = await supabase
        .from('pacientes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Error updating patient:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setEditingPatient(null);
      toast.success('Paciente atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error updating patient:', error);
      toast.error('Erro ao atualizar paciente');
    }
  });

  // Mutation para ativar/desativar a Nina
  const toggleNinaStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: boolean }) => {
      const { error } = await supabase
        .from('pacientes')
        .update({ nina_status: newStatus })
        .eq('id', id);
      if (error) {
        console.error('Error updating Nina status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Status da Nina atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar o status da Nina.');
    }
  });

  const handleToggleNinaStatus = (patientId: string, currentStatus: boolean) => {
    toggleNinaStatusMutation.mutate({ id: patientId, newStatus: !currentStatus });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleDeletePatient = (id: string) => {
    setDeletingPatientId(id);
  };

  const confirmDeletePatient = () => {
    if (deletingPatientId) {
      deletePatientMutation.mutate(deletingPatientId);
    }
  };

  const cancelDeletePatient = () => {
    setDeletingPatientId(null);
  };

  const handleEditPatient = (patient: any) => {
    setEditingPatient(patient);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (!editingPatient) return;
    if (!profile?.organizacao_id) {
      toast.error('Não foi possível identificar a organização do usuário.');
      return;
    }
    const patientData = {
      id: editingPatient.id,
      nome: formData.get('name') as string,
      cpf: formData.get('cpf') as string,
      email: formData.get('email') as string,
      telefone: (formData.get('phone') as string)?.replace(/\\D/g, ''),
      data_nascimento: formData.get('birthDate') as string || null,
      nina_status: true,
      organizacao_id: editingPatient.organizacao_id || profile.organizacao_id,
    };
    updatePatientMutation.mutate(patientData);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center bg-zinc-50">
      {/* Banner premium no topo */}
      <div className="w-full flex flex-col items-center max-w-7xl mx-auto">
        <div className="w-full pt-8 pb-4">
          <PatientsHeader />
        </div>
        {/* Filtros e busca premium horizontal */}
        <div className="w-full flex flex-wrap gap-3 items-center bg-white/80 rounded-xl shadow p-4 md:p-6 mb-6">
          <div className="flex-1 min-w-[220px]">
            <Input
              placeholder="Buscar por nome, CPF ou email"
              className="pl-10 h-11 rounded-lg border border-zinc-200 bg-white/90 shadow-sm focus:ring-2 focus:ring-ninacare-primary placeholder:text-zinc-400 text-base transition-all w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filtros de status, etc, podem ser adicionados aqui como chips/badges */}
          {/* Botão de adicionar paciente */}
          <Button className="ml-auto px-4 py-2 rounded-full text-sm font-medium bg-ninacare-primary text-white hover:bg-ninacare-primary/90 transition" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Novo Paciente
          </Button>
        </div>
        {/* Grid de cards de pacientes */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center text-zinc-500">Carregando...</div>
          ) : (patients && patients.length > 0 ? (
            patients.map((patient: any) => (
              <Card key={patient.id} className="rounded-2xl border bg-white/90 shadow-md hover:shadow-lg transition-all flex flex-col p-6">
                <div className="flex items-center gap-4 mb-3">
                  <Avatar className="h-12 w-12 shadow border-2 border-white bg-ninacare-primary/10">
                    <AvatarFallback className="bg-ninacare-primary text-white text-lg font-bold">{patient.nome?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-lg text-zinc-900 truncate block">{patient.nome}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Switch
                        id={`nina-status-${patient.id}`}
                        checked={patient.nina_status}
                        onCheckedChange={() => handleToggleNinaStatus(patient.id, patient.nina_status)}
                        aria-label="Ativar ou desativar Nina"
                      />
                      <Label htmlFor={`nina-status-${patient.id}`} className={patient.nina_status ? 'text-emerald-800' : 'text-zinc-600'}>
                        {patient.nina_status ? 'Ativo' : 'Inativo'}
                      </Label>
                    </div>
                  </div>
                  {/* Ações rápidas */}
                  <div className="flex flex-col gap-2 items-end">
                    <Button size="icon" variant="ghost" onClick={() => handleEditPatient(patient)} aria-label="Editar paciente"><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeletePatient(patient.id)} aria-label="Excluir paciente"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                  <span className="font-medium">Telefone:</span>
                  <span className="truncate">{patient.telefone || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                  <span className="font-medium">E-mail:</span>
                  <span className="truncate">{patient.email || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                  <span className="font-medium">CPF:</span>
                  <span className="truncate">{patient.cpf || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-xs mt-2">
                  <span>Cadastro:</span>
                  <span>{formatDate(patient.created_at)}</span>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-zinc-400 py-12">Nenhum paciente encontrado</div>
          ))}
        </div>
      </div>
      {/* Diálogos de cadastro/edição/exclusão permanecem */}
      {deletingPatientId && (
        <Dialog open={!!deletingPatientId} onOpenChange={cancelDeletePatient}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <div>Tem certeza que deseja excluir este paciente? Esta ação não poderá ser desfeita.</div>
            <div className="flex gap-2 pt-4">
              <Button 
                className="bg-destructive hover:bg-destructive/90 flex-1" 
                onClick={confirmDeletePatient}
                disabled={deletePatientMutation.isPending}
              >
                {deletePatientMutation.isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
              <Button variant="outline" onClick={cancelDeletePatient} disabled={deletePatientMutation.isPending}>
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Edição de Paciente */}
      {editingPatient && (
        <Dialog open={!!editingPatient} onOpenChange={() => setEditingPatient(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Paciente</DialogTitle>
            </DialogHeader>
            {editingPatient && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome Completo <span className="text-red-500">*</span></Label>
                  <Input id="edit-name" name="name" defaultValue={editingPatient.nome} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cpf">CPF <span className="text-gray-400">(opcional)</span></Label>
                  <Input id="edit-cpf" name="cpf" defaultValue={editingPatient.cpf} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">E-mail <span className="text-gray-400">(opcional)</span></Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={editingPatient.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone <span className="text-red-500">*</span></Label>
                  <InputMaskPhone id="edit-phone" name="phone" defaultValue={editingPatient.telefone} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-birthDate">Data de Nascimento <span className="text-gray-400">(opcional)</span></Label>
                  <Input id="edit-birthDate" name="birthDate" type="date" defaultValue={editingPatient.data_nascimento ? editingPatient.data_nascimento.slice(0,10) : ''} />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-ninacare-primary hover:bg-ninacare-primary/90"
                    disabled={updatePatientMutation.isPending}
                  >
                    {updatePatientMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingPatient(null)} disabled={updatePatientMutation.isPending}>
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}

      <PatientDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default PacientesPage;
