import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DocumentApproval } from './components/document-approval/DocumentApproval';
import { useJobTimer } from './hooks/useJobTimer';
import { useJobLocation } from './hooks/useJobLocation';
import { useJobFinancialData } from './hooks/useJobFinancialData';
import { AppLayout } from '@/components/ui/AppLayout';
import { JobLoadingState } from './components/JobLoadingState';
import { useJobData } from './hooks/useJobData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Share2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { usePhotoSharing } from '@/hooks/usePhotoSharing';
import { PhotoSharingModal } from '@/components/sharing/PhotoSharingModal';
import { useOpenInTab } from './hooks/useOpenInTab';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  
  const handleUploadPhotos = () => {
    // Implement photo upload functionality
    toast.info("Photo upload functionality will be implemented");
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

  // Mock photos data based on the image
  const jobPhotos = [
    { id: 1, title: "Main electrical panel before replacement", url: "/images/panel.jpg" },
    { id: 2, title: "Kitchen wiring assessment", url: "/images/kitchen.jpg" },
    { id: 3, title: "Living room outlets inspection", url: "/images/living-room.jpg" },
    { id: 4, title: "Exterior wiring", url: "/images/exterior.jpg" },
    { id: 5, title: "Completed installation", url: "/images/completed.jpg" },
  ];
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">aaaaaaaaaaaaaaaaaaaa</h1>
          <Button variant="outline" onClick={() => navigate('/jobs')}>
            ← Back to Jobs
          </Button>
        </div>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-7 mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Job Number</p>
                      <p>{job.jobNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Customer</p>
                      <p>{job.customer || "Daniel John Snyer Snyer"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p>{job.address || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p>{job.type || "Electrical"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Team</p>
                      <p>{job.assignedTeam || "Not assigned"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p>{job.date || ""}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Job Process Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 italic">No process steps defined for this job</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Plans/Drawings Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Plans/Drawings</CardTitle>
                <Button variant="outline" size="sm" onClick={handleUploadPhotos}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobPhotos.map(photo => (
                    <div key={photo.id} className="overflow-hidden rounded-md border">
                      <div className="aspect-video relative">
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/600x400/gray/white?text=Placeholder";
                          }}
                        />
                      </div>
                      <div className="p-2 text-sm font-medium">{photo.title}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Notes content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Calendar content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timer">
            <Card>
              <CardHeader>
                <CardTitle>Timer</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Timer content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Materials content will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financials">
            <Card>
              <CardHeader>
                <CardTitle>Financials</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Financial information will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Conversation history will go here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
