
import { FinancialData } from "../types";

export interface DocumentApprovalState {
  currentFile: File | null;
  extractedText: string | null;
  isProcessing: boolean;
  uploadProgress: number;
  isUploading: boolean;
  extractionError: string | null;
}

export interface DocumentApprovalHookReturn extends DocumentApprovalState {
  setCurrentFile: (file: File | null) => void;
  setExtractionError: (error: string | null) => void;
  handleApproveDocument: (asDraft?: boolean) => Promise<void>;
}
