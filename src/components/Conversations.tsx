
import { useState } from "react";
import { Search, Filter, MessageCircle, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    { value: "all", label: "Todos" },
    { value: "aguardando_ativacao", label: "Aguardando Ativação" },
    { value: "em_acompanhamento", label: "Em Acompanhamento" },
    { value: "humano_solicitado", label: "Humano Solicitado" },
    { value: "finalizada", label: "Finalizada" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Conversas Nina</h1>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Buscar por nome do paciente..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(option.value)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Conversas */}
      <Card>
        <CardHeader>
          <CardTitle>Conversas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando conversas...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations && conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className={`p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer ${
                      !conversation.is_read ? 'bg-blue-50 border-blue-200' : ''
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
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== "all" 
                      ? 'Nenhuma conversa encontrada com os filtros aplicados' 
                      : 'Nenhuma conversa encontrada'
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
