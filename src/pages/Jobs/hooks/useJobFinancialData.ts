
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useJobFinancialData = (jobId: string | undefined) => {
  const [extractedFinancialData, setExtractedFinancialData] = useState<any[]>([]);
  const [tabNotes, setTabNotes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Create the necessary tables if they don't exist
  useEffect(() => {
    const createTables = async () => {
      try {
        await supabase.functions.invoke('create-tables');
      } catch (error) {
        console.error("Error creating tables:", error);
      }
    };
    
    createTables();
  }, []);

  useEffect(() => {
    if (!jobId) return;
    
    const loadFinancialData = async () => {
      setIsLoading(true);
      try {
        console.log("Loading financial data for job:", jobId);
        const storageKey = `job-${jobId}-financial-data`;
        const storedData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (storedData.length > 0) {
          console.log("Found data in local storage:", storedData.length, "items");
          setExtractedFinancialData(storedData);
        }
        
        // Also check Supabase for any stored financial data
        try {
          console.log("Checking database for financial data...");
          const { data, error } = await supabase
            .from('job_financial_data')
            .select('*')
            .eq('job_id', jobId);
            
          if (error) {
            if (error.message.includes("relation") && error.message.includes("does not exist")) {
              console.log("Table doesn't exist yet, will be created when needed");
            } else {
              console.error("Database error:", error);
            }
          } else if (data && data.length > 0) {
            console.log("Found data in database:", data.length, "items");
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
        } catch (dbError) {
          console.error("Error querying database:", dbError);
          // Just continue with localStorage data
        }
      } catch (error) {
        console.error("Error loading financial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFinancialData();
  }, [jobId]);

  const handleFinancialDataExtracted = (newData: any) => {
    console.log("New financial data extracted:", newData);
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
    handleFinancialDataExtracted,
    isLoading
  };
};
