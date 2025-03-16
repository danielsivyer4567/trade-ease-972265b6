
import { User } from "lucide-react";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CustomerDetailsProps {
  job: Job;
}

export const CustomerDetails = ({ job }: CustomerDetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center p-3 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <User className="mr-2 h-5 w-5 text-gray-500" />
          <span className="font-medium">Customer Details</span>
        </div>
      </Button>
      
      {isExpanded && (
        <div className="p-3 pt-0 space-y-2 border-t">
          <p className="text-sm"><span className="font-semibold">Name:</span> {job.customer}</p>
          <p className="text-sm"><span className="font-semibold">Job Number:</span> {job.jobNumber}</p>
          <p className="text-sm"><span className="font-semibold">Job Type:</span> {job.type}</p>
          <p className="text-sm"><span className="font-semibold">Assigned Team:</span> {job.assignedTeam}</p>
        </div>
      )}
    </div>
  );
};
