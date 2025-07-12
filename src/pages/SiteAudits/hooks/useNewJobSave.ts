import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useNewJobSave() {
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
      const jobWithUserId = {
        ...jobData,
        user_id: session.session.user.id
      };
      if (isEditing && jobData.jobNumber) {
        if (jobData.jobNumber.includes('-')) {
          const parts = jobData.jobNumber.split('-');
          const baseNumber = parts[0];
          const currentVersion = parseInt(parts[parts.length - 1], 10) || 0;
          jobWithUserId.jobNumber = `${baseNumber}-${currentVersion + 1}`;
        } else {
          jobWithUserId.jobNumber = `${jobData.jobNumber}-1`;
        }
      }
      let result;
      if (isEditing && jobData.id) {
        result = await supabase
          .from("new_jobs")
          .update(jobWithUserId)
          .eq("id", jobData.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("new_jobs")
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