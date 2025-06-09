import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const PatientsHeader = () => {
  return (
    <div className="bg-ninacare-primary rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end justify-between shadow-lg mb-6">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Avatar className="h-16 w-16 shadow-md border-4 border-white bg-white">
          <Users className="w-8 h-8 text-ninacare-primary" />
          <AvatarFallback className="bg-ninacare-primary text-white text-xl font-bold">PT</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            Pacientes
            <Badge className="ml-2 bg-white/20 text-white border-white/30" variant="secondary">
              Central de Pacientes
            </Badge>
          </h1>
          <p className="text-sm text-white/80 mt-1 font-medium">Gerencie e acompanhe todos os pacientes cadastrados na plataforma.</p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 text-right w-full md:w-auto">
        <p className="text-base text-white/90 font-medium">Gestão de Pacientes</p>
        <p className="text-xs text-white/70 mt-1">Visualize, edite e acompanhe o histórico de cada paciente</p>
      </div>
    </div>
  );
};

export default PatientsHeader; 