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
import { Camera, Share2, MapPin, Clock, Calendar, Briefcase, Users, Package, SunMedium, FileText } from 'lucide-react';
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
          
          {/* Detailed Job Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address and Location Details */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium">{job.address || "123 Main Street, Suite 456"}</div>
                  <div className="text-sm">{job.city || "Springfield"}, {job.state || "ST"} {job.zipCode || "12345"}</div>
                  <div className="text-sm mt-2">
                    Property Type: <span className="font-medium">{job.propertyType || "Commercial"}</span>
                  </div>
                  <div className="text-sm">
                    Access Instructions: <span className="font-medium">{job.accessInstructions || "Use side entrance. Gate code: 1234"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Schedule and Timing */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Start Date</div>
                      <div className="font-medium">{job.startDate || "June 15, 2023"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">End Date</div>
                      <div className="font-medium">{job.endDate || "June 18, 2023"}</div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <div className="text-sm">
                      Duration: <span className="font-medium">{job.duration || "3 days"}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    <SunMedium className="h-4 w-4 mr-2 text-primary" />
                    <div className="text-sm">
                      Weather Forecast: <span className="font-medium">{job.weatherForecast || "Sunny, 75°F, 10% chance of rain"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Type and Description */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-primary" />
                  Job Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Type of Work</div>
                  <div className="font-medium">{job.workType || "Commercial Renovation"}</div>
                  <div className="text-sm mt-2">
                    Scope: <span className="font-medium">{job.scope || "Complete interior renovation including electrical, plumbing, and HVAC"}</span>
                  </div>
                  <div className="text-sm">
                    Square Footage: <span className="font-medium">{job.squareFootage || "2,500 sq ft"}</span>
                  </div>
                  <div className="text-sm">
                    Budget: <span className="font-medium">${job.budget || "45,000"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Allocation */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Team Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Assigned Team</div>
                  <div className="font-medium">{job.teamName || "Alpha Construction Team"}</div>
                  <div className="text-sm mt-2">
                    Team Lead: <span className="font-medium">{job.teamLead || "John Smith"}</span>
                  </div>
                  <div className="text-sm">
                    Members:
                  </div>
                  <div className="text-sm pl-4">
                    {job.teamMembers ? job.teamMembers.join(", ") : "- Michael Johnson (Electrician)\n- Sarah Williams (Plumber)\n- David Brown (HVAC Specialist)\n- Emily Davis (Project Manager)"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Materials */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <Package className="h-4 w-4 mr-2 text-primary" />
                  Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Required Materials</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {job.materials ? (
                      job.materials.map((material, index) => (
                        <div key={index} className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2" />
                          <div className="text-sm">{material}</div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2" />
                          <div className="text-sm">Drywall (25 sheets)</div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2" />
                          <div className="text-sm">Paint (10 gallons)</div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2" />
                          <div className="text-sm">Copper piping (200 ft)</div>
                        </div>
                        <div className="flex items-start">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-primary mr-2" />
                          <div className="text-sm">Electrical wiring (500 ft)</div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-sm mt-2">
                    Material Total Cost: <span className="font-medium">${job.materialCost || "12,500"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Additional Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Special Instructions</div>
                  <div className="text-sm">
                    {job.specialInstructions || "Customer requires all work to be performed after business hours (6PM-6AM). Noise restrictions apply after 10PM. All debris must be removed daily. Parking available in rear lot only."}
                  </div>
                  <div className="text-sm mt-2">
                    Safety Requirements: <span className="font-medium">{job.safetyRequirements || "Hard hats and safety vests required at all times. Daily safety briefing at 6:00 PM."}</span>
                  </div>
                  <div className="text-sm">
                    Quality Standards: <span className="font-medium">{job.qualityStandards || "All work must meet or exceed local building codes. Client inspection required before final approval."}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
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
