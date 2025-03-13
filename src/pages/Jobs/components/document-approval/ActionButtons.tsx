
import { Check, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  currentFile: File | null;
  isProcessing: boolean;
  onApprove: () => void;
  onSaveDraft: () => void;
}

export function ActionButtons({ 
  currentFile, 
  isProcessing, 
  onApprove, 
  onSaveDraft 
}: ActionButtonsProps) {
  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded border">
      <h4 className="font-medium text-sm">Document Actions</h4>
      
      <div className="space-y-2">
        <Button
          variant="default"
          className="w-full justify-start"
          disabled={!currentFile || isProcessing}
          onClick={onApprove}
        >
          <Check className="mr-2 h-4 w-4" />
          Approve Document
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start"
          disabled={!currentFile || isProcessing}
          onClick={onSaveDraft}
        >
          <FileCheck className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Approving a document will extract financial data and add it to the job record.
        Draft documents are saved but not marked as approved.
      </p>
    </div>
  );
}
