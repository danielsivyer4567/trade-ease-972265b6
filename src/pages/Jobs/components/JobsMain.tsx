import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/types/job";
import { UnassignedJobs } from "./UnassignedJobs";
import { CurrentJobs } from "./CurrentJobs";
import { JobAssignmentDialog } from "./JobAssignmentDialog";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { teams } from "../constants/teams";

export function JobsMain() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*');
          
        if (error) {
          console.error("Error fetching jobs:", error);
          toast({
            title: "Error",
            description: "Failed to load jobs",
            variant: "destructive"
          });
          return;
        }
        
        const mappedJobs: Job[] = data.map(job => ({
          id: job.id,
          customer: job.customer,
          type: job.type,
          status: job.status as any,
          date: job.date,
          location: job.location,
          jobNumber: job.job_number,
          title: job.title,
          description: job.description || undefined,
          assignedTeam: job.assigned_team || undefined
        }));
        
        setJobs(mappedJobs);
      } catch (error) {
        console.error("Exception fetching jobs:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchJobs();
  }, [toast]);

  const handleAssign = (job: Job) => {
    setSelectedJob(job);
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedTeam || !selectedDate) {
      toast({
        title: "Error",
        description: "Please select both a team and date",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          status: 'in-progress',
          assigned_team: selectedTeam,
          date: selectedDate.toISOString().split('T')[0]
        })
        .eq('id', selectedJob!.id);
        
      if (error) {
        console.error("Error updating job:", error);
        toast({
          title: "Error",
          description: "Failed to update job status",
          variant: "destructive"
        });
        return;
      }
      
      updateJobStatus(selectedJob!.id, 'in-progress');
      
      toast({
        title: "Job Assigned",
        description: `Job ${selectedJob?.jobNumber} has been assigned to ${teams.find(t => t.id === selectedTeam)?.name} for ${selectedDate.toLocaleDateString()}`,
      });
  
      setIsAssignDialogOpen(false);
      setSelectedJob(null);
      setSelectedTeam('');
      setSelectedDate(undefined);
      
    } catch (error) {
      console.error("Exception updating job:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: Job['status']) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);
        
      if (error) {
        console.error("Error updating job status:", error);
        toast({
          title: "Error",
          description: "Failed to update job status",
          variant: "destructive"
        });
        return;
      }
      
      setJobs(currentJobs => currentJobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      
      toast({
        title: "Status Updated",
        description: `Job status has been updated successfully`
      });
    } catch (error) {
      console.error("Exception updating job status:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

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
        teams={teams}
      />
    </div>
  );
}
