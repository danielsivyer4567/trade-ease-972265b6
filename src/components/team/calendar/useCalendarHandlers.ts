
import { useNavigate } from 'react-router-dom';
import { format, subWeeks, addWeeks } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/types/job';
import { useState } from 'react';
import { RainData } from './WeatherDisplay';

interface CalendarHandlerProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setSelectedDay: React.Dispatch<React.SetStateAction<{date: Date, jobs: Job[]} | null>>;
  weatherData?: RainData[];
  mockJobsData?: Job[];
}

export const useCalendarHandlers = (props?: CalendarHandlerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDayJobs, setSelectedDayJobs] = useState<{ date: Date, jobs: Job[] } | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetDate: Date) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId) {
      toast({
        title: "Job Rescheduled",
        description: `Job has been rescheduled to ${format(targetDate, 'PPP')}`
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleJobClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${jobId}`);
  };

  const handleDayClick = (date: Date, jobs: Job[]) => {
    if (props?.setSelectedDay) {
      props.setSelectedDay({ date, jobs });
    } else {
      setSelectedDayJobs({ date, jobs });
    }
  };

  const handlePrevWeek = () => {
    if (props?.setCurrentDate && props?.currentDate) {
      props.setCurrentDate(subWeeks(props.currentDate, 1));
    }
  };
  
  const handleNextWeek = () => {
    if (props?.setCurrentDate && props?.currentDate) {
      props.setCurrentDate(addWeeks(props.currentDate, 1));
    }
  };
  
  const handleToday = () => {
    if (props?.setCurrentDate) {
      props.setCurrentDate(new Date());
    }
  };

  const closeDayDetail = () => {
    if (props?.setSelectedDay) {
      props.setSelectedDay(null);
    } else {
      setSelectedDayJobs(null);
    }
  };

  return {
    handleDrop,
    handleDragOver,
    handleJobClick,
    handleDayClick,
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    selectedDayJobs,
    closeDayDetail
  };
};
