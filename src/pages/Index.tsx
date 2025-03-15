
import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import CleaningRequiredJobs from "@/components/dashboard/CleaningRequiredJobs";

export default function Index() {
  return (
    <BaseLayout showQuickTabs={true}>
      <div className="space-y-8 animate-fadeIn">
        <div className="grid grid-cols-1 gap-8">
          <div className="glass-effect p-4 rounded-xl animate-slideUp">
            <JobSiteMap />
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
    </BaseLayout>
  );
}
