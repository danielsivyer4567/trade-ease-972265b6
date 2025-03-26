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
      case 'to-invoice':
        return 'bg-green-500 hover:bg-green-600';
      case 'invoiced':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'clean-required':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const viewInCalendar = (job: Job) => {
    navigate(`/calendar?job=${job.id}&date=${job.date}`);
    toast.success(`Navigating to ${job.title || `Job #${job.jobNumber}`} in calendar`);
  };

  const handleJobClick = (jobId: string) => {
    console.log("Navigating to job details:", jobId);
    navigate(`/jobs/${jobId}`);
  };

  const formatJobNumber = (jobNumber: string) => {
    if (!jobNumber) return "";
    
    // Check if this is a versioned job (starts with -n where n is version number)
    if (jobNumber.includes('-')) {
      const parts = jobNumber.split('-');
      const versionPart = parts[parts.length - 1];
      
      // Get the numerical part before the version
      const baseNumber = parts[0].replace(/\D/g, '');
      // Get exactly 4 digits without leading zeros
      const last4Digits = baseNumber.slice(-4);
      
      return `JOB-${last4Digits}`;
    }
    
    // For regular jobs, extract the numeric part and take the last 4 digits
    const numericPart = jobNumber.replace(/\D/g, '');
    return `JOB-${numericPart.slice(-4)}`;
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
                    <Badge className={`${getStatusBadgeColor(job.status)}`}>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/jobs/${job.id}`);
                        }}
                      >
                        View
                      </Button>
                      
                      {job.status === 'in-progress' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(job.id, 'to-invoice');
                          }}
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
                      
                      {job.status === 'to-invoice' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(job.id, 'invoiced');
                          }}
                          disabled={actionLoading === job.id}
                        >
                          {actionLoading === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span>Invoice</span>
                          )}
                        </Button>
                      )}
                      
                      {job.date && job.status !== 'clean-required' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewInCalendar(job);
                          }}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>Calendar</span>
                        </Button>
                      )}
                      
                      {job.status !== 'clean-required' && job.status !== 'invoiced' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(job.id, 'clean-required');
                          }}
                          disabled={actionLoading === job.id}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {actionLoading === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          <span>Mark for Cleaning</span>
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
