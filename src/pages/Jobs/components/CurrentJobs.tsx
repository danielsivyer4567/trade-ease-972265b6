
import { Button } from "@/components/ui/button";
import { Clock, Loader2, DollarSign, CheckCircle, Brush, MoreHorizontal } from "lucide-react";
import { Job } from "@/types/job";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface CurrentJobsProps {
  jobs: Job[];
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => void;
}

export function CurrentJobs({
  jobs,
  onStatusUpdate
}: CurrentJobsProps) {
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
    if (newStatus === 'clean-required') {
      try {
        const {
          data,
          error
        } = await supabase.functions.invoke('notify-team-leader', {
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

    onStatusUpdate(jobId, newStatus);
  };

  return <div>
      <SectionHeader title="Current Jobs" />
      <div className="bg-white rounded-lg shadow">
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="divide-x divide-gray-200">
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job #
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map(job => <tr key={job.id} className="hover:bg-gray-50 cursor-pointer divide-x divide-gray-200" onClick={() => navigate(`/jobs/${job.id}`)}>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-xs font-mono text-gray-900">{job.jobNumber}</div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-xs font-medium text-gray-900">{job.title || job.type}</div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-xs text-gray-500">{job.customer}</div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-xs text-gray-500">{job.date}</div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(job.status)}
                      <span className="ml-1 text-xs text-gray-500">
                        {job.status === 'invoiced' ? 'Completed' : job.status === 'clean-required' ? 'Clean Req.' : job.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-slate-200">
                        <DropdownMenuItem className="flex items-center gap-1 text-xs py-1" onClick={e => {
                      e.stopPropagation();
                      handleStatusChange(job.id, 'ready');
                    }}>
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span>Set Ready</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-1 text-xs py-1" onClick={e => {
                      e.stopPropagation();
                      handleStatusChange(job.id, 'in-progress');
                    }}>
                          <Loader2 className="h-3 w-3 text-yellow-500" />
                          <span>Set In Progress</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-1 text-xs py-1" onClick={e => {
                      e.stopPropagation();
                      handleStatusChange(job.id, 'clean-required');
                    }}>
                          <Brush className="h-3 w-3 text-orange-500" />
                          <span>Set Clean Required</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-1 text-xs py-1" onClick={e => {
                      e.stopPropagation();
                      handleStatusChange(job.id, 'to-invoice');
                    }}>
                          <DollarSign className="h-3 w-3 text-green-500" />
                          <span>Set To Invoice</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-1 text-xs py-1" onClick={e => {
                      e.stopPropagation();
                      handleStatusChange(job.id, 'invoiced');
                    }}>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Mark Complete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
