import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Briefcase, Receipt, FileText, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
export const QuickTabs = () => {
  return <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Quick Tabs</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 px-0 py-0 mx-px my-[2px]">
        <Link to="/customers/new" className="w-full">
          <Button variant="outline" className="w-full h-16 bg-[#E5DEFF] hover:bg-[#D3C6FF] border-[#C4B5FF] text-[#4F46E5] hover:text-[#3730A3] flex flex-col items-center justify-center p-1 sm:p-2 font-normal px-[12px] mx-[2px] my-0 py-[5px] text-sm">
            <UserPlus className="mb-1 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] font-medium sm:text-xs">New Customer</span>
          </Button>
        </Link>
        
        <Link to="/jobs/new" className="w-full">
          <Button variant="outline" className="w-full h-16 bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] flex flex-col items-center justify-center p-1 sm:p-2">
            <Briefcase className="mb-1 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">New Job</span>
          </Button>
        </Link>
        
        <Link to="/invoices/new" className="w-full">
          <Button variant="outline" className="w-full h-16 bg-[#FDE1D3] hover:bg-[#FBC7AC] border-[#F9B292] text-[#C2410C] hover:text-[#9A3412] flex flex-col items-center justify-center p-1 sm:p-2">
            <Receipt className="mb-1 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">New Invoice</span>
          </Button>
        </Link>
        
        <Link to="/quotes/new" className="w-full">
          <Button variant="outline" className="w-full h-16 bg-[#F2FCE2] hover:bg-[#E3F8C6] border-[#D3F1A7] text-[#4D7C0F] hover:text-[#3F6212] flex flex-col items-center justify-center p-1 sm:p-2">
            <FileText className="mb-1 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">New Quote</span>
          </Button>
        </Link>
        
        <Link to="/payments/new" className="w-full">
          <Button variant="outline" className="w-full h-16 bg-[#FFDEE2] hover:bg-[#FFC9CF] border-[#FFADB6] text-[#BE123C] hover:text-[#9F1239] flex flex-col items-center justify-center p-1 sm:p-2">
            <CreditCard className="mb-1 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[10px] sm:text-xs font-medium">New Payment</span>
          </Button>
        </Link>
      </div>
    </div>;
};