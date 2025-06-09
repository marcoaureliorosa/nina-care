import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input, InputMaskPhone } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PatientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (patientData: any) => void;
}

const PatientDialog = ({ isOpen, onOpenChange, onSubmit }: PatientDialogProps) => {
  const { profile } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastro de Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          if (!profile?.organizacao_id) {
            alert('Não foi possível identificar a organização do usuário.');
            return;
          }
          const patientData = {
            nome: formData.get('name') as string,
            cpf: formData.get('cpf') as string,
            email: formData.get('email') as string,
            telefone: (formData.get('phone') as string)?.replace(/\D/g, ''),
            data_nascimento: formData.get('birthDate') as string || undefined,
            nina_status: true,
            organizacao_id: profile.organizacao_id,
          };
          onSubmit(patientData);
        }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Nome Completo <span className="text-red-500">*</span></Label>
            <Input id="patientName" name="name" placeholder="Digite o nome completo" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientCpf">CPF <span className="text-gray-400">(opcional)</span></Label>
            <Input id="patientCpf" name="cpf" placeholder="000.000.000-00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientEmail">E-mail <span className="text-gray-400">(opcional)</span></Label>
            <Input id="patientEmail" name="email" type="email" placeholder="email@exemplo.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientPhone">Telefone <span className="text-red-500">*</span></Label>
            <InputMaskPhone id="patientPhone" name="phone" placeholder="(00) 00000-0000" required pattern="\\d{11}" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientBirthDate">Data de Nascimento <span className="text-gray-400">(opcional)</span></Label>
            <Input id="patientBirthDate" name="birthDate" type="date" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-ninacare-primary hover:bg-ninacare-primary/90">
              Cadastrar
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDialog;
