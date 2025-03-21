
/**
 * Extracts vendor name from text based on keyword indicators
 */
export const extractVendor = (text: string): string | null => {
  const fullText = text.toLowerCase();
  const vendorKeywords = ["from:", "vendor:", "supplier:", "bill from:", "company:", "business:"];
  
  for (const keyword of vendorKeywords) {
    const keywordIndex = fullText.indexOf(keyword);
    if (keywordIndex !== -1) {
      // Extract the text after the keyword until a newline or period
      const afterKeyword = fullText.substring(keywordIndex + keyword.length).trim();
      return afterKeyword.split(/[\n\r\.,]/)[0].trim();
    }
  }
  
  return null;
};
