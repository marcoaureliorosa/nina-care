import { useState } from "react";
import CalendarHeader from "@/components/agenda/CalendarHeader";
import CalendarGrid from "@/components/agenda/CalendarGrid";
import ConsultationDialog from "@/components/agenda/ConsultationDialog";

const AgendaPage = () => {
  const [isConsultaDialogOpen, setIsConsultaDialogOpen] = useState(false);
  const [isPacienteDialogOpen, setIsPacienteDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const appointments = [
    {
      id: 1,
      patient: "Maria Silva",
      type: "Consulta Pré-operatória",
      date: "2024-06-06",
      time: "09:00",
      status: "agendado"
    },
    {
      id: 2,
      patient: "João Santos", 
      type: "Procedimento Cirúrgico",
      date: "2024-06-06",
      time: "14:00",
      status: "confirmado"
    },
    {
      id: 3,
      patient: "Ana Costa",
      type: "Consulta Pós-operatória",
      date: "2024-06-07",
      time: "10:30",
      status: "agendado"
    }
  ];

  const handleConsultaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultaDialogOpen(false);
  };

  const handlePacienteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPacienteDialogOpen(false);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
        <ConsultationDialog 
          isOpen={isConsultaDialogOpen}
          onOpenChange={setIsConsultaDialogOpen}
          onSubmit={handleConsultaSubmit}
          isPacienteDialogOpen={isPacienteDialogOpen}
          onPacienteDialogOpenChange={setIsPacienteDialogOpen}
          onPacienteSubmit={handlePacienteSubmit}
        />
      </div>

      <CalendarHeader 
        currentDate={currentDate}
        view={view}
        onNavigateDate={navigateDate}
        onViewChange={setView}
      />

      <div className="flex-1">
        <CalendarGrid 
          view={view}
          currentDate={currentDate}
          appointments={appointments}
        />
      </div>
    </div>
  );
};

export default AgendaPage;
