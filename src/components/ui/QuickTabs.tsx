
import React from "react";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Briefcase,
  Receipt,
  FileText,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      bgColor: "bg-white",
      hoverBgColor: "hover:bg-slate-100/50",
      borderColor: "border-slate-300",
      textColor: "text-[#4F46E5]",
      hoverTextColor: "hover:text-[#3730A3]",
    },
    {
      to: "/jobs/new",
      icon: <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      label: "New Job",
      mobileLabel: "Job",
      bgColor: "bg-white",
      hoverBgColor: "hover:bg-slate-100/50",
      borderColor: "border-slate-300",
      textColor: "text-[#1E40AF]",
      hoverTextColor: "hover:text-[#1E3A8A]",
    },
    {
      to: "/invoices/new",
      icon: <Receipt className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      label: "New Invoice",
      mobileLabel: "Invoice",
      bgColor: "bg-white",
      hoverBgColor: "hover:bg-slate-100/50",
      borderColor: "border-slate-300",
      textColor: "text-[#C2410C]",
      hoverTextColor: "hover:text-[#9A3412]",
    },
    {
      to: "/quotes/new",
      icon: <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      label: "New Quote",
      mobileLabel: "Quote",
      bgColor: "bg-white",
      hoverBgColor: "hover:bg-slate-100/50",
      borderColor: "border-slate-300",
      textColor: "text-[#4D7C0F]",
      hoverTextColor: "hover:text-[#3F6212]",
    },
    {
      to: "/payments/new",
      icon: <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />,
      label: "New Payment",
      mobileLabel: "Payment",
      bgColor: "bg-white",
      hoverBgColor: "hover:bg-slate-100/50",
      borderColor: "border-slate-300",
      textColor: "text-[#BE123C]",
      hoverTextColor: "hover:text-[#9F1239]",
    },
  ];

  return (
    <TooltipProvider>
      <div className="w-full overflow-x-auto">
        <div className="flex flex-nowrap gap-2">
          {quickActions.map((action) => (
            <Tooltip key={action.to}>
              <TooltipTrigger asChild>
                <Link to={action.to} className="shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "border transition-all duration-200",
                      "flex items-center justify-center gap-1.5",
                      "shadow-sm hover:shadow-md px-3 py-1 h-8",
                      action.bgColor,
                      action.hoverBgColor,
                      action.borderColor,
                      action.textColor,
                      action.hoverTextColor
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {action.icon}
                      <span className={isMobile ? "hidden" : "inline"}>
                        {isMobile ? action.mobileLabel : action.label}
                      </span>
                    </div>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
