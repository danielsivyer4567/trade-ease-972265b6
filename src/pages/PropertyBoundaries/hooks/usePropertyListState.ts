
import { useState, useCallback, useMemo } from 'react';
import { Property } from '../types';
import Fuse from 'fuse.js';
import { toast } from 'sonner';

export const usePropertyListState = (
  properties: Property[],
  searchQuery: string,
  selectedProperty: Property | null,
  onPropertySelect: (property: Property) => void
) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  // Initialize Fuse for fuzzy search
  const fuse = useMemo(() => new Fuse(properties, {
    keys: ['name', 'description', 'address'],
    threshold: 0.3
  }), [properties]);

  // Get address previews based on search query
  const addressPreviews = useMemo(() => {
    if (!searchQuery) return [];
    const results = fuse.search(searchQuery);
    return results.slice(0, 5).map(result => result.item.address || '');
  }, [searchQuery, fuse]);

  // Filter properties based on search query
  const filteredProperties = useMemo(() => {
    if (!searchQuery) return properties;
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, fuse, properties]);

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
