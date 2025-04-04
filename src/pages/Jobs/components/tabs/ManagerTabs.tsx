
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";
import { FinancialData } from "../../hooks/financial-data/types";

interface ManagerTabsProps {
  jobTimer: number;
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  totalRevenue: number;
  totalCosts: number;
  totalBills: number;
  extractedFinancialData: FinancialData[];
  onUpdateInvoiceTotals: (total: number) => void;
  onUpdateCostsTotals: (total: number) => void;
  onUpdateBillsTotals: (total: number) => void;
}

export const ManagerTabs: React.FC<ManagerTabsProps> = ({
  jobTimer,
  tabNotes,
  setTabNotes,
  totalRevenue,
  totalCosts,
  totalBills,
  extractedFinancialData,
  onUpdateBillsTotals,
  onUpdateCostsTotals,
  onUpdateInvoiceTotals
}) => {
  return (
    <>
      <TabsTrigger value="bills">Bills</TabsTrigger>
      <TabsTrigger value="costs">Costs</TabsTrigger>
      <TabsTrigger value="financials">Financials</TabsTrigger>
      <TabsTrigger value="conversations">
        <span className="relative">
          Customer Conversations
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </span>
      </TabsTrigger>
    </>
  );
};
