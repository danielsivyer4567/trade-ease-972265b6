import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TermsFormProps {
  onUpdate: (terms: string[]) => void;
  initialTerms: string[];
}

export const TermsForm = ({ onUpdate, initialTerms }: TermsFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(e.target.value.split('\n'));
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <Label htmlFor="terms">Terms & Conditions</Label>
        <Textarea 
          id="terms" 
          placeholder="Enter each term on a new line..."
          value={initialTerms?.join('\n') || ''}
          onChange={handleChange}
          rows={8} 
          className="mt-1" 
        />
      </div>
    </div>
  );
};
