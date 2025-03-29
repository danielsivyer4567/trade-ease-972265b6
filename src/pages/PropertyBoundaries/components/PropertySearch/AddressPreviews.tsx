
import React from 'react';
import { MapPin } from 'lucide-react';

interface AddressPreviewsProps {
  addressPreviews: string[];
  onAddressClick: (address: string) => void;
}

export const AddressPreviews: React.FC<AddressPreviewsProps> = ({ 
  addressPreviews, 
  onAddressClick 
}) => {
  if (addressPreviews.length === 0) return null;
  
  return (
    <div className="absolute z-10 left-0 right-0 bg-white border border-slate-200 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
      {addressPreviews.map((address, index) => (
        <div 
          key={`address-${index}`}
          className="p-3 hover:bg-slate-100 cursor-pointer flex items-start gap-2 border-b border-slate-100 last:border-b-0"
          onClick={() => onAddressClick(address)}
        >
          <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
          <span className="text-sm">{address}</span>
        </div>
      ))}
    </div>
  );
};
