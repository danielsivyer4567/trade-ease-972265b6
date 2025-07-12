
import { FinancialData } from '../types';
import { extractAmounts, findMaxAmount } from './extractors/amountExtractor';
import { extractDate } from './extractors/dateExtractor';
import { extractVendor } from './extractors/vendorExtractor';
import { extractDescription } from './extractors/descriptionExtractor';
import { determineCategory } from './extractors/categoryExtractor';

/**
 * Creates a FinancialData object from extracted components
 */
const createFinancialDataObject = (
  amount: number,
  vendor: string | null,
  date: string | null,
  description: string | null,
  category: string,
  docName: string,
  jobId: string
): FinancialData => {
  return {
    amount,
    vendor: vendor || undefined,
    date: date || undefined,
    description: description || undefined,
    source: docName,
    timestamp: new Date().toISOString(),
    jobId,
    category
  };
};

/**
 * Main function to extract financial data from document text
 */
export const extractFinancialData = (text: string, docName: string, jobId: string): FinancialData | null => {
  try {
    // Get the full text from OCR
    const fullText = text.toLowerCase();
    
    // Extract amounts using regex
    const amounts = extractAmounts(fullText);
    
    if (amounts.length === 0) {
      throw new Error("No financial amounts found in the document");
    }
    
    // Find the largest amount (likely the total)
    const maxAmount = findMaxAmount(amounts);
    
    if (maxAmount === null) {
      throw new Error("Could not determine maximum amount");
    }
    
    // Try to extract date
    const date = extractDate(fullText);
    
    // Try to extract vendor name
    const vendor = extractVendor(fullText);
    
    // Try to extract description
    const description = extractDescription(fullText);
    
    // Determine document category
    const category = determineCategory(fullText);
    
    // Create and return the financial data object
    return createFinancialDataObject(
      maxAmount,
      vendor,
      date,
      description,
      category,
      docName,
      jobId
    );
    
  } catch (error) {
    console.error("Error extracting financial data:", error);
    return null;
  }
};
