
import { FinancialData } from './types';

export const getFinancialDataFromStorage = (jobId: string): FinancialData[] => {
  if (!jobId) return [];
  
  try {
    const storageKey = `job-${jobId}-financial-data`;
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (error) {
    console.error("Error parsing financial data from local storage:", error);
    return [];
  }
};

export const saveFinancialDataToStorage = (jobId: string, data: FinancialData[]): void => {
  if (!jobId) return;
  
  try {
    const storageKey = `job-${jobId}-financial-data`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving financial data to local storage:", error);
  }
};

export const addFinancialDataToStorage = (jobId: string, newData: FinancialData): FinancialData[] => {
  if (!jobId) return [];
  
  try {
    const existingData = getFinancialDataFromStorage(jobId);
    const updatedData = [...existingData, newData];
    saveFinancialDataToStorage(jobId, updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error adding financial data to storage:", error);
    return [];
  }
};
