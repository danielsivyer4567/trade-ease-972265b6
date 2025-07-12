
import { DocumentApproval as RefactoredDocumentApproval } from "./document-approval/DocumentApproval";

export function DocumentApproval(props: {
  jobId: string;
  onFinancialDataExtracted: (data: any) => void;
}) {
  return <RefactoredDocumentApproval {...props} />;
}
