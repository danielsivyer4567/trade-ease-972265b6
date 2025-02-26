
import { TabsContent } from "@/components/ui/tabs";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface JobBillsTabProps {
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  onUpdateTotals: (amount: number) => void;
}

export const JobBillsTab = ({ tabNotes, setTabNotes, onUpdateTotals }: JobBillsTabProps) => {
  const [amount, setAmount] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Convert to array and filter for images and PDFs
    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    // Create URLs for preview (only for images)
    const imageUrls = newFiles
      .filter(file => file.type.startsWith('image/'))
      .map(file => URL.createObjectURL(file));

    setUploadedFiles(prev => [...prev, ...imageUrls]);

    if (amount) {
      onUpdateTotals(parseFloat(amount));
    }

    toast({
      title: "Files uploaded successfully",
      description: `${newFiles.length} files have been uploaded.`
    });
  };

  return (
    <TabsContent value="bills" className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Bill Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter bill amount"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Upload Bills</Label>
            <FileUpload onFileUpload={handleFileUpload} label="Upload bills" />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="w-full min-h-[100px] p-3 border rounded-lg mt-1"
              placeholder="Add notes about this bill..."
              value={tabNotes.bills || ""}
              onChange={(e) => setTabNotes({ ...tabNotes, bills: e.target.value })}
            />
          </div>
          <ImagesGrid images={uploadedFiles} title="Uploaded Bills" />
        </div>
      </div>
    </TabsContent>
  );
};
