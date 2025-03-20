
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UnassignedJobs } from "./UnassignedJobs";
import { CurrentJobs } from "./CurrentJobs";
import { JobAssignmentDialog } from "./JobAssignmentDialog";
import { JobAssignmentManager } from "../hooks/useJobAssignmentManager";
import { Job } from "@/types/job";

export function JobsDashboard() {
  const { 
    jobs,
    loading,
    selectedJob,
    selectedTeam,
    setSelectedTeam,
    selectedDate,
    setSelectedDate,
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    handleAssign,
    handleAssignSubmit,
    updateJobStatus
  } = JobAssignmentManager();

  return (
    <div className="space-y-4 p-6">
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <span className="ml-2 text-gray-600">Loading jobs...</span>
        </div>
      ) : (
        <>
          <UnassignedJobs jobs={jobs.filter(job => job.status === 'ready')} onAssign={handleAssign} />
          <Separator className="my-3 h-[2px] bg-gray-400" />
          <CurrentJobs jobs={jobs.filter(job => job.status !== 'ready')} onStatusUpdate={updateJobStatus} />
        </>
      )}

      <JobAssignmentDialog
        isOpen={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        selectedJob={selectedJob}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onAssign={handleAssignSubmit}
        teams={[
          { id: '1', name: 'Team Red', color: 'text-red-500' },
          { id: '2', name: 'Team Blue', color: 'text-blue-500' },
          { id: '3', name: 'Team Green', color: 'text-green-500' },
        ]}
      />
    </div>
  );
}
