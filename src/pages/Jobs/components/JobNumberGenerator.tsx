
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobNumberGeneratorProps {
  jobNumber: string;
  setJobNumber: (jobNumber: string) => void;
}

export function JobNumberGenerator({ jobNumber, setJobNumber }: JobNumberGeneratorProps) {
  const { toast } = useToast();

  // Function to generate a new job number
  const generateJobNumber = () => {
    const prefix = "JOB";
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  // Generate job number on component mount
  useEffect(() => {
    if (!jobNumber) {
      setJobNumber(generateJobNumber());
    }
  }, [jobNumber, setJobNumber]);

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
