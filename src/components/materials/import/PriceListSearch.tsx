
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { PriceListItem } from '@/pages/Quotes/components/PriceList/types';

interface PriceListSearchProps {
  onImport: (items: Array<{name: string, quantity: string, unit: string}>) => void;
  onCancel: () => void;
}

export function PriceListSearch({ onImport, onCancel }: PriceListSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceItems, setPriceItems] = useState<PriceListItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchPriceListItems = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('price_list_items')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching price list items:', error);
        toast.error("Failed to load price list items");
        return;
      }
      
      if (data) {
        const formattedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: parseFloat(item.price),
          description: item.description || ""
        }));
        
        setPriceItems(formattedData);
      }
    } catch (error) {
      console.error('Error in fetchPriceListItems:', error);
      toast.error("Failed to load price list items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceListItems();
  }, []);

  const toggleItem = (id: string) => {
    setSelectedItems({
      ...selectedItems,
      [id]: !selectedItems[id]
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    fetchPriceListItems();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchPriceListItems();
    }
  };

  const handleImport = () => {
    const selectedItemsArray = priceItems
      .filter(item => selectedItems[item.id])
      .map(item => ({
        name: item.name,
        quantity: "1",
        unit: "pieces"
      }));
    
    if (selectedItemsArray.length === 0) {
      toast.warning("No items selected for import");
      return;
    }
    
    onImport(selectedItemsArray);
    toast.success(`Imported ${selectedItemsArray.length} items from price list`);
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search price list..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  {isLoading 
                    ? "Loading items..." 
                    : "No price list items found. Try a different search term."}
                </TableCell>
              </TableRow>
            ) : (
              priceItems.map(item => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-slate-50" onClick={() => toggleItem(item.id)}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={!!selectedItems[item.id]} 
                      onChange={() => toggleItem(item.id)} 
                      className="w-4 h-4" 
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={Object.values(selectedItems).filter(Boolean).length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Import Selected Items
        </Button>
      </div>
    </>
  );
}
