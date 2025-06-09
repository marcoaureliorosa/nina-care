import { useState } from "react";
import { Search, Filter, X, Star, CheckCircle, AlertCircle, Clock, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ConversationsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  extraFilter: string;
  setExtraFilter: (filter: string) => void;
}

const statusOptions = [
  { value: "all", label: "Todos", icon: <Filter className="w-4 h-4" />, color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  { value: "aguardando_ativacao", label: "Aguardando", icon: <Clock className="w-4 h-4 text-yellow-500" />, color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "em_acompanhamento", label: "Acompanhando", icon: <CheckCircle className="w-4 h-4 text-blue-500" />, color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "humano_solicitado", label: "Humano", icon: <AlertCircle className="w-4 h-4 text-red-500" />, color: "bg-red-100 text-red-800 border-red-200" },
  { value: "finalizada", label: "Finalizada", icon: <CheckCircle className="w-4 h-4 text-green-500" />, color: "bg-green-100 text-green-800 border-green-200" },
];

const extraOptions = [
  { value: "all", label: "Todas", icon: <Filter className="w-4 h-4" /> },
  { value: "priority", label: "Prioritárias", icon: <Star className="w-4 h-4 text-yellow-500" /> },
  { value: "read", label: "Lidas", icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
  { value: "unread", label: "Não lidas", icon: <AlertCircle className="w-4 h-4 text-red-500" /> },
];

const mainStatusOptions = [
  statusOptions[0], // Todos
  statusOptions[1], // Aguardando
  statusOptions[2], // Acompanhando
  statusOptions[4], // Finalizada
];

const extraStatusOptions = [
  statusOptions[3], // Humano
];

const allFilters = [
  ...statusOptions,
  ...extraOptions,
];

const ConversationsFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  extraFilter,
  setExtraFilter
}: ConversationsFiltersProps) => {
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setExtraFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || extraFilter !== "all";

  return (
    <div className="w-full flex items-center gap-3 bg-white/80 rounded-xl shadow p-4 md:p-6 mb-8">
      <div className="flex-1 min-w-[220px] w-full">
        <Input
          placeholder="Buscar por nome do paciente"
          className="pl-10 h-11 rounded-lg border border-zinc-200 bg-white/90 shadow-sm focus:ring-2 focus:ring-ninacare-primary placeholder:text-zinc-400 text-base transition-all w-full"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Filtros">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {statusOptions.map(option => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={statusFilter === option.value ? 'font-bold text-ninacare-primary' : ''}
            >
              <span className="flex items-center gap-2">{option.icon}{option.label}</span>
            </DropdownMenuItem>
          ))}
          <div className="border-t my-1" />
          {extraOptions.map(option => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setExtraFilter(option.value)}
              className={extraFilter === option.value ? 'font-bold text-pink-600' : ''}
            >
              <span className="flex items-center gap-2">{option.icon}{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {(statusFilter !== 'all' || extraFilter !== 'all' || searchTerm) && (
        <button
          className="ml-2 px-4 py-2 rounded-full text-sm font-medium border border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 transition"
          onClick={clearFilters}
          type="button"
        >
          Limpar
        </button>
      )}
    </div>
  );
};

export default ConversationsFilters;
