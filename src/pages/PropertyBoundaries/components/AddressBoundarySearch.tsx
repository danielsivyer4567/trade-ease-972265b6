import { useState, useRef, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';
import { searchAddress } from '../services/geocodeService';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddressBoundarySearchProps {
  onSearch: (address: string) => Promise<void>;
  isSearching: boolean;
}

interface AddressSuggestion {
  address: string;
  score: number;
  magicKey?: string;
  text: string;
}

export function AddressBoundarySearch({ onSearch, isSearching }: AddressBoundarySearchProps) {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch address suggestions as user types
  useEffect(() => {
    // Clear previous timeout if it exists
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Don't search for suggestions if less than 3 characters
    if (!address || address.length < 3) {
      setSuggestions([]);
      return;
    }

    // Set a timeout to avoid making too many requests while typing
    searchTimeout.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const { data, error } = await searchAddress(address);
        
        if (error) {
          console.error('Error fetching address suggestions:', error);
          return;
        }
        
        if (data && data.candidates) {
          // Map the results to a more usable format
          const formattedSuggestions: AddressSuggestion[] = data.candidates.map((candidate: any) => ({
            address: candidate.address,
            score: candidate.score,
            magicKey: candidate.magicKey,
            text: candidate.address
          }));
          
          setSuggestions(formattedSuggestions);
          
          // Open the popover if we have suggestions
          if (formattedSuggestions.length > 0) {
            setOpen(true);
          }
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      // Clean up the timeout when the component unmounts or address changes
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [address]);

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

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    setAddress(suggestion.address);
    setOpen(false);
    await onSearch(suggestion.address);
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Search Property by Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex-1 relative">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="w-full">
                  <div className="flex items-center relative">
                    <MapPin className="h-4 w-4 absolute left-3 text-muted-foreground" />
                    <Input
                      ref={inputRef}
                      placeholder="Enter address to search"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9"
                      disabled={isSearching}
                    />
                    {isLoadingSuggestions && (
                      <Loader2 className="h-4 w-4 absolute right-3 animate-spin text-muted-foreground" />
                    )}
                    {!isLoadingSuggestions && address && (
                      <X
                        className="h-4 w-4 absolute right-3 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => setAddress('')}
                      />
                    )}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[350px]" align="start">
                <Command>
                  <CommandList>
                    <CommandEmpty>No address found</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      {suggestions.map((suggestion, index) => (
                        <CommandItem
                          key={index}
                          value={suggestion.address}
                          onSelect={() => handleSelectSuggestion(suggestion)}
                          className="flex items-center"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{suggestion.address}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground mt-1">
              Enter a complete address to search for the property boundary
            </p>
          </div>
          <Button type="submit" disabled={isSearching || !address.trim()}>
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Searching...
              </>
            ) : (
              'Search Address'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        Property boundaries are sourced from ArcGIS data services
      </CardFooter>
    </Card>
  );
} 