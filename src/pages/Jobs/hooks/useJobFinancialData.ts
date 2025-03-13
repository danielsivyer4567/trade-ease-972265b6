
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useJobFinancialData = (jobId: string | undefined) => {
  const [extractedFinancialData, setExtractedFinancialData] = useState<any[]>([]);
  const [tabNotes, setTabNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!jobId) return;
    
    const loadFinancialData = async () => {
      try {
        const storageKey = `job-${jobId}-financial-data`;
        const storedData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (storedData.length > 0) {
          setExtractedFinancialData(storedData);
        }
        
        // Also check Supabase for any stored financial data
        const { data, error } = await supabase
          .from('job_financial_data')
          .select('*')
          .eq('job_id', jobId);
          
        if (!error && data && data.length > 0) {
          // Format the data to match our expected structure
          const formattedData = data.map(item => ({
            ...item.extracted_data,
            id: item.id,
            status: item.status
          }));
          
          // Merge with local storage data
          const mergedData = [...storedData];
          
          // Add any items from Supabase that aren't in localStorage
          formattedData.forEach(item => {
            if (!mergedData.some(m => m.timestamp === item.timestamp)) {
              mergedData.push(item);
            }
          });
          
          setExtractedFinancialData(mergedData);
          localStorage.setItem(storageKey, JSON.stringify(mergedData));
        }
      } catch (error) {
        console.error("Error loading financial data:", error);
      }
    };
    
    loadFinancialData();
  }, [jobId]);

  const handleFinancialDataExtracted = (newData: any) => {
    setExtractedFinancialData(prev => [...prev, newData]);
    
    // Update localStorage
    if (jobId) {
      const storageKey = `job-${jobId}-financial-data`;
      const storedData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...storedData, newData]));
    }
    
    // Update job notes with the extracted financial data
    setTabNotes(prev => ({
      ...prev,
      financials: `${prev.financials || ''}\n\nExtracted amount of $${newData.amount.toFixed(2)} from document "${newData.source}" on ${new Date().toLocaleString()}`
    }));
    
    toast.success(`Financial data has been extracted and added to the job`);
  };

  return {
    extractedFinancialData,
    tabNotes,
    setTabNotes,
    handleFinancialDataExtracted
  };
};
