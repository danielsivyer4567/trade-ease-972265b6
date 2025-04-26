import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Job, JobStep } from '@/types/job';
import { mockJobs } from '../data/mockJobs';

// Default job steps if not present in the database
const defaultJobSteps: JobStep[] = [
  {
    id: 1,
    title: 'step 1-',
    tasks: ['-schedule job date', '-allocate staff'],
    isCompleted: false
  },
  {
    id: 2,
    title: 'step 2-',
    tasks: ['-order materials', '-fill out job details', '- management sign off'],
    isCompleted: false
  },
  {
    id: 3,
    title: 'step 3-',
    tasks: ['-start job', '-inductions', '-material count check'],
    isCompleted: false
  },
  {
    id: 4,
    title: 'step 4-',
    tasks: ['- complete job', '- do quality check', '- site clean up', '- add any variations'],
    isCompleted: false
  },
  {
    id: 5,
    title: 'step5-',
    tasks: ['- verify customer is happy', '- customer to sign job is complete as per contract', '-take pics and double check all documents.', '-send invoices with variations'],
    isCompleted: false
  },
  {
    id: 6,
    title: 'step 6',
    tasks: ['- mark invoices paid to finalise job', '-automaticly sync to xero'],
    isCompleted: false
  }
];

export const useJobData = (id: string | undefined) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("JobDetails mounted with id:", id);
    const fetchJob = async () => {
      if (!id) {
        setError("No job ID provided");
        setLoading(false);
        navigate('/jobs');
        return;
      }

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
              date_undecided: data.date_undecided,
              job_steps: data.job_steps || defaultJobSteps,
              boundaries: data.boundaries
            };
            
            setJob(transformedJob);
            setError(null);
            setLoading(false);
            return;
          } else if (error) {
            console.error("Error fetching job from Supabase:", error);
            setError("Failed to fetch job from database");
          }
        }
      } catch (err) {
        console.error("Exception fetching job:", err);
        setError("An unexpected error occurred");
      }
      
      // Fallback to mock data
      const foundJob = mockJobs.find(j => j.id === id);
      console.log("Using mock job data:", foundJob);
      if (foundJob) {
        // Add job steps to the mock job if it doesn't have them
        setJob({
          ...foundJob,
          job_steps: defaultJobSteps,
          boundaries: foundJob.boundaries || [] // Ensure boundaries exists even if undefined in mock data
        });
        setError(null);
      } else {
        setError("Job not found");
        toast.error("Job not found");
        navigate('/jobs');
      }
      setLoading(false);
    };
    
    fetchJob();
  }, [id, navigate]);

  return { job, loading, error };
};
