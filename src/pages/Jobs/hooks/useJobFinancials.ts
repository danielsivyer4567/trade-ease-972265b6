
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useJobFinancials = (jobId?: string) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [autoProcessedInvoices, setAutoProcessedInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      // In a real implementation, this would fetch actual invoice data from Supabase
      // This is a mock implementation
      setIsLoading(true);
      setTimeout(() => {
        // Mock data for auto-processed invoices
        const mockInvoices = [
          {
            id: "inv-1",
            supplierName: "Smith Building Materials",
            invoiceNumber: "INV-2023-001",
            date: "2023-12-01",
            amount: 584.25,
            status: "processed",
            items: [
              { description: "2x4 Lumber", quantity: 24, unitPrice: 15.75 },
              { description: "Nails 3\"", quantity: 5, unitPrice: 12.50 }
            ]
          },
          {
            id: "inv-2",
            supplierName: "Northwest Lumber Co.",
            invoiceNumber: "NL-5692",
            date: "2023-12-05",
            amount: 345.00,
            status: "processed",
            items: [
              { description: "Plywood 4x8", quantity: 10, unitPrice: 34.50 }
            ]
          }
        ];
        
        setAutoProcessedInvoices(mockInvoices);
        
        // Calculate totals based on mock data
        const invoiceTotal = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        setTotalCosts(invoiceTotal);
        setTotalBills(250); // Mock value for other bills
        setTotalRevenue(1500); // Mock value for revenue
        
        setIsLoading(false);
      }, 1000);
    }
  }, [jobId]);

  const handleUpdateInvoiceTotals = (amount: number) => {
    setTotalRevenue(prev => prev + amount);
  };

  const handleUpdateCostsTotals = (amount: number) => {
    setTotalCosts(prev => prev + amount);
  };

  const handleUpdateBillsTotals = (amount: number) => {
    setTotalBills(prev => prev + amount);
  };
  
  const processNewInvoice = async (invoiceData: any) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would call the Supabase function to process the invoice
      const { data, error } = await supabase.functions.invoke('process-invoice', {
        body: invoiceData
      });
      
      if (error) throw error;
      
      // Update local state with new invoice
      setAutoProcessedInvoices(prev => [...prev, {
        ...invoiceData,
        id: `inv-${Date.now()}`,
        status: 'processed'
      }]);
      
      // Update totals
      setTotalCosts(prev => prev + invoiceData.totalAmount);
      
      return { success: true, data };
    } catch (error) {
      console.error("Error processing invoice:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    totalRevenue,
    totalCosts,
    totalBills,
    autoProcessedInvoices,
    isLoading,
    handleUpdateInvoiceTotals,
    handleUpdateCostsTotals,
    handleUpdateBillsTotals,
    processNewInvoice
  };
};
