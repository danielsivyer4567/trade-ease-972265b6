
import React from 'react';
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
  return (
    <div className="relative mb-4">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by address, name, or description..."
        className="pl-8"
        value={searchQuery}
        onChange={onSearchChange}
        onKeyDown={onKeyDown}
        onFocus={() => setIsPreviewVisible(addressPreviews.length > 0)}
        onBlur={() => setTimeout(() => setIsPreviewVisible(false), 200)}
      />
      
      {/* Address Preview */}
      {isPreviewVisible && addressPreviews.length > 0 && (
        <AddressPreviews 
          addressPreviews={addressPreviews} 
          onAddressClick={onAddressPreviewClick} 
        />
      )}
    </div>
  );
};
