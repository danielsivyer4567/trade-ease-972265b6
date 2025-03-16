
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamCalendar } from '@/components/team/TeamCalendar';
import type { Team } from '../types';
import type { Job } from '@/types/job';

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
  // Mock jobs data with properly typed status values
  const mockJobs: Job[] = [
    {
      id: "1",
      customer: "John Smith",
      type: "Plumbing",
      status: "ready" as const,
      date: "2024-03-15",
      location: [151.2093, -33.8688],
      jobNumber: "PLM-001",
      title: "Water Heater Installation",
      description: "Install new water heater system",
      assignedTeam: "Red Team"
    }, 
    {
      id: "2",
      customer: "Sarah Johnson",
      type: "HVAC",
      status: "in-progress" as const,
      date: "2024-03-14",
      location: [151.2543, -33.8688],
      jobNumber: "HVAC-001",
      title: "HVAC Maintenance",
      description: "Regular maintenance check",
      assignedTeam: "Blue Team"
    }
  ];

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
              assignedJobs={mockJobs.filter(job => job.assignedTeam === team.name)} 
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
