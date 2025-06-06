
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users } from 'lucide-react';
import { UserProfile } from './types';

interface UserTableProps {
  users: UserProfile[];
  currentUserId?: string;
  onEdit: (user: UserProfile) => void;
  onDelete: (id: string) => void;
}

const UserTable = ({ users, currentUserId, onEdit, onDelete }: UserTableProps) => {
  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'bg-red-100 text-red-800',
      doctor: 'bg-blue-100 text-blue-800',
      nurse: 'bg-green-100 text-green-800',
      secretary: 'bg-yellow-100 text-yellow-800',
      recepcionista: 'bg-purple-100 text-purple-800'
    };
    
    const roleLabels = {
      admin: 'Administrador',
      doctor: 'Médico',
      nurse: 'Enfermeiro',
      secretary: 'Secretário',
      recepcionista: 'Recepcionista'
    };

    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
        {roleLabels[role as keyof typeof roleLabels] || role}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Organização</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Nenhum usuário cadastrado</p>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{user.organizacoes?.nome || '-'}</TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? 'default' : 'secondary'}>
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      disabled={user.id === currentUserId}
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
  );
};

export default UserTable;
