
import { Button } from "@/components/ui/button";
import { Clock, Loader2, DollarSign, CheckCircle } from "lucide-react";
import { Job } from "@/types/job";

interface CurrentJobsProps {
  jobs: Job[];
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => void;
}

export function CurrentJobs({ jobs, onStatusUpdate }: CurrentJobsProps) {
  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'ready':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-yellow-500" />;
      case 'to-invoice':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'invoiced':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Current Jobs</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{job.jobNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(job.status)}
                      <span className="ml-2 text-sm text-gray-500">
                        {job.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      className="text-sm border border-gray-300 rounded-md px-2 py-1" 
                      value={job.status} 
                      onChange={e => onStatusUpdate(job.id, e.target.value as Job['status'])}
                    >
                      <option value="ready">Ready to Go</option>
                      <option value="in-progress">In Progress</option>
                      <option value="to-invoice">To Invoice</option>
                      <option value="invoiced">Invoiced</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
