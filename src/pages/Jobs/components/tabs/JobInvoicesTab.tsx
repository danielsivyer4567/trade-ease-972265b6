
import { TabsContent } from "@/components/ui/tabs";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface JobInvoicesTabProps {
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  onUpdateTotals: (amount: number) => void;
}

export const JobInvoicesTab = ({ tabNotes, setTabNotes, onUpdateTotals }: JobInvoicesTabProps) => {
  const [amount, setAmount] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

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
    <TabsContent value="invoices" className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Invoice Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter invoice amount"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Upload Invoices</Label>
            <FileUpload onFileUpload={handleFileUpload} label="Upload invoices" />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="w-full min-h-[100px] p-3 border rounded-lg mt-1"
              placeholder="Add notes about this invoice..."
              value={tabNotes.invoices || ""}
              onChange={(e) => setTabNotes({ ...tabNotes, invoices: e.target.value })}
            />
          </div>
          <ImagesGrid images={uploadedFiles} title="Uploaded Invoices" />
        </div>
      </div>
    </TabsContent>
  );
};
