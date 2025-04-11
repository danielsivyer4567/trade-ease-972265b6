
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronLeft, ChevronRight, FileImage } from "lucide-react";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";

export interface QuoteItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

interface QuoteItemsFormProps {
  quoteItems: QuoteItem[];
  setQuoteItems: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
  onPrevTab: () => void;
  onNextTab: () => void;
}

export const QuoteItemsForm = ({ 
  quoteItems, 
  setQuoteItems, 
  onPrevTab,
  onNextTab 
}: QuoteItemsFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  const handleAddItem = () => {
    setQuoteItems([...quoteItems, { description: "", quantity: 1, rate: 0, total: 0 }]);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...quoteItems];
    newItems.splice(index, 1);
    setQuoteItems(newItems);
  };
  
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...quoteItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      total: field === 'quantity' || field === 'rate' 
        ? Number(field === 'quantity' ? value : newItems[index].quantity) * Number(field === 'rate' ? value : newItems[index].rate)
        : newItems[index].total
    };
    setQuoteItems(newItems);
  };
  
  const totalAmount = quoteItems.reduce((sum, item) => sum + item.total, 0);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);

      // Create preview URLs for images
      const newPreviewUrls = newFiles.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      }).filter(url => url !== '');
      
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="quote-title">Quote Title</Label>
        <Input 
          id="quote-title" 
          placeholder="e.g., Kitchen Renovation" 
          className="mt-1" 
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Quote Items</h3>
          <Button size="sm" variant="outline" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-2 px-3 font-medium">Description</th>
                <th className="text-left py-2 px-3 font-medium w-20">Qty</th>
                <th className="text-left py-2 px-3 font-medium w-28">Rate</th>
                <th className="text-left py-2 px-3 font-medium w-28">Total</th>
                <th className="text-center py-2 px-3 font-medium w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quoteItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-3">
                    <Input 
                      placeholder="Item description" 
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Input 
                      type="number" 
                      min="1" 
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                    />
                  </td>
                  <td className="py-2 px-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        type="number" 
                        className="pl-7"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <Input 
                      value={`$${item.total.toFixed(2)}`}
                      disabled
                      className="bg-gray-50"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    {quoteItems.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-medium">
                <td colSpan={3} className="text-right py-3 px-4">Total:</td>
                <td className="py-3 px-3">${totalAmount.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Photo upload section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="font-medium mb-2 flex items-center">
          <FileImage className="mr-2 h-4 w-4" />
          Attach Photos to Quote
        </h3>
        <FileUpload onFileUpload={handleFileUpload} label="Drag and drop images or click to browse" />
        {uploadedFiles.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {uploadedFiles.length} file(s) attached to quote
            </p>
          </div>
        )}
      </div>
      
      {previewImages.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Attached Photos</h3>
          <ImagesGrid images={previewImages} />
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrevTab}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNextTab}>
          Next: Terms & Notes
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
