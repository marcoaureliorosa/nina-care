import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck } from "lucide-react";

const AgendaHeader = () => {
  return (
    <div className="ninacare-gradient rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end justify-between shadow-lg">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Avatar className="h-16 w-16 shadow-md border-4 border-white bg-white">
          <CalendarCheck className="w-8 h-8 text-ninacare-primary" />
          <AvatarFallback className="bg-ninacare-primary text-white text-xl font-bold">AG</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            Agenda
            <Badge className="ml-2 bg-white/20 text-white border-white/30" variant="secondary">
              Central de Agendamentos
            </Badge>
          </h1>
          <p className="text-sm text-white/80 mt-1 font-medium">Visualize, agende e gerencie compromissos de pacientes e profissionais.</p>
        </div>
      </div>
    </div>
  );
};

export default AgendaHeader; 