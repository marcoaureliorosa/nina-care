
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface PatientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PatientDialog = ({ isOpen, onOpenChange, onSubmit }: PatientDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <User className="w-4 h-4 mr-2" />
          Novo Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastro de Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Nome Completo</Label>
            <Input id="patientName" placeholder="Digite o nome completo" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientCpf">CPF</Label>
            <Input id="patientCpf" placeholder="000.000.000-00" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientEmail">E-mail</Label>
            <Input id="patientEmail" type="email" placeholder="email@exemplo.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientPhone">Telefone</Label>
            <Input id="patientPhone" placeholder="(00) 00000-0000" required />
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
