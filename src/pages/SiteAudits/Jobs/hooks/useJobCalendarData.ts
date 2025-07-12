import { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { useCalendarStore, CalendarSyncService } from '@/services/CalendarSyncService';
import { useToast } from '@/components/ui/use-toast';

interface UseJobCalendarOptions {
  jobId?: string;
  job?: Job;
  teamId?: string;
}

export function useJobCalendarData({ jobId, job, teamId }: UseJobCalendarOptions = {}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { events, syncWithJobs } = useCalendarStore();
  const { toast } = useToast();

  // Load job data on initial render
  useEffect(() => {
    const loadJobData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // If we already have a job, use it
        if (job) {
          setJobs([job]);
          syncWithJobs([job]);
          return;
        }

        // For a real app, fetch job data from an API
        // This is a mock implementation
        if (jobId) {
          // Simulate fetching a single job
          setTimeout(() => {
            const mockJob: Job = {
              id: jobId,
              title: `Job ${jobId}`,
              status: 'ready',
              date: new Date().toISOString(),
              customer: 'Mock Customer',
              jobNumber: jobId,
              type: 'General'
            };
            setJobs([mockJob]);
            syncWithJobs([mockJob]);
            setIsLoading(false);
          }, 500);
        } else if (teamId) {
          // Simulate fetching team jobs
          setTimeout(() => {
            const mockTeamJobs: Job[] = Array(5).fill(0).map((_, i) => ({
              id: `team-job-${i}`,
              title: `Team Job ${i}`,
              status: 'ready',
              date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
              customer: 'Mock Customer',
              jobNumber: `TJ-${i}`,
              type: 'General',
              assignedTeam: teamId
            }));
            setJobs(mockTeamJobs);
            syncWithJobs(mockTeamJobs);
            setIsLoading(false);
          }, 500);
        } else {
          // No job or team specified, load nothing
          setJobs([]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading job data:', err);
        setError('Failed to load job data');
        toast({
          title: 'Error',
          description: 'Failed to load job calendar data',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    loadJobData();
  }, [jobId, job, teamId, syncWithJobs, toast]);

  // Function to update a job's date
  const updateJobDate = (jobId: string, newDate: Date) => {
    setJobs(prevJobs => {
      const updatedJobs = prevJobs.map(job => {
        if (job.id === jobId) {
          return { ...job, date: newDate.toISOString() };
        }
        return job;
      });
      
      // Sync with calendar store
      syncWithJobs(updatedJobs);
      
      return updatedJobs;
    });
    
    toast({
      title: 'Success',
      description: `Job scheduled for ${newDate.toLocaleDateString()}`,
    });
  };

  return {
    jobs,
    isLoading,
    error,
    updateJobDate,
    events: events.filter(event => event.type === 'job')
  };
} 