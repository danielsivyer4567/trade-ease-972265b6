
/**
 * Extracts monetary amounts from text using regex patterns
 */
export const extractAmounts = (text: string): number[] => {
  const fullText = text.toLowerCase();
  const currencyRegex = /\$\s*(\d{1,3}(,\d{3})*(\.\d{2})?)/g;
  
  const amounts: number[] = [];
  let match;
  
  while ((match = currencyRegex.exec(fullText)) !== null) {
    amounts.push(parseFloat(match[1].replace(/,/g, '')));
  }
  
  return amounts;
};

/**
 * Gets the maximum amount from a list of extracted amounts
 */
export const findMaxAmount = (amounts: number[]): number | null => {
  if (amounts.length === 0) return null;
  return Math.max(...amounts);
};
