
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { DocumentSummary } from "@/components/team/DocumentSummary";
import { DocumentUpload } from "@/components/team/DocumentUpload";
import { IncidentReports } from "@/components/team/IncidentReports";
import { JobsOverview } from "@/components/team/JobsOverview";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { TeamHeader } from "@/components/team/TeamHeader";
import { TeamTimeOff } from "@/components/team/TeamTimeOff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamMember {
  id: string;
  name: string;
}

export default function TeamRed() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [documentCount, setDocumentCount] = useState({
    insurance: 0,
    general: 0,
    jobRelated: 0
  });
  const [incidentReport, setIncidentReport] = useState({
    type: "",
    description: "",
    location: "",
    date: new Date(),
    severity: ""
  });

  const teamMembers: TeamMember[] = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" }
  ];

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Incident Report Submitted:', incidentReport);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => {
    if (event.target.files && event.target.files.length > 0) {
      setDocumentCount(prev => ({
        ...prev,
        [type]: prev[type] + event.target.files!.length
      }));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <TeamHeader teamName="Red Team" />
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Team Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <TeamCalendar 
                date={date}
                setDate={setDate}
                teamColor="red"
              />
            </div>
          </CardContent>
        </Card>

        <JobsOverview />

        <section>
          <h2 className="text-xl font-semibold mb-4 text-zinc-950">Document Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentUpload
              teamMembers={teamMembers}
              selectedTeamMember={selectedTeamMember}
              setSelectedTeamMember={setSelectedTeamMember}
              jobNumber={jobNumber}
              setJobNumber={setJobNumber}
              handleFileUpload={handleFileUpload}
            />
            <DocumentSummary
              documentCount={documentCount}
              teamColor="red"
            />
          </div>
        </section>

        <TeamTimeOff teamColor="red" />

        <IncidentReports
          teamColor="red"
          incidentReport={incidentReport}
          setIncidentReport={setIncidentReport}
          handleIncidentSubmit={handleIncidentSubmit}
        />
      </div>
    </AppLayout>
  );
}
