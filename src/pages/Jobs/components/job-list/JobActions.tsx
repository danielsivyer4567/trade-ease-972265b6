
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Job } from "@/types/job";

interface JobActionsProps {
  job: Job;
  actionLoading: string | null;
  onStatusChange: (jobId: string, newStatus: Job['status']) => Promise<void>;
}

export const JobActions = ({ job, actionLoading, onStatusChange }: JobActionsProps) => {
  const navigate = useNavigate();

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
            onStatusChange(job.id, 'to-invoice');
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
            onStatusChange(job.id, 'invoiced');
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
            onStatusChange(job.id, 'clean-required');
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
