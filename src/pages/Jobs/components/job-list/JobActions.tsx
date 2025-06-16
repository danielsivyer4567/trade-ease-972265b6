import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, CheckCircle, Eye, FileText, ArrowRight } from "lucide-react";
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

  // Add a safety check to prevent accessing properties of undefined
  if (!job) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  const viewInCalendar = (job: Job) => {
    navigate(`/calendar?job=${job.id}&date=${job.date}`);
    toast.success(`Navigating to ${job.title || `Job #${job.jobNumber}`} in calendar`);
  };

  return (
    <div className="flex items-center space-x-1.5">
      <Button
        variant="ghost" 
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/jobs/${job.id}`);
        }}
        className="h-8 w-8 p-0 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {job.status === 'in-progress' && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(job.id, 'to-invoice');
          }}
          disabled={actionLoading === job.id}
          className="h-8 w-8 p-0 text-gray-700 hover:text-green-600 hover:bg-green-50"
          aria-label="Complete"
        >
          {actionLoading === job.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
        </Button>
      )}
      
      {job.status === 'to-invoice' && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(job.id, 'invoiced');
          }}
          disabled={actionLoading === job.id}
          className="h-8 w-8 p-0 text-gray-700 hover:text-purple-600 hover:bg-purple-50"
        >
          {actionLoading === job.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </Button>
      )}
      
      {job.date && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            viewInCalendar(job);
          }}
          className="h-8 w-8 p-0 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="ghost" 
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/jobs/${job.id}/progress`);
        }}
        className="flex h-8 px-3 items-center text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
      >
        <span className="mr-1">Details</span>
        <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  );
};
