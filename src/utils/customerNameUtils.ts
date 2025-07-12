import { customerService } from '@/services/CustomerService';

// Cache for customer names to avoid repeated API calls
const customerNameCache = new Map<string, string>();

/**
 * Formats a full name to "First Name + Last Initial" format
 * e.g., "John Smith" -> "John S."
 */
export function formatCustomerName(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return 'Customer';
  }
  
  const nameParts = fullName.trim().split(/\s+/);
  
  if (nameParts.length === 1) {
    return nameParts[0];
  }
  
  const firstName = nameParts[0];
  const lastInitial = nameParts[nameParts.length - 1][0]?.toUpperCase();
  
  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
}

/**
 * Detects if a path is a customer detail path
 * Matches: /customers/:id, /customers/:id/details, /customers/:id/edit, etc.
 */
export function isCustomerPath(path: string): { isCustomer: boolean; customerId?: string } {
  const customerPathRegex = /^\/customers\/([^\/]+)(?:\/.*)?$/;
  const match = path.match(customerPathRegex);
  
  if (match && match[1] && match[1] !== 'new' && match[1] !== 'external' && match[1] !== 'console') {
    return { isCustomer: true, customerId: match[1] };
  }
  
  return { isCustomer: false };
}

/**
 * Gets customer name for tab title, with caching
 */
export async function getCustomerTabTitle(customerId: string): Promise<string> {
  // Check cache first
  if (customerNameCache.has(customerId)) {
    return customerNameCache.get(customerId)!;
  }
  
  try {
    const customer = await customerService.getCustomerProfile(customerId);
    
    if (customer?.name) {
      const formattedName = formatCustomerName(customer.name);
      customerNameCache.set(customerId, formattedName);
      return formattedName;
    }
  } catch (error) {
    console.warn('Failed to fetch customer name for tab title:', error);
  }
  
  // Fallback to generic title
  const fallbackTitle = 'Customer';
  customerNameCache.set(customerId, fallbackTitle);
  return fallbackTitle;
}

/**
 * Clears customer name cache (useful when customer data is updated)
 */
export function clearCustomerNameCache(customerId?: string): void {
  if (customerId) {
    customerNameCache.delete(customerId);
  } else {
    customerNameCache.clear();
  }
}