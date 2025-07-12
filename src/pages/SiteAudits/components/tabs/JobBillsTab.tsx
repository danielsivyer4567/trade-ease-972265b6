
import { TabsContent } from "@/components/ui/tabs";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface JobBillsTabProps {
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  onUpdateTotals: (amount: number) => void;
}

export const JobBillsTab = ({ tabNotes, setTabNotes, onUpdateTotals }: JobBillsTabProps) => {
  const [amount, setAmount] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [extractedText, setExtractedText] = useState<string>("");
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
  
  const handleTextExtracted = (text: string, filename: string) => {
    setExtractedText(text);
    
    // Automatically update notes with the extracted text
    setTabNotes({ 
      ...tabNotes, 
      bills: tabNotes.bills ? 
        `${tabNotes.bills}\n\n--- Extracted from ${filename} ---\n${text}` : 
        `--- Extracted from ${filename} ---\n${text}` 
    });
    
    // Try to extract amount information from the text
    const amountMatch = text.match(/\$?\s*(\d{1,3}(,\d{3})*(\.\d{2})?)/);
    if (amountMatch && amountMatch[1]) {
      const cleanAmount = amountMatch[1].replace(/,/g, '');
      setAmount(cleanAmount);
      onUpdateTotals(parseFloat(cleanAmount));
      toast({
        title: "Amount detected",
        description: `Extracted amount: $${cleanAmount}`
      });
    }
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
            <FileUpload 
              onFileUpload={handleFileUpload} 
              label="Upload bills" 
              allowGcpVision={true}
              onTextExtracted={handleTextExtracted}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              className="w-full min-h-[100px]"
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
