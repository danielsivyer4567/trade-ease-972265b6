
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/job';
import { useState } from 'react';

export const useCalendarHandlers = (onJobAssign?: (jobId: string, date: Date) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDayJobs, setSelectedDayJobs] = useState<{ date: Date, jobs: Job[] } | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetDate: Date) => {
    e.preventDefault();
    
    // Try to get job data from JSON format (for drag from queued jobs)
    const jobDataStr = e.dataTransfer.getData('application/json');
    if (jobDataStr) {
      try {
        const job = JSON.parse(jobDataStr);
        if (job.id && onJobAssign) {
          onJobAssign(job.id, targetDate);
          toast({
            title: "Job Scheduled",
            description: `${job.title || job.type} scheduled for ${format(targetDate, 'PPP')}`
          });
        }
      } catch (error) {
        console.error('Error parsing job data:', error);
      }
    } else {
      // Fallback to jobId format (for existing functionality)
      const jobId = e.dataTransfer.getData('jobId');
      if (jobId && onJobAssign) {
        onJobAssign(jobId, targetDate);
        toast({
          title: "Job Rescheduled",
          description: `Job has been rescheduled to ${format(targetDate, 'PPP')}`
        });
      }
    }
  };

  const handleJobClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${jobId}`);
  };

  const handleDayClick = (date: Date, jobs: Job[]) => {
    setSelectedDayJobs({ date, jobs });
  };

  const closeDayDetail = () => {
    setSelectedDayJobs(null);
  };

  return {
    handleDrop,
    handleJobClick,
    handleDayClick,
    selectedDayJobs,
    closeDayDetail
  };
};
