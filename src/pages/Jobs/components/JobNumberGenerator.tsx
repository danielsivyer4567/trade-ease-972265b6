
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobNumberGeneratorProps {
  jobNumber: string;
  setJobNumber: (jobNumber: string) => void;
  isEditing?: boolean;
}

export function JobNumberGenerator({ jobNumber, setJobNumber, isEditing = false }: JobNumberGeneratorProps) {
  const { toast } = useToast();

  // Function to generate a new job number with 4 digits
  const generateJobNumber = () => {
    const prefix = "JOB";
    // Generate a random 4-digit number between 1000 and 9999
    const fourDigitNumber = Math.floor(1000 + Math.random() * 9000);
    
    // If we're editing an existing job, add version indicator
    if (isEditing && jobNumber) {
      // Check if it already has a version
      if (jobNumber.includes('-')) {
        // Extract the base part and increment the version
        const parts = jobNumber.split('-');
        const baseNumber = parts[0];
        const currentVersion = parseInt(parts[parts.length - 1], 10) || 0;
        return `${baseNumber}-${currentVersion + 1}`;
      } else {
        // First version
        return `${jobNumber}-1`;
      }
    }
    
    return `${prefix}-${fourDigitNumber}`;
  };

  // Generate job number on component mount
  useEffect(() => {
    if (!jobNumber && !isEditing) {
      setJobNumber(generateJobNumber());
    }
  }, [jobNumber, setJobNumber, isEditing]);

  // Function to handle refreshing the job number
  const handleRefreshJobNumber = () => {
    setJobNumber(generateJobNumber());
    toast({
      title: "Job Number Generated",
      description: "A new job number has been generated."
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="jobNumber">Job Number *</Label>
      <div className="flex">
        <Input 
          id="jobNumber" 
          value={jobNumber} 
          onChange={(e) => setJobNumber(e.target.value)} 
          placeholder="Auto-generated" 
          className="flex-1"
          readOnly 
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleRefreshJobNumber}
          className="ml-2 h-10 w-10 p-0 flex items-center justify-center bg-slate-300 hover:bg-slate-400"
          title="Generate new job number"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
