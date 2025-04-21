/**
 * Extracts description from text based on keyword indicators
 */
export const extractDescription = (text: string): string | null => {
  const fullText = text.toLowerCase();
  const descriptionKeywords = ["description:", "details:", "item:", "service:"];
  
  for (const keyword of descriptionKeywords) {
    const keywordIndex = fullText.indexOf(keyword);
    if (keywordIndex !== -1) {
      const afterKeyword = fullText.substring(keywordIndex + keyword.length).trim();
      return afterKeyword.split(/[\n\r,.]/)[0].trim();
    }
  }
  
  return null;
};
