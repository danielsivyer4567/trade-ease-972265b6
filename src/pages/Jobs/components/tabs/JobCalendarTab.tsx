
import { TabsContent } from "@/components/ui/tabs";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import type { Job } from "@/types/job";
import { useState } from "react";

interface JobCalendarTabProps {
  job: Job;
}

export const JobCalendarTab = ({ job }: JobCalendarTabProps) => {
  const [date, setDate] = useState<Date | undefined>(job.date ? new Date(job.date) : undefined);

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
          />
        </div>
      </div>
    </TabsContent>
  );
};
