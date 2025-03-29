
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export function TeamCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { teamColor = "red" } = useParams();
  const navigate = useNavigate();
  
  const teamName = 
    teamColor === "red" ? "Team Red" : 
    teamColor === "blue" ? "Team Blue" : 
    teamColor === "green" ? "Team Green" : "Team";
  
  return (
    <BaseLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-md border border-gray-300"
            onClick={() => navigate('/calendar')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{teamName} Calendar</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TeamCalendar 
            date={date}
            setDate={setDate}
            teamColor={teamColor}
            assignedJobs={[]}
          />
        </div>
      </div>
    </BaseLayout>
  );
}

export default TeamCalendarPage;
