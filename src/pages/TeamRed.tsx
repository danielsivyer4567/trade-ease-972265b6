
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleRainyDateHighlight = (date: string) => {
    setHighlightedDate(date);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <TeamHeader teamName="Red Team" teamColor="red" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <JobsOverview />
            <DocumentUpload />
          </div>
          
          <div className="space-y-6">
            <TeamCalendar />
            <TeamTimeOff />
          </div>
          
          <div className="space-y-6">
            <IncidentReports />
            <DocumentSummary />
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
