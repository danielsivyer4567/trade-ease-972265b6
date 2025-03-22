import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Briefcase, Receipt, FileText, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

interface QuickAction {
  to: string;
  icon: React.ReactNode;
  label: string;
  mobileLabel: string;
  bgColor: string;
  hoverBgColor: string;
  borderColor: string;
  textColor: string;
  hoverTextColor: string;
}

export const QuickTabs = () => {
  const isMobile = useIsMobile();

  const quickActions: QuickAction[] = [
    {
      to: "/customers/new",
      icon: <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      label: "New Customer",
      mobileLabel: "Customer",
      bgColor: "bg-[#E5DEFF]",
      hoverBgColor: "hover:bg-[#D3C6FF]",
      borderColor: "border-[#C4B5FF]",
      textColor: "text-[#4F46E5]",
      hoverTextColor: "hover:text-[#3730A3]"
    },
    {
      to: "/jobs/new",
      icon: <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      label: "New Job",
      mobileLabel: "Job",
      bgColor: "bg-[#D3E4FD]",
      hoverBgColor: "hover:bg-[#B5D1F8]",
      borderColor: "border-[#A3C0ED]",
      textColor: "text-[#1E40AF]",
      hoverTextColor: "hover:text-[#1E3A8A]"
    },
    {
      to: "/invoices/new",
      icon: <Receipt className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      label: "New Invoice",
      mobileLabel: "Invoice",
      bgColor: "bg-[#FDE1D3]",
      hoverBgColor: "hover:bg-[#FBC7AC]",
      borderColor: "border-[#F9B292]",
      textColor: "text-[#C2410C]",
      hoverTextColor: "hover:text-[#9A3412]"
    },
    {
      to: "/quotes/new",
      icon: <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      label: "New Quote",
      mobileLabel: "Quote",
      bgColor: "bg-[#F2FCE2]",
      hoverBgColor: "hover:bg-[#E3F8C6]",
      borderColor: "border-[#D3F1A7]",
      textColor: "text-[#4D7C0F]",
      hoverTextColor: "hover:text-[#3F6212]"
    },
    {
      to: "/payments/new",
      icon: <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      label: "New Payment",
      mobileLabel: "Payment",
      bgColor: "bg-[#FFDEE2]",
      hoverBgColor: "hover:bg-[#FFC9CF]",
      borderColor: "border-[#FFADB6]",
      textColor: "text-[#BE123C]",
      hoverTextColor: "hover:text-[#9F1239]"
    }
  ];

  return (
    <div className=" w-full ">
      <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to} className="w-full">
            <Button
              size='xl'
              variant="outline"
              className={cn(
                "w-full h-12  sm:h-14 border transition-all duration-200",
                "flex md:flex-col items-center justify-center gap-1.5 sm:gap-2",
                "shadow-sm hover:shadow-md",
                action.bgColor,
                action.hoverBgColor,
                action.borderColor,
                action.textColor,
                action.hoverTextColor
              )}
            >
              {action.icon}
              <span className="text-[10px] sm:text-xs font-medium">
                {isMobile ? action.mobileLabel : action.label}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};
