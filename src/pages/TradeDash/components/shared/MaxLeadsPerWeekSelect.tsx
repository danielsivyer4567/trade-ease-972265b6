
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MaxLeadsPerWeekSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  helpText?: string;
}

export const MaxLeadsPerWeekSelect = ({ 
  value, 
  onChange, 
  id = "max-per-week",
  helpText
}: MaxLeadsPerWeekSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Maximum Leads Per Week</Label>
      {helpText && (
        <div className="text-sm text-gray-500 mb-1">
          {helpText}
        </div>
      )}
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select maximum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 per week</SelectItem>
          <SelectItem value="2">2 per week</SelectItem>
          <SelectItem value="3">3 per week</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
