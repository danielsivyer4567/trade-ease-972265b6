
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface DateSelectionStepProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onChangeStep?: () => void;
  isChangingDate?: boolean;
}

export function DateSelectionStep({
  selectedDate,
  onDateSelect,
  onChangeStep,
  isChangingDate = false
}: DateSelectionStepProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <span className="text-base">Select Date</span>
      </label>
      <div className="border-2 rounded-lg p-3 shadow-md bg-slate-300">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="mx-auto pointer-events-auto bg-slate-300"
          initialFocus
        />
      </div>
      
      {isChangingDate && onChangeStep && (
        <div className="flex justify-end mt-2">
          <Button 
            onClick={onChangeStep} 
            variant="outline" 
            className="text-sm"
          >
            Back to Team Selection
          </Button>
        </div>
      )}
    </div>
  );
}
