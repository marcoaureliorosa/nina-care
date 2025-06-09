import React from 'react';
import { Button } from '@/components/ui/button';
import { Input, InputMaskPhone } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { UserProfile, Organization, UserFormData } from './types';

interface UserFormDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingUser: UserProfile | null;
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  organizations: Organization[];
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onDialogClose: () => void;
  onDelete?: (id: string) => void;
  hideOrganizationSelect?: boolean;
}

const UserFormDialog = ({
  dialogOpen,
  setDialogOpen,
  editingUser,
  formData,
  setFormData,
  organizations,
  loading,
  onSubmit,
  onDialogClose,
  onDelete,
  hideOrganizationSelect
}: UserFormDialogProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do usuário abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <input type="hidden" name="is_active" value="true" />
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="usuario@email.com"
              required
              disabled={!!editingUser}
            />
          </div>

          {/* Campo de senha apenas para novo usuário */}
          {!editingUser && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Digite uma senha segura"
                required
                minLength={6}
              />
            </div>
          )}

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
            <Label htmlFor="role">Perfil</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserFormData['role'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="doctor">Médico</SelectItem>
                <SelectItem value="nurse">Enfermeiro</SelectItem>
                <SelectItem value="secretary">Secretário</SelectItem>
                <SelectItem value="recepcionista">Recepcionista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!hideOrganizationSelect && (
            <div className="space-y-2">
              <Label htmlFor="organizacao">Organização</Label>
              <Select
                value={formData.organizacao_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, organizacao_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a organização" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="avatar_url">URL do Avatar</Label>
            <Input
              id="avatar_url"
              value={formData.avatar_url || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
              placeholder="https://exemplo.com/avatar.jpg"
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Usuário Ativo</Label>
              <div className="text-[0.8rem] text-muted-foreground">
                Permite que o usuário acesse o sistema
              </div>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="can_manage_organizations">Gerenciar Organizações</Label>
              <div className="text-[0.8rem] text-muted-foreground">
                Permite criar e gerenciar organizações
              </div>
            </div>
            <Switch
              id="can_manage_organizations"
              checked={formData.can_manage_organizations || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, can_manage_organizations: checked }))}
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onDialogClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Salvando...' : (editingUser ? 'Atualizar' : 'Criar')}
              </Button>
            </div>

            {editingUser && onDelete && (
              <>
                <Separator />
                <div className="flex justify-center pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este usuário?')) {
                        onDelete(editingUser.id);
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Excluir usuário
                  </Button>
                </div>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
