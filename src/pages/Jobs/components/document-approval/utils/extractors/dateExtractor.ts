
/**
 * Extracts date from text using regex patterns
 */
export const extractDate = (text: string): string | null => {
  const fullText = text.toLowerCase();
  const dateRegex = /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)?\d{2}\b/g;
  
  const dates = fullText.match(dateRegex);
  return dates ? dates[0] : null;
};
