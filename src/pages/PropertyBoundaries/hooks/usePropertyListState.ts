
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Property } from '../types';
import Fuse from 'fuse.js';
import { toast } from 'sonner';
import { searchProperties } from '../services/propertyBoundariesService';

export const usePropertyListState = (
  properties: Property[],
  searchQuery: string,
  selectedProperty: Property | null,
  onPropertySelect: (property: Property) => void
) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTotal, setSearchTotal] = useState(0);

  // Initialize Fuse for local fuzzy search (used for address previews)
  const fuse = useMemo(() => new Fuse(properties, {
    keys: ['name', 'description', 'address'],
    threshold: 0.3
  }), [properties]);

  // Get address previews based on search query (client-side)
  const addressPreviews = useMemo(() => {
    if (!searchQuery) return [];
    const results = fuse.search(searchQuery);
    return results.slice(0, 5).map(result => result.item.address || '');
  }, [searchQuery, fuse]);

  // Search properties from the server when searchQuery changes
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const { data, pagination, error } = await searchProperties(searchQuery);
          
          if (error) {
            console.error('Search error:', error);
            toast.error('Error searching properties');
          } else if (data) {
            setSearchResults(data);
            setSearchTotal(pagination.total);
          }
        } catch (error) {
          console.error('Error during search:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        // If search query is too short, use the passed properties
        setSearchResults([]);
      }
    }, 500); // Debounce search requests

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Filter properties based on search query
  const filteredProperties = useMemo(() => {
    if (searchQuery.length > 2 && searchResults.length > 0) {
      // Use server-side search results if available
      return searchResults;
    } else if (!searchQuery) {
      // Return all properties if no search query
      return properties;
    } else {
      // Fall back to client-side filtering for short queries
      return fuse.search(searchQuery).map(result => result.item);
    }
  }, [searchQuery, fuse, properties, searchResults]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && addressPreviews.length > 0) {
      const property = properties.find(p => p.address === addressPreviews[0]);
      if (property) {
        onPropertySelect(property);
        setIsPreviewVisible(false);
      }
    }
  }, [addressPreviews, properties, onPropertySelect]);

  const handleAddressPreviewClick = useCallback((address: string) => {
    const property = properties.find(p => p.address === address);
    if (property) {
      onPropertySelect(property);
      setIsPreviewVisible(false);
    }
  }, [properties, onPropertySelect]);

  const handleSearchClick = useCallback(() => {
    if (!searchQuery) {
      toast.warning('Please enter a search term');
      return;
    }
    
    if (addressPreviews.length > 0) {
      const property = properties.find(p => p.address === addressPreviews[0]);
      if (property) {
        onPropertySelect(property);
        setIsPreviewVisible(false);
      }
    } else {
      toast.info('No matching properties found');
    }
  }, [searchQuery, addressPreviews, properties, onPropertySelect]);

  // Load more results (for pagination)
  const loadMoreResults = useCallback(async () => {
    if (searchQuery.length < 3) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await searchProperties(
        searchQuery, 
        20, 
        searchResults.length
      );
      
      if (error) {
        console.error('Error loading more properties:', error);
        toast.error('Failed to load more properties');
      } else if (data) {
        setSearchResults(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error('Error during pagination:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, searchResults.length]);

  return {
    addressPreviews,
    isPreviewVisible,
    setIsPreviewVisible,
    filteredProperties,
    handleKeyPress,
    handleAddressPreviewClick,
    handleSearchClick,
    isSearching,
    searchTotal,
    loadMoreResults
  };
};
