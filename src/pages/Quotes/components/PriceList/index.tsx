
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PriceListSearch } from "./PriceListSearch";
import { NewPriceItemForm } from "./NewPriceItemForm";
import { PriceListTable } from "./PriceListTable";
import type { PriceListItem, NewPriceItemFormData } from "./types";

interface PriceListFormProps {
  onAddItemToQuote: (item: PriceListItem) => void;
  onChangeTab: (tab: string) => void;
}

export const PriceListForm = ({ onAddItemToQuote, onChangeTab }: PriceListFormProps) => {
  const { toast } = useToast();
  const [searchPriceList, setSearchPriceList] = useState("");
  const [priceListItems, setPriceListItems] = useState<PriceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newPriceItem, setNewPriceItem] = useState<NewPriceItemFormData>({
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
        .insert({
          name: newPriceItem.name,
          category: newPriceItem.category,
          price: newPriceItem.price,
        })
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
        const newItem: PriceListItem = {
          id: data[0].id,
          name: data[0].name,
          category: data[0].category,
          price: parseFloat(data[0].price.toString()),
          created_at: data[0].created_at,
          updated_at: data[0].updated_at,
          description: ""
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
      <PriceListSearch 
        searchQuery={searchPriceList} 
        setSearchQuery={setSearchPriceList} 
      />
      
      <NewPriceItemForm 
        newPriceItem={newPriceItem}
        setNewPriceItem={setNewPriceItem}
        isLoading={isLoading}
        onAddNewPriceItem={handleAddNewPriceItem}
      />
      
      <PriceListTable 
        priceListItems={priceListItems}
        isLoading={isLoading}
        searchQuery={searchPriceList}
        onAddItemToQuote={handleAddPriceListItem}
      />
    </div>
  );
};
