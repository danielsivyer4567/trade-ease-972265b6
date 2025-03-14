import { useParams, useNavigate } from 'react-router-dom';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';
import { useState, useEffect } from 'react';
import type { Job } from '@/types/job';
import { DocumentApproval } from './components/DocumentApproval';
import { useJobTimer } from './hooks/useJobTimer';
import { useJobLocation } from './hooks/useJobLocation';
import { useJobFinancialData } from './hooks/useJobFinancialData';

const mockJobs: Job[] = [
  {
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
  }, {
    id: "2",
    customer: "Sarah Johnson",
    type: "HVAC",
    status: "in-progress",
    date: "2024-03-14",
    location: [151.2543, -33.8688],
    jobNumber: "HVAC-001",
    title: "HVAC Maintenance",
    description: "Regular maintenance check",
    assignedTeam: "Blue Team"
  }, {
    id: "3",
    customer: "Mike Brown",
    type: "Electrical",
    status: "to-invoice",
    date: "2024-03-13",
    location: [151.1943, -33.8788],
    jobNumber: "ELE-001",
    title: "Electrical Panel Upgrade",
    description: "Upgrade main electrical panel",
    assignedTeam: "Green Team"
  }
];

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => j.id === id);
  const [jobNotes, setJobNotes] = useState("");
  const isManager = true;

  const { 
    jobTimer, 
    isTimerRunning, 
    isOnBreak, 
    setIsTimerRunning,
    handleBreakToggle 
  } = useJobTimer();

  const { 
    hasLocationPermission, 
    locationHistory, 
    handleTimerToggle: locationHandleTimerToggle 
  } = useJobLocation();

  const { 
    extractedFinancialData, 
    tabNotes, 
    setTabNotes, 
    handleFinancialDataExtracted 
  } = useJobFinancialData(id);

  useEffect(() => {
    if (!job) {
      navigate('/jobs');
    }
  }, [job, navigate]);

  const handleTimerToggle = () => {
    locationHandleTimerToggle(isTimerRunning, setIsTimerRunning);
  };

  if (!job) {
    return null;
  }

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
        extractedFinancialData={extractedFinancialData}
      />
      
      {isManager && (
        <DocumentApproval 
          jobId={job.id} 
          onFinancialDataExtracted={handleFinancialDataExtracted} 
        />
      )}
    </div>
  );
}
