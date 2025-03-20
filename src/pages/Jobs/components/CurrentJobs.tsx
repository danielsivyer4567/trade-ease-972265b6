
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface CurrentJobsProps {
  jobs: Job[];
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => Promise<void>;
}

export const CurrentJobs = ({ jobs, onStatusUpdate }: CurrentJobsProps) => {
  const navigate = useNavigate();
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

  const getStatusBadgeColor = (status: Job['status']) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'invoiced':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const viewInCalendar = (job: Job) => {
    navigate(`/calendar?job=${job.id}&date=${job.date}`);
    toast.success(`Navigating to ${job.title || `Job #${job.jobNumber}`} in calendar`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Current Jobs</h2>
      
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
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        #{job.jobNumber}
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
                    <Badge className={`${getStatusBadgeColor(job.status)}`}>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        View
                      </Button>
                      
                      {job.status === 'in-progress' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(job.id, 'completed')}
                          disabled={actionLoading === job.id}
                        >
                          {actionLoading === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          <span>Complete</span>
                        </Button>
                      )}
                      
                      {job.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(job.id, 'invoiced')}
                          disabled={actionLoading === job.id}
                        >
                          {actionLoading === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span>Invoice</span>
                          )}
                        </Button>
                      )}
                      
                      {job.date && job.status !== 'cancelled' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewInCalendar(job)}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>Calendar</span>
                        </Button>
                      )}
                      
                      {job.status !== 'cancelled' && job.status !== 'invoiced' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(job.id, 'cancelled')}
                          disabled={actionLoading === job.id}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {actionLoading === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          <span>Cancel</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
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
    </div>
  );
};
