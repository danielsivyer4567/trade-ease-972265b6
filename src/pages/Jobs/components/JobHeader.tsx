
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";
import { ActionButtons } from "./job-header/ActionButtons";
import { WalkieTalkie } from "./job-header/WalkieTalkie";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobHeaderProps {
  job: Job;
}

export const JobHeader = ({ job }: JobHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="relative">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{job.customer}</h2>
            <p className="text-gray-500">{job.type}</p>
          </div>
          <div className={`flex flex-wrap ${isMobile ? 'w-full justify-between mt-2' : 'items-center gap-2'}`}>
            <WalkieTalkie jobId={job.id} />
            <ActionButtons />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Badge variant={job.status === "invoiced" ? "default" : "secondary"}>
            {job.status}
          </Badge>
          <span className="text-gray-500">{job.date}</span>
        </div>
      </div>
    </Card>
  );
};
