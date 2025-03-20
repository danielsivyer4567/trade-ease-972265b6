
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamCalendar } from '@/components/team/TeamCalendar';
import type { Team } from '../types';
import type { Job } from '@/types/job';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface TeamCalendarGridProps {
  teams: Team[];
  onJobAssign: (jobId: string, date: Date) => void;
}

export function TeamCalendarGrid({ 
  teams, 
  onJobAssign 
}: TeamCalendarGridProps) {
  // Create separate date states for each team
  const [teamDates, setTeamDates] = useState<Record<string, Date | undefined>>(() => {
    const initialDates: Record<string, Date | undefined> = {};
    teams.forEach(team => {
      initialDates[team.name] = new Date();
    });
    return initialDates;
  });

  // Handler to update a specific team's date
  const updateTeamDate = (teamName: string, date: Date | undefined) => {
    setTeamDates(prev => ({
      ...prev,
      [teamName]: date
    }));
  };
  
  // Fetch jobs from Supabase
  const { data: jobs = [] } = useQuery({
    queryKey: ['teamJobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*');
        
      if (error) {
        console.error('Error fetching jobs:', error);
        return [];
      }
      
      return data.map(job => ({
        id: job.id,
        customer: job.customer,
        type: job.type,
        status: job.status,
        date: job.date,
        location: job.location,
        jobNumber: job.job_number,
        title: job.title,
        description: job.description,
        assignedTeam: job.assigned_team
      }));
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team, index) => {
        // Filter jobs for this specific team only
        const teamJobs = jobs.filter(job => 
          job.assignedTeam?.toLowerCase() === team.name.toLowerCase()
        );
        
        return (
          <Card key={`${team.name}-${index}`}>
            <CardHeader className="bg-slate-200">
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <CardDescription>View and manage team schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamCalendar 
                date={teamDates[team.name]} 
                setDate={(date) => updateTeamDate(team.name, date)}
                teamColor={team.color} 
                onJobAssign={onJobAssign} 
                assignedJobs={teamJobs} 
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
