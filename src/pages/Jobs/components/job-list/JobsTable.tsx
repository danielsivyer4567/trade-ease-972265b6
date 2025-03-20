
import { useNavigate } from "react-router-dom";
import type { Job } from "@/types/job";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobActions } from "./JobActions";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface JobsTableProps {
  jobs: Job[];
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => Promise<void>;
  actionLoading: string | null;
  setActionLoading: (jobId: string | null) => void;
}

export const JobsTable = ({ jobs, onStatusUpdate, actionLoading, setActionLoading }: JobsTableProps) => {
  const navigate = useNavigate();

  const navigateToJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        No active jobs found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow 
              key={job.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => navigateToJob(job.id)}
            >
              <TableCell className="py-2">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    #{job.jobNumber}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="text-sm text-gray-900">{job.customer}</div>
              </TableCell>
              <TableCell className="py-2">
                <div className="text-sm text-gray-900">{job.date || 'Not scheduled'}</div>
              </TableCell>
              <TableCell className="py-2">
                <div className="text-sm text-gray-900">{job.assignedTeam || 'Unassigned'}</div>
              </TableCell>
              <TableCell className="py-2">
                <JobStatusBadge status={job.status} />
              </TableCell>
              <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                <JobActions 
                  job={job}
                  onStatusUpdate={onStatusUpdate}
                  actionLoading={actionLoading}
                  setActionLoading={setActionLoading}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
