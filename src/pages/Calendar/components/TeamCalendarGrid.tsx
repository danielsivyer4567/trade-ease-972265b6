
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamCalendar } from '@/components/team/TeamCalendar';
import type { Team } from '../types';
import type { Job } from '@/types/job';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface TeamCalendarGridProps {
  teams: Team[];
  sharedDate: Date | undefined;
  setSharedDate: (date: Date | undefined) => void;
  onJobAssign: (jobId: string, date: Date) => void;
}

export function TeamCalendarGrid({ 
  teams, 
  sharedDate, 
  setSharedDate, 
  onJobAssign 
}: TeamCalendarGridProps) {
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
              onJobAssign={onJobAssign} 
              assignedJobs={jobs.filter(job => 
                job.assignedTeam?.toLowerCase() === team.name.toLowerCase()
              )} 
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
