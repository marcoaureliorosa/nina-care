
import { useState } from "react";
import { Plus, Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day)
      });
    }
    
    // Next month's days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    return currentDate.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
        <div className="flex gap-2">
          <Dialog open={isPacienteDialogOpen} onOpenChange={setIsPacienteDialogOpen}>
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
              <form onSubmit={handlePacienteSubmit} className="space-y-4">
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
                  <Button type="button" variant="outline" onClick={() => setIsPacienteDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isConsultaDialogOpen} onOpenChange={setIsConsultaDialogOpen}>
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
              <form onSubmit={handleConsultaSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Paciente</Label>
                  <Input id="patient" placeholder="Selecionar paciente" required />
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
                  <Button type="button" variant="outline" onClick={() => setIsConsultaDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold capitalize">{formatDateHeader()}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={view === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('month')}
            className={view === 'month' ? 'bg-ninacare-primary hover:bg-ninacare-primary/90' : ''}
          >
            Mês
          </Button>
          <Button 
            variant={view === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('week')}
            className={view === 'week' ? 'bg-ninacare-primary hover:bg-ninacare-primary/90' : ''}
          >
            Semana
          </Button>
          <Button 
            variant={view === 'day' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('day')}
            className={view === 'day' ? 'bg-ninacare-primary hover:bg-ninacare-primary/90' : ''}
          >
            Dia
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1">
        {view === 'month' && (
          <Card className="h-full">
            <CardContent className="p-0">
              {/* Days of week header */}
              <div className="grid grid-cols-7 border-b">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="p-3 text-center font-medium text-gray-500 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 h-full">
                {getMonthDays().map((day, index) => {
                  const dayAppointments = getAppointmentsForDate(day.fullDate);
                  const isToday = day.fullDate.toDateString() === new Date().toDateString();
                  
                  return (
                    <div 
                      key={index} 
                      className={`min-h-32 p-2 border-r border-b relative ${
                        !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                      } ${isToday ? 'bg-blue-50' : ''} hover:bg-gray-50 transition-colors`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        isToday ? 'text-ninacare-primary' : ''
                      }`}>
                        {day.date}
                      </div>
                      
                      <div className="space-y-1">
                        {dayAppointments.map((appointment) => (
                          <div 
                            key={appointment.id}
                            className={`text-xs p-1 rounded text-white truncate cursor-pointer ${
                              appointment.status === 'confirmado' ? 'bg-green-500' : 'bg-ninacare-primary'
                            }`}
                            title={`${appointment.time} - ${appointment.patient}`}
                          >
                            {appointment.time} {appointment.patient}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {view === 'week' && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center text-gray-500 py-16">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Visualização Semanal</h3>
                <p>Em desenvolvimento...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {view === 'day' && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center text-gray-500 py-16">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Visualização Diária</h3>
                <p>Em desenvolvimento...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgendaPage;
