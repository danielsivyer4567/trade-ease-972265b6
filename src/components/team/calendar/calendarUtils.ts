
import { format } from 'date-fns';
import { Job } from '@/types/job';

// Mock job data for calendar display
export const mockJobsData: Job[] = [
  {
    id: "job-1",
    customer: "John Smith",
    type: "Repair",
    status: "in-progress",
    date: "2024-03-18",
    location: [0, 0],
    jobNumber: "JOB-001",
    title: "Fence Repair",
    description: "Fix broken fence sections",
    assignedTeam: "Red Team"
  },
  {
    id: "job-2",
    customer: "Sarah Johnson",
    type: "Installation",
    status: "ready",
    date: "2024-03-19",
    location: [0, 0],
    jobNumber: "JOB-002",
    title: "New Deck Installation",
    description: "Install new 10x12 deck",
    assignedTeam: "Blue Team"
  },
  {
    id: "job-3",
    customer: "Mike Brown",
    type: "Maintenance",
    status: "to-invoice",
    date: "2024-03-20",
    location: [0, 0],
    jobNumber: "JOB-003",
    title: "Quarterly Maintenance",
    description: "Regular maintenance service",
    assignedTeam: "Green Team"
  }
];

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
