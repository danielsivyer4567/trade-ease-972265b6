
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  className?: string;
}

export function FormActions({ isSubmitting, onCancel, className }: FormActionsProps) {
  return (
    <div className={`flex gap-2 justify-end ${className}`}>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Customer"}
      </Button>
    </div>
  );
}
