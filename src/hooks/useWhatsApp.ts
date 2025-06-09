import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { whatsappApiFetch, checkWhatsAppConfig } from "@/lib/whatsapp-api";

interface WhatsAppStatus {
  status: string | number | boolean;
  instance?: string;
  error?: string;
  data?: {
    code?: number;
    error?: string;
    success?: boolean;
  };
}

interface WhatsAppQRCode {
  status?: boolean;
  data?: {
    success?: boolean;
    message?: string;
    qrcode?: string;
  };
  error?: string;
}

export const useWhatsApp = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Hook para buscar o status da instância
  const useInstanceStatus = () => {
    return useQuery({
      queryKey: ['whatsapp-status', user?.id],
      queryFn: async (): Promise<WhatsAppStatus> => {
        try {
          const data = await whatsappApiFetch('/instance/status');
          return data;
        } catch (error) {
          console.error('Erro ao buscar status do WhatsApp:', error);
          return {
            status: 'error',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      },
      enabled: !!user?.id,
      // removendo o refetch automático para dar controle ao usuário
      // refetchInterval: 10000, 
      retry: 2
    });
  };

  // Hook para buscar o QR Code
  const useQRCode = () => {
    return useQuery({
      queryKey: ['whatsapp-qr', user?.id],
      queryFn: async (): Promise<WhatsAppQRCode> => {
        try {
          const data = await whatsappApiFetch('/instance/qr');
          return data;
        } catch (error) {
          console.error('Erro ao buscar QR Code do WhatsApp:', error);
          return {
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      },
      enabled: false, // Só buscar quando solicitado manualmente
      retry: 1
    });
  };

  // Function para refresh do QR Code
  const refreshQRCode = () => {
    queryClient.invalidateQueries({ queryKey: ['whatsapp-qr'] });
  };

  // Mutation para verificar status manualmente
  const checkStatus = useMutation({
    mutationFn: async (): Promise<WhatsAppStatus> => {
      try {
        const data = await whatsappApiFetch('/instance/status');
        return data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro ao verificar status');
      }
    },
    onSuccess: () => {
      // Invalidar cache do status
      queryClient.invalidateQueries({ queryKey: ['whatsapp-status'] });
    }
  });

  return {
    useInstanceStatus,
    useQRCode,
    refreshQRCode,
    checkStatus
  };
}; 