
import { AppLayout } from "@/components/ui/AppLayout";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import CleaningRequiredJobs from "@/components/dashboard/CleaningRequiredJobs";

export default function Index() {
  return (
    <AppLayout>
      <div className="p-6 space-y-8 animate-fadeIn">
        <div className="grid grid-cols-1 gap-8">
          <div className="glass-effect p-4 rounded-xl animate-slideUp">
            <JobSiteMap />
          </div>
          
          <div className="glass-effect p-4 rounded-xl animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <KeyStatistics />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-effect p-4 rounded-xl animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <RecentActivity />
            </div>
            <div className="glass-effect p-4 rounded-xl animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <UpcomingJobs />
            </div>
          </div>
          
          <div className="glass-effect p-4 rounded-xl animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <CleaningRequiredJobs />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
