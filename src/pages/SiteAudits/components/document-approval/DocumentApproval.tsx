
import { DocumentApprovalProps } from "./types";
import { FileUploadSection } from "./FileUploadSection";
import { ActionButtons } from "./ActionButtons";
import { useDocumentApproval } from "./hooks/useDocumentApproval";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Users, Mail, Copy } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

// Define common suppliers - same as in CustomerMaterials
const commonSuppliers = [
  { name: "ABC Building Supplies", email: "orders@abcbuilding.com" },
  { name: "Smith's Timber & Hardware", email: "orders@smithstimber.com" },
  { name: "Metro Electrical Wholesale", email: "orders@metroelectrical.com" },
  { name: "Coastal Plumbing Supplies", email: "orders@coastalplumbing.com" },
  { name: "BuildWell Construction Materials", email: "sales@buildwell.com" },
  { name: "Premier Roofing Supplies", email: "orders@premierroofing.com" },
];

export function DocumentApproval({
  jobId,
  onFinancialDataExtracted
}: DocumentApprovalProps) {
  const {
    currentFile,
    setCurrentFile,
    isProcessing,
    uploadProgress,
    isUploading,
    extractionError,
    handleApproveDocument
  } = useDocumentApproval(jobId, onFinancialDataExtracted);
  
  const isMobile = useIsMobile();
  const [supplierEmail, setSupplierEmail] = useState<string>("");
  const [ccEmails, setCcEmails] = useState<string>("");
  const [bccEmails, setBccEmails] = useState<string>("");
  const [subject, setSubject] = useState<string>(`Document Approval - Job #${jobId}`);
  const [message, setMessage] = useState<string>("");
  
  // Handler for selecting a supplier from the dropdown
  const handleSupplierSelect = (supplierEmail: string) => {
    const supplier = commonSuppliers.find(s => s.email === supplierEmail);
    if (supplier) {
      setSupplierEmail(supplier.email);
    }
  };
  
  return (
    <div className="border-t-2 sm:border-t-4 border-gray-200 pt-6 sm:pt-8">
      <h3 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 px-2">Document Approval</h3>
      
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center mb-4 px-2 gap-2">
              <label className="text-sm text-gray-500 w-24 flex items-center gap-1">
                <Mail className="h-4 w-4" /> To:
              </label>
              <div className="flex-1 flex items-center gap-2">
                <Input 
                  value={supplierEmail} 
                  onChange={e => setSupplierEmail(e.target.value)} 
                  className="flex-1"
                  placeholder="Supplier email" 
                />
                <div className="min-w-[180px]">
                  <Select onValueChange={handleSupplierSelect}>
                    <SelectTrigger className="h-9 border-dashed border-slate-300">
                      <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span className="text-xs">Select supplier</span>
                    </SelectTrigger>
                    <SelectContent>
                      {commonSuppliers.map((supplier) => (
                        <SelectItem key={supplier.email} value={supplier.email}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center px-2 gap-2">
              <label className="text-sm text-gray-500 w-24 flex items-center gap-1">
                <Copy className="h-4 w-4" /> Cc/Bcc:
              </label>
              <div className="flex-1">
                <Input 
                  value={ccEmails} 
                  onChange={e => setCcEmails(e.target.value)} 
                  className="mb-2"
                  placeholder="Cc emails (separated by commas)" 
                />
                <Input 
                  value={bccEmails} 
                  onChange={e => setBccEmails(e.target.value)} 
                  placeholder="Bcc emails (separated by commas)" 
                />
              </div>
            </div>
            
            <div className="flex items-center px-2 gap-2">
              <label className="text-sm text-gray-500 w-24">Subject:</label>
              <Input 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                className="flex-1"
              />
            </div>
            
            <div className="px-2">
              <Textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full min-h-[150px] mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-6'} items-start`}>
        <FileUploadSection
          currentFile={currentFile}
          setCurrentFile={setCurrentFile}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          extractionError={extractionError}
        />
        
        <ActionButtons
          currentFile={currentFile}
          isProcessing={isProcessing}
          onApprove={() => handleApproveDocument(false)}
          onSaveDraft={() => handleApproveDocument(true)}
          supplierEmail={supplierEmail}
        />
      </div>
    </div>
  );
}
