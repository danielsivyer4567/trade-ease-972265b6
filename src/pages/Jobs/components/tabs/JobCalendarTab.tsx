
import { TabsContent } from "@/components/ui/tabs";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import type { Job } from "@/types/job";

interface JobCalendarTabProps {
  job: Job;
}

export const JobCalendarTab = ({ job }: JobCalendarTabProps) => {
  return (
    <TabsContent value="calendar" className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Job Schedule</h3>
          <TeamCalendar
            teamColor={job.assignedTeam === 'Red Team' ? 'red' : job.assignedTeam === 'Blue Team' ? 'blue' : 'green'}
            assignedJobs={[job]}
          />
        </div>
      </div>
    </TabsContent>
  );
};
