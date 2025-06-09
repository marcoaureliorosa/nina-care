import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, InputMaskPhone } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const PacientesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const { profile } = useAuth();

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

  // Mutation para criar paciente
  const createPatientMutation = useMutation({
    mutationFn: async (patientData: {
      nome: string;
      cpf: string;
      email: string;
      telefone: string;
      data_nascimento?: string;
      nina_status: boolean;
      organizacao_id: string;
    }) => {
      const { data, error } = await supabase
        .from('pacientes')
        .insert([patientData])
        .select()
        .single()

      if (error) {
        console.error('Error creating patient:', error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setIsDialogOpen(false)
      toast.success('Paciente cadastrado com sucesso!')
    },
    onError: (error: any) => {
      console.error('Error creating patient:', error)
      toast.error('Erro ao cadastrar paciente')
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
      telefone: (formData.get('phone') as string)?.replace(/\D/g, ''),
      data_nascimento: formData.get('birthDate') as string || undefined,
      nina_status: true,
      organizacao_id: profile.organizacao_id,
    };

    console.log('Profile no cadastro:', profile);
    console.log('Dados enviados para cadastro de paciente:', patientData);

    createPatientMutation.mutate(patientData);
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
      telefone: (formData.get('phone') as string)?.replace(/\D/g, ''),
      data_nascimento: formData.get('birthDate') as string || null,
      nina_status: true,
      organizacao_id: editingPatient.organizacao_id || profile.organizacao_id,
    };
    console.log('Profile na edição:', profile);
    console.log('Dados enviados para edição de paciente:', patientData);
    updatePatientMutation.mutate(patientData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ninacare-primary hover:bg-ninacare-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastro de Paciente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <InputMaskPhone id="phone" name="phone" placeholder="(00) 00000-0000" required pattern="\\d{11}" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento <span className="text-gray-400">(opcional)</span></Label>
                <Input id="birthDate" name="birthDate" type="date" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-ninacare-primary hover:bg-ninacare-primary/90"
                  disabled={createPatientMutation.isPending}
                >
                  {createPatientMutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Buscar pacientes..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando pacientes...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Data Nascimento</TableHead>
                  <TableHead>Procedimentos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients && patients.length > 0 ? (
                  patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.nome}</TableCell>
                      <TableCell>{patient.cpf}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.telefone}</TableCell>
                      <TableCell>
                        {patient.data_nascimento ? formatDate(patient.data_nascimento) : '-'}
                      </TableCell>
                      <TableCell>{patient.procedimentos?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditPatient(patient)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeletePatient(patient.id)}
                            disabled={deletePatientMutation.isPending && deletingPatientId === patient.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-gray-500">
                        {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
                <InputMaskPhone id="edit-phone" name="phone" defaultValue={editingPatient.telefone} required pattern="\\d{11}" />
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
    </div>
  );
};

export default PacientesPage;
