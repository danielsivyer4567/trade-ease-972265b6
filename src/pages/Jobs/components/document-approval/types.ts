
export interface FinancialData {
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

export interface DocumentApprovalProps {
  jobId: string;
  onFinancialDataExtracted: (data: any) => void;
}
