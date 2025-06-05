
import { useState } from "react";
import { Plus, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AgendaPage = () => {
  const [isConsultaDialogOpen, setIsConsultaDialogOpen] = useState(false);
  const [isPacienteDialogOpen, setIsPacienteDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Agenda do Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(appointment.date).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ninacare-primary">8</div>
                  <div className="text-sm text-gray-600">Consultas Hoje</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ninacare-accent">3</div>
                  <div className="text-sm text-gray-600">Procedimentos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">2</div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgendaPage;
