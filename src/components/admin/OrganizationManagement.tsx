import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input, InputMaskPhone } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  created_at: string;
  procedures_performed?: string | null;
}

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    procedures_performed: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Erro ao carregar organizações",
        description: "Não foi possível carregar a lista de organizações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da organização é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingOrg) {
        const { error } = await supabase
          .from('organizacoes')
          .update(formData)
          .eq('id', editingOrg.id);

        if (error) throw error;
        
        toast({
          title: "Organização atualizada",
          description: "A organização foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('organizacoes')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Organização criada",
          description: "A organização foi criada com sucesso.",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchOrganizations();
    } catch (error) {
      console.error('Error saving organization:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a organização.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      nome: org.nome,
      cnpj: org.cnpj || '',
      email: org.email || '',
      telefone: org.telefone || '',
      endereco: org.endereco || '',
      procedures_performed: org.procedures_performed || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta organização?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('organizacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Organização excluída",
        description: "A organização foi excluída com sucesso.",
      });
      
      fetchOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a organização.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      procedures_performed: ''
    });
    setEditingOrg(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Organizações Cadastradas</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Organização
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingOrg ? 'Editar Organização' : 'Nova Organização'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da organização abaixo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Nome da organização" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contato@organizacao.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <InputMaskPhone
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value.replace(/\D/g, '') }))}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                  placeholder="Endereço completo"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedures_performed">Procedimentos Realizados</Label>
                <Input
                  id="procedures_performed"
                  name="procedures_performed"
                  type="number"
                  min="0"
                  value={formData.procedures_performed}
                  onChange={e => setFormData(prev => ({ ...prev, procedures_performed: e.target.value }))}
                  placeholder="Quantidade de procedimentos realizados"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Salvando...' : (editingOrg ? 'Atualizar' : 'Criar')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Procedimentos Realizados</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Nenhuma organização cadastrada</p>
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.nome}</TableCell>
                  <TableCell>{org.cnpj || '-'}</TableCell>
                  <TableCell>{org.email || '-'}</TableCell>
                  <TableCell>{org.telefone || '-'}</TableCell>
                  <TableCell>{org.procedures_performed || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(org)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(org.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrganizationManagement;
