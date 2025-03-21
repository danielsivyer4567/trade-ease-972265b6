import { useParams, useNavigate } from 'react-router-dom';
import { JobHeader } from './components/JobHeader';
import { JobTabs } from './components/JobTabs';
import { useState, useEffect } from 'react';
import type { Job } from '@/types/job';
import { DocumentApproval } from './components/document-approval/DocumentApproval';
import { useJobTimer } from './hooks/useJobTimer';
import { useJobLocation } from './hooks/useJobLocation';
import { useJobFinancialData } from './hooks/useJobFinancialData';
import { useIsMobile } from '@/hooks/use-mobile';
import JobMap from '@/components/JobMap';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AppLayout } from '@/components/ui/AppLayout';
import { JobsHeader } from './components/JobsHeader';

const mockJobs: Job[] = [
  {
    id: "1",
    customer: "John Smith",
    type: "Plumbing",
    status: "ready",
    date: "2024-03-15",
    location: [151.2093, -33.8688],
    jobNumber: "JOB-1234",
    title: "Water Heater Installation",
    description: "Install new water heater system",
    assignedTeam: "Red Team"
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    type: "HVAC",
    status: "in-progress",
    date: "2024-03-14",
    location: [151.2543, -33.8688],
    jobNumber: "JOB-5678",
    title: "HVAC Maintenance",
    description: "Regular maintenance check",
    assignedTeam: "Blue Team"
  },
  {
    id: "3",
    customer: "Mike Brown",
    type: "Electrical",
    status: "to-invoice",
    date: "2024-03-13",
    location: [151.1943, -33.8788],
    jobNumber: "JOB-9012",
    title: "Electrical Panel Upgrade",
    description: "Upgrade main electrical panel",
    assignedTeam: "Green Team"
  }
];

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [jobNotes, setJobNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const isManager = true;
  const isMobile = useIsMobile();
  
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
    console.log("JobDetails mounted with id:", id);
    const fetchJob = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
          if (data && !error) {
            console.log("Job fetched from Supabase:", data);
            
            const transformedJob: Job = {
              id: data.id,
              jobNumber: data.job_number,
              title: data.title,
              customer: data.customer,
              description: data.description || '',
              type: data.type,
              date: data.date,
              status: data.status,
              location: data.location,
              assignedTeam: data.assigned_team,
              date_undecided: data.date_undecided
            };
            
            setJob(transformedJob);
            setLoading(false);
            return;
          } else if (error) {
            console.error("Error fetching job from Supabase:", error);
          }
        }
      } catch (err) {
        console.error("Exception fetching job:", err);
      }
      
      const foundJob = mockJobs.find(j => j.id === id);
      console.log("Using mock job data:", foundJob);
      if (foundJob) {
        setJob(foundJob);
      } else {
        toast.error("Job not found");
        navigate('/jobs');
      }
      setLoading(false);
    };
    
    if (id) {
      fetchJob();
    } else {
      navigate('/jobs');
    }
  }, [id, navigate]);
  
  const handleTimerToggle = () => {
    locationHandleTimerToggle(isTimerRunning, setIsTimerRunning);
  };
  
  if (loading) {
    return (
      <AppLayout>
        <div className="container-responsive mx-auto p-8">
          <div className="text-center">Loading job details...</div>
        </div>
      </AppLayout>
    );
  }
  
  if (!job) {
    return (
      <AppLayout>
        <div className="container-responsive mx-auto p-8">
          <div className="text-center">Job not found. Please try again.</div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container-responsive mx-auto">
        <JobsHeader navigateTo="/jobs" />
        <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-7xl mx-auto pb-24 bg-slate-200">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            <div className="h-[300px] w-full">
              <JobMap 
                center={[job.location[0], job.location[1]]} 
                zoom={15} 
                markers={[{
                  position: [job.location[1], job.location[0]],
                  title: job.title
                }]} 
              />
            </div>
          </div>

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
