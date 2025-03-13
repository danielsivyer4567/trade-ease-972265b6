
import { useState } from "react";

export const useJobFinancials = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalBills, setTotalBills] = useState(0);

  const handleUpdateInvoiceTotals = (amount: number) => {
    setTotalRevenue(prev => prev + amount);
  };

  const handleUpdateCostsTotals = (amount: number) => {
    setTotalCosts(prev => prev + amount);
  };

  const handleUpdateBillsTotals = (amount: number) => {
    setTotalBills(prev => prev + amount);
  };

  return {
    totalRevenue,
    totalCosts,
    totalBills,
    handleUpdateInvoiceTotals,
    handleUpdateCostsTotals,
    handleUpdateBillsTotals
  };
};
