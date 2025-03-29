
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
  
  // Completely revised address search for better matching
  const searchAddressMatches = (address: string, query: string): boolean => {
    if (!address || !query) return false;
    
    const addressLower = address.toLowerCase();
    const queryLower = query.toLowerCase().trim();
    
    // Direct matching - quickest check first
    if (addressLower.includes(queryLower)) return true;
    
    // Split both address and query into parts for more flexible matching
    const addressParts = addressLower.split(/[\s,]+/).filter(part => part.length > 1);
    const queryParts = queryLower.split(/[\s,]+/).filter(part => part.length > 1);
    
    if (queryParts.length === 0) return false;
    
    // Check if any query part is a street number
    const hasStreetNumber = queryParts.some(part => /^\d+$/.test(part));
    
    // If looking for a specific street number, be more strict in matching
    if (hasStreetNumber) {
      // For street numbers, most parts should match
      const requiredMatches = Math.ceil(queryParts.length * 0.75);
      const matches = queryParts.filter(part => addressLower.includes(part)).length;
      return matches >= requiredMatches;
    }
    
    // For general street names, be more flexible
    // Check if significant parts of the query appear in the address
    // "Collins Street" should match "123 Collins Street, Melbourne"
    const significantMatches = queryParts.filter(part => {
      // Consider words like "street", "road", etc. as significant
      const isSignificant = part.length > 3 || 
                          ['st', 'rd', 'ave', 'ln', 'dr', 'ct'].includes(part);
      return isSignificant && addressLower.includes(part);
    }).length;
    
    // Match if we have significant matches
    return significantMatches > 0;
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
    
    // Enhanced address matching with better recognition of street names
    const addressMatch = prop.address ? searchAddressMatches(prop.address, query) : false;
    
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
  
  // Handle search button click
  const handleSearchClick = useCallback(() => {
    // If we have filtered results, select the first one
    if (filteredProperties.length > 0) {
      onPropertySelect(filteredProperties[0]);
    }
    setIsPreviewVisible(false);
  }, [filteredProperties, onPropertySelect]);
  
  return {
    addressPreviews,
    isPreviewVisible,
    setIsPreviewVisible,
    filteredProperties,
    handleKeyPress,
    handleAddressPreviewClick,
    handleSearchClick
  };
};
