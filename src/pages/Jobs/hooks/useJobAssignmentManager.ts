
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";

export function JobAssignmentManager() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Fetch jobs from Supabase
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
        
        // Map the database jobs to our Job type
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
      // Update job status and team in database
      const { error } = await supabase
        .from('jobs')
        .update({
          status: 'in-progress',
          assigned_team: selectedTeam,
          date: selectedDate.toISOString().split('T')[0] // Format date as YYYY-MM-DD
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
      
      // Update local state
      updateJobStatus(selectedJob!.id, 'in-progress');
      
      toast({
        title: "Job Assigned",
        description: `Job ${selectedJob?.jobNumber} has been assigned to ${
          ['Team Red', 'Team Blue', 'Team Green'][parseInt(selectedTeam) - 1]
        } for ${selectedDate.toLocaleDateString()}`,
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
      // Update in database
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
      
      // Update local state
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

  return {
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
  };
}
