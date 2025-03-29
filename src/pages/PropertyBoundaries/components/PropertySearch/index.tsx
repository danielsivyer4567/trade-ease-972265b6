
import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AddressPreviews } from './AddressPreviews';

interface PropertySearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addressPreviews: string[];
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;
  onAddressPreviewClick: (address: string) => void;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({
  searchQuery,
  onSearchChange,
  onKeyDown,
  addressPreviews,
  isPreviewVisible,
  setIsPreviewVisible,
  onAddressPreviewClick
}) => {
  const blurTimeoutRef = useRef<number | null>(null);

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsPreviewVisible(addressPreviews.length > 0);
  };

  const handleBlur = () => {
    // Delay hiding the preview to allow for clicking on it
    blurTimeoutRef.current = window.setTimeout(() => {
      setIsPreviewVisible(false);
    }, 200);
  };

  return (
    <div className="relative mb-4">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by address, name, or description..."
        className="pl-8"
        value={searchQuery}
        onChange={onSearchChange}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label="Property search"
      />
      
      {/* Address Preview */}
      {isPreviewVisible && (
        <AddressPreviews 
          addressPreviews={addressPreviews} 
          onAddressClick={onAddressPreviewClick} 
        />
      )}
    </div>
  );
};
