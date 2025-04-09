
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Files } from "lucide-react";
import { toast } from "sonner";
import { processCSVContent } from '../utils/csvParser';

interface CSVUploadFormProps {
  onItemsImported: (items: Array<{name: string, quantity: string, unit: string}>) => void;
  onCancel: () => void;
}

export function CSVUploadForm({ onItemsImported, onCancel }: CSVUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        // Detect file type and parse accordingly
        if (file.name.endsWith('.csv')) {
          const items = processCSVContent(content);
          onItemsImported(items);
          toast.success(`Imported ${items.length} items from CSV file`);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          toast.error("Excel format requires conversion to CSV. Please export as CSV.");
        } else {
          toast.error("Unsupported file format. Please use CSV.");
        }
      } catch (error: any) {
        console.error('Error reading file:', error);
        toast.error(error.message || "Failed to parse file");
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="border rounded-lg p-6 bg-slate-50 space-y-4">
      <div className="text-center">
        <Files className="h-12 w-12 mx-auto text-blue-500 mb-2" />
        <h3 className="text-lg font-medium mb-1">Import from CSV</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a CSV file with columns for name, quantity, and unit
        </p>
        
        <div className="flex flex-col gap-4 items-center">
          <div className="bg-white p-3 rounded border text-xs text-slate-700 max-w-md">
            <p className="font-medium mb-1">CSV Format Example:</p>
            <code>name,quantity,unit<br/>Copper Pipe,5,meters<br/>Electrical Outlet,3,pieces</code>
          </div>
          
          <Input 
            type="file" 
            ref={fileInputRef}
            accept=".csv" 
            className="max-w-xs"
            onChange={handleFileUpload}
          />
          
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
