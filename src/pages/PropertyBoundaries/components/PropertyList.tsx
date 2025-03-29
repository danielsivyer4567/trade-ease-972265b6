
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, FileUp, Search, Ruler, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyListProps {
  properties: Property[];
  selectedProperty: Property | null;
  uploadedFile: File | null;
  searchQuery: string;
  isMeasuring: boolean;
  onPropertySelect: (property: Property) => void;
  onFileRemove: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMeasurement: () => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  selectedProperty,
  uploadedFile,
  searchQuery,
  isMeasuring,
  onPropertySelect,
  onFileRemove,
  onSearchChange,
  onToggleMeasurement
}) => {
  // Track matching addresses for preview
  const [addressPreviews, setAddressPreviews] = useState<string[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
  // Enhanced address search that breaks down addresses into components
  const searchAddressMatches = (address: string, query: string): boolean => {
    const addressLower = address.toLowerCase();
    
    // Direct contains check
    if (addressLower.includes(query)) return true;
    
    // Split query into parts and check if each part exists in address
    const queryParts = query.split(/\s+/);
    let matchCount = 0;
    
    for (const part of queryParts) {
      if (part.length > 1 && addressLower.includes(part)) {
        matchCount++;
      }
    }
    
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
    
    // More thorough address matching - check for partial matches in address parts
    const addressMatch = prop.address ? searchAddressMatches(prop.address, query) : false;
    
    // Return true if any of the fields match
    return nameMatch || descMatch || addressMatch;
  });

  // Update address previews when search query changes - fixing the dependency array
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // Extract matching addresses for preview
      const matchingAddresses = properties
        .filter(prop => {
          if (!prop.address) return false;
          const query = searchQuery.toLowerCase().trim();
          return searchAddressMatches(prop.address, query);
        })
        .map(prop => prop.address as string)
        .slice(0, 3); // Limit to top 3 matches
      
      setAddressPreviews(matchingAddresses);
      setIsPreviewVisible(matchingAddresses.length > 0);
    } else {
      setAddressPreviews([]);
      setIsPreviewVisible(false);
    }
  }, [searchQuery, properties]); // Only depend on searchQuery and properties, NOT filteredProperties
  
  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If we have filtered results, select the first one
      if (filteredProperties.length > 0) {
        onPropertySelect(filteredProperties[0]);
      }
    }
  };
  
  // Handle address preview click
  const handleAddressPreviewClick = (address: string) => {
    // Find property with this address
    const property = properties.find(p => p.address === address);
    if (property) {
      onPropertySelect(property);
      setIsPreviewVisible(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Properties</h2>
      
      {/* Search Box */}
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by address, name, or description..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsPreviewVisible(addressPreviews.length > 0)}
          onBlur={() => setTimeout(() => setIsPreviewVisible(false), 200)}
        />
        
        {/* Address Preview */}
        {isPreviewVisible && addressPreviews.length > 0 && (
          <div className="absolute z-10 left-0 right-0 bg-white border border-slate-200 rounded-md shadow-md mt-1 max-h-48 overflow-y-auto">
            {addressPreviews.map((address, index) => (
              <div 
                key={`address-${index}`}
                className="p-2 hover:bg-slate-100 cursor-pointer flex items-start gap-2"
                onClick={() => handleAddressPreviewClick(address)}
              >
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm">{address}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Properties List */}
      <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <div
              key={property.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedProperty?.id === property.id
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-secondary/10 hover:bg-primary/5 border border-transparent"
              }`}
              onClick={() => onPropertySelect(property)}
            >
              <h3 className="font-medium">{property.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {property.description}
              </p>
              {property.address && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium">Address:</span> {property.address}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No properties found
          </div>
        )}
      </div>
      
      {/* Upload Info */}
      {uploadedFile && (
        <div className="bg-secondary/20 p-3 rounded-md mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-sm">Uploaded File</h4>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {uploadedFile.name}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onFileRemove}
              className="h-7 w-7"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button variant="outline" className="w-full justify-start gap-2">
          <FileUp className="h-4 w-4" />
          Upload Property
        </Button>
        <Button 
          variant={isMeasuring ? "default" : "outline"} 
          className="w-full justify-start gap-2"
          onClick={onToggleMeasurement}
        >
          <Ruler className="h-4 w-4" />
          {isMeasuring ? "Stop Measuring" : "Measure"}
        </Button>
      </div>
    </div>
  );
};
