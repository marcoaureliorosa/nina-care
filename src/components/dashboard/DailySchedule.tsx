import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  data_procedimento: string;
  pacientes: { nome: string } | null;
  medicos: { nome: string } | null;
}

interface DailyScheduleProps {
  upcomingAppointments: Appointment[];
}

const DailySchedule = ({ upcomingAppointments }: DailyScheduleProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Agenda do Dia</CardTitle>
        <CardDescription>Próximos 5 agendamentos de hoje.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments && upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`/avatars/${apt.pacientes?.nome?.charAt(0)}.png`} alt="Avatar" />
                  <AvatarFallback>{apt.pacientes?.nome?.charAt(0) || 'P'}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{apt.pacientes?.nome || 'Paciente não informado'}</p>
                  <p className="text-sm text-muted-foreground">
                    Dr(a). {apt.medicos?.nome || 'Não informado'}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {format(new Date(apt.data_procedimento), 'HH:mm', { locale: ptBR })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum agendamento para hoje.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySchedule; 