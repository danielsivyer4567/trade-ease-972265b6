
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package2, Search, Plus, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { PriceListItem } from '@/pages/Quotes/components/PriceList/types';
import { supabase } from '@/integrations/supabase/client';

interface ImportPriceListItemsProps {
  onImportItems: (items: Array<{name: string, quantity: string, unit: string}>) => void;
}

export function ImportPriceListItems({ onImportItems }: ImportPriceListItemsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceItems, setPriceItems] = useState<PriceListItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    
    onImportItems(selectedItemsArray);
    setSelectedItems({});
    setIsOpen(false);
    toast.success(`Imported ${selectedItemsArray.length} items from price list`);
  };

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => {
          setIsOpen(true);
          fetchPriceListItems();
        }}
      >
        <ArrowDown className="h-4 w-4" />
        Import from Price List
      </Button>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package2 className="h-5 w-5 text-blue-500" />
          Import from Price List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
            <Button variant="outline" onClick={() => setIsOpen(false)}>
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
        </div>
      </CardContent>
    </Card>
  );
}
