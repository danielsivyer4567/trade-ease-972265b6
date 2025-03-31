
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeamCalendar } from '@/components/team/TeamCalendar';
import { Expand } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types/job';

interface TeamCalendarGridProps {
  teams?: { name: string; color: string }[];
  onJobAssign?: (jobId: string, date: Date) => void;
  assignedJobs?: Record<string, Job[]>;
}

export function TeamCalendarGrid({ 
  teams = [
    { name: "Team Red", color: "red" },
    { name: "Team Blue", color: "blue" },
    { name: "Team Green", color: "green" }
  ], 
  onJobAssign, 
  assignedJobs = {} 
}: TeamCalendarGridProps) {
  const navigate = useNavigate();
  const [date] = useState<Date>(new Date());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <Card key={team.color} className="overflow-hidden">
          <CardHeader className="p-4 flex flex-row justify-between items-center bg-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-${team.color}-500`}></div>
              {team.name}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => navigate(`/calendar/team/${team.color}`)}
            >
              <Expand className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <TeamCalendar
              date={date}
              setDate={() => {}}
              teamColor={team.color}
              assignedJobs={assignedJobs[team.color] || []}
              miniView={true}
              onJobAssign={onJobAssign}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
