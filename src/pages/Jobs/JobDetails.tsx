
import { useParams } from 'react-router-dom';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';
import { useState } from 'react';
import type { Job } from '@/types/job';

const mockJobs: Job[] = [{
  id: "1",
  customer: "John Smith",
  type: "Plumbing",
  status: "ready",
  date: "2024-03-15",
  location: [151.2093, -33.8688],
  jobNumber: "PLM-001",
  title: "Water Heater Installation",
  description: "Install new water heater system",
  assignedTeam: "Red Team"
}];

export function JobDetails() {
  const { id } = useParams();
  const job = mockJobs.find(j => j.id === id) || mockJobs[0];
  const [jobTimer, setJobTimer] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Array<{timestamp: number; coords: [number, number]}>>([]);
  const [jobNotes, setJobNotes] = useState("");
  const [tabNotes, setTabNotes] = useState<Record<string, string>>({});
  const isManager = true;

  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleBreakToggle = () => {
    setIsOnBreak(!isOnBreak);
  };

  return (
    <div className="space-y-6 p-6">
      <JobHeader job={job} />
      <JobTabs
        job={job}
        isManager={isManager}
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
  );
}
