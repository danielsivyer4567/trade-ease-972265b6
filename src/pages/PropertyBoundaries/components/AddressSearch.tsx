import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, MapPin, Plus } from "lucide-react";
import { usePropertyBoundaries } from '../hooks/usePropertyBoundaries';

export const AddressSearch: React.FC = () => {
  const {
    addressSearchQuery,
    setAddressSearchQuery,
    isSearching,
    searchResults,
    handleAddressSearch,
    handleAddressComponentSearch,
    handleAddPropertyFromSearch
  } = usePropertyBoundaries();

  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postcode, setPostcode] = useState('');

  const handleFullAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddressSearch(addressSearchQuery);
  };

  const handleComponentsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddressComponentSearch(houseNumber, streetName, suburb, postcode);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Search</CardTitle>
        <CardDescription>
          Search for property boundaries by address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="full-address">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="full-address">Full Address</TabsTrigger>
            <TabsTrigger value="components">Address Components</TabsTrigger>
          </TabsList>
          
          <TabsContent value="full-address">
            <form onSubmit={handleFullAddressSubmit} className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter full address..."
                  value={addressSearchQuery}
                  onChange={(e) => setAddressSearchQuery(e.target.value)}
                  disabled={isSearching}
                />
                <Button type="submit" disabled={isSearching || !addressSearchQuery.trim()}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="components">
            <form onSubmit={handleComponentsSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="house-number" className="block text-sm font-medium text-gray-700">
                    House Number
                  </label>
                  <Input
                    id="house-number"
                    placeholder="e.g. 123"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    disabled={isSearching}
                  />
                </div>
                <div>
                  <label htmlFor="street-name" className="block text-sm font-medium text-gray-700">
                    Street Name
                  </label>
                  <Input
                    id="street-name"
                    placeholder="e.g. Main Street"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    disabled={isSearching}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="suburb" className="block text-sm font-medium text-gray-700">
                    Suburb
                  </label>
                  <Input
                    id="suburb"
                    placeholder="e.g. Brisbane"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    disabled={isSearching}
                  />
                </div>
                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                    Postcode
                  </label>
                  <Input
                    id="postcode"
                    placeholder="e.g. 4000"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    disabled={isSearching}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSearching || (!houseNumber.trim() || !streetName.trim())}
              >
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Search
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium">Search Results ({searchResults.length})</h3>
            <div className="max-h-80 overflow-y-auto mt-2 space-y-3">
              {searchResults.map((result, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                        {result.address || 'Property'}
                      </h4>
                      {result.properties && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {Object.entries(result.properties)
                            .filter(([key]) => 
                              ['HOUSE_NUMBER', 'CORRIDOR_NAME', 'SUBURB', 'POSTCODE'].includes(key))
                            .map(([key, value]) => `${value}`)
                            .join(' ')}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAddPropertyFromSearch(result)}
                      title="Add this property"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {searchResults.length > 0 && (
        <CardFooter className="border-t pt-3 flex justify-between">
          <p className="text-xs text-muted-foreground">
            Click the + button to add a property to your list
          </p>
        </CardFooter>
      )}
    </Card>
  );
}; 