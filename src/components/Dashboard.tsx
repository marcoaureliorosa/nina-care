
import { useAuth } from "@/contexts/AuthContext"
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics"
import DashboardHeader from "./dashboard/DashboardHeader"
import DashboardLoading from "./dashboard/DashboardLoading"
import DashboardError from "./dashboard/DashboardError"
import MainMetricsGrid from "./dashboard/MainMetricsGrid"
import EngagementMetrics from "./dashboard/EngagementMetrics"
import RecentActivity from "./dashboard/RecentActivity"

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
    <div className="space-y-6">
      <DashboardHeader userProfile={metrics.userProfile} />

      <MainMetricsGrid
        procedures={metrics.procedures}
        totalPatients={metrics.totalPatients}
        activePatients={metrics.activePatients}
        ninaActivation={metrics.ninaActivation}
      />

      <EngagementMetrics
        responseRate24h={metrics.responseRate24h}
        spontaneousContacts={metrics.spontaneousContacts}
        humanActivations={metrics.humanActivations}
        satisfactionClicks={metrics.satisfactionClicks}
      />

      <RecentActivity />
    </div>
  );
};

export default Dashboard;
