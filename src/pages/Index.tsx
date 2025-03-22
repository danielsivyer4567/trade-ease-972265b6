
import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import CleaningRequiredJobs from "@/components/dashboard/CleaningRequiredJobs";
import { QuickTabs } from "@/components/ui/QuickTabs";

export default function Index() {
  return (
    <BaseLayout showQuickTabs={true}>
      <div className=" px-8 space-y-8 animate-fadeIn py-10">
        <div className="grid grid-cols-1 gap-8">
          <div className="flex items-center gap-2">
            <QuickTabs />
          </div>
          <div className=" rounded-xl animate-slideUp">
            <JobSiteMap />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className=" rounded-xl animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <RecentActivity />
            </div>
            <div className=" rounded-xl animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <UpcomingJobs />
            </div>
          </div>

          <div className="rounded-xl animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <CleaningRequiredJobs />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
