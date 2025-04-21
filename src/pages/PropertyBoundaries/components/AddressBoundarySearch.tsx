import { useState, useRef, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface AddressBoundarySearchProps {
  onSearch: (address: string) => Promise<void>;
  isSearching: boolean;
}

export function AddressBoundarySearch({ onSearch, isSearching }: AddressBoundarySearchProps) {
  const [address, setAddress] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast.error('Please enter an address to search');
      inputRef.current?.focus();
      return;
    }
    
    // Call the search function
    await onSearch(address);
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Search Property by Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Enter full address (e.g., 300 Annerley Rd, Annerley, QLD)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full"
              disabled={isSearching}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a complete address to search for the property boundary
            </p>
          </div>
          <Button type="submit" disabled={isSearching || !address.trim()}>
            {isSearching ? 'Searching...' : 'Search Address'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        Property boundaries are sourced from ArcGIS data services
      </CardFooter>
    </Card>
  );
} 