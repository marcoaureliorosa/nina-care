
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, UserPlus } from "lucide-react";
import PatientDialog from "./PatientDialog";

interface ConsultationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPacienteDialogOpen: boolean;
  onPacienteDialogOpenChange: (open: boolean) => void;
  onPacienteSubmit: (e: React.FormEvent) => void;
}

const ConsultationDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit,
  isPacienteDialogOpen,
  onPacienteDialogOpenChange,
  onPacienteSubmit
}: ConsultationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-ninacare-primary hover:bg-ninacare-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Consulta/Procedimento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Consulta/Procedimento</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente</Label>
            <div className="flex gap-2">
              <Input id="patient" placeholder="Selecionar paciente" required className="flex-1" />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => onPacienteDialogOpenChange(true)}
                title="Cadastrar novo paciente"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor">Dr./Dra.</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar médico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dr-silva">Dr. João Silva</SelectItem>
                <SelectItem value="dra-santos">Dra. Maria Santos</SelectItem>
                <SelectItem value="dr-costa">Dr. Pedro Costa</SelectItem>
                <SelectItem value="dra-oliveira">Dra. Ana Oliveira</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Input id="type" placeholder="Consulta/Procedimento" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input id="time" type="time" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Input id="notes" placeholder="Observações adicionais" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-ninacare-primary hover:bg-ninacare-primary/90">
              Agendar
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>

        <PatientDialog 
          isOpen={isPacienteDialogOpen}
          onOpenChange={onPacienteDialogOpenChange}
          onSubmit={onPacienteSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDialog;
