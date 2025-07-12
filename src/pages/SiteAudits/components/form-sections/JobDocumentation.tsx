import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/FileUpload";
import { ImagesGrid } from "@/components/ImagesGrid";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface JobDocumentationProps {
  documents: File[];
  setDocuments: (documents: File[]) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
}

export function JobDocumentation({
  documents,
  setDocuments,
  notes,
  setNotes,
  onFileUpload,
  isUploading
}: JobDocumentationProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [extractedText, setExtractedText] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFileUpload) return onFileUpload(e);
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments([...documents, ...newFiles]);
    }
  };

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-blue-600" />
        <Label className="text-sm font-medium text-gray-700">Documentation</Label>
      </div>

      {isUploading && (
        <div className="text-blue-600 text-sm">Uploading...</div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="permits">Permits</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="variation">Variation</TabsTrigger>
          <TabsTrigger value="defects">Defects</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div>
            <Label>Upload Documents</Label>
            <FileUpload 
              onFileUpload={handleFileUpload}
              label="Upload general documentation"
              allowGcpVision={true}
              onTextExtracted={handleTextExtracted}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about the documentation..."
              className="w-full min-h-[100px]"
            />
          </div>
          <ImagesGrid images={documents} title="Uploaded Documents" />
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div>
            <Label>Upload Technical Documents</Label>
            <FileUpload 
              onFileUpload={handleFileUpload}
              label="Upload technical specifications and drawings"
              allowGcpVision={true}
              onTextExtracted={handleTextExtracted}
            />
          </div>
          <div>
            <Label htmlFor="technicalNotes">Technical Notes</Label>
            <Textarea
              id="technicalNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add technical notes and specifications..."
              className="w-full min-h-[100px]"
            />
          </div>
          <ImagesGrid images={documents} title="Technical Documents" />
        </TabsContent>

        <TabsContent value="permits" className="space-y-4">
          <div>
            <Label>Upload Permits</Label>
            <FileUpload 
              onFileUpload={handleFileUpload}
              label="Upload permits and approvals"
              allowGcpVision={true}
              onTextExtracted={handleTextExtracted}
            />
          </div>
          <div>
            <Label htmlFor="permitNotes">Permit Notes</Label>
            <Textarea
              id="permitNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about permits and approvals..."
              className="w-full min-h-[100px]"
            />
          </div>
          <ImagesGrid images={documents} title="Permits and Approvals" />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div>
            <Label>Upload Contracts</Label>
            <FileUpload 
              onFileUpload={handleFileUpload}
              label="Upload contracts and agreements"
              allowGcpVision={true}
              onTextExtracted={handleTextExtracted}
            />
          </div>
          <div>
            <Label htmlFor="contractNotes">Contract Notes</Label>
            <Textarea
              id="contractNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about contracts..."
              className="w-full min-h-[100px]"
            />
          </div>
          <ImagesGrid images={documents} title="Contracts" />
        </TabsContent>

        <TabsContent value="variation" className="space-y-4">
          <div>
            <Label>Upload Variations</Label>
            <FileUpload 
              onFileUpload={handleFileUpload}
              label="Upload variation documents"
              allowGcpVision={true}
              onTextExtracted={handleTextExtracted}
            />
          </div>
          <div>
            <Label htmlFor="variationNotes">Variation Notes</Label>
            <Textarea
              id="variationNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about variations..."
              className="w-full min-h-[100px]"
            />
          </div>
          <ImagesGrid images={documents} title="Variations" />
        </TabsContent>

        <TabsContent value="defects" className="space-y-4">
          <div>
            <Label>Upload Defects</Label>
            <FileUpload 
              onFileUpload={handleFileUpload}
              label="Upload defect reports and photos"
              allowGcpVision={true}
              onTextExtracted={handleTextExtracted}
            />
          </div>
          <div>
            <Label htmlFor="defectNotes">Defect Notes</Label>
            <Textarea
              id="defectNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about defects..."
              className="w-full min-h-[100px]"
            />
          </div>
          <ImagesGrid images={documents} title="Defects" />
        </TabsContent>
      </Tabs>
    </div>
  );
} 