
import { ScheduledDate } from "./ScheduledDate";
import { JobLocation } from "./JobLocation";
import type { Job } from "@/types/job";

interface RightColumnProps {
  job: Job;
}

export const RightColumn = ({ job }: RightColumnProps) => {
  return (
    <div className="space-y-5">
      <ScheduledDate job={job} />
      <JobLocation job={job} />
    </div>
  );
};
