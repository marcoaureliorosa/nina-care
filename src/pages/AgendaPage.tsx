import { useState, useEffect, FC } from "react";
import CalendarHeader from "@/components/agenda/CalendarHeader";
import CalendarGrid from "@/components/agenda/CalendarGrid";
import ConsultationDialog from "@/components/agenda/ConsultationDialog";
import EditProcedureDialog from "@/components/agenda/EditProcedureDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import AgendaHeader from "@/components/agenda/AgendaHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, CalendarCheck, Plus, Edit } from "lucide-react";
import { ptBR } from 'date-fns/locale';
import { isSameDay, isSameMonth } from 'date-fns';

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

interface Compromisso {
  id: string;
  paciente_id: string;
  medico_id: string;
  data_procedimento: string;
  status: string;
  observacoes: string;
  pacientes?: { nome: string };
  medicos?: { nome: string };
}

interface AgendamentoModalProps {
  pacientes: Paciente[];
  medicos: Medico[];
  compromisso?: Compromisso | null;
  onClose: () => void;
  onSave: (form: any) => void;
}

const profissionais = [
  { id: '1', nome: "Dra. Ana Paula" },
  { id: '2', nome: "Dr. João Silva" },
];
const statusList = [
  { value: "agendado", label: "Agendado" },
  { value: "realizado", label: "Realizado" },
  { value: "cancelado", label: "Cancelado" },
];
const compromissosSimulados = [
  {
    id: 1,
    paciente: "Larissa Souza",
    avatar: null,
    horario: "09:00",
    status: "confirmed",
    profissional: "Dra. Ana Paula",
  },
  {
    id: 2,
    paciente: "Carlos Lima",
    avatar: null,
    horario: "10:30",
    status: "pending",
    profissional: "Dr. João Silva",
  },
  {
    id: 3,
    paciente: "Fernanda Alves",
    avatar: null,
    horario: "13:00",
    status: "cancelled",
    profissional: "Dra. Ana Paula",
  },
];

const AgendaPage: FC = () => {
  const [isConsultaDialogOpen, setIsConsultaDialogOpen] = useState(false);
  const [isPacienteDialogOpen, setIsPacienteDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
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
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [compromissoSelecionado, setCompromissoSelecionado] = useState<Compromisso | null>(null);

  // Dias com compromissos do mês atual
  const diasComCompromissos = compromissos
    .filter(c => isSameMonth(new Date(c.data_procedimento), date))
    .map(c => new Date(c.data_procedimento));

  // Busca procedimentos futuros do Supabase, incluindo nome do paciente
  const fetchProcedures = async () => {
    setLoading(true);
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from("procedimentos")
      .select("id, paciente_id, medico_id, data_procedimento, status, observacoes, pacientes (nome)")
      .gte('data_procedimento', todayISO)
      .order('created_at', { ascending: true });
    if (error) {
      alert("Erro ao buscar procedimentos: " + error.message);
      setLoading(false);
      return;
    }
    // Mapear para o formato esperado pelo CalendarGrid
    const mapped = (data || []).map((item: any) => {
      const [date, time] = item.data_procedimento.split('T');
      return {
        id: item.id,
        patient: item.pacientes?.nome || item.paciente_id, // Mostra nome se disponível
        paciente_id: item.paciente_id,
        medico_id: item.medico_id,
        type: item.observacoes || "Procedimento",
        date,
        time: time ? time.substring(0,5) : '',
        status: item.status || "agendado",
        observacoes: item.observacoes,
        data_procedimento: item.data_procedimento
      };
    });
    setAppointments(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  // Handler para abrir o dialog de edição
  const handleEditProcedure = (procedure: any) => {
    setEditingProcedure(procedure);
    setIsEditDialogOpen(true);
  };

  // Handler de submit adaptado para criar ou editar
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

    if (!data_procedimento) {
      alert("A data do procedimento é obrigatória.");
      return;
    }
    if (!horario) {
      alert("O horário do procedimento é obrigatório.");
      return;
    }
    // Impede cadastro para datas passadas
    const now = new Date();
    const dataHora = new Date(`${data_procedimento}T${horario.length === 5 ? `${horario}:00` : horario}`);
    if (dataHora < now) {
      alert("Não é possível cadastrar procedimentos para datas passadas.");
      return;
    }
    // Junta data e hora no formato ISO para timestampz, sempre com segundos
    const horarioComSegundos = horario.length === 5 ? `${horario}:00` : horario;
    const dataHoraISO = `${data_procedimento}T${horarioComSegundos}`;

    let error;
    if (editingProcedure) {
      // Atualizar procedimento existente
      ({ error } = await supabase.from("procedimentos").update({
        paciente_id,
        medico_id,
        data_procedimento: dataHoraISO,
        status,
        observacoes
      }).eq('id', editingProcedure.id));
    } else {
      // Criar novo procedimento
      ({ error } = await supabase.from("procedimentos").insert([
        {
          paciente_id,
          medico_id,
          data_procedimento: dataHoraISO,
          status,
          observacoes
        },
      ]));
    }

    if (error) {
      alert("Erro ao salvar procedimento: " + error.message);
    } else {
      alert(editingProcedure ? "Procedimento atualizado com sucesso!" : "Procedimento salvo com sucesso!");
      setIsConsultaDialogOpen(false);
      setEditingProcedure(null);
      fetchProcedures(); // Atualiza a lista
    }
  };

  // Handler para fechar o dialog e limpar edição
  const handleCloseDialog = (open: boolean) => {
    setIsConsultaDialogOpen(open);
    if (!open) setEditingProcedure(null);
  };

  const handlePacienteSubmit = async (patientData: any) => {
    if (!profile?.organizacao_id) {
      toast.error("Não foi possível identificar a organização do usuário.");
      return;
    }
    // Validação mínima
    if (!patientData.nome || !patientData.telefone) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    const { error } = await supabase.from("pacientes").insert([
      patientData
    ]);
    if (error) {
      toast.error("Erro ao cadastrar paciente: " + error.message);
    } else {
      toast.success("Paciente cadastrado com sucesso!");
      setIsPacienteDialogOpen(false);
    }
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

  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) setEditingProcedure(null);
  };

  const handleDeleteProcedure = async (procedureId: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este procedimento?");
    if (!confirmDelete) return;
    const { error } = await supabase.from("procedimentos").delete().eq("id", procedureId);
    if (error) {
      alert("Erro ao excluir procedimento: " + error.message);
    } else {
      alert("Procedimento excluído com sucesso!");
      setIsEditDialogOpen(false);
      setEditingProcedure(null);
      fetchProcedures();
    }
  };

  const compromissosFiltrados = compromissos.filter(c => {
    const matchProf = profissional === "all" || String(c.medico_id) === profissional;
    const matchStatus = status === "all" || c.status === status;
    const matchSearch = !!c.pacientes?.nome?.toLowerCase().includes(search.toLowerCase());
    const matchDate = !date || (new Date(c.data_procedimento).toDateString() === date.toDateString());
    return matchProf && matchStatus && matchSearch && matchDate;
  });

  // Buscar dados reais do Supabase
  useEffect(() => {
    async function fetchData() {
      const { data: pacientesData } = await supabase.from('pacientes').select('id, nome, telefone, email');
      setPacientes(pacientesData || []);
      const { data: medicosData } = await supabase.from('medicos').select('id, nome, especialidade, email');
      setMedicos(medicosData || []);
      const { data: compromissosData } = await supabase
        .from('procedimentos')
        .select('id, paciente_id, medico_id, data_procedimento, status, observacoes, pacientes:paciente_id (nome), medicos:medico_id (nome)')
        .order('data_procedimento', { ascending: true });
      setCompromissos(compromissosData || []);
    }
    fetchData();
  }, [modalOpen, modalEdit]);

  // Modal de edição
  function openEditModal(compromisso: Compromisso) {
    setCompromissoSelecionado(compromisso);
    setModalEdit(true);
  }
  function closeEditModal() {
    setCompromissoSelecionado(null);
    setModalEdit(false);
  }
  // Modal de novo agendamento
  function openNewModal() {
    setCompromissoSelecionado(null);
    setModalOpen(true);
  }
  function closeNewModal() {
    setModalOpen(false);
  }

  // Salvar edição
  async function handleSaveEdit(form) {
    await supabase.from('procedimentos').update({
      paciente_id: form.paciente_id,
      medico_id: form.medico_id,
      data_procedimento: form.data_procedimento,
      status: form.status,
      observacoes: form.observacoes,
    }).eq('id', compromissoSelecionado.id);
    closeEditModal();
  }
  // Salvar novo
  async function handleSaveNew(form) {
    await supabase.from('procedimentos').insert({
      paciente_id: form.paciente_id,
      medico_id: form.medico_id,
      data_procedimento: form.data_procedimento,
      status: form.status,
      observacoes: form.observacoes,
    });
    closeNewModal();
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center bg-zinc-50">
      <div className="w-full flex flex-col items-center max-w-7xl mx-auto">
        <div className="w-full pt-8 pb-4">
          <AgendaHeader />
        </div>
        {/* Filtros rápidos */}
        <div className="w-full flex flex-wrap gap-3 items-center bg-white/80 rounded-xl shadow p-4 md:p-6 mb-6">
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
          <Button className="ml-auto px-4 py-2 rounded-full text-sm font-medium bg-ninacare-primary text-white hover:bg-ninacare-primary/90 transition flex items-center gap-2" onClick={openNewModal}>
            <Plus className="w-4 h-4" /> Novo Agendamento
          </Button>
        </div>
        {/* Layout responsivo: calendário + cards */}
        <div className="w-full flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 w-full bg-white/80 rounded-2xl shadow p-4 md:p-6 flex flex-col items-center">
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
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            {compromissosFiltrados.length === 0 ? (
              <div className="text-center text-zinc-400 py-12">Nenhum compromisso encontrado</div>
            ) : (
              compromissosFiltrados.map(c => (
                <Card key={c.id} className="rounded-2xl border bg-white/90 shadow-md hover:shadow-lg transition-all flex flex-col p-6">
                  <CardContent className="flex items-center gap-4 p-0">
                    <div className="h-12 w-12 rounded-full bg-ninacare-primary/10 flex items-center justify-center">
                      <User className="w-7 h-7 text-ninacare-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-lg text-zinc-900 truncate block">{c.pacientes?.nome}</span>
                      <Badge className={`ml-2 ${c.status === 'agendado' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : c.status === 'realizado' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'} px-2 py-0.5 text-xs font-semibold rounded-full shadow-none mt-1`}>
                        {statusList.find(s => s.value === c.status)?.label || c.status}
                      </Badge>
                      <div className="text-zinc-500 text-sm mt-1">Profissional: {c.medicos?.nome}</div>
                      <div className="text-zinc-400 text-xs mt-1">{c.observacoes}</div>
                    </div>
                    <div className="flex flex-col items-end min-w-[80px]">
                      <span className="text-xs text-zinc-400 font-mono mb-2">{new Date(c.data_procedimento).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <Button size="sm" variant="outline" className="text-ninacare-primary border-ninacare-primary" onClick={() => openEditModal(c)}>
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
      {/* Modal de novo agendamento */}
      {modalOpen && (
        <AgendamentoModal
          pacientes={pacientes}
          medicos={medicos}
          onClose={closeNewModal}
          onSave={handleSaveNew}
        />
      )}
      {/* Modal de edição */}
      {modalEdit && compromissoSelecionado && (
        <AgendamentoModal
          pacientes={pacientes}
          medicos={medicos}
          compromisso={compromissoSelecionado}
          onClose={closeEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

// Componente de modal premium para criar/editar agendamento
function AgendamentoModal({ pacientes, medicos, compromisso = null, onClose, onSave }: AgendamentoModalProps) {
  const [form, setForm] = useState({
    paciente_id: compromisso?.paciente_id || "",
    medico_id: compromisso?.medico_id || "",
    data_procedimento: compromisso?.data_procedimento ? compromisso.data_procedimento.slice(0, 16) : "",
    status: compromisso?.status || "agendado",
    observacoes: compromisso?.observacoes || "",
  });
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">{compromisso ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
        <select name="paciente_id" value={String(form.paciente_id)} onChange={handleChange} required className="rounded-lg border border-zinc-200 bg-white/90 shadow-sm h-11 px-3 text-base text-zinc-700">
          <option value="">Selecione o paciente</option>
          {pacientes.map(p => (
            <option key={String(p.id)} value={String(p.id)}>{p.nome}</option>
          ))}
        </select>
        <select name="medico_id" value={String(form.medico_id)} onChange={handleChange} required className="rounded-lg border border-zinc-200 bg-white/90 shadow-sm h-11 px-3 text-base text-zinc-700">
          <option value="">Selecione o profissional</option>
          {medicos.map(m => (
            <option key={String(m.id)} value={String(m.id)}>{m.nome}</option>
          ))}
        </select>
        <input type="datetime-local" name="data_procedimento" value={form.data_procedimento} onChange={handleChange} required className="rounded-lg border border-zinc-200 bg-white/90 shadow-sm h-11 px-3 text-base text-zinc-700" />
        <select name="status" value={String(form.status)} onChange={handleChange} required className="rounded-lg border border-zinc-200 bg-white/90 shadow-sm h-11 px-3 text-base text-zinc-700">
          {statusList.map(s => (
            <option key={String(s.value)} value={String(s.value)}>{s.label}</option>
          ))}
        </select>
        <textarea name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Observações" className="rounded-lg border border-zinc-200 bg-white/90 shadow-sm px-3 py-2 text-base text-zinc-700 min-h-[60px]" />
        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 bg-ninacare-primary hover:bg-ninacare-primary/90 text-white">Salvar</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}

export default AgendaPage;
