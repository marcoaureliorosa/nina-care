import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const FollowUpsHeader = () => {
  return (
    <div className="ninacare-gradient rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end justify-between shadow-lg mb-6">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Avatar className="h-16 w-16 shadow-md border-4 border-white bg-white">
          <Clock className="w-8 h-8 text-ninacare-primary" />
          <AvatarFallback className="bg-ninacare-primary text-white text-xl font-bold">AC</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            Acompanhamentos
            <Badge className="ml-2 bg-white/20 text-white border-white/30" variant="secondary">
              Agendados
            </Badge>
          </h1>
          <p className="text-sm text-white/80 mt-1 font-medium">Gerencie e monitore todos os envios programados para os pacientes.</p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 text-right w-full md:w-auto">
        <p className="text-base text-white/90 font-medium">Central de Acompanhamentos</p>
        <p className="text-xs text-white/70 mt-1">Touchpoints automáticos e programação de envios</p>
      </div>
    </div>
  );
};

export default FollowUpsHeader; 