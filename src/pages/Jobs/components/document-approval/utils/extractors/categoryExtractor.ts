
/**
 * Determines document category based on keyword analysis
 */
export const determineCategory = (text: string): string => {
  const fullText = text.toLowerCase();
  
  if (fullText.includes("invoice") || fullText.includes("inv#")) {
    return "invoice";
  } else if (fullText.includes("receipt")) {
    return "receipt";
  } else if (fullText.includes("quote") || fullText.includes("estimate")) {
    return "quote";
  } else if (fullText.includes("bill") || fullText.includes("statement")) {
    return "bill";
  }
  
  return "unknown";
};
