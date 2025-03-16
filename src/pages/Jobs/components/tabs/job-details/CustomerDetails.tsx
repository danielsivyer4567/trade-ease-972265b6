
import { User } from "lucide-react";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CustomerDetailsProps {
  job: Job;
}

export const CustomerDetails = ({ job }: CustomerDetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center px-3 py-2 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">Customer Details</span>
        </div>
        <span className="text-xs text-gray-500">{job.customer}</span>
      </Button>
      
      {isExpanded && (
        <div className="p-3 pt-2 space-y-2 border-t text-sm">
          <p><span className="font-semibold">Name:</span> {job.customer}</p>
          <p><span className="font-semibold">Job Number:</span> {job.jobNumber}</p>
          <p><span className="font-semibold">Job Type:</span> {job.type}</p>
          <p><span className="font-semibold">Assigned Team:</span> {job.assignedTeam}</p>
        </div>
      )}
    </div>
  );
};
