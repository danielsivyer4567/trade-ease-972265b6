import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  DollarSign,
  Calendar,
  Building,
  Tag,
  Zap
} from 'lucide-react';
import { aiAccountingService, type FinancialTransaction } from '@/services/AIAccountingService';
import { useToast } from '@/components/ui/use-toast';

interface AIDocumentProcessorProps {
  accounts: Array<{
    id: string;
    name: string;
    bank: string;
  }>;
  selectedAccountId?: string;
  onTransactionCreated: (transaction: FinancialTransaction) => void;
}

interface ProcessingFile {
  file: File;
  id: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: FinancialTransaction;
  error?: string;
}

export default function AIDocumentProcessor({ 
  accounts, 
  selectedAccountId, 
  onTransactionCreated 
}: AIDocumentProcessorProps) {
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFiles = useCallback(async (files: File[]) => {
    if (!selectedAccountId) {
      toast({
        title: "Select an account",
        description: "Please select a bank account before uploading documents.",
        variant: "destructive"
      });
      return;
    }

    const newFiles: ProcessingFile[] = files.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0
    }));

    setProcessingFiles(prev => [...prev, ...newFiles]);
    setIsProcessing(true);

    // Process each file
    for (const processingFile of newFiles) {
      try {
        // Update status to processing
        setProcessingFiles(prev => 
          prev.map(f => 
            f.id === processingFile.id 
              ? { ...f, status: 'processing', progress: 25 }
              : f
          )
        );

        // Process document with AI
        const result = await aiAccountingService.processFinancialDocument(
          processingFile.file, 
          selectedAccountId
        );

        if (result) {
          // Update status to completed
          setProcessingFiles(prev => 
            prev.map(f => 
              f.id === processingFile.id 
                ? { ...f, status: 'completed', progress: 100, result }
                : f
            )
          );

          onTransactionCreated(result);
          
          toast({
            title: "Document processed successfully",
            description: `Extracted: ${result.description} - $${result.amount}`,
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
        
        setProcessingFiles(prev => 
          prev.map(f => 
            f.id === processingFile.id 
              ? { 
                  ...f, 
                  status: 'failed', 
                  progress: 0, 
                  error: error instanceof Error ? error.message : 'Processing failed'
                }
              : f
          )
        );

        toast({
          title: "Processing failed",
          description: `Failed to process ${processingFile.file.name}`,
          variant: "destructive"
        });
      }
    }

    setIsProcessing(false);
  }, [selectedAccountId, onTransactionCreated, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow same file selection again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const clearProcessedFiles = () => {
    setProcessingFiles(prev => prev.filter(f => f.status === 'processing'));
  };

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">AI Document Processor</CardTitle>
        </div>
        <CardDescription>
          Upload receipts, invoices, or bank statements. AI will automatically extract and categorize transaction data.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Account Selection Info */}
        {selectedAccount && (
          <Alert>
            <Building className="h-4 w-4" />
            <AlertDescription>
              Processing documents for: <strong>{selectedAccount.name}</strong> ({selectedAccount.bank})
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            ${!selectedAccountId ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input 
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileChange}
            disabled={!selectedAccountId}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Upload className="h-12 w-12 text-gray-400" />
              <Zap className="h-4 w-4 text-blue-500 absolute -top-1 -right-1" />
            </div>
            
            <div>
              <p className="text-lg font-medium">
                {isDragOver ? 'Drop documents here' : 'Drop documents or click to upload'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports PNG, JPG, PDF up to 10MB each
              </p>
            </div>
            
            <div className="flex gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                AI-powered
              </span>
              <span>•</span>
              <span>Auto-categorization</span>
              <span>•</span>
              <span>Smart extraction</span>
            </div>
          </div>
        </div>

        {/* Processing Files */}
        {processingFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Processing Queue</h4>
              {processingFiles.some(f => f.status === 'completed' || f.status === 'failed') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearProcessedFiles}
                  className="text-xs"
                >
                  Clear Completed
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {processingFiles.map(file => (
                <ProcessingFileCard 
                  key={file.id} 
                  processingFile={file} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <Separator />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>OCR Text Extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>Amount Detection</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>Date Recognition</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-purple-500" />
            <span>Smart Categories</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProcessingFileCardProps {
  processingFile: ProcessingFile;
}

function ProcessingFileCard({ processingFile }: ProcessingFileCardProps) {
  const { file, status, progress, result, error } = processingFile;

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* File Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium text-sm">{file.name}</span>
            <Badge variant="outline" className="text-xs">
              {(file.size / 1024 / 1024).toFixed(1)}MB
            </Badge>
          </div>
          
          <Badge 
            variant={status === 'completed' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {status}
          </Badge>
        </div>

        {/* Progress Bar */}
        {(status === 'uploading' || status === 'processing') && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500">
              {status === 'uploading' ? 'Uploading...' : 'Processing with AI...'}
            </p>
          </div>
        )}

        {/* Results */}
        {status === 'completed' && result && (
          <div className="bg-green-50 p-3 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Amount:</span>
                <span className="ml-2 font-medium">${result.amount}</span>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 capitalize">{result.type}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Description:</span>
                <span className="ml-2">{result.description}</span>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2">{result.category}</span>
              </div>
              <div>
                <span className="text-gray-500">Confidence:</span>
                <span className="ml-2">{Math.round((result.confidence_score || 0) * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'failed' && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
} 