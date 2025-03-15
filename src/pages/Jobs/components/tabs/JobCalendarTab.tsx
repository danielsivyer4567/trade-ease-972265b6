
import { TabsContent } from "@/components/ui/tabs";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import type { Job } from "@/types/job";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  return (
    <TabsContent value="calendar" className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Job Schedule</h3>
          <TeamCalendar
            date={date}
            setDate={setDate}
            teamColor={job.assignedTeam === 'Red Team' ? 'red' : job.assignedTeam === 'Blue Team' ? 'blue' : 'green'}
            assignedJobs={[job]}
            onJobAssign={handleJobAssign}
          />
        </div>
      </div>
    </TabsContent>
  );
};
