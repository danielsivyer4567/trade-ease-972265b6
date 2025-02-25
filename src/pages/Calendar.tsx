
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamCalendar } from '@/components/team/TeamCalendar';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { Job } from '@/types/job';

export default function Calendar() {
  const [sharedDate, setSharedDate] = React.useState<Date | undefined>(new Date());
  const [teams, setTeams] = React.useState([
    { name: 'Red Team', color: 'red' },
    { name: 'Blue Team', color: 'blue' },
    { name: 'Green Team', color: 'green' }
  ]);

  const mockJobs: Job[] = [{
    id: "1",
    customer: "John Smith",
    type: "Plumbing",
    status: "ready",
    date: "2024-03-15",
    location: [151.2093, -33.8688],
    jobNumber: "PLM-001",
    title: "Water Heater Installation",
    description: "Install new water heater system",
    assignedTeam: "Red Team"
  }, {
    id: "2",
    customer: "Sarah Johnson",
    type: "HVAC",
    status: "in-progress",
    date: "2024-03-14",
    location: [151.2543, -33.8688],
    jobNumber: "HVAC-001",
    title: "HVAC Maintenance",
    description: "Regular maintenance check",
    assignedTeam: "Blue Team"
  }];

  const getColorForTeam = (teamIndex: number) => {
    const baseColors = [
      'red', 'blue', 'green', 'purple', 'orange', 'pink', 'teal', 'yellow', 'indigo', 'rose'
    ];
    
    const colorIndex = teamIndex % baseColors.length;
    return baseColors[colorIndex];
  };

  const handleAddTeam = () => {
    const newTeamIndex = teams.length;
    const newColor = getColorForTeam(newTeamIndex);
    const newTeam = {
      name: `Team ${newTeamIndex + 1}`,
      color: newColor
    };
    
    setTeams([...teams, newTeam]);
    toast.success(`Added ${newTeam.name} with ${newColor} color scheme`);
  };

  const handleJobAssign = (jobId: string, date: Date) => {
    toast.success(`Job ${jobId} has been scheduled for ${format(date, 'PPP')}`);
  };

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 animate-fadeIn p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Team Calendars</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddTeam}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.name}>
              <CardHeader>
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <CardDescription>View and manage team schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <TeamCalendar 
                  date={sharedDate} 
                  setDate={setSharedDate} 
                  teamColor={team.color}
                  onJobAssign={handleJobAssign}
                  assignedJobs={mockJobs.filter(job => job.assignedTeam === team.name)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
