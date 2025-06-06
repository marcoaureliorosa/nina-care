
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building2, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: string;
  nome: string;
  cnpj?: string;
}

const OrganizationSwitcher = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizacoes')
        .select('id, nome, cnpj')
        .order('nome');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const switchOrganization = async (organizationId: string) => {
    setLoading(true);
    try {
      const { error } = await updateProfile({ organizacao_id: organizationId });
      
      if (!error) {
        toast({
          title: "Organização alterada",
          description: "Você foi transferido para a nova organização.",
        });
        
        // Recarregar a página para atualizar dados
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching organization:', error);
      toast({
        title: "Erro ao trocar organização",
        description: "Não foi possível alterar a organização.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentOrg = organizations.find(org => org.id === profile?.organizacao_id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2" disabled={loading}>
          <Building2 className="w-4 h-4" />
          <span className="max-w-40 truncate">
            {currentOrg?.nome || 'Selecionar Organização'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Trocar Organização</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrganization(org.id)}
            className={org.id === profile?.organizacao_id ? 'bg-accent' : ''}
          >
            <div className="flex flex-col">
              <span className="font-medium">{org.nome}</span>
              {org.cnpj && (
                <span className="text-xs text-muted-foreground">{org.cnpj}</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrganizationSwitcher;
