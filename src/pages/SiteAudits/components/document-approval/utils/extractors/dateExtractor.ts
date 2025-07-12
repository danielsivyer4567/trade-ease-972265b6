
/**
 * Extracts date from text using multiple regex patterns to support various formats
 */
export const extractDate = (text: string): string | null => {
  const fullText = text.toLowerCase();
  
  // Common date formats
  const dateFormats = [
    // MM/DD/YYYY or MM-DD-YYYY
    /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)?\d{2}\b/g,
    
    // DD/MM/YYYY or DD-MM-YYYY
    /\b(0?[1-9]|[12]\d|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-](19|20)?\d{2}\b/g,
    
    // YYYY/MM/DD or YYYY-MM-DD
    /\b(19|20)\d{2}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])\b/g,
    
    // Month DD, YYYY (e.g., January 1, 2023)
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(0?[1-9]|[12]\d|3[01])(st|nd|rd|th)?,?\s+(19|20)\d{2}\b/gi
  ];
  
  // Try each date format
  for (const regex of dateFormats) {
    const matches = fullText.match(regex);
    if (matches && matches.length > 0) {
      return matches[0];
    }
  }
  
  return null;
};
