
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, SendHorizontal, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { QuoteItem } from "./QuoteItemsForm";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";

interface QuotePreviewProps {
  quoteItems: QuoteItem[];
  onPrevTab: () => void;
}

export const QuotePreview = ({
  quoteItems,
  onPrevTab
}: QuotePreviewProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

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
      toast({
        title: "Files Uploaded",
        description: `${newFiles.length} file(s) added to quote`
      });
    }
  };

  const handleSaveQuote = async () => {
    toast({
      title: "Quote Saved",
      description: "Quote has been saved successfully"
    });
  };

  const handleSendQuote = () => {
    toast({
      title: "Quote Sent",
      description: "Quote has been sent to the customer"
    });
    navigate("/quotes");
  };

  return (
    <div className="space-y-6">
      <div className="border p-4 rounded-md bg-slate-100">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <h2 className="font-bold text-xl">QUOTE</h2>
            <p className="text-gray-500 text-sm mt-1">Kitchen Renovation</p>
          </div>
          <div className="text-left md:text-right">
            <p className="font-medium">Quote #: Q-2024-009</p>
            <p className="text-sm text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">FROM</h3>
            <p className="font-medium">Your Company Name</p>
            <p className="text-sm">123 Business Street</p>
            <p className="text-sm">City, State ZIP</p>
            <p className="text-sm">Phone: (555) 987-6543</p>
            <p className="text-sm">Email: info@yourcompany.com</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">TO</h3>
            <p className="font-medium">John Smith</p>
            <p className="text-sm">456 Residential Ave</p>
            <p className="text-sm">City, State ZIP</p>
            <p className="text-sm">Phone: (555) 123-4567</p>
            <p className="text-sm">Email: john@example.com</p>
          </div>
        </div>

        {/* File upload section - moved above the pricing table */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium mb-2 flex items-center">
            <FileImage className="mr-2 h-4 w-4" />
            Attach Images to Quote
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
        
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 font-medium">Description</th>
                <th className="text-center py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">Rate</th>
                <th className="text-right py-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quoteItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3">{item.description || "Item description"}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">${item.rate.toFixed(2)}</td>
                  <td className="py-3 text-right">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right py-4 font-medium">Subtotal:</td>
                <td className="text-right py-4 font-medium">${totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-right py-2">Tax (10%):</td>
                <td className="text-right py-2">${(totalAmount * 0.1).toFixed(2)}</td>
              </tr>
              <tr className="text-lg">
                <td colSpan={3} className="text-right py-4 font-bold">Total:</td>
                <td className="text-right py-4 font-bold">${(totalAmount * 1.1).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="mt-8 border-t pt-4">
          <h3 className="bg-slate-400 hover:bg-slate-300 text-gray-950 text-lg p-2 rounded">Terms & Conditions</h3>
          <p className="text-sm mt-2">Payment due within 14 days of quote acceptance. This quote is valid for 30 days from the date of issue.</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <Button variant="outline" onClick={onPrevTab} className="w-full sm:w-auto">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleSaveQuote} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Save Quote
          </Button>
          <Button onClick={handleSendQuote} className="w-full sm:w-auto">
            <SendHorizontal className="mr-2 h-4 w-4" />
            Send to Customer
          </Button>
        </div>
      </div>
    </div>
  );
};
