import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";
import { ActionButtons } from "./job-header/ActionButtons";
import { WalkieTalkie } from "./job-header/WalkieTalkie";
import { useIsMobile } from "@/hooks/use-mobile";
interface JobHeaderProps {
  job: Job;
}
export const JobHeader = ({
  job
}: JobHeaderProps) => {
  const isMobile = useIsMobile();
  return <Card className="relative overflow-hidden">
      <div className="p-3 sm:p-6 bg-slate-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold truncate">{job.customer}</h2>
            <p className="text-gray-500 text-sm sm:text-base">{job.type}</p>
          </div>
          <div className={`flex ${isMobile ? 'justify-between mt-2' : 'items-center gap-2'}`}>
            <WalkieTalkie jobId={job.id} />
            <ActionButtons />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-4">
          <Badge variant={job.status === "invoiced" ? "default" : "secondary"} className="h-6 sm:h-7">
            {job.status}
          </Badge>
          <span className="text-gray-500 text-xs sm:text-sm">{job.date}</span>
        </div>
      </div>
    </Card>;
};