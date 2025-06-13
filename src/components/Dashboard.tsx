import { useAuth } from "@/contexts/AuthContext"
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import DashboardHeader from "./dashboard/DashboardHeader"
import DashboardLoading from "./dashboard/DashboardLoading"
import DashboardError from "./dashboard/DashboardError"
import MainMetricsGrid from "./dashboard/MainMetricsGrid"
import EngagementMetrics from "./dashboard/EngagementMetrics"
import OverviewMetrics from "./dashboard/OverviewMetrics"
import DailySchedule from "./dashboard/DailySchedule"
import EditProceduresDialog from "@/components/dashboard/EditProceduresDialog"
import HumanActivationsMetrics from "./dashboard/HumanActivationsMetrics"

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { data: metrics, isLoading, error, refetch: refetchMetrics } = useDashboardMetrics();
  const [isEditProceduresOpen, setIsEditProceduresOpen] = useState(false);

  const handleSaveProcedures = async (newValue: number) => {
    if (!profile?.organizacao_id) {
      toast.error("ID da organização não encontrado.");
      return;
    }
    const { error } = await supabase
      .from("organizacoes")
      .update({ procedures_performed: newValue })
      .eq("id", profile.organizacao_id);

    if (error) {
      throw new Error(error.message);
    }
    refetchMetrics();
  };

  console.log('Dashboard - user:', user?.id);
  console.log('Dashboard - profile:', profile);
  console.log('Dashboard query result:', { metrics, isLoading, error });

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!user || !metrics) {
    return <DashboardError error={error} />;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="w-full flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full pt-8 pb-4">
            <DashboardHeader userProfile={metrics.userProfile} />
          </div>
          <div className="w-full space-y-8">
            <OverviewMetrics
              newPatientsMonthly={metrics.newPatientsMonthly}
            />

            <MainMetricsGrid
              procedures={metrics.procedures}
              totalPatients={metrics.totalPatients}
              patientsPercentage={metrics.patientsPercentage}
              activePatients={metrics.activePatients}
              ninaActivation={metrics.ninaActivation}
              onEditProcedures={() => setIsEditProceduresOpen(true)}
            />

            <HumanActivationsMetrics
              humanActivationsToday={metrics.humanActivations.count}
              humanActivationsMonthly={metrics.humanActivationsMonthly}
            />

            <div className="grid gap-8 lg:grid-cols-3 items-stretch">
              <div className="lg:col-span-1">
                <DailySchedule upcomingAppointments={metrics.upcomingAppointments} />
              </div>
              <div className="lg:col-span-2">
                <EngagementMetrics
                  responseRate24h={metrics.responseRate24h}
                  spontaneousContacts={metrics.spontaneousContacts}
                  satisfactionClicks={metrics.satisfactionClicks}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProceduresDialog
        open={isEditProceduresOpen}
        onOpenChange={setIsEditProceduresOpen}
        currentValue={metrics.procedures}
        onSave={handleSaveProcedures}
      />
    </>
  );
};

export default Dashboard;
