
import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import CleaningRequiredJobs from "@/components/dashboard/CleaningRequiredJobs";
import { QuickTabs } from "@/components/ui/QuickTabs";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Hammer, CalendarDays } from "lucide-react";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<string>("red");
  
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

          {/* Team Calendars Overview Section */}
          <div className="rounded-xl animate-slideUp" style={{ animationDelay: "0.15s" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Team Calendars Overview</h2>
              <Button 
                variant="outline" 
                onClick={() => navigate("/calendar")}
                className="flex items-center gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Full Calendar</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.name} className="p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-${team.color}-500 flex items-center justify-center`}>
                        <Hammer className="w-4 h-4 text-white" />
                      </div>
                      <h3 className={`text-lg font-medium text-${team.color}-700`}>{team.name}</h3>
                    </div>
                    <Link 
                      to={team.path}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View details
                    </Link>
                  </div>
                  
                  <div className="overflow-hidden rounded-lg border">
                    <TeamCalendar 
                      date={new Date()} 
                      setDate={() => {}} 
                      teamColor={team.color.toLowerCase()} 
                      miniView={true} 
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Dashboards Section with cards */}
          <div className="rounded-xl animate-slideUp" style={{ animationDelay: "0.25s" }}>
            <h2 className="text-xl font-semibold mb-4">Team Dashboards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teams.map((team) => (
                <Link 
                  key={`dashboard-${team.name}`} 
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
              style={{ animationDelay: "0.35s" }}
            >
              <RecentActivity />
            </div>
            <div
              className="rounded-xl animate-slideUp"
              style={{ animationDelay: "0.45s" }}
            >
              <UpcomingJobs />
            </div>
          </div>

          <div
            className="rounded-xl animate-slideUp"
            style={{ animationDelay: "0.55s" }}
          >
            <CleaningRequiredJobs />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
