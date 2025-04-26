import { useParams, useNavigate } from 'react-router-dom';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';
import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { usePhotoSharing } from '@/hooks/usePhotoSharing';
import { PhotoSharingModal } from '@/components/sharing/PhotoSharingModal';
import { useOpenInTab } from './hooks/useOpenInTab';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jobNotes, setJobNotes] = useState("");
  const isManager = true;
  
  const { job, loading, error } = useJobData(id);
  
  // Use the openInTab hook to automatically handle tab management
  const { openInTab } = useOpenInTab();
  
  // Add an effect to handle tab creation when job data is loaded
  useEffect(() => {
    if (job && !loading && id) {
      // Create a tab with the job information
      openInTab(`/jobs/${id}`, job.title || job.jobNumber, `job-${id}`);
    }
  }, [job, loading, id, openInTab]);
  
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
  
  const {
    isPhotoSharingOpen,
    openPhotoSharing,
    closePhotoSharing
  } = usePhotoSharing();
  
  const handleTimerToggle = () => {
    locationHandleTimerToggle(isTimerRunning, setIsTimerRunning);
  };
  
  const handleSendPhotosToCustomer = () => {
    if (!id) return;
    openPhotoSharing('job', id);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error === "Job not found" 
              ? "The job you're looking for doesn't exist or has been removed."
              : error}
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={() => navigate('/jobs')}>
              Back to Jobs
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load job details. Please try again later.
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={() => navigate('/jobs')}>
              Back to Jobs
            </Button>
          </div>
        </Alert>
      </div>
    );
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
          
          <div className="flex justify-end space-x-2">
            <Button 
              size="sm"
              variant="outline"
              onClick={handleSendPhotosToCustomer}
              className="mb-2"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Photos
            </Button>
          </div>

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
      
      <PhotoSharingModal 
        isOpen={isPhotoSharingOpen} 
        onClose={closePhotoSharing} 
        initialSource="job"
        jobId={id}
      />
    </AppLayout>
  );
}
