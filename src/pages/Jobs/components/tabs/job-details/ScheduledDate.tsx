
import { Calendar } from "lucide-react";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ScheduledDateProps {
  job: Job;
}

export const ScheduledDate = ({ job }: ScheduledDateProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const date = new Date(job.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format a shortened date for the button display
  const shortDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center px-3 py-2 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">Scheduled Date</span>
        </div>
        <span className="text-xs text-gray-500">{shortDate}</span>
      </Button>
      
      {isExpanded && (
        <div className="p-3 pt-2 border-t">
          <p className="text-sm">{formattedDate}</p>
        </div>
      )}
    </div>
  );
};
