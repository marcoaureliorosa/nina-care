import { useState, useEffect } from "react";
import CalendarHeader from "@/components/agenda/CalendarHeader";
import CalendarGrid from "@/components/agenda/CalendarGrid";
import ConsultationDialog from "@/components/agenda/ConsultationDialog";
import EditProcedureDialog from "@/components/agenda/EditProcedureDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const AgendaPage = () => {
  const [isConsultaDialogOpen, setIsConsultaDialogOpen] = useState(false);
  const [isPacienteDialogOpen, setIsPacienteDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { profile } = useAuth();

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

  const handleDeleteProcedure = async (procedureId: number) => {
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

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
        <ConsultationDialog 
          isOpen={isConsultaDialogOpen}
          onOpenChange={handleCloseDialog}
          onSubmit={handleConsultaSubmit}
          isPacienteDialogOpen={isPacienteDialogOpen}
          onPacienteDialogOpenChange={setIsPacienteDialogOpen}
          onPacienteSubmit={handlePacienteSubmit}
        />
        <EditProcedureDialog
          isOpen={isEditDialogOpen}
          onOpenChange={handleEditDialogClose}
          procedure={editingProcedure}
          onSubmit={handleConsultaSubmit}
          onDelete={handleDeleteProcedure}
        />
      </div>

      <CalendarHeader 
        currentDate={currentDate}
        view={view}
        onNavigateDate={navigateDate}
        onViewChange={setView}
      />

      <div className="flex-1">
        {loading ? (
          <div className="text-center text-gray-500">Carregando procedimentos...</div>
        ) : (
          <CalendarGrid 
            view={view}
            currentDate={currentDate}
            appointments={appointments}
            onAppointmentClick={handleEditProcedure} // Torna eventos clicáveis
          />
        )}
      </div>
    </div>
  );
};

export default AgendaPage;
