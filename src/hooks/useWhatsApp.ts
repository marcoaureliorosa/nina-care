
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface WhatsAppConnectionStatus {
  connected: boolean;
  lastCheck: Date;
  error?: string;
  data?: {
    success?: boolean;
    code?: number;
    error?: string;
  };
  status?: string | number | boolean;
  instance?: string;
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

  // Hook para buscar o status da instância via Edge Function
  const useInstanceStatus = () => {
    return useQuery({
      queryKey: ['whatsapp-status', user?.id],
      queryFn: async (): Promise<WhatsAppConnectionStatus> => {
        try {
          const { data, error } = await supabase.functions.invoke('whatsapp-status');
          
          if (error) {
            console.error('Erro ao buscar status do WhatsApp:', error);
            return {
              connected: false,
              lastCheck: new Date(),
              error: error.message || 'Erro desconhecido'
            };
          }
          
          return {
            connected: data?.data?.success === true,
            lastCheck: new Date(),
            ...data
          };
        } catch (error) {
          console.error('Erro ao buscar status do WhatsApp:', error);
          return {
            connected: false,
            lastCheck: new Date(),
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      },
      enabled: !!user?.id,
      retry: 2
    });
  };

  // Hook para buscar o QR Code via Edge Function
  const useQRCode = () => {
    return useQuery({
      queryKey: ['whatsapp-qr', user?.id],
      queryFn: async (): Promise<WhatsAppQRCode> => {
        try {
          const { data, error } = await supabase.functions.invoke('whatsapp-qr');
          
          if (error) {
            console.error('Erro ao buscar QR Code do WhatsApp:', error);
            return {
              error: error.message || 'Erro desconhecido'
            };
          }
          
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

  // Mutation para verificar status manualmente via Edge Function
  const checkStatus = useMutation({
    mutationFn: async (): Promise<WhatsAppConnectionStatus> => {
      try {
        const { data, error } = await supabase.functions.invoke('whatsapp-status');
        
        if (error) {
          throw new Error(error.message || 'Erro ao verificar status');
        }
        
        return {
          connected: data?.data?.success === true,
          lastCheck: new Date(),
          ...data
        };
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
