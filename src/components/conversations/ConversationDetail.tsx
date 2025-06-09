import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

// Função utilitária para buscar telefone do paciente a partir do id da conversa
async function getTelefoneByConversaId(conversaId: string) {
  // 1. Buscar paciente_id na tabela conversas
  const { data: conversa, error: errorConversa } = await supabase
    .from('conversas')
    .select('paciente_id')
    .eq('id', conversaId)
    .single();
  if (errorConversa || !conversa?.paciente_id) throw new Error('Conversa ou paciente_id não encontrado');

  // 2. Buscar telefone na tabela pacientes
  const { data: paciente, error: errorPaciente } = await supabase
    .from('pacientes')
    .select('telefone')
    .eq('id', conversa.paciente_id)
    .single();
  if (errorPaciente || !paciente?.telefone) throw new Error('Telefone do paciente não encontrado');

  return paciente.telefone;
}

const ConversationDetail = () => {
  const { id } = useParams(); // id da conversa
  const navigate = useNavigate();

  // Marcar como lida ao abrir
  useEffect(() => {
    if (!id) return;
    (async () => {
      await supabase
        .from('conversas')
        .update({ is_read: true })
        .eq('id', id);
    })();
  }, [id]);

  // Buscar mensagens do n8n_chat_histories usando o conversa_id
  const { data: mensagens, isLoading } = useQuery({
    queryKey: ['n8n_chat_histories', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('conversa_id', id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      // Extrair dados do campo message (JSON)
      return data?.map(msg => {
        const messageObj = typeof msg.message === 'object' && msg.message !== null ? msg.message : {};
        return {
          id: msg.id,
          created_at: msg.created_at,
          ...messageObj,
        };
      }) || [];
    },
    enabled: !!id,
  });

  const getRemetente = (msg: any) => {
    if (msg.type === 'human') return 'Paciente';
    if (msg.type === 'ai') return 'Agente';
    return '';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
      <button
        className="mb-4 flex items-center gap-2 text-ninacare-primary hover:underline font-medium"
        onClick={() => navigate('/conversas')}
        aria-label="Voltar para conversas"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Voltar
      </button>
      <h2 className="text-2xl font-bold mb-4">Histórico de Mensagens</h2>
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <ul className="space-y-3 mb-4">
          {mensagens?.map(msg => {
            const isAgente = msg.type === 'ai';
            return (
              <li
                key={msg.id}
                className={`flex ${isAgente ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow-sm break-words text-sm
                    ${isAgente
                      ? 'bg-ninacare-primary text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'}
                  `}
                >
                  <div className="font-semibold mb-1 text-xs opacity-80">
                    {getRemetente(msg)}
                  </div>
                  <div>{msg.content || ''}</div>
                  <div className={`mt-2 text-[10px] opacity-70 flex ${isAgente ? 'justify-end' : 'justify-start'}`}>
                    {msg.created_at ? new Date(String(msg.created_at)).toLocaleString() : ''}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ConversationDetail; 