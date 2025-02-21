
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { WeatherChart } from "@/components/team/WeatherChart";
import { DocumentSummary } from "@/components/team/DocumentSummary";
import { DocumentUpload } from "@/components/team/DocumentUpload";
import { IncidentReports } from "@/components/team/IncidentReports";
import { JobsOverview } from "@/components/team/JobsOverview";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { TeamHeader } from "@/components/team/TeamHeader";
import { TeamTimeOff } from "@/components/team/TeamTimeOff";

export default function TeamRed() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [highlightedDate, setHighlightedDate] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [date, setDate] = useState(new Date());
  const [incidentReport, setIncidentReport] = useState({ title: "", description: "" });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleRainyDateHighlight = (date: string) => {
    setHighlightedDate(date);
  };

  const handleIncidentSubmit = (data: any) => {
    console.log("Incident submitted:", data);
  };

  const teamMembers = ["John Doe", "Jane Smith", "Bob Johnson"];
  const teamColor = "red";
  const jobNumber = "JOB-001";
  const documentCount = 5;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <TeamHeader label="Red Team" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <JobsOverview />
            <DocumentUpload 
              teamMembers={teamMembers}
              selectedTeamMember={selectedTeamMember}
              setSelectedTeamMember={setSelectedTeamMember}
              jobNumber={jobNumber}
              teamColor={teamColor}
              onUpload={() => {}}
            />
          </div>
          
          <div className="space-y-6">
            <TeamCalendar
              date={date}
              setDate={setDate}
              teamColor={teamColor}
            />
            <TeamTimeOff teamColor={teamColor} />
          </div>
          
          <div className="space-y-6">
            <IncidentReports
              teamColor={teamColor}
              incidentReport={incidentReport}
              setIncidentReport={setIncidentReport}
              handleIncidentSubmit={handleIncidentSubmit}
            />
            <DocumentSummary
              documentCount={documentCount}
              teamColor={teamColor}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
          
          <WeatherChart
            selectedDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            onRainyDateHighlight={handleRainyDateHighlight}
          />
        </div>
      </div>
    </AppLayout>
  );
}
