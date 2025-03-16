
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { Team, Job } from '../types';

export function useCalendarState() {
  const [sharedDate, setSharedDate] = useState<Date | undefined>(new Date());
  const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const [teams, setTeams] = useState<Team[]>([{
    name: 'Red Team',
    color: 'red'
  }, {
    name: 'Blue Team',
    color: 'blue'
  }, {
    name: 'Green Team',
    color: 'green'
  }]);

  useEffect(() => {
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

  return {
    sharedDate,
    setSharedDate,
    teams,
    setTeams,
    integrationDialogOpen,
    setIntegrationDialogOpen,
    handleAddTeam,
    handleJobAssign,
    handleCalendarIntegration,
    redirectToCalendarProvider,
  };
}
