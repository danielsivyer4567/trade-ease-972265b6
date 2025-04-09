
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface CustomerSaveActionsProps {
  onSaveAndContinue: () => void;
  onSaveAndExit: () => void;
}

export const CustomerSaveActions = ({ onSaveAndContinue, onSaveAndExit }: CustomerSaveActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onSaveAndContinue} className="flex items-center gap-1">
        <Save className="h-4 w-4" />
        Save
      </Button>
      <Button onClick={onSaveAndExit} className="flex items-center gap-1">
        <Save className="h-4 w-4" />
        Save & Exit
      </Button>
    </div>
  );
};
