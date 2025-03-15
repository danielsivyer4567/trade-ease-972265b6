
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/job';

export const useCalendarHandlers = (onJobAssign?: (jobId: string, date: Date) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetDate: Date) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId && onJobAssign) {
      onJobAssign(jobId, targetDate);
      toast({
        title: "Job Rescheduled",
        description: `Job has been rescheduled to ${format(targetDate, 'PPP')}`
      });
    }
  };

  const handleJobClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${jobId}`);
  };

  return {
    handleDrop,
    handleJobClick
  };
};
