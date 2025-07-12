
export interface FinancialData {
  id?: string;
  amount: number;
  vendor?: string;
  date?: string;
  description?: string;
  source: string;
  timestamp: string;
  jobId: string;
  category?: string;
  status?: string;
}

export interface JobFinancialDataHookReturn {
  extractedFinancialData: FinancialData[];
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  handleFinancialDataExtracted: (data: FinancialData) => void;
  isLoading: boolean;
}
