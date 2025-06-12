import { useAuth } from "@/contexts/AuthContext"
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics"
import DashboardHeader from "./dashboard/DashboardHeader"
import DashboardLoading from "./dashboard/DashboardLoading"
import DashboardError from "./dashboard/DashboardError"
import MainMetricsGrid from "./dashboard/MainMetricsGrid"
import EngagementMetrics from "./dashboard/EngagementMetrics"
import OverviewMetrics from "./dashboard/OverviewMetrics"
import DailySchedule from "./dashboard/DailySchedule"

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { data: metrics, isLoading, error } = useDashboardMetrics();

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
    <div className="space-y-8">
      <div className="w-full flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full pt-8 pb-4">
          <DashboardHeader userProfile={metrics.userProfile} />
        </div>
        <div className="w-full space-y-8">
          <OverviewMetrics
            newPatientsMonthly={metrics.newPatientsMonthly}
            scheduledToday={metrics.scheduledToday}
            pendingConversations={metrics.pendingConversations}
            humanActivationsMonthly={metrics.humanActivationsMonthly}
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MainMetricsGrid
                procedures={metrics.procedures}
                totalPatients={metrics.totalPatients}
                patientsPercentage={metrics.patientsPercentage}
                activePatients={metrics.activePatients}
                ninaActivation={metrics.ninaActivation}
              />
            </div>
            <div className="lg:col-span-1">
              <DailySchedule upcomingAppointments={metrics.upcomingAppointments} />
            </div>
          </div>
          
          <EngagementMetrics
            responseRate24h={metrics.responseRate24h}
            spontaneousContacts={metrics.spontaneousContacts}
            humanActivations={metrics.humanActivations}
            satisfactionClicks={metrics.satisfactionClicks}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
