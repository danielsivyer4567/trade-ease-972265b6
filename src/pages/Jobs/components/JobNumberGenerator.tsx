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
    // Generate a random 4-digit number between 1000 and 9000
    const fourDigitNumber = Math.floor(1000 + Math.random() * 9000);
    
    // If we're editing an existing job, maintain the original number
    if (isEditing && jobNumber) {
      return jobNumber;
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
      <Label htmlFor="jobNumber" className="text-sm font-medium text-gray-700">Job Number *</Label>
      <div className="relative">
        <Input 
          id="jobNumber" 
          value={jobNumber} 
          onChange={(e) => setJobNumber(e.target.value)} 
          placeholder="Auto-generated" 
          className="pr-12 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          readOnly 
        />
        <Button 
          type="button" 
          variant="ghost" 
          onClick={handleRefreshJobNumber}
          className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-l-none rounded-r-md transition-colors duration-200"
          title="Generate new job number"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-1">Unique identifier for this job</p>
    </div>
  );
}
