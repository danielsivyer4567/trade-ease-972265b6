
import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AddressPreviews } from './AddressPreviews';
import { Button } from '@/components/ui/button';

interface PropertySearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addressPreviews: string[];
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;
  onAddressPreviewClick: (address: string) => void;
  onSearchClick: () => void;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({
  searchQuery,
  onSearchChange,
  onKeyDown,
  addressPreviews,
  isPreviewVisible,
  setIsPreviewVisible,
  onAddressPreviewClick,
  onSearchClick
}) => {
  const blurTimeoutRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    // Clear any pending blur timeout
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    
    // Only show previews if we have search text and matching addresses
    if (searchQuery.trim() && addressPreviews.length > 0) {
      setIsPreviewVisible(true);
      console.log('Showing previews on focus:', addressPreviews);
    }
  };

  const handleBlur = () => {
    // Delay hiding the preview to allow for clicking on it
    blurTimeoutRef.current = window.setTimeout(() => {
      setIsPreviewVisible(false);
    }, 200);
  };
  
  const handleInputClick = () => {
    // Show previews when clicking on input if we have search text and matching addresses
    if (searchQuery.trim() && addressPreviews.length > 0) {
      setIsPreviewVisible(true);
      console.log('Showing previews on click:', addressPreviews);
    }
  };

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search by address, name, or description..."
            className="pl-8"
            value={searchQuery}
            onChange={onSearchChange}
            onKeyDown={onKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleInputClick}
            aria-label="Property search"
          />
        </div>
        <Button 
          onClick={onSearchClick} 
          className="whitespace-nowrap"
          size="sm"
        >
          Search
        </Button>
      </div>
      
      {/* Address Preview with improved visibility logic */}
      {isPreviewVisible && addressPreviews.length > 0 && (
        <AddressPreviews 
          addressPreviews={addressPreviews} 
          onAddressClick={onAddressPreviewClick} 
        />
      )}
    </div>
  );
};
