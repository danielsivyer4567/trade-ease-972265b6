import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamCalendar } from '@/components/team/TeamCalendar';
import { Plus, ArrowLeft, Calendar as CalendarIcon, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { Job } from '@/types/job';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

export default function Calendar() {
  const [sharedDate, setSharedDate] = React.useState<Date | undefined>(new Date());
  const [integrationDialogOpen, setIntegrationDialogOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const [teams, setTeams] = React.useState([{
    name: 'Red Team',
    color: 'red'
  }, {
    name: 'Blue Team',
    color: 'blue'
  }, {
    name: 'Green Team',
    color: 'green'
  }]);

  React.useEffect(() => {
    const newTeamData = localStorage.getItem('newTeam');
    if (newTeamData) {
      try {
        const newTeam = JSON.parse(newTeamData);
        if (!teams.some(team => team.name === newTeam.name)) {
          setTeams(prevTeams => [...prevTeams, newTeam]);
          toast.success(`${newTeam.name} has been added to your calendar view`);
        }
        localStorage.removeItem('newTeam');
      } catch (error) {
        console.error('Error parsing new team data:', error);
      }
    }
  }, [teams]);

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
    const baseColors = ['red', 'blue', 'green', 'purple', 'orange', 'pink', 'teal', 'yellow', 'indigo', 'rose'];
    const colorIndex = teamIndex % baseColors.length;
    return baseColors[colorIndex];
  };

  const handleAddTeam = () => {
    navigate('/team-new');
  };

  const handleJobAssign = (jobId: string, date: Date) => {
    toast.success(`Job ${jobId} has been scheduled for ${format(date, 'PPP')}`);
  };

  const handleCalendarIntegration = () => {
    setIntegrationDialogOpen(true);
  };

  const redirectToCalendarProvider = (provider: string) => {
    setIntegrationDialogOpen(false);
    navigate(`/calendar/sync?platform=${provider}&team=All Teams&action=sync`);
  };

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 animate-fadeIn p-4 md:p-6 py-[126px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-md border border-gray-300 px-3 py-1 text-slate-950 bg-slate-400 hover:bg-slate-300">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Team Calendars</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCalendarIntegration} className="text-slate-950 bg-slate-300 hover:bg-slate-200">
              <Link className="w-4 h-4 mr-2" />
              Connect Calendars
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddTeam} className="text-slate-950 bg-slate-300 hover:bg-slate-200 px-[64px] text-left">
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <Card key={`${team.name}-${index}`}>
              <CardHeader className="bg-slate-200">
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

      <Dialog open={integrationDialogOpen} onOpenChange={setIntegrationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Connect Calendar
            </DialogTitle>
            <DialogDescription>
              Sync your team calendars with external calendar services
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Button 
              className="flex items-center justify-start gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
              onClick={() => redirectToCalendarProvider('Google Calendar')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="h-5 w-5" />
              Connect with Google Calendar
            </Button>
            
            <Button 
              className="flex items-center justify-start gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
              onClick={() => redirectToCalendarProvider('Apple Calendar')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/IOS_Calendar_Icon.png" alt="Apple Calendar" className="h-5 w-5" />
              Connect with Apple Calendar
            </Button>
            
            <Button 
              className="flex items-center justify-start gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
              onClick={() => redirectToCalendarProvider('Microsoft Outlook')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Microsoft Outlook" className="h-5 w-5" />
              Connect with Outlook Calendar
            </Button>
            
            <Button 
              className="flex items-center justify-start gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100" 
              onClick={() => {
                setIntegrationDialogOpen(false);
                navigate('/settings/integrations');
              }}
            >
              <Plus className="h-5 w-5" />
              Add Other Calendar
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIntegrationDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
