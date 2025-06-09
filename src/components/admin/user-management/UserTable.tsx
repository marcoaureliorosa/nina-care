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
  XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserProfile } from './types';

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
    case 'nurse':
      return <UserCheck className="w-4 h-4" />;
    case 'secretary':
    case 'recepcionista':
      return <ClipboardList className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
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

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'bg-red-100 text-red-800 hover:bg-red-200',
      doctor: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      nurse: 'bg-green-100 text-green-800 hover:bg-green-200',
      secretary: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      recepcionista: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
    };
    
    const roleLabels = {
      admin: 'Administrador',
      doctor: 'Médico',
      nurse: 'Enfermeiro',
      secretary: 'Secretário',
      recepcionista: 'Recepcionista'
    };

    const roleColor = roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    const roleLabel = roleLabels[role as keyof typeof roleLabels] || role;

    return (
      <Badge variant="outline" className={cn("flex items-center gap-1 px-2 py-1 rounded-full", roleColor)}>
        {getRoleIcon(role)}
        <span>{roleLabel}</span>
      </Badge>
    );
  };

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
              <Card 
                className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer hover:scale-[1.02]"
                onClick={() => {
                  console.log('Clicou no card do usuário:', user.nome);
                  onEdit(user);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <Avatar className="h-16 w-16 border-2 border-background">
                        <AvatarImage src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nome}`} alt={user.nome} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {getInitials(user.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground truncate">{user.nome}</h3>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground opacity-70">
                      Clique para editar
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {getRoleBadge(user.role)}
                      <Badge 
                        variant={user.is_active ? "default" : "secondary"}
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {user.is_active ? 
                          <CheckCircle2 className="w-3 h-3" /> : 
                          <XCircle className="w-3 h-3" />
                        }
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    {user.organizacoes?.nome && (
                      <div className="flex items-center text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                        <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{user.organizacoes.nome}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default UserTable;
