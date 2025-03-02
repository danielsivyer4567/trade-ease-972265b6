
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface PriceListItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface PriceListFormProps {
  onAddItemToQuote: (item: PriceListItem) => void;
  onChangeTab: (tab: string) => void;
}

export const PriceListForm = ({ onAddItemToQuote, onChangeTab }: PriceListFormProps) => {
  const { toast } = useToast();
  const [searchPriceList, setSearchPriceList] = useState("");
  const [priceListItems, setPriceListItems] = useState<PriceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeItemTab, setActiveItemTab] = useState("basic");
  
  const [newPriceItem, setNewPriceItem] = useState({
    name: "",
    category: "Materials",
    price: 0,
    description: ""
  });

  const fetchPriceListItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('price_list_items')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching price list items:', error);
        toast({
          title: "Error",
          description: "Failed to load price list items",
          variant: "destructive"
        });
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
        
        setPriceListItems(formattedData);
      }
    } catch (error) {
      console.error('Error in fetchPriceListItems:', error);
      toast({
        title: "Error",
        description: "Failed to load price list items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPriceListItems();
  }, []);
  
  const filteredPriceItems = priceListItems.filter(item => 
    item.name.toLowerCase().includes(searchPriceList.toLowerCase()) ||
    item.category.toLowerCase().includes(searchPriceList.toLowerCase())
  );
  
  const handleAddNewPriceItem = async () => {
    if (!newPriceItem.name) {
      toast({
        title: "Error",
        description: "Please enter a name for the price list item",
        variant: "destructive"
      });
      return;
    }
    
    if (newPriceItem.price <= 0) {
      toast({
        title: "Error",
        description: "Price must be greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('price_list_items')
        .insert([
          {
            name: newPriceItem.name,
            category: newPriceItem.category,
            price: newPriceItem.price.toString(), // Fix: Convert number to string
            description: newPriceItem.description // This will be null if the column doesn't exist
          }
        ])
        .select();
      
      if (error) {
        console.error('Error adding price list item:', error);
        toast({
          title: "Error",
          description: "Failed to add price list item to database",
          variant: "destructive"
        });
        return;
      }
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Create a new item with the same shape as our PriceListItem interface
        const newItem: PriceListItem = {
          id: data[0].id,
          name: data[0].name,
          category: data[0].category,
          price: parseFloat(data[0].price),
          description: data[0].description || "", // Handle missing description
          created_at: data[0].created_at,
          updated_at: data[0].updated_at
        };
        
        setPriceListItems([...priceListItems, newItem]);
        
        toast({
          title: "Price List Item Saved",
          description: `${newItem.name} has been added to your price list`,
        });
        
        setNewPriceItem({
          name: "",
          category: "Materials",
          price: 0,
          description: ""
        });
      }
    } catch (error) {
      console.error('Error in handleAddNewPriceItem:', error);
      toast({
        title: "Error",
        description: "Failed to add price list item",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddPriceListItem = (item: PriceListItem) => {
    onAddItemToQuote(item);
    onChangeTab("items");
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="price-list-search">Search Price List</Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            id="price-list-search" 
            placeholder="Search by name or category..." 
            className="pl-10"
            value={searchPriceList}
            onChange={(e) => setSearchPriceList(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="font-medium mb-3">Add New Price List Item</h3>
        
        <Tabs value={activeItemTab} onValueChange={setActiveItemTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
            <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  placeholder="Enter item name"
                  value={newPriceItem.name}
                  onChange={(e) => setNewPriceItem({...newPriceItem, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="item-category">Category</Label>
                <Select 
                  value={newPriceItem.category}
                  onValueChange={(value) => setNewPriceItem({...newPriceItem, category: value})}
                >
                  <SelectTrigger id="item-category" className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Labor">Labor</SelectItem>
                    <SelectItem value="Materials">Materials</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="item-price">Price ($)</Label>
                <Input
                  id="item-price"
                  type="number"
                  placeholder="0.00"
                  value={newPriceItem.price}
                  onChange={(e) => setNewPriceItem({...newPriceItem, price: parseFloat(e.target.value) || 0})}
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="mt-0">
            <div>
              <Label htmlFor="item-description">Item Description</Label>
              <Textarea
                id="item-description"
                placeholder="Enter detailed description of the item..."
                value={newPriceItem.description}
                onChange={(e) => setNewPriceItem({...newPriceItem, description: e.target.value})}
                className="mt-1 min-h-32"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add details about specifications, usage, warranty, or any other relevant information.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          className="mt-4"
          onClick={handleAddNewPriceItem}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add to Price List
            </>
          )}
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        {isLoading && priceListItems.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading price list items...</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-2 px-4 font-medium">Item</th>
                <th className="text-left py-2 px-4 font-medium">Category</th>
                <th className="text-right py-2 px-4 font-medium">Price</th>
                <th className="text-center py-2 px-4 font-medium w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPriceItems.length > 0 ? (
                filteredPriceItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        {item.name}
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="font-normal">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <Button 
                        size="sm" 
                        onClick={() => handleAddPriceListItem(item)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    {searchPriceList ? 
                      "No items found matching your search criteria" : 
                      "No price list items found. Add some to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
