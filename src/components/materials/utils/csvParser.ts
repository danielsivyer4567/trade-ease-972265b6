
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
      const columns = line.split(',').map(col => col.trim());
      return {
        name: columns[nameIndex] || '',
        quantity: quantityIndex >= 0 ? columns[quantityIndex] || '1' : '1',
        unit: unitIndex >= 0 ? columns[unitIndex] || 'pieces' : 'pieces'
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
