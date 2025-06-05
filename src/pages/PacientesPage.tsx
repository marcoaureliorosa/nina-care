
import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PacientesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const patientData = {
      nome: formData.get('name') as string,
      cpf: formData.get('cpf') as string,
      email: formData.get('email') as string,
      telefone: formData.get('phone') as string,
      data_nascimento: formData.get('birthDate') as string || undefined,
    };

    createPatientMutation.mutate(patientData);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

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
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" placeholder="Digite o nome completo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" name="cpf" placeholder="000.000.000-00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" placeholder="email@exemplo.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" placeholder="(00) 00000-0000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
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
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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
    </div>
  );
};

export default PacientesPage;
