import { useState, useEffect } from 'react';
import { 
  FileSearch, 
  FileText, 
  ClipboardList, 
  ReceiptText, 
  CheckCircle2
} from 'lucide-react';
import { customerService } from '@/services/CustomerService';

interface CustomerProgressBarProps {
  customerId: string;
}

export function CustomerProgressBar({ customerId }: CustomerProgressBarProps) {
  const [progress, setProgress] = useState({
    hasAudits: false,
    hasQuotes: false,
    hasJobs: false,
    hasInvoices: false
  });

  useEffect(() => {
    async function loadCustomerProgress() {
      try {
        const journey = await customerService.getCustomerJourney(customerId);
        
        setProgress({
          hasAudits: (journey.audits || []).length > 0,
          hasQuotes: (journey.quotes || []).length > 0,
          hasJobs: (journey.jobs || []).length > 0,
          hasInvoices: (journey.invoices || []).length > 0
        });
      } catch (error) {
        console.error('Error loading customer progress:', error);
      }
    }
    
    loadCustomerProgress();
  }, [customerId]);

  // Calculate how many steps have been completed
  const stepsCompleted = [
    progress.hasAudits,
    progress.hasQuotes,
    progress.hasJobs,
    progress.hasInvoices
  ].filter(Boolean).length;

  // Calculate progress percentage
  const progressPercentage = (stepsCompleted / 4) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Customer Journey Progress</h3>
        <span className="text-sm text-gray-500">{stepsCompleted} of 4 steps completed</span>
      </div>
      
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div 
            style={{ width: `${progressPercentage}%` }} 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <div className={`flex flex-col items-center ${progress.hasAudits ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
            <FileSearch className="h-4 w-4" />
          </div>
          <span className="text-xs mt-1">Site Audit</span>
          {progress.hasAudits && <CheckCircle2 className="h-3 w-3 mt-1 text-green-500" />}
        </div>
        
        <div className={`flex flex-col items-center ${progress.hasQuotes ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-xs mt-1">Quote</span>
          {progress.hasQuotes && <CheckCircle2 className="h-3 w-3 mt-1 text-green-500" />}
        </div>
        
        <div className={`flex flex-col items-center ${progress.hasJobs ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
            <ClipboardList className="h-4 w-4" />
          </div>
          <span className="text-xs mt-1">Job</span>
          {progress.hasJobs && <CheckCircle2 className="h-3 w-3 mt-1 text-green-500" />}
        </div>
        
        <div className={`flex flex-col items-center ${progress.hasInvoices ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
            <ReceiptText className="h-4 w-4" />
          </div>
          <span className="text-xs mt-1">Invoice</span>
          {progress.hasInvoices && <CheckCircle2 className="h-3 w-3 mt-1 text-green-500" />}
        </div>
      </div>
    </div>
  );
} 