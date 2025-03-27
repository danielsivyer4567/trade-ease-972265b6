
import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import CleaningRequiredJobs from "@/components/dashboard/CleaningRequiredJobs";
import { QuickTabs } from "@/components/ui/QuickTabs";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Hammer } from "lucide-react";

export default function Index() {
  // Team dashboard data
  const teams = [
    { name: "Team Red", color: "red", path: "/team-red" },
    { name: "Team Blue", color: "blue", path: "/team-blue" },
    { name: "Team Green", color: "green", path: "/team-green" },
  ];

  return (
    <BaseLayout showQuickTabs={true}>
      <div className="px-8 space-y-8 animate-fadeIn py-10">
        <div className="grid grid-cols-1 gap-8">
          <div className="rounded-xl animate-slideUp">
            <JobSiteMap />
          </div>

          {/* Team Dashboards Section */}
          <div className="rounded-xl animate-slideUp" style={{ animationDelay: "0.15s" }}>
            <h2 className="text-xl font-semibold mb-4">Team Dashboards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teams.map((team) => (
                <Link 
                  key={team.name} 
                  to={team.path}
                  className="block hover:scale-105 transition-transform duration-200"
                >
                  <Card className={`p-5 bg-${team.color}-50 border-${team.color}-200 hover:bg-${team.color}-100 transition-colors`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-${team.color}-500 flex items-center justify-center`}>
                        <Hammer className="w-5 h-5 text-white" />
                      </div>
                      <h3 className={`text-lg font-medium text-${team.color}-700`}>{team.name}</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">View team dashboard and schedule</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
              className="rounded-xl animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <RecentActivity />
            </div>
            <div
              className="rounded-xl animate-slideUp"
              style={{ animationDelay: "0.3s" }}
            >
              <UpcomingJobs />
            </div>
          </div>

          <div
            className="rounded-xl animate-slideUp"
            style={{ animationDelay: "0.4s" }}
          >
            <CleaningRequiredJobs />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
