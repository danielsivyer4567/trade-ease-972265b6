
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JobStepIndicators } from "./job-header/JobStepIndicators";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobsHeaderProps {
  navigateTo?: string;
}

export const JobsHeader = ({ navigateTo = "/jobs" }: JobsHeaderProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobNumber, setJobNumber] = useState<string>("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchJobNumber = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('jobs')
          .select('job_number')
          .eq('id', id)
          .single();
          
        if (data && !error) {
          setJobNumber(data.job_number);
        }
      }
    };
    
    fetchJobNumber();
  }, [id]);

  // Format job number to display only the last 4 digits with a single dash
  const formatJobNumber = (jobNumber: string) => {
    if (!jobNumber) return "";
    
    // For all job numbers, extract the numeric part and take the last 4 digits
    const numericPart = jobNumber.replace(/\D/g, '');
    return `JOB-${numericPart.slice(-4)}`;
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(navigateTo)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
        
        {jobNumber && (
          <span className="text-sm font-medium text-gray-500">
            {formatJobNumber(jobNumber)}
          </span>
        )}
      </div>
      
      {/* Step indicators to the right of job number */}
      {id && <JobStepIndicators jobId={id} />}
    </div>
  );
};
