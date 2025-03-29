
import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import CleaningRequiredJobs from "@/components/dashboard/CleaningRequiredJobs";
import { QuickTabs } from "@/components/ui/QuickTabs";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Hammer, CalendarDays, ArrowLeft, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Index() {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<string>("red");
  const [calendarExpanded, setCalendarExpanded] = useState<boolean>(false);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  // Team dashboard data
  const teams = [{
    name: "Team Red",
    color: "red",
    path: "/team-red"
  }, {
    name: "Team Blue",
    color: "blue",
    path: "/team-blue"
  }, {
    name: "Team Green",
    color: "green",
    path: "/team-green"
  }];

  // Recent changes history for undo functionality
  const recentChanges = [{
    id: 1,
    description: "Added team calendars view",
    timestamp: "Today, 10:15 AM"
  }, {
    id: 2,
    description: "Updated team dashboards layout",
    timestamp: "Today, 09:30 AM"
  }, {
    id: 3,
    description: "Changed job site map style",
    timestamp: "Yesterday, 4:45 PM"
  }];
  
  const handleUndoChange = (changeId: number) => {
    // Here you would implement the actual logic to undo specific changes
    console.log(`Undoing change with ID: ${changeId}`);
    // For demonstration purposes, show a toast message
    alert(`Change #${changeId} has been reverted`);
  };

  const toggleTeamCalendar = (teamName: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamName]: !prev[teamName]
    }));
  };
  
  return <BaseLayout showQuickTabs={true}>
      <div className="px-8 space-y-8 animate-fadeIn py-10">
        <div className="grid grid-cols-1 gap-8">
          <div className="rounded-xl animate-slideUp">
            <JobSiteMap />
          </div>

          {/* Navigation and Undo Dropdown */}
          <div className="flex justify-between items-center mb-4 animate-slideUp" style={{
          animationDelay: "0.1s"
        }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white">
                <DropdownMenuLabel>Undo Recent Changes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {recentChanges.map(change => <DropdownMenuItem key={change.id} onClick={() => handleUndoChange(change.id)} className="flex items-center cursor-pointer">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    <div className="flex flex-col">
                      <span className="text-sm">{change.description}</span>
                      <span className="text-xs text-gray-500">{change.timestamp}</span>
                    </div>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Team Calendars Overview Section */}
          <Collapsible 
            open={calendarExpanded} 
            onOpenChange={setCalendarExpanded}
            className="rounded-xl animate-slideUp px-0 mx-[5px]"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Team Calendars Overview</h2>
              
              <div className="flex items-center gap-2">
                {/* Full Calendar button */}
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/calendar")} 
                  className="flex items-center gap-2 text-left"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>Full Calendar</span>
                </Button>
                
                {/* Expand/Collapse button */}
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    {calendarExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            
            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teams.map(team => (
                  <Card key={team.name} className="p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full bg-${team.color}-500 flex items-center justify-center`}>
                          <Hammer className="w-4 h-4 text-white" />
                        </div>
                        <h3 className={`text-lg font-medium text-${team.color}-700`}>{team.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={team.path} className="text-sm text-blue-600 hover:underline">
                          View details
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleTeamCalendar(team.name);
                          }}
                        >
                          {expandedTeams[team.name] ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {expandedTeams[team.name] && (
                      <div className="overflow-hidden rounded-lg border">
                        <TeamCalendar 
                          date={new Date()} 
                          setDate={() => {}} 
                          teamColor={team.color.toLowerCase()} 
                          miniView={true} 
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Team Dashboards Section with cards */}
          <div className="rounded-xl animate-slideUp" style={{
          animationDelay: "0.25s"
        }}>
            <h2 className="text-xl font-semibold mb-4">Team Dashboards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teams.map(team => <Link key={`dashboard-${team.name}`} to={team.path} className="block hover:scale-105 transition-transform duration-200">
                  
                </Link>)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-xl animate-slideUp" style={{
            animationDelay: "0.35s"
          }}>
              <RecentActivity />
            </div>
            <div className="rounded-xl animate-slideUp" style={{
            animationDelay: "0.45s"
          }}>
              <UpcomingJobs />
            </div>
          </div>

          <div className="rounded-xl animate-slideUp" style={{
          animationDelay: "0.55s"
        }}>
            <CleaningRequiredJobs />
          </div>
        </div>
      </div>
    </BaseLayout>;
}
