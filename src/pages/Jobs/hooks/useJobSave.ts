
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function useJobSave() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const saveJobToDatabase = async (jobData: any) => {
    try {
      setIsSaving(true);
      
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.session) {
        console.error("Error getting session:", sessionError);
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to create jobs. Please sign in and try again.",
          variant: "destructive"
        });
        
        // Redirect to login page after a short delay
        setTimeout(() => navigate("/auth"), 2000);
        return false;
      }
      
      // Fix: Convert camelCase field names to snake_case for Supabase
      const dataToSave = {
        job_number: jobData.jobNumber,
        title: jobData.title,
        customer: jobData.customer,
        description: jobData.description,
        type: jobData.type,
        date: jobData.date,
        date_undecided: jobData.date_undecided, 
        status: jobData.status,
        location: jobData.location,
        assigned_team: jobData.assigned_team
      };
      
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...dataToSave,
          user_id: session.session.user.id
        })
        .select();
        
      if (error) {
        console.error("Error saving job:", error);
        toast({
          title: "Error",
          description: "Failed to save job to database: " + error.message,
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Job saved successfully:", data);
      return true;
    } catch (error) {
      console.error("Exception saving job:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return { saveJobToDatabase, isSaving };
}
