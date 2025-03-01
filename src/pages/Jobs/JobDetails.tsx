
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';
import { Job } from '@/types/job';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [jobNotes, setJobNotes] = useState('');
  const [tabNotes, setTabNotes] = useState<Record<string, string>>({});
  const [jobTimer, setJobTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Array<{timestamp: number; coords: [number, number]}>>([]);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  
  // Create a job object with the id and other required properties to pass to the components
  const job: Job = {
    id: id || '',
    customer: 'Unknown Customer',
    type: 'General',
    status: 'ready', // Using a valid status from the Job type
    date: new Date().toISOString(),
    location: [0, 0], // Default location coordinates
    jobNumber: 'JOB-' + (id || '000'),
    title: 'New Job',
    address: 'No address provided'
  };

  const handleTimerToggle = () => {
    setIsTimerRunning(prev => !prev);
  };

  const handleBreakToggle = () => {
    setIsOnBreak(prev => !prev);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <JobHeader job={job} />
        <JobTabs 
          job={job}
          isManager={true}
          jobTimer={jobTimer}
          jobNotes={jobNotes}
          setJobNotes={setJobNotes}
          tabNotes={tabNotes}
          setTabNotes={setTabNotes}
          locationHistory={locationHistory}
          hasLocationPermission={hasLocationPermission}
          handleTimerToggle={handleTimerToggle}
          handleBreakToggle={handleBreakToggle}
          isTimerRunning={isTimerRunning}
          isOnBreak={isOnBreak}
        />
      </div>
    </AppLayout>
  );
};

export default JobDetails;
