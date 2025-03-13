
import { FinancialData } from '../types';

export const extractFinancialData = (text: string, docName: string, jobId: string): FinancialData | null => {
  try {
    // Get the full text from OCR
    const fullText = text.toLowerCase();
    
    // Advanced regex patterns to extract financial information
    const currencyRegex = /\$\s*(\d{1,3}(,\d{3})*(\.\d{2})?)/g;
    const dateRegex = /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)?\d{2}\b/g;
    const vendorKeywords = ["from:", "vendor:", "supplier:", "bill from:", "company:", "business:"];
    
    // Extract amounts
    const amounts: number[] = [];
    let match;
    while ((match = currencyRegex.exec(fullText)) !== null) {
      amounts.push(parseFloat(match[1].replace(/,/g, '')));
    }
    
    if (amounts.length === 0) {
      throw new Error("No financial amounts found in the document");
    }
    
    // Find the largest amount (likely the total)
    const maxAmount = Math.max(...amounts);
    
    // Try to extract date (use the first one found)
    const dates = fullText.match(dateRegex);
    const date = dates ? dates[0] : null;
    
    // Try to extract vendor name
    let vendor = null;
    for (const keyword of vendorKeywords) {
      const keywordIndex = fullText.indexOf(keyword);
      if (keywordIndex !== -1) {
        // Extract the text after the keyword until a newline or period
        const afterKeyword = fullText.substring(keywordIndex + keyword.length).trim();
        vendor = afterKeyword.split(/[\n\r\.,]/)[0].trim();
        break;
      }
    }
    
    // Try to extract description based on contextual clues
    const descriptionKeywords = ["description:", "details:", "item:", "service:"];
    let description = null;
    for (const keyword of descriptionKeywords) {
      const keywordIndex = fullText.indexOf(keyword);
      if (keywordIndex !== -1) {
        const afterKeyword = fullText.substring(keywordIndex + keyword.length).trim();
        description = afterKeyword.split(/[\n\r\.,]/)[0].trim();
        break;
      }
    }
    
    // Determine if this is an invoice, receipt, quote, or other document type
    let category = "unknown";
    if (fullText.includes("invoice") || fullText.includes("inv#")) {
      category = "invoice";
    } else if (fullText.includes("receipt")) {
      category = "receipt";
    } else if (fullText.includes("quote") || fullText.includes("estimate")) {
      category = "quote";
    } else if (fullText.includes("bill") || fullText.includes("statement")) {
      category = "bill";
    }
    
    return {
      amount: maxAmount,
      vendor: vendor || undefined,
      date: date || undefined,
      description: description || undefined,
      source: docName,
      timestamp: new Date().toISOString(),
      jobId: jobId,
      category: category
    };
  } catch (error) {
    console.error("Error extracting financial data:", error);
    return null;
  }
};
