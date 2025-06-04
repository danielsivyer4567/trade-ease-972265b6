import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";

interface JobDateSelectorProps {
  date: string;
  setDate: (date: string) => void;
  dateUndecided: boolean;
  setDateUndecided: (undecided: boolean) => void;
}

export function JobDateSelector({
  date,
  setDate,
  dateUndecided,
  setDateUndecided
}: JobDateSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="date" className="text-sm font-medium text-gray-700">Job Date *</Label>
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Calendar className="h-4 w-4" />
          </div>
          <Input 
            id="date" 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            disabled={dateUndecided} 
            required={!dateUndecided}
            className={`pl-10 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${dateUndecided ? 'opacity-50' : ''}`}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="dateUndecided" 
            checked={dateUndecided} 
            onCheckedChange={checked => {
              setDateUndecided(checked === true);
              if (checked) {
                setDate("");
              }
            }} 
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="dateUndecided" className="text-sm text-gray-600 cursor-pointer">
            Yet to be decided
          </label>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">When the job is scheduled to begin</p>
    </div>
  );
}
