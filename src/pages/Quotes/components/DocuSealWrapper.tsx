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
  
  useEffect(() => {
    // Simulate loading the DocuSeal form
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // In a real implementation, we would listen for messages from the iframe
    // to know when the document is signed
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from DocuSeal
      if (event.origin === new URL(url).origin) {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'docuseal:completed') {
            setIsSigned(true);
            onDocumentSigned();
          }
        } catch (error) {
          console.error('Error parsing message from DocuSeal iframe:', error);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
    };
  }, [url, onDocumentSigned]);
  
  const handleOpenInNewWindow = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  // For demo purposes, simulate signing
  const handleSimulateSign = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSigned(true);
      onDocumentSigned();
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading signature form...</p>
      </div>
    );
  }
  
  if (isSigned) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
        <p className="text-green-700 font-medium text-lg">Document Signed!</p>
        <p className="text-gray-600 mt-2">The document has been signed successfully.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-800">Document Signing Interface</h3>
        <Button variant="outline" size="sm" onClick={handleOpenInNewWindow} className="flex items-center">
          <ExternalLink className="w-4 h-4 mr-1" />
          Open in New Tab
        </Button>
      </div>
      
      {/* DocuSeal iframe */}
      <div className="border rounded overflow-hidden shadow-sm">
        <iframe 
          src={url}
          style={{ width: '100%', height: '500px', border: 'none' }}
          title="Document Signing"
        />
      </div>
      
      {/* For demo purposes only - in a real implementation, this button would not be needed */}
      <div className="flex justify-end">
        <Button onClick={handleSimulateSign} className="bg-green-600 hover:bg-green-700 text-white">
          Simulate Signing (Demo Only)
        </Button>
      </div>
    </div>
  );
}; 