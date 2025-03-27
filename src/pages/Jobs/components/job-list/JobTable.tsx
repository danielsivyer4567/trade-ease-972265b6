
import type { Job } from "@/types/job";
import { JobRow } from "./JobRow";

interface JobTableProps {
  jobs: Job[];
  actionLoading: string | null;
  onStatusChange: (jobId: string, newStatus: Job['status']) => Promise<void>;
}

export const JobTable = ({ jobs, actionLoading, onStatusChange }: JobTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job Number
            </th>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team
            </th>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobRow 
                key={job.id} 
                job={job} 
                actionLoading={actionLoading} 
                onStatusChange={onStatusChange} 
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-2 py-4 text-center text-sm text-gray-500">
                No active jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
