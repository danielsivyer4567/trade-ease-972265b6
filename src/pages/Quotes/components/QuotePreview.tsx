import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, SendHorizontal, FileImage, Download, Mail, Send, FileSignature } from "lucide-react";
import { QuoteItem } from "./QuoteItemsForm";
import { DocuSealWrapper } from "./DocuSealWrapper";

interface QuotePreviewProps {
  quoteItems: QuoteItem[];
  onPrevTab: () => void;
  customerEmail?: string;
  showSignatureSection?: boolean;
  onRequestSignature?: () => void;
  signingUrl?: string;
  documentSigned?: boolean;
  onDocumentSigned?: () => void;
}

export const QuotePreview = ({
  quoteItems,
  onPrevTab,
  customerEmail = "",
  showSignatureSection = false,
  onRequestSignature,
  signingUrl = "",
  documentSigned = false,
  onDocumentSigned = () => {}
}: QuotePreviewProps) => {
  const totalAmount = quoteItems.reduce((sum, item) => sum + item.total, 0);
  const [showDocuSeal, setShowDocuSeal] = useState(false);

  const handleRequestSignature = () => {
    if (onRequestSignature) {
      onRequestSignature();
      setShowDocuSeal(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden shadow-md bg-white">
        {/* Quote Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl tracking-tight">QUOTE</h2>
                <p className="text-blue-100 text-xs">Kitchen Renovation</p>
              </div>
              <div className="bg-blue-500/30 p-2 rounded-md backdrop-blur-sm">
                <p className="font-medium text-xs">Quote #: Q-2024-009</p>
                <p className="text-xs text-blue-100">Date: {new Date().toLocaleDateString()}</p>
                <p className="text-xs text-blue-100">Valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Company and Customer Info */}
        <div className="p-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <h3 className="font-medium text-xs text-blue-700 uppercase mb-1 flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1"></span>
                FROM
              </h3>
              <p className="font-medium text-xs text-slate-800">Your Company Name</p>
              <p className="text-xs text-slate-600">123 Business Street</p>
              <p className="text-xs text-slate-600">City, State ZIP</p>
              <p className="text-xs text-slate-600">Phone: (555) 987-6543</p>
              <p className="text-xs text-slate-600">Email: info@yourcompany.com</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
              <h3 className="font-medium text-xs text-amber-700 uppercase mb-1 flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1"></span>
                TO
              </h3>
              <p className="font-medium text-xs text-slate-800">John Smith</p>
              <p className="text-xs text-slate-600">456 Residential Ave</p>
              <p className="text-xs text-slate-600">City, State ZIP</p>
              <p className="text-xs text-slate-600">Phone: (555) 123-4567</p>
              <p className="text-xs text-slate-600">Email: {customerEmail || "john@example.com"}</p>
            </div>
          </div>
        </div>
        
        {/* Quote Items */}
        <div className="px-4 py-3">
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full text-xs bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
                  <th className="text-left py-2 px-2 font-medium text-slate-700">Description</th>
                  <th className="text-center py-2 px-2 font-medium text-slate-700">Qty</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-700">Rate</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quoteItems.map((item, index) => (
                  <tr key={index} className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="py-2 px-2 text-slate-700">{item.description || "Item description"}</td>
                    <td className="py-2 px-2 text-center text-slate-700">{item.quantity}</td>
                    <td className="py-2 px-2 text-right text-slate-700">${item.rate.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right text-slate-700">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Totals */}
        <div className="p-4 bg-gradient-to-b from-white to-slate-50">
          <div className="ml-auto w-full md:w-1/2 bg-white rounded-md border border-slate-200 overflow-hidden">
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 text-right font-medium text-slate-600">Subtotal:</td>
                  <td className="py-2 px-3 text-right font-medium text-slate-800 w-24">${totalAmount.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 text-right text-slate-600">Tax (10%):</td>
                  <td className="py-2 px-3 text-right text-slate-800">${(totalAmount * 0.1).toFixed(2)}</td>
                </tr>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <td className="py-3 px-3 text-right font-bold text-slate-700">Total:</td>
                  <td className="py-3 px-3 text-right font-bold text-blue-700">${(totalAmount * 1.1).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Terms & Conditions */}
        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-800 text-white text-xs p-2 rounded-md flex items-center">
            <span className="font-semibold">Terms & Conditions</span>
          </div>
          <p className="text-xs mt-2 text-slate-600">Payment due within 14 days of quote acceptance. This quote is valid for 30 days from the date of issue.</p>
        </div>
        
        {/* Electronic Signature Section */}
        {showSignatureSection && (
          <div className="p-4 border-t border-slate-200 bg-blue-50">
            <div className="bg-blue-600 text-white text-xs p-2 rounded-md flex items-center mb-3">
              <FileSignature className="h-3.5 w-3.5 mr-1.5" />
              <span className="font-semibold">Electronic Signature</span>
            </div>
            
            {documentSigned ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
                <p className="text-green-700 text-sm font-medium">Document has been signed electronically</p>
                <p className="text-xs text-green-600 mt-1">A copy has been sent to your email</p>
              </div>
            ) : showDocuSeal && signingUrl ? (
              <div className="border border-blue-200 rounded-md overflow-hidden">
                <DocuSealWrapper url={signingUrl} onDocumentSigned={onDocumentSigned} />
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <p className="text-xs text-blue-700">
                  By clicking "Sign Electronically" below, you agree to accept this quote electronically. A link will be sent to {customerEmail || "your email"} to complete the signing process.
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={handleRequestSignature}
                    disabled={!customerEmail}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center"
                    size="sm"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Sign Electronically
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-50 to-blue-50 p-2 rounded-md border border-slate-200">
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
            <Download className="h-3 w-3 mr-1" />
            PDF
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Button>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          <SendHorizontal className="h-3 w-3 mr-1" />
          Send Quote
        </Button>
      </div>
    </div>
  );
};
