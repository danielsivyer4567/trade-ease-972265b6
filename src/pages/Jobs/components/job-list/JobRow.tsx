
import { useNavigate } from "react-router-dom";
import type { Job } from "@/types/job";
import { JobStatusBadge } from "./JobStatusBadge";
import { JobActions } from "./JobActions";

interface JobRowProps {
  job: Job;
  actionLoading: string | null;
  onStatusChange: (jobId: string, newStatus: Job['status']) => Promise<void>;
}

export const JobRow = ({ job, actionLoading, onStatusChange }: JobRowProps) => {
  const navigate = useNavigate();

  // Add safety check
  if (!job) {
    return null;
  }

  const handleJobClick = (jobId: string) => {
    console.log("Navigating to job details:", jobId);
    navigate(`/jobs/${jobId}`);
  };

  const formatJobNumber = (jobNumber: string) => {
    if (!jobNumber) return "";
    
    // For all job numbers, extract the numeric part and take the last 4 digits
    const numericPart = jobNumber.replace(/\D/g, '');
    return `JOB-${numericPart.slice(-4)}`;
  };

  return (
    <tr 
      key={job.id} 
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => handleJobClick(job.id)}
    >
      <td className="px-2 py-2 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {formatJobNumber(job.jobNumber)}
          </div>
        </div>
      </td>
      <td className="px-2 py-2 whitespace-nowrap">
        <div className="text-sm text-gray-900">{job.customer}</div>
      </td>
      <td className="px-2 py-2 whitespace-nowrap">
        <div className="text-sm text-gray-900">{job.date || 'Not scheduled'}</div>
      </td>
      <td className="px-2 py-2 whitespace-nowrap">
        <div className="text-sm text-gray-900">{job.assignedTeam || 'Unassigned'}</div>
      </td>
      <td className="px-2 py-2 whitespace-nowrap">
        <JobStatusBadge status={job.status} />
      </td>
      <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <JobActions 
          job={job} 
          actionLoading={actionLoading} 
          onStatusChange={onStatusChange} 
        />
      </td>
    </tr>
  );
};
