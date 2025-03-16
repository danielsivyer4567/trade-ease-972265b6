
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types/job";
import { ActionButtons } from "./job-header/ActionButtons";
import { WalkieTalkie } from "./job-header/WalkieTalkie";

interface JobHeaderProps {
  job: Job;
}

export const JobHeader = ({ job }: JobHeaderProps) => {
  return (
    <Card className="relative">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">{job.customer}</h2>
            <p className="text-gray-500">{job.type}</p>
          </div>
          <div className="flex items-center gap-2 py-0 mx-0 my-0 px-[232px]">
            <WalkieTalkie jobId={job.id} />
            <ActionButtons />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={job.status === "invoiced" ? "default" : "secondary"}>
            {job.status}
          </Badge>
          <span className="text-gray-500">{job.date}</span>
        </div>
      </div>
    </Card>
  );
};
