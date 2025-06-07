import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSignature, Send, Save, ArrowLeft } from 'lucide-react';
import { DocuSealWrapper } from './DocuSealWrapper';
import { QuoteItem } from './QuoteItemsForm';

interface FinalPreviewProps {
  customer: any;
  items: QuoteItem[];
  terms: string[];
  template: {
    id: number;
    name: string;
    component: React.FC<any>;
  };
  onBack: () => void;
  onSave: () => void;
  onSend: () => void;
  onRequestSignature: () => Promise<void>;
  signingUrl: string;
  documentSigned: boolean;
  onDocumentSigned: () => void;
}

export const FinalPreview: React.FC<FinalPreviewProps> = ({
  customer,
  items,
  terms,
  template,
  onBack,
  onSave,
  onSend,
  onRequestSignature,
  signingUrl,
  documentSigned,
  onDocumentSigned,
}) => {
  const [showDocuSeal, setShowDocuSeal] = useState(false);
  const TemplateComponent = template.component;

  const handleRequestSignature = async () => {
    await onRequestSignature();
    setShowDocuSeal(true);
  };

  const templateProps = {
    ...customer,
    items,
    terms,
    // Pass any other template-specific props here if needed
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header Bar */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-wrap justify-between items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Terms
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Final Quote Preview</h2>
            <p className="text-sm text-muted-foreground">Review and send your quote for signature</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onSave}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button onClick={onSend} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="mr-2 h-4 w-4" /> Send Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Template Render */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <TemplateComponent {...templateProps} />
      </div>

      {/* DocuSeal Signature Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-blue-600" />
            Electronic Signature (DocuSeal)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documentSigned ? (
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="font-semibold text-green-700">Document has been successfully signed!</p>
            </div>
          ) : showDocuSeal && signingUrl ? (
            <div className="border rounded-md overflow-hidden">
              <DocuSealWrapper url={signingUrl} onDocumentSigned={onDocumentSigned} />
            </div>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                After sending, the client will receive an email with a secure link to sign this document electronically.
              </p>
              <Button 
                onClick={handleRequestSignature} 
                disabled={!customer?.email}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Request Signature Now
              </Button>
              {!customer?.email && <p className="text-xs text-red-500">A customer email is required to request a signature.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 