
import { AppLayout } from "@/components/ui/AppLayout";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import CleaningRequiredJobs from "@/components/dashboard/CleaningRequiredJobs";

export default function Index() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <JobSiteMap />
          
          <KeyStatistics />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <UpcomingJobs />
          </div>
          
          <CleaningRequiredJobs />
        </div>
      </div>
    </AppLayout>
  );
}
