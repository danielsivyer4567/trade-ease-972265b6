
import { FinancialData as FinancialDataBase } from "../../hooks/financial-data/types";

export interface DocumentApprovalProps {
  jobId: string;
  onFinancialDataExtracted: (data: FinancialData) => void;
}

// Re-export the FinancialData type so it can be used in this module
export type FinancialData = FinancialDataBase;
