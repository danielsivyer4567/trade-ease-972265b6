
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package2, Search, Plus, ArrowDown, FileSpreadsheet, Files, Import } from "lucide-react";
import { toast } from "sonner";
import { PriceListItem } from '@/pages/Quotes/components/PriceList/types';
import { supabase } from '@/integrations/supabase/client';
import { parseTextTemplate, parseCSVTemplate } from '@/utils/templateUtils';

interface ImportPriceListItemsProps {
  onImportItems: (items: Array<{name: string, quantity: string, unit: string}>) => void;
}

export function ImportPriceListItems({ onImportItems }: ImportPriceListItemsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceItems, setPriceItems] = useState<PriceListItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        // Detect file type and parse accordingly
        if (file.name.endsWith('.csv')) {
          processCSVContent(content);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          toast.error("Excel format requires conversion to CSV. Please export as CSV.");
        } else {
          toast.error("Unsupported file format. Please use CSV.");
        }
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error("Failed to parse file");
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const processCSVContent = (content: string) => {
    try {
      // Basic CSV parsing - handles simple CSV format
      const lines = content.split('\n').filter(line => line.trim() !== '');
      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
      
      // Check for required columns
      const nameIndex = headers.findIndex(h => h === 'name' || h === 'item' || h === 'description' || h === 'product');
      const quantityIndex = headers.findIndex(h => h === 'quantity' || h === 'qty' || h === 'amount');
      const unitIndex = headers.findIndex(h => h === 'unit' || h === 'uom' || h === 'measure');
      
      if (nameIndex === -1) {
        toast.error("CSV file must contain a 'name' or 'item' or 'description' column");
        return;
      }
      
      // Process rows
      const items = lines.slice(1).map(line => {
        const columns = line.split(',').map(col => col.trim());
        return {
          name: columns[nameIndex] || '',
          quantity: quantityIndex >= 0 ? columns[quantityIndex] || '1' : '1',
          unit: unitIndex >= 0 ? columns[unitIndex] || 'pieces' : 'pieces'
        };
      }).filter(item => item.name);
      
      if (items.length === 0) {
        toast.error("No valid items found in file");
        return;
      }
      
      onImportItems(items);
      setUploadMode(false);
      setIsOpen(false);
      toast.success(`Imported ${items.length} items from CSV file`);
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error("Failed to process CSV file");
    }
  };

  const toggleUploadMode = () => {
    setUploadMode(!uploadMode);
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
    <Card className="mt-4 relative">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package2 className="h-5 w-5 text-blue-500" />
          Import from Price List
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 right-2 rounded-full h-8 w-8" 
          onClick={() => setIsOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tab-like selection */}
          <div className="flex gap-2 mb-4">
            <Button 
              variant={!uploadMode ? "default" : "outline"} 
              size="sm"
              onClick={() => setUploadMode(false)}
              className="flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              Search Price List
            </Button>
            <Button 
              variant={uploadMode ? "default" : "outline"} 
              size="sm"
              onClick={toggleUploadMode}
              className="flex items-center gap-1"
            >
              <Files className="h-4 w-4" />
              Import from CSV
            </Button>
          </div>

          {uploadMode ? (
            <div className="border rounded-lg p-6 bg-slate-50 space-y-4">
              <div className="text-center">
                <Files className="h-12 w-12 mx-auto text-blue-500 mb-2" />
                <h3 className="text-lg font-medium mb-1">Import from CSV</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file with columns for name, quantity, and unit
                </p>
                
                <div className="flex flex-col gap-4 items-center">
                  <div className="bg-white p-3 rounded border text-xs text-slate-700 max-w-md">
                    <p className="font-medium mb-1">CSV Format Example:</p>
                    <code>name,quantity,unit<br/>Copper Pipe,5,meters<br/>Electrical Outlet,3,pieces</code>
                  </div>
                  
                  <Input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".csv" 
                    className="max-w-xs"
                    onChange={handleFileUpload}
                  />
                  
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" onClick={() => setUploadMode(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
