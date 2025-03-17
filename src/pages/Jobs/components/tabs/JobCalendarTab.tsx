
import { TabsContent } from "@/components/ui/tabs";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import type { Job } from "@/types/job";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CalendarDays } from "lucide-react";

interface JobCalendarTabProps {
  job: Job;
}

export const JobCalendarTab = ({ job }: JobCalendarTabProps) => {
  const [date, setDate] = useState<Date | undefined>(job.date ? new Date(job.date) : undefined);
  const navigate = useNavigate();

  const handleJobAssign = (jobId: string, date: Date) => {
    // Navigate to the job details page when a job is clicked
    navigate(`/jobs/${jobId}`);
  };

  const getTeamColor = (teamName: string | undefined) => {
    if (!teamName) return 'gray';
    
    if (teamName.toLowerCase().includes('red')) return 'red';
    if (teamName.toLowerCase().includes('blue')) return 'blue';
    if (teamName.toLowerCase().includes('green')) return 'green';
    
    return 'gray';
  };

  return (
    <TabsContent value="calendar" className="space-y-4">
      {job.date_undecided ? (
        <Alert>
          <CalendarDays className="h-4 w-4" />
          <AlertTitle>No scheduled date</AlertTitle>
          <AlertDescription>
            This job doesn't have a scheduled date yet. Add a date to see it on the calendar.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Job Schedule</h3>
            <TeamCalendar
              date={date}
              setDate={setDate}
              teamColor={getTeamColor(job.assignedTeam)}
              assignedJobs={[job]}
              onJobAssign={handleJobAssign}
            />
          </div>
        </div>
      )}
    </TabsContent>
  );
};
