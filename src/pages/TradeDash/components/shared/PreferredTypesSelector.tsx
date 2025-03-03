
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PreferredTypesSelectorProps {
  jobTypes: string[];
  selectedTypes: string[];
  onTypeChange: (type: string, checked: boolean) => void;
  label?: string;
  columns?: number;
}

export const PreferredTypesSelector = ({
  jobTypes,
  selectedTypes,
  onTypeChange,
  label = "Job Types",
  columns = 2
}: PreferredTypesSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className={`grid grid-cols-${columns} gap-2 mt-2`}>
        {jobTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox 
              id={`job-type-${type}`}
              checked={selectedTypes.includes(type)}
              onCheckedChange={(checked) => {
                onTypeChange(type, !!checked);
              }}
            />
            <label
              htmlFor={`job-type-${type}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
