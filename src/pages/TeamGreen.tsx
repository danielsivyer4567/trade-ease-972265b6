
import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { TeamHeader } from '@/components/team/TeamHeader';
import { TeamCalendar } from '@/components/team/TeamCalendar';
import { JobsOverview } from '@/components/team/JobsOverview';
import { DocumentUpload } from '@/components/team/DocumentUpload';
import { DocumentSummary } from '@/components/team/DocumentSummary';
import { TeamTimeOff } from '@/components/team/TeamTimeOff';
import { IncidentReports } from '@/components/team/IncidentReports';

export default function TeamGreen() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [documentCount, setDocumentCount] = React.useState({
    insurance: 0,
    general: 0,
    jobRelated: 0
  });
  const [jobNumber, setJobNumber] = React.useState('');
  const [selectedTeamMember, setSelectedTeamMember] = React.useState('');
  const [incidentReport, setIncidentReport] = React.useState({
    type: '',
    description: '',
    location: '',
    date: new Date(),
    severity: ''
  });

  const teamMembers = [{
    id: '1',
    name: 'John Smith'
  }, {
    id: '2',
    name: 'Sarah Johnson'
  }, {
    id: '3',
    name: 'Mike Williams'
  }, {
    id: '4',
    name: 'Emily Brown'
  }];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => {
    if (event.target.files && event.target.files.length > 0) {
      setDocumentCount(prev => ({
        ...prev,
        [type]: prev[type] + event.target.files!.length
      }));
    }
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Incident Report Submitted:', incidentReport);
    setIncidentReport({
      type: '',
      description: '',
      location: '',
      date: new Date(),
      severity: ''
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <TeamHeader teamName="Green Team" />
        
        <TeamCalendar 
          date={date}
          setDate={setDate}
          teamColor="green"
        />

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
              teamColor="green"
            />
          </div>
        </section>

        <TeamTimeOff teamColor="green" />

        <IncidentReports
          teamColor="green"
          incidentReport={incidentReport}
          setIncidentReport={setIncidentReport}
          handleIncidentSubmit={handleIncidentSubmit}
        />
      </div>
    </AppLayout>
  );
}
