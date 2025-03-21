
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FinancialData, JobFinancialDataHookReturn } from './financial-data/types';
import { getFinancialDataFromStorage, addFinancialDataToStorage } from './financial-data/storage';
import { createTablesIfNeeded, fetchFinancialDataFromDatabase } from './financial-data/database';

export const useJobFinancialData = (jobId: string | undefined): JobFinancialDataHookReturn => {
  const [extractedFinancialData, setExtractedFinancialData] = useState<FinancialData[]>([]);
  const [tabNotes, setTabNotes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Create the necessary tables if they don't exist
  useEffect(() => {
    createTablesIfNeeded();
  }, []);

  useEffect(() => {
    if (!jobId) return;
    
    const loadFinancialData = async () => {
      setIsLoading(true);
      try {
        console.log("Loading financial data for job:", jobId);
        
        // Get data from local storage first
        const storedData = getFinancialDataFromStorage(jobId);
        if (storedData.length > 0) {
          console.log("Found data in local storage:", storedData.length, "items");
          setExtractedFinancialData(storedData);
        }
        
        // Also check Supabase for any stored financial data
        try {
          const dbData = await fetchFinancialDataFromDatabase(jobId);
          
          if (dbData.length > 0) {
            // Merge with local storage data
            const mergedData = [...storedData];
            
            // Add any items from Supabase that aren't in localStorage
            dbData.forEach(item => {
              if (!mergedData.some(m => m.timestamp === item.timestamp)) {
                mergedData.push(item);
              }
            });
            
            setExtractedFinancialData(mergedData);
            addFinancialDataToStorage(jobId, mergedData[mergedData.length - 1]);
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

  const handleFinancialDataExtracted = (newData: FinancialData) => {
    console.log("New financial data extracted:", newData);
    setExtractedFinancialData(prev => [...prev, newData]);
    
    // Update localStorage
    if (jobId) {
      addFinancialDataToStorage(jobId, newData);
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
