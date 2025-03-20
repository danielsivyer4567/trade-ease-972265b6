
import { format } from 'date-fns';
import { Job } from '@/types/job';

export const getJobsForDate = (date: Date, jobs: Job[] = []) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  return jobs.filter(job => {
    try {
      const jobDate = new Date(job.date);
      return format(jobDate, 'yyyy-MM-dd') === dateStr;
    } catch (e) {
      console.error('Invalid date in job:', job);
      return false;
    }
  });
};
