
import { Button } from "@/components/ui/button";
import { Clock, Loader2, DollarSign, CheckCircle, Brush } from "lucide-react";
import { Job } from "@/types/job";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CurrentJobsProps {
  jobs: Job[];
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => void;
}

export function CurrentJobs({ jobs, onStatusUpdate }: CurrentJobsProps) {
  const navigate = useNavigate();
  
  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'ready':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-yellow-500" />;
      case 'to-invoice':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'invoiced':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'clean-required':
        return <Brush className="h-5 w-5 text-orange-500" />;
      default:
        return null;
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: Job['status']) => {
    // If status is changing to clean-required, notify Paul Finch
    if (newStatus === 'clean-required') {
      try {
        const { data, error } = await supabase.functions.invoke('notify-team-leader', {
          body: { 
            phoneNumber: '0430388131',
            name: 'Paul Finch',
            message: `Job ${jobId} requires cleaning. Please check the dashboard for details.`
          }
        });
        
        if (error) throw error;
        
        if (data.success) {
          toast.success("Paul Finch has been notified about the cleaning requirement");
        } else {
          toast.error("Failed to send notification to Paul Finch");
        }
      } catch (error) {
        console.error('Error sending notification:', error);
        toast.error("Failed to send notification. Using fallback notification system.");
      }
    }
    
    // Call the original status update function
    onStatusUpdate(jobId, newStatus);
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
                <tr 
                  key={job.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{job.jobNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title || job.type}</div>
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
                        {job.status === 'invoiced' ? 'Completed' : 
                          job.status === 'clean-required' ? 'Clean Required (Paul Finch notified)' :
                          job.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      className="text-sm border border-gray-300 rounded-md px-2 py-1"
                      value={job.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(job.id, e.target.value as Job['status'])}
                    >
                      <option value="ready">Ready to Go</option>
                      <option value="in-progress">In Progress</option>
                      <option value="clean-required">Clean Required</option>
                      <option value="to-invoice">To Invoice</option>
                      <option value="invoiced">Completed</option>
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
