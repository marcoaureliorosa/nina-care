import { useState, useEffect, FC } from "react";
import ConsultationDialog from "@/components/agenda/ConsultationDialog";
import EditProcedureDialog from "@/components/agenda/EditProcedureDialog";
import PatientDialog from "@/components/patients/PatientDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import AgendaHeader from "@/components/agenda/AgendaHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Plus, Edit } from "lucide-react";
import { ptBR } from 'date-fns/locale';
import { isSameMonth } from 'date-fns';

// --- Tipagem dos dados ---
interface Paciente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
}

interface Medico {
  id: string;
  nome: string;
  especialidade?: string;
  email?: string;
}

const statusList = [
  { value: "agendado", label: "Agendado" },
  { value: "realizado", label: "Realizado" },
  { value: "cancelado", label: "Cancelado" },
];

const AgendaPage: FC = () => {
  const [isConsultaDialogOpen, setIsConsultaDialogOpen] = useState(false);
  const [isPacienteDialogOpen, setIsPacienteDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [profissional, setProfissional] = useState("all");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState<Date>(new Date());
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [newlyCreatedPatient, setNewlyCreatedPatient] = useState<Paciente | null>(null);

  // Dias com compromissos do mês atual
  const diasComCompromissos = appointments
    .filter(c => isSameMonth(new Date(c.data_procedimento), date))
    .map(c => new Date(c.data_procedimento));

  // Busca procedimentos do Supabase, incluindo nome do paciente
  const fetchProcedures = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("procedimentos")
      .select("id, paciente_id, medico_id, data_procedimento, status, observacoes, pacientes (nome)")
      .order('data_procedimento', { ascending: true });
      
    if (error) {
      toast.error("Erro ao buscar procedimentos: " + error.message);
      setLoading(false);
      return;
    }

    const mapped = (data || []).map((item: any) => {
      const [date, time] = item.data_procedimento.split('T');
      return {
        id: item.id,
        patient: item.pacientes?.nome || item.paciente_id,
        paciente_id: item.paciente_id,
        medico_id: item.medico_id,
        type: item.observacoes || "Procedimento",
        date,
        time: time ? time.substring(0, 5) : '',
        status: item.status || "agendado",
        observacoes: item.observacoes,
        data_procedimento: item.data_procedimento
      };
    });
    setAppointments(mapped);
    setLoading(false);
  };

  // Handler para abrir o dialog de edição
  const handleEditProcedure = (procedure: any) => {
    const [date, time] = procedure.data_procedimento.split('T');
    const procedureToEdit = {
      ...procedure,
      date,
      time: time ? time.substring(0, 5) : '',
      patient: procedure.patient,
    };
    setEditingProcedure(procedureToEdit);
    setIsEditDialogOpen(true);
  };

  // Handler de submit para criar ou editar
  const handleConsultaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const paciente_id = formData.get("paciente_id") as string;
    const medico_id = formData.get("medico_id") as string;
    const data_procedimento = formData.get("date") as string;
    const horario = formData.get("time") as string;
    const status = formData.get("status") as string || "agendado";
    const observacoes = formData.get("notes") as string;

    if (!data_procedimento || !horario) {
      toast.error("A data e o horário do procedimento são obrigatórios.");
      return;
    }

    const now = new Date();
    const dataHora = new Date(`${data_procedimento}T${horario.length === 5 ? `${horario}:00` : horario}`);
    if (dataHora < now && !editingProcedure) {
      toast.error("Não é possível cadastrar procedimentos para datas passadas.");
      return;
    }
    
    const horarioComSegundos = horario.length === 5 ? `${horario}:00` : horario;
    const dataHoraISO = `${data_procedimento}T${horarioComSegundos}`;

    let result;
    if (editingProcedure) {
      result = await supabase.from("procedimentos").update({
        paciente_id,
        medico_id,
        data_procedimento: dataHoraISO,
        status,
        observacoes
      }).eq('id', editingProcedure.id).select().single();
    } else {
      result = await supabase.from("procedimentos").insert([
        {
          paciente_id,
          medico_id,
          data_procedimento: dataHoraISO,
          status,
          observacoes
        },
      ]).select().single();
    }

    const { error } = result;

    if (error) {
      toast.error("Erro ao salvar procedimento: " + error.message);
    } else {
      toast.success(editingProcedure ? "Procedimento atualizado com sucesso!" : "Procedimento salvo com sucesso!");
      setIsConsultaDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingProcedure(null);
      fetchProcedures();
    }
  };

  const handleCloseDialog = () => {
    setIsConsultaDialogOpen(false);
    setEditingProcedure(null);
    setNewlyCreatedPatient(null);
  };

  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingProcedure(null);
    }
  };

  const handleDeleteProcedure = async (procedureId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este procedimento?")) {
      return;
    }
    const { error } = await supabase
      .from("procedimentos")
      .delete()
      .eq("id", procedureId);
    if (error) {
      toast.error("Erro ao excluir procedimento: " + error.message);
    } else {
      toast.success("Procedimento excluído com sucesso!");
      fetchProcedures();
      setIsEditDialogOpen(false);
      setEditingProcedure(null);
    }
  };

  const compromissosFiltrados = appointments.filter(c => {
    const matchProf = profissional === "all" || String(c.medico_id) === profissional;
    const matchStatus = status === "all" || c.status === status;
    const matchSearch = !!c.patient?.toLowerCase().includes(search.toLowerCase());
    const matchDate = !date || (new Date(c.data_procedimento).toDateString() === date.toDateString());
    return matchProf && matchStatus && matchSearch && matchDate;
  });

  useEffect(() => {
    async function fetchData() {
      const { data: pacientesData } = await supabase.from('pacientes').select('id, nome, telefone, email');
      setPacientes(pacientesData || []);
      const { data: medicosData } = await supabase.from('medicos').select('id, nome, especialidade, email');
      setMedicos(medicosData || []);
    }
    fetchData();
    fetchProcedures();
  }, []);

  const handlePatientCreated = (newPatient: Paciente) => {
    setPacientes(prev => [...prev, newPatient]);
    setIsPacienteDialogOpen(false);
    setNewlyCreatedPatient(newPatient);
    setIsConsultaDialogOpen(true);
    toast.info(`Paciente ${newPatient.nome} cadastrado. Agora você pode selecioná-lo para o agendamento.`);
  };

  const handleOpenNewAppointmentDialog = () => {
    setEditingProcedure(null);
    setNewlyCreatedPatient(null);
    setIsConsultaDialogOpen(true);
  };

  return (
    <>
      <div className="w-full min-h-[calc(100vh-80px)] flex flex-col bg-zinc-50/50">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-6">
            <AgendaHeader />
            
            {/* Filtros rápidos */}
            <div className="w-full flex flex-wrap gap-3 items-center bg-white/80 rounded-xl shadow p-4 md:p-6">
                <Input
                  placeholder="Buscar por paciente"
                  className="pl-10 h-11 rounded-lg border border-zinc-200 bg-white/90 shadow-sm focus:ring-2 focus:ring-ninacare-primary placeholder:text-zinc-400 text-base transition-all w-full max-w-xs"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select
                  className="rounded-lg border border-zinc-200 bg-white/90 shadow-sm h-11 px-3 text-base text-zinc-700 focus:ring-2 focus:ring-ninacare-primary"
                  value={profissional}
                  onChange={e => setProfissional(e.target.value)}
                >
                  <option value="all">Todos os profissionais</option>
                  {medicos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-zinc-200 bg-white/90 shadow-sm h-11 px-3 text-base text-zinc-700 focus:ring-2 focus:ring-ninacare-primary"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="all">Todos os status</option>
                  {statusList.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Calendário */}
                <div className="md:col-span-1">
                  <div className="md:w-full bg-white/80 rounded-2xl shadow p-4 md:p-6 flex flex-col items-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="w-full"
                      locale={ptBR}
                      modifiers={{ compromisso: diasComCompromissos }}
                      modifiersClassNames={{ 
                        compromisso: 'text-ninacare-primary font-bold border-2 border-ninacare-primary/60 bg-ninacare-primary/5 hover:border-ninacare-primary hover:bg-ninacare-primary/10 transition-all' 
                      }}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Procedimentos Agendados</h2>
                    <Button onClick={handleOpenNewAppointmentDialog} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Novo Procedimento
                    </Button>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 min-h-[300px]">
                    {loading ? (
                      <p>Carregando...</p>
                    ) : compromissosFiltrados.length === 0 ? (
                      <div className="text-center text-zinc-400 py-12">Nenhum compromisso encontrado</div>
                    ) : (
                      compromissosFiltrados.map(c => (
                        <Card key={c.id} className="bg-white/95 border-l-4 border-ninacare-primary/50 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex-1 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-ninacare-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-ninacare-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-zinc-800 text-base">{c.patient}</p>
                                <p className="text-sm text-zinc-500">{c.observacoes}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs font-medium capitalize h-6">
                              {c.status}
                            </Badge>
                            <div className="flex flex-col items-end min-w-[80px]">
                              <span className="text-xs text-zinc-400 font-mono mb-2">{new Date(c.data_procedimento).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <Button size="sm" variant="outline" className="text-ninacare-primary border-ninacare-primary" onClick={() => handleEditProcedure(c)}>
                                <Edit className="w-4 h-4 mr-1" /> Editar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dialogs */}
        {isConsultaDialogOpen && (
          <ConsultationDialog
            isOpen={isConsultaDialogOpen}
            onOpenChange={handleCloseDialog}
            onSubmit={handleConsultaSubmit}
            editingProcedure={editingProcedure || (newlyCreatedPatient ? { paciente_id: newlyCreatedPatient.id, patient: newlyCreatedPatient } : null)}
            onOpenPatientDialog={() => {
              setIsConsultaDialogOpen(false);
              setIsPacienteDialogOpen(true);
            }}
          />
        )}
        
        {isEditDialogOpen && editingProcedure && (
          <EditProcedureDialog
            key={editingProcedure.id}
            isOpen={isEditDialogOpen}
            onOpenChange={handleEditDialogClose}
            procedure={editingProcedure}
            onSubmit={handleConsultaSubmit}
            onDelete={() => handleDeleteProcedure(editingProcedure.id)}
          />
        )}
        
        <PatientDialog
          isOpen={isPacienteDialogOpen}
          onClose={() => setIsPacienteDialogOpen(false)}
          onPatientCreated={handlePatientCreated}
        />
    </>
  );
};

export default AgendaPage;
