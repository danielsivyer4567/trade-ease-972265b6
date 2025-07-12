
import { Calendar as CalendarIcon } from "lucide-react";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScheduledDateProps {
  job: Job;
}

export const ScheduledDate = ({ job }: ScheduledDateProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(job.date));
  
  const handleDateChange = async (date: Date | undefined) => {
    if (!date) return;
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ date: format(date, 'yyyy-MM-dd') })
        .eq('id', job.id);
        
      if (error) throw error;
      
      setSelectedDate(date);
      toast.success("Job date updated successfully");
    } catch (error) {
      console.error('Error updating job date:', error);
      toast.error("Failed to update job date");
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center px-3 py-2 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">Scheduled Date</span>
        </div>
        <span className="text-xs text-gray-500">
          {format(selectedDate, 'd MMM')}
        </span>
      </Button>
      
      {isExpanded && (
        <div className="p-3 pt-2 border-t">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};
