import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConversationsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  extraFilter: string;
  setExtraFilter: (filter: string) => void;
}

const ConversationsFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  extraFilter,
  setExtraFilter
}: ConversationsFiltersProps) => {
  const statusOptions = [
    { value: "all", label: "Todos os Status", count: 0 },
    { value: "aguardando_ativacao", label: "Aguardando Ativação", count: 0 },
    { value: "em_acompanhamento", label: "Em Acompanhamento", count: 0 },
    { value: "humano_solicitado", label: "Humano Solicitado", count: 0 },
    { value: "finalizada", label: "Finalizada", count: 0 }
  ];

  const extraOptions = [
    { value: "all", label: "Todas" },
    { value: "priority", label: "Apenas prioritárias" },
    { value: "read", label: "Apenas lidas" },
    { value: "unread", label: "Apenas não lidas" },
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setExtraFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || extraFilter !== "all";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campo de Busca */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Paciente
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                id="search"
                placeholder="Digite o nome do paciente..." 
                className="pl-10 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro de Status */}
          <div className="lg:w-64">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Status da Conversa
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro Extra */}
          <div className="lg:w-64">
            <label htmlFor="extra-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Outros Filtros
            </label>
            <Select value={extraFilter} onValueChange={setExtraFilter}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione o filtro" />
              </SelectTrigger>
              <SelectContent>
                {extraOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botão de Limpar Filtros */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="h-11 px-4"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          )}
        </div>

        {/* Indicadores de Filtros Ativos */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Filtros ativos:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                <Search className="w-3 h-3" />
                "{searchTerm}"
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                <Filter className="w-3 h-3" />
                {statusOptions.find(opt => opt.value === statusFilter)?.label}
              </Badge>
            )}
            {extraFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                <Filter className="w-3 h-3" />
                {extraOptions.find(opt => opt.value === extraFilter)?.label}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsFilters;
