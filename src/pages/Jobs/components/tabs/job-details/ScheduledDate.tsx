
import { Calendar } from "lucide-react";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ScheduledDateProps {
  job: Job;
}

export const ScheduledDate = ({ job }: ScheduledDateProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const date = new Date(job.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center p-3 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-gray-500" />
          <span className="font-medium">Scheduled Date</span>
        </div>
      </Button>
      
      {isExpanded && (
        <div className="p-3 pt-0 border-t">
          <p className="text-sm">{formattedDate}</p>
        </div>
      )}
    </div>
  );
};
