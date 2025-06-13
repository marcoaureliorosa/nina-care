import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Send, 
  User, 
  Building2, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  submitSupportTicket, 
  validateSupportTicket, 
  createSupportTicketTemplate,
  type SupportTicket 
} from '@/utils/support';

interface SupportModalProps {
  children: React.ReactNode;
}

const SupportModal: React.FC<SupportModalProps> = ({ children }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SupportTicket>({
    paciente: '',
    titulo: '',
    descricao: '',
    organizacao: ''
  });

  // Preencher dados automaticamente quando o modal abrir
  React.useEffect(() => {
    if (open && profile) {
      const template = createSupportTicketTemplate(profile);
      setFormData(prev => ({
        ...prev,
        ...template
      }));
    }
  }, [open, profile]);

  const handleInputChange = (field: keyof SupportTicket, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = validateSupportTicket(formData);
    
    if (errors.length > 0) {
      toast({
        title: "Erro de validação",
        description: errors[0], // Mostrar primeiro erro
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await submitSupportTicket(formData);

      if (result.success) {
        toast({
          title: "Chamado enviado com sucesso!",
          description: result.message || "Nossa equipe de suporte entrará em contato em breve.",
          variant: "default",
        });

        // Resetar formulário e fechar modal
        const template = createSupportTicketTemplate(profile);
        setFormData({
          paciente: template.paciente || '',
          titulo: '',
          descricao: '',
          organizacao: template.organizacao || ''
        });
        setOpen(false);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }

    } catch (error) {
      console.error('Erro ao enviar chamado:', error);
      toast({
        title: "Erro ao enviar chamado",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar seu chamado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      // Resetar apenas título e descrição
      setFormData(prev => ({
        ...prev,
        titulo: '',
        descricao: ''
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="bg-primary/10 p-2 rounded-full">
              <Info className="w-5 h-5 text-primary" />
            </div>
            Solicitar Suporte
          </DialogTitle>
          <DialogDescription>
            Descreva seu problema ou dúvida e nossa equipe de suporte entrará em contato.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do usuário */}
          <Card className="bg-muted/20 border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Suas informações</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <User className="w-3 h-3 mr-1" />
                    {formData.paciente || 'Usuário'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Building2 className="w-3 h-3 mr-1" />
                    {formData.organizacao || 'Sem organização'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Título do Problema *
              </Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Ex: Problema no login, erro ao carregar dados..."
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                disabled={loading}
                className="w-full"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {formData.titulo.length}/100 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Descrição Detalhada *
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva detalhadamente o problema que você está enfrentando. Inclua passos para reproduzir o erro, mensagens de erro e qualquer informação relevante..."
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                disabled={loading}
                className="min-h-[120px] resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {formData.descricao.length}/1000 caracteres (mínimo 10)
              </p>
            </div>

            <Separator />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.titulo.trim() || !formData.descricao.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Chamado
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Informações adicionais */}
          <Card className="bg-blue-50/50 border-blue-200/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    Como funciona o suporte?
                  </p>
                  <p className="text-xs text-blue-700">
                    • Nossa equipe receberá seu chamado imediatamente<br />
                    • Responderemos em até 24 horas úteis<br />
                    • Problemas críticos são priorizados<br />
                    • Você receberá atualizações por email
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportModal; 