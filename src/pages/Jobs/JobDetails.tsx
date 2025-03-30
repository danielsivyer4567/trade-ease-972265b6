
import { useParams } from 'react-router-dom';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';
import { useState } from 'react';
import { DocumentApproval } from './components/document-approval/DocumentApproval';
import { useJobTimer } from './hooks/useJobTimer';
import { useJobLocation } from './hooks/useJobLocation';
import { useJobFinancialData } from './hooks/useJobFinancialData';
import { AppLayout } from '@/components/ui/AppLayout';
import { JobsHeader } from './components/JobsHeader';
import { JobLoadingState } from './components/JobLoadingState';
import { JobMapView } from './components/JobMapView';
import { useJobData } from './hooks/useJobData';
import { JobStepProgress } from '@/components/dashboard/JobStepProgress';
import { Card } from '@/components/ui/card';

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [jobNotes, setJobNotes] = useState("");
  const isManager = true;
  
  const { job, loading } = useJobData(id);
  
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
  
  const handleTimerToggle = () => {
    locationHandleTimerToggle(isTimerRunning, setIsTimerRunning);
  };
  
  if (loading) {
    return <JobLoadingState />;
  }
  
  if (!job) {
    return <JobLoadingState isError />;
  }
  
  return (
    <AppLayout>
      <div className="container-responsive mx-auto">
        <JobsHeader navigateTo="/jobs" />
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-7xl mx-auto pb-24 bg-slate-200">
          {/* Job Progress Steps above map */}
          <Card className="bg-white shadow-sm py-3 px-3 sm:px-6">
            <JobStepProgress />
          </Card>
          
          <JobMapView job={job} />

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
            <div className="mt-8 mb-8">
              <DocumentApproval 
                jobId={job.id} 
                onFinancialDataExtracted={handleFinancialDataExtracted} 
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
