
import { FinancialData } from "../../hooks/financial-data/types";

export interface DocumentApprovalProps {
  jobId: string;
  onFinancialDataExtracted: (data: FinancialData) => void;
}
