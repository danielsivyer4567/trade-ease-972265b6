
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useJobSave() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveJobToDatabase = async (jobData: any, isEditing = false) => {
    setIsSaving(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to save jobs",
          variant: "destructive"
        });
        return { success: false, data: null };
      }
      
      // Add user_id to the job data
      const jobWithUserId = {
        ...jobData,
        user_id: session.session.user.id
      };
      
      // Version the job number if editing an existing job
      if (isEditing && jobData.jobNumber) {
        // Check if it already has a version
        if (jobData.jobNumber.includes('-')) {
          // Extract the base part and increment the version
          const parts = jobData.jobNumber.split('-');
          const baseNumber = parts[0];
          const currentVersion = parseInt(parts[parts.length - 1], 10) || 0;
          jobWithUserId.jobNumber = `${baseNumber}-${currentVersion + 1}`;
        } else {
          // First version
          jobWithUserId.jobNumber = `${jobData.jobNumber}-1`;
        }
      }
      
      let result;
      if (isEditing && jobData.id) {
        // Update existing job
        result = await supabase
          .from("jobs")
          .update(jobWithUserId)
          .eq("id", jobData.id)
          .select()
          .single();
      } else {
        // Create new job
        result = await supabase
          .from("jobs")
          .insert(jobWithUserId)
          .select()
          .single();
      }
      
      const { data, error } = result;
      
      if (error) {
        console.error("Error saving job:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to save job",
          variant: "destructive"
        });
        return { success: false, data: null };
      }
      
      return { success: true, data };
    } catch (error: any) {
      console.error("Exception saving job:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, data: null };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveJobToDatabase,
    isSaving
  };
}
