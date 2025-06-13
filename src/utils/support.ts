interface SupportTicket {
  paciente: string;
  titulo: string;
  descricao: string;
  organizacao: string;
}

interface SupportApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const SUPPORT_WEBHOOK_URL = 'https://primary-production-72f4.up.railway.app/webhook/nina_cs';

/**
 * Envia um chamado de suporte para o webhook da equipe de CS
 * @param ticket - Dados do chamado de suporte
 * @returns Promise com resposta da API
 */
export const submitSupportTicket = async (ticket: SupportTicket): Promise<SupportApiResponse> => {
  try {
    // Validação dos dados obrigatórios
    if (!ticket.titulo.trim()) {
      throw new Error('Título é obrigatório');
    }

    if (!ticket.descricao.trim()) {
      throw new Error('Descrição é obrigatória');
    }

    if (ticket.descricao.trim().length < 10) {
      throw new Error('Descrição deve ter pelo menos 10 caracteres');
    }

    // Preparar dados para envio
    const payload = {
      paciente: ticket.paciente || 'Usuário não identificado',
      titulo: ticket.titulo.trim(),
      descricao: ticket.descricao.trim(),
      organizacao: ticket.organizacao || 'Organização não identificada'
    };

    console.log('Enviando chamado de suporte:', payload);

    const response = await fetch(SUPPORT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    // Tentar ler resposta como JSON se disponível
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      // Se não for JSON válido, considerar sucesso se status for OK
      responseData = { success: true };
    }

    console.log('Chamado enviado com sucesso:', responseData);

    return {
      success: true,
      message: 'Chamado enviado com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao enviar chamado de suporte:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao enviar chamado';

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Valida os dados de um chamado de suporte antes do envio
 * @param ticket - Dados do chamado
 * @returns Array de erros encontrados (vazio se válido)
 */
export const validateSupportTicket = (ticket: SupportTicket): string[] => {
  const errors: string[] = [];

  if (!ticket.titulo.trim()) {
    errors.push('Título é obrigatório');
  } else if (ticket.titulo.trim().length > 100) {
    errors.push('Título deve ter no máximo 100 caracteres');
  }

  if (!ticket.descricao.trim()) {
    errors.push('Descrição é obrigatória');
  } else if (ticket.descricao.trim().length < 10) {
    errors.push('Descrição deve ter pelo menos 10 caracteres');
  } else if (ticket.descricao.trim().length > 1000) {
    errors.push('Descrição deve ter no máximo 1000 caracteres');
  }

  return errors;
};

/**
 * Cria um template de ticket com dados pré-preenchidos
 * @param userProfile - Perfil do usuário
 * @returns Template de ticket
 */
export const createSupportTicketTemplate = (userProfile?: any): Partial<SupportTicket> => {
  return {
    paciente: userProfile?.nome || userProfile?.email || '',
    organizacao: userProfile?.organizacoes?.nome || '',
    titulo: '',
    descricao: ''
  };
};

export type { SupportTicket, SupportApiResponse }; 