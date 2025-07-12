
import { ScheduledDate } from "./ScheduledDate";
import { JobLocation } from "./JobLocation";
import type { Job } from "@/types/job";
import { useIsMobile } from "@/hooks/use-mobile";

interface RightColumnProps {
  job: Job;
}

export const RightColumn = ({ job }: RightColumnProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${isMobile ? '' : 'h-full'}`}>
      <ScheduledDate job={job} />
      <JobLocation job={job} />
    </div>
  );
};
