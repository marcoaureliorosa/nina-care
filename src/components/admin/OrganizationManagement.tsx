import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  Search,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Organization {
  id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  created_at: string;
  telefone_emergencia?: string | null;
}

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    telefone_emergencia: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOrgs(organizations);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      setFilteredOrgs(
        organizations.filter(
          org => 
            org.nome.toLowerCase().includes(lowercaseQuery) ||
            (org.email && org.email.toLowerCase().includes(lowercaseQuery)) ||
            (org.cnpj && org.cnpj.includes(lowercaseQuery))
        )
      );
    }
  }, [searchQuery, organizations]);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
      setFilteredOrgs(data || []);
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
      telefone_emergencia: org.telefone_emergencia || ''
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
      telefone_emergencia: ''
    });
    setEditingOrg(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  // Format phone number for display
  const formatPhone = (phone: string | undefined) => {
    if (!phone) return '-';
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Organizações</h3>
          <p className="text-muted-foreground">
            Gerencie as organizações cadastradas no sistema
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar organizações..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto">
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
                  {editingOrg
                    ? 'Atualize os dados da organização.'
                    : 'Preencha os dados da nova organização.'}
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
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone_emergencia" className="text-right flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Emergência
                  </Label>
                  <Input
                    id="telefone_emergencia"
                    value={formData.telefone_emergencia}
                    onChange={e => setFormData({ ...formData, telefone_emergencia: e.target.value })}
                    className="col-span-3"
                    placeholder="Telefone para contato da IA"
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

                <div className="space-y-4 pt-4">
                  <div className="flex gap-2">
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

                  {editingOrg && (
                    <>
                      <Separator />
                      <div className="flex justify-center pt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir esta organização?')) {
                              handleDelete(editingOrg.id);
                              handleDialogClose();
                            }
                          }}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Excluir organização
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      {loading && organizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted"></div>
            <div className="h-4 w-48 rounded bg-muted"></div>
            <div className="h-3 w-36 rounded bg-muted"></div>
          </div>
        </div>
      ) : filteredOrgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
          {searchQuery ? (
            <>
              <h3 className="text-lg font-medium">Nenhuma organização encontrada</h3>
              <p className="text-muted-foreground mt-1">
                Não encontramos organizações com "{searchQuery}"
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium">Nenhuma organização cadastrada</h3>
              <p className="text-muted-foreground mt-1">
                Clique em "Nova Organização" para adicionar
              </p>
            </>
          )}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrgs.map((org) => (
              <Card 
                key={org.id} 
                className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer hover:scale-[1.02] group"
                onClick={() => {
                  console.log('Clicou no card da organização:', org.nome);
                  handleEdit(org);
                }}
              >
                <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl truncate">{org.nome}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {org.cnpj || 'CNPJ não informado'}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground opacity-70">
                    Clique para editar
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm truncate flex-1">{org.email || 'Email não informado'}</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm truncate">{formatPhone(org.telefone)}</span>
                  </div>
                  
                  {org.endereco && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm line-clamp-2">{org.endereco}</span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-6 pt-0 flex justify-between items-center">
                  <Badge 
                    variant="outline" 
                    className="text-xs font-normal px-3 py-1"
                  >
                    {new Date(org.created_at).toLocaleDateString('pt-BR')}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default OrganizationManagement;
