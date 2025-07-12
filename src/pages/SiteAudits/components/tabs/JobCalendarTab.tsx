import React from 'react';
import { DashboardCalendar } from '@/components/dashboard/DashboardCalendar';
import { useParams } from 'react-router-dom';
import { Job } from '@/types/job';
import { TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CalendarDays } from 'lucide-react';
import { useJobCalendarData } from '../../hooks/useJobCalendarData';

interface JobCalendarTabProps {
  job?: Job;
  teamJobs?: Job[];
}

export function JobCalendarTab({ job, teamJobs = [] }: JobCalendarTabProps) {
  const params = useParams();
  const jobId = params.id || job?.id;
  
  // Use our custom hook for calendar data
  const { jobs, isLoading } = useJobCalendarData({
    jobId,
    job,
    teamId: job?.assignedTeam
  });

  // Calculate the initial date based on the job's date
  const getInitialDate = () => {
    if (job?.date) {
      return new Date(job.date);
    }
    return new Date();
  };

  return (
    <TabsContent value="calendar" className="space-y-4">
      {job?.date_undecided ? (
        <Alert>
          <CalendarDays className="h-4 w-4" />
          <AlertTitle>Job date is currently undecided</AlertTitle>
          <AlertDescription>
            This job's date has not been confirmed yet. 
            Use the calendar to schedule this job.
          </AlertDescription>
        </Alert>
      ) : null}
      
      <div className="rounded-lg border">
        <div className="p-6">
          <h3 className="text-xl font-semibold">Job Schedule</h3>
          <div className="min-h-[600px] w-full">
            <DashboardCalendar 
              jobId={jobId} 
              initialDate={getInitialDate()}
              jobs={jobs.length > 0 ? jobs : teamJobs}
            />
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
