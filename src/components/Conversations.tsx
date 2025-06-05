
import { useState } from "react";
import { Search, MessageCircle, AlertCircle, CheckCircle, Clock, Filter, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Conversations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Buscar conversas do Supabase
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', searchTerm, statusFilter],
    queryFn: async () => {
      console.log('Fetching conversations...')
      
      let query = supabase
        .from('conversas')
        .select(`
          *,
          pacientes (
            nome,
            telefone
          )
        `)
        .order('updated_at', { ascending: false })

      if (searchTerm) {
        // Buscar por nome do paciente através do JOIN
        query = query.or(`pacientes.nome.ilike.%${searchTerm}%`)
      }

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching conversations:', error)
        return []
      }

      console.log('Conversations data:', data)
      return data
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_acompanhamento':
        return <MessageCircle className="w-4 h-4" />
      case 'humano_solicitado':
        return <AlertCircle className="w-4 h-4" />
      case 'finalizada':
        return <CheckCircle className="w-4 h-4" />
      case 'aguardando_ativacao':
        return <Clock className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_acompanhamento':
        return 'bg-blue-100 text-blue-800'
      case 'humano_solicitado':
        return 'bg-red-100 text-red-800'
      case 'finalizada':
        return 'bg-green-100 text-green-800'
      case 'aguardando_ativacao':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_acompanhamento':
        return 'Em Acompanhamento'
      case 'humano_solicitado':
        return 'Humano Solicitado'
      case 'finalizada':
        return 'Finalizada'
      case 'aguardando_ativacao':
        return 'Aguardando Ativação'
      default:
        return status
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statusOptions = [
    { value: "all", label: "Todos os Status", count: 0 },
    { value: "aguardando_ativacao", label: "Aguardando Ativação", count: 0 },
    { value: "em_acompanhamento", label: "Em Acompanhamento", count: 0 },
    { value: "humano_solicitado", label: "Humano Solicitado", count: 0 },
    { value: "finalizada", label: "Finalizada", count: 0 }
  ]

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  }

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conversas Nina</h1>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe todas as conversas dos pacientes</p>
        </div>
      </div>

      {/* Filtros Redesenhados */}
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
            </div>
          )}
        </div>
      </div>

      {/* Lista de Conversas */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Conversas Ativas</CardTitle>
            {conversations && (
              <div className="text-sm text-gray-500">
                {conversations.length} {conversations.length === 1 ? 'conversa encontrada' : 'conversas encontradas'}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando conversas...
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations && conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className={`p-5 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                      !conversation.is_read ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(conversation.status)}
                            <h3 className="font-semibold text-gray-900">
                              {conversation.pacientes?.nome || 'Paciente não identificado'}
                            </h3>
                          </div>
                          <Badge className={getStatusColor(conversation.status)}>
                            {getStatusLabel(conversation.status)}
                          </Badge>
                          {conversation.is_priority && (
                            <Badge variant="destructive">Prioritária</Badge>
                          )}
                          {!conversation.is_read && conversation.unread_count > 0 && (
                            <Badge variant="secondary">
                              {conversation.unread_count} nova{conversation.unread_count > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Telefone:</strong> {conversation.pacientes?.telefone || 'N/A'}
                        </div>

                        {conversation.ultima_mensagem && (
                          <div className="text-sm text-gray-700 mb-2">
                            <strong>Última mensagem:</strong> {conversation.ultima_mensagem}
                          </div>
                        )}

                        {conversation.resumo_conversa && (
                          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                            <strong>Resumo:</strong> {conversation.resumo_conversa}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right text-sm text-gray-500">
                        <div>Agente: {conversation.agente}</div>
                        <div>{formatTime(conversation.timestamp_ultima_mensagem || conversation.updated_at)}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" 
                      ? 'Nenhuma conversa encontrada' 
                      : 'Nenhuma conversa ativa'
                    }
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {searchTerm || statusFilter !== "all" 
                      ? 'Tente ajustar os filtros para encontrar outras conversas' 
                      : 'As conversas aparecerão aqui quando os pacientes iniciarem o acompanhamento'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Conversations;
