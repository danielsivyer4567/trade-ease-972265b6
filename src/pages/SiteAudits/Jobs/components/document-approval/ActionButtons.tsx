
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Save, Send } from "lucide-react";

interface ActionButtonsProps {
  currentFile: File | null;
  isProcessing: boolean;
  onApprove: () => void;
  onSaveDraft: () => void;
  supplierEmail?: string;
}

export function ActionButtons({
  currentFile,
  isProcessing,
  onApprove,
  onSaveDraft,
  supplierEmail
}: ActionButtonsProps) {
  const hasFile = !!currentFile;
  const isEmailReady = !!supplierEmail;
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-sm">Document Actions</h4>
            <p className="text-muted-foreground text-sm">
              Approve documents or save as draft for later review.
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={onApprove}
              disabled={!hasFile || isProcessing}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Approve Document
            </Button>
            
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={!hasFile || isProcessing}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            
            <Button
              variant="secondary"
              disabled={!hasFile || !isEmailReady || isProcessing}
              className="flex items-center gap-2 ml-auto"
            >
              <Send className="h-4 w-4" />
              Send to Supplier
            </Button>
          </div>
          
          {hasFile && !isEmailReady && (
            <p className="text-amber-600 text-xs">
              Select a supplier email to enable sending
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
