"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Users, 
  Search, 
  UserCheck, 
  Shield, 
  Stethoscope, 
  ClipboardList, 
  Building2, 
  CheckCircle2, 
  XCircle,
  MoreHorizontal,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserProfile } from './types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface UserTableProps {
  users: UserProfile[];
  currentUserId?: string;
  onEdit: (user: UserProfile) => void;
}

// Helper function to generate avatar fallback from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// Helper function to get role icon
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin':
      return <Shield className="w-4 h-4" />;
    case 'doctor':
      return <Stethoscope className="w-4 h-4" />;
    case 'recepcionista':
      return <ClipboardList className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
};

const roleDisplayNames: Record<string, string> = {
  admin: 'Administrador',
  doctor: 'Médico',
  equipe: 'Equipe',
};

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800 hover:bg-red-200',
  doctor: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  equipe: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
};

const UserTable = ({ users, currentUserId, onEdit }: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>(users);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.organizacoes?.nome && user.organizacoes.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Usuários</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4"
            />
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm('')}
              >
                Limpar busca
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredUsers.map((user) => (
            <motion.div key={user.id} variants={itemVariants}>
              <div 
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onEdit(user)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar_url || ''} alt={user.nome} />
                      <AvatarFallback>{getInitials(user.nome)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{user.nome}</h4>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  {user.id !== currentUserId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEdit(user)}>Editar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`cursor-pointer transition-colors ${roleColors[user.role] || 'bg-gray-100'}`}
                      onClick={(e) => { e.stopPropagation(); onEdit(user); }}
                    >
                      {roleDisplayNames[user.role] || user.role}
                    </Badge>
                    <Badge 
                      variant={user.is_active ? "default" : "secondary"}
                      className={user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {user.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{user.organizacoes?.nome || 'Sem organização'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default UserTable;
