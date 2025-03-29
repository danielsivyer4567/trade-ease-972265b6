
import { useState, useEffect, useCallback } from 'react';
import { Property } from '../types';

export const usePropertyListState = (
  properties: Property[],
  searchQuery: string,
  selectedProperty: Property | null,
  onPropertySelect: (property: Property) => void
) => {
  const [addressPreviews, setAddressPreviews] = useState<string[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
  // Improved address search that properly matches address strings
  const searchAddressMatches = (address: string, query: string): boolean => {
    if (!address || !query) return false;
    
    const addressLower = address.toLowerCase();
    const queryLower = query.toLowerCase().trim();
    
    // Direct contains check
    if (addressLower.includes(queryLower)) return true;
    
    // Split query into parts and check if each part exists in address
    const queryParts = queryLower.split(/\s+/).filter(part => part.length > 0);
    if (queryParts.length === 0) return false;
    
    // Count how many parts of the query match the address
    const matchCount = queryParts.filter(part => 
      part.length > 1 && addressLower.includes(part)
    ).length;
    
    // Match if more than half of the query parts are found
    return matchCount > 0 && matchCount >= Math.ceil(queryParts.length / 2);
  };
  
  // Filter properties based on search query with improved address search
  const filteredProperties = properties.filter(prop => {
    // If search query is empty, return all properties
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    
    // Check if property name includes search query
    const nameMatch = prop.name?.toLowerCase().includes(query) || false;
    
    // Check if property description includes search query
    const descMatch = prop.description?.toLowerCase().includes(query) || false;
    
    // More thorough address matching with proper null checking
    const addressMatch = prop.address ? searchAddressMatches(prop.address, query) : false;
    
    // Debug log to verify address matching
    if (prop.address) {
      console.log(`Checking address "${prop.address}" against query "${query}": ${addressMatch}`);
    }
    
    // Return true if any of the fields match
    return nameMatch || descMatch || addressMatch;
  });

  // Update address previews when search query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // Extract matching addresses for preview
      const matchingAddresses = properties
        .filter(prop => prop.address && searchAddressMatches(prop.address, searchQuery))
        .map(prop => prop.address as string)
        .filter((address, index, self) => self.indexOf(address) === index) // Remove duplicates
        .slice(0, 5); // Limit to top 5 matches
      
      setAddressPreviews(matchingAddresses);
      setIsPreviewVisible(matchingAddresses.length > 0);
    } else {
      setAddressPreviews([]);
      setIsPreviewVisible(false);
    }
  }, [searchQuery, properties]);
  
  // Handle keyboard navigation
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If we have filtered results, select the first one
      if (filteredProperties.length > 0) {
        onPropertySelect(filteredProperties[0]);
      }
    }
  }, [filteredProperties, onPropertySelect]);
  
  // Handle address preview click
  const handleAddressPreviewClick = useCallback((address: string) => {
    // Find property with this address
    const property = properties.find(p => p.address === address);
    if (property) {
      onPropertySelect(property);
      setIsPreviewVisible(false);
    }
  }, [properties, onPropertySelect]);
  
  return {
    addressPreviews,
    isPreviewVisible,
    setIsPreviewVisible,
    filteredProperties,
    handleKeyPress,
    handleAddressPreviewClick
  };
};
