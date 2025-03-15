
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Briefcase, Receipt, FileText, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from '@/hooks/use-mobile';

export const QuickTabs = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-4 md:mb-6">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 px-0 py-0 mx-0 my-0">
        <Link to="/customers/new" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-8 sm:h-10 bg-[#E5DEFF] hover:bg-[#D3C6FF] border-[#C4B5FF] text-[#4F46E5] hover:text-[#3730A3] flex flex-col items-center justify-center p-0.5 font-normal"
          >
            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] font-medium mt-1">
              {isMobile ? "Customer" : "New Customer"}
            </span>
          </Button>
        </Link>
        
        <Link to="/jobs/new" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-8 sm:h-10 bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] flex flex-col items-center justify-center p-0.5"
          >
            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] font-medium mt-1">
              {isMobile ? "Job" : "New Job"}
            </span>
          </Button>
        </Link>
        
        <Link to="/invoices/new" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-8 sm:h-10 bg-[#FDE1D3] hover:bg-[#FBC7AC] border-[#F9B292] text-[#C2410C] hover:text-[#9A3412] flex flex-col items-center justify-center p-0.5"
          >
            <Receipt className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] font-medium mt-1">
              {isMobile ? "Invoice" : "New Invoice"}
            </span>
          </Button>
        </Link>
        
        <Link to="/quotes/new" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-8 sm:h-10 bg-[#F2FCE2] hover:bg-[#E3F8C6] border-[#D3F1A7] text-[#4D7C0F] hover:text-[#3F6212] flex flex-col items-center justify-center p-0.5"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] font-medium mt-1">
              {isMobile ? "Quote" : "New Quote"}
            </span>
          </Button>
        </Link>
        
        <Link to="/payments/new" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-8 sm:h-10 bg-[#FFDEE2] hover:bg-[#FFC9CF] border-[#FFADB6] text-[#BE123C] hover:text-[#9F1239] flex flex-col items-center justify-center p-0.5"
          >
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[8px] sm:text-[10px] font-medium mt-1">
              {isMobile ? "Payment" : "New Payment"}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
