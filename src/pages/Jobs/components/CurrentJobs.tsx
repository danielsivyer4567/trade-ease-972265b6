
import { useState } from "react";
import type { Job } from "@/types/job";
import { JobsTable } from "./job-list/JobsTable";

interface CurrentJobsProps {
  jobs: Job[];
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => Promise<void>;
}

export const CurrentJobs = ({ jobs, onStatusUpdate }: CurrentJobsProps) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Current Jobs</h2>
      <JobsTable 
        jobs={jobs}
        onStatusUpdate={onStatusUpdate}
        actionLoading={actionLoading}
        setActionLoading={setActionLoading}
      />
    </div>
  );
};
