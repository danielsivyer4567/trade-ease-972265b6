
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface PurchaseDialogBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  toggleLabel: string;
  maxWidth?: string;
  children?: React.ReactNode;
}

export const PurchaseDialogBase = ({
  open,
  onOpenChange,
  title,
  description,
  enabled,
  onEnabledChange,
  onSave,
  onCancel,
  toggleLabel,
  maxWidth = "500px",
  children,
}: PurchaseDialogBaseProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[${maxWidth}]`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="purchase-toggle" className="font-medium">
              {toggleLabel}
            </Label>
            <Switch
              id="purchase-toggle"
              checked={enabled}
              onCheckedChange={onEnabledChange}
            />
          </div>
          
          {enabled && children}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
