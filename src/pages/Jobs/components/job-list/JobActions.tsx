
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface JobActionsProps {
  job: Job;
  onStatusUpdate: (jobId: string, newStatus: Job['status']) => Promise<void>;
  actionLoading: string | null;
  setActionLoading: (jobId: string | null) => void;
}

export const JobActions = ({ job, onStatusUpdate, actionLoading, setActionLoading }: JobActionsProps) => {
  const navigate = useNavigate();

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

  const viewInCalendar = (job: Job) => {
    navigate(`/calendar?job=${job.id}&date=${job.date}`);
    toast.success(`Navigating to ${job.title || `Job #${job.jobNumber}`} in calendar`);
  };

  return (
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
  );
};
