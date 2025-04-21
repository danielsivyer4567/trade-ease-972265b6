/**
 * CSV parser utilities for material imports
 */

/**
 * Process CSV content and extract material items
 */
export const processCSVContent = (content: string): Array<{name: string, quantity: string, unit: string}> => {
  try {
    // Basic CSV parsing - handles simple CSV format
    const lines = content.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }
    
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    // Check for required columns
    const nameIndex = headers.findIndex(h => h === 'name' || h === 'item' || h === 'description' || h === 'product');
    const quantityIndex = headers.findIndex(h => h === 'quantity' || h === 'qty' || h === 'amount');
    const unitIndex = headers.findIndex(h => h === 'unit' || h === 'uom' || h === 'measure');
    
    if (nameIndex === -1) {
      throw new Error("CSV file must contain a 'name' or 'item' or 'description' column");
    }
    
    // Process rows
    const items = lines.slice(1).map(line => {
      // Handle special cases where commas might be inside quotes
      const columns: string[] = [];
      let inQuotes = false;
      let currentField = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
          inQuotes = !inQuotes;
          continue;
        }
        
        if (char === ',' && !inQuotes) {
          columns.push(currentField.trim());
          currentField = '';
          continue;
        }
        
        currentField += char;
      }
      
      // Add the last field
      columns.push(currentField.trim());
      
      // Ensure we don't accidentally use undefined for missing columns
      return {
        name: columns[nameIndex] || '',
        quantity: quantityIndex >= 0 && columns[quantityIndex] ? columns[quantityIndex] : '1',
        unit: unitIndex >= 0 && columns[unitIndex] ? columns[unitIndex] : 'pieces'
      };
    }).filter(item => item.name);
    
    if (items.length === 0) {
      throw new Error("No valid items found in file");
    }
    
    return items;
  } catch (error) {
    console.error('Error processing CSV:', error);
    throw error;
  }
}
