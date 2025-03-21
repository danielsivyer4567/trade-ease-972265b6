
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Job } from '@/types/job';
import { mockJobs } from '../data/mockJobs';

export const useJobData = (id: string | undefined) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return { job, loading };
};
