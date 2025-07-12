
import { useState } from "react";
import type { Job } from "@/types/job";
import { JobTable } from "./job-list/JobTable";

interface CurrentJobsProps {
  jobs: Job[];
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => Promise<void>;
}

export const CurrentJobs = ({ jobs, onStatusUpdate }: CurrentJobsProps) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    setActionLoading(jobId);
    try {
      await onStatusUpdate(jobId, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Current Jobs</h2>
      <JobTable 
        jobs={jobs}
        actionLoading={actionLoading}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
