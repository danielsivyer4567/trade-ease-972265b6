
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useJobSave() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveJobToDatabase = async (jobData: any) => {
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
      
      const { data, error } = await supabase
        .from("jobs")
        .insert(jobWithUserId)
        .select()
        .single();
      
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
