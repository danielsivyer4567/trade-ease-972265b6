
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MinBudgetInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export const MinBudgetInput = ({ 
  value, 
  onChange, 
  id = "min-budget" 
}: MinBudgetInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Minimum Budget</Label>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">$</span>
        <Input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="5000"
        />
      </div>
    </div>
  );
};
