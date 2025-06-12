import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

const FollowUpsHeader = () => {
  return (
    <div className="bg-ninacare-primary rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end justify-between shadow-lg mb-6">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Avatar className="h-16 w-16 shadow-md border-4 border-white bg-white">
          <Bell className="w-8 h-8 text-ninacare-primary" />
          <AvatarFallback className="bg-ninacare-primary text-white text-xl font-bold">AC</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            Acompanhamentos
            <Badge className="ml-2 bg-white/20 text-white border-white/30" variant="secondary">
              Visão Futura
            </Badge>
          </h1>
          <p className="text-sm text-white/80 mt-1 font-medium">Visualize todos os envios de comunicação programados para os pacientes.</p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 text-right w-full md:w-auto">
        <p className="text-base text-white/90 font-medium">Agenda de Follow-ups</p>
        <p className="text-xs text-white/70 mt-1">Filtre por paciente e planeje as próximas interações.</p>
      </div>
    </div>
  );
};

export default FollowUpsHeader; 