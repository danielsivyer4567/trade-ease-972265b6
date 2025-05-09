import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';

interface DocuSealWrapperProps {
  url: string;
  onDocumentSigned: () => void;
}

export const DocuSealWrapper: React.FC<DocuSealWrapperProps> = ({ url, onDocumentSigned }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSigned, setIsSigned] = useState(false);
  
  // In a real implementation, this would use the DocuSeal SDK or iframe
  // Here we're just simulating the signing flow
  
  useEffect(() => {
    // Simulate loading the DocuSeal form
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSignClick = () => {
    // Simulate the signing process
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSigned(true);
      
      // Notify parent component
      onDocumentSigned();
    }, 2000);
  };
  
  // In a real implementation, you would use an iframe to embed the DocuSeal signing interface
  // Or integrate with their JavaScript SDK
  
  return (
    <div className="border rounded-md p-4 bg-white">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading signature form...</p>
        </div>
      ) : isSigned ? (
        <div className="flex flex-col items-center justify-center py-10">
          <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
          <p className="text-green-700 font-medium text-lg">Document Signed!</p>
          <p className="text-gray-600 mt-2">The document has been signed successfully.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">Document Signing Preview</h3>
            <p className="text-gray-600 text-sm">
              This is a preview of what the customer will see when they access the signing link.
              In a real implementation, this would be the actual DocuSeal interface.
            </p>
          </div>
          
          <div className="flex flex-col items-center border-t border-b border-gray-200 py-6 my-4">
            <div className="w-full max-w-md bg-white p-6 rounded-md shadow-sm border border-gray-200 mb-4">
              <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/6 mb-5"></div>
              
              <div className="h-20 bg-gray-100 rounded-md w-full mb-4 border border-dashed border-gray-300 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Signature Area</p>
              </div>
              
              <div className="h-4 bg-gray-200 rounded-md w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-5"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" className="flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
            
            <Button onClick={handleSignClick} className="bg-green-600 hover:bg-green-700 text-white">
              Sign Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 