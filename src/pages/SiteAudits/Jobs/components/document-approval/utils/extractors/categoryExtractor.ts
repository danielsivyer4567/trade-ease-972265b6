
/**
 * Determines document category based on comprehensive keyword analysis
 */
export const determineCategory = (text: string): string => {
  const fullText = text.toLowerCase();
  
  // Invoice keywords
  if (fullText.includes("invoice") || 
      fullText.includes("inv#") || 
      fullText.includes("inv #") ||
      fullText.includes("tax invoice") ||
      fullText.includes("payment due")) {
    return "invoice";
  } 
  
  // Receipt keywords
  else if (fullText.includes("receipt") || 
           fullText.includes("paid") || 
           fullText.includes("payment received") ||
           fullText.includes("thank you for your purchase") ||
           fullText.includes("payment confirmation")) {
    return "receipt";
  } 
  
  // Quote keywords
  else if (fullText.includes("quote") || 
           fullText.includes("estimate") || 
           fullText.includes("quotation") ||
           fullText.includes("proposed") ||
           fullText.includes("proposal")) {
    return "quote";
  } 
  
  // Bill keywords
  else if (fullText.includes("bill") || 
           fullText.includes("statement") || 
           fullText.includes("account summary") ||
           fullText.includes("amount due") ||
           fullText.includes("please pay")) {
    return "bill";
  }
  
  // Purchase order keywords
  else if (fullText.includes("purchase order") || 
           fullText.includes("p.o.") || 
           fullText.includes("po#") ||
           fullText.includes("order confirmation")) {
    return "purchase order";
  }
  
  // Contract keywords
  else if (fullText.includes("contract") || 
           fullText.includes("agreement") || 
           fullText.includes("terms and conditions") ||
           fullText.includes("scope of work")) {
    return "contract";
  }
  
  // If no specific category is identified
  return "unknown";
};
