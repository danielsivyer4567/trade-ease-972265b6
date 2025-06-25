import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Job, JobStep } from '@/types/job';

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
    const fetchJob = async () => {
      if (!id) {
        setError("No job ID provided");
        setLoading(false);
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
<<<<<<< HEAD
              boundaries: data.boundaries,
              address: data.address,
              city: data.city,
              state: data.state,
              zipCode: data.zip_code
=======
              boundaries: data.boundaries
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
            };
            setJob(transformedJob);
            setError(null);
            setLoading(false);
            return;
          } else if (error) {
            setError("Failed to fetch job from database");
          }
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
      
      // If we get here, the job wasn't found
      setError("Job not found");
      toast.error("Job not found");
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  return { job, loading, error };
};
