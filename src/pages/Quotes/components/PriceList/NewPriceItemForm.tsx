
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { NewPriceItemFormData } from "./types";

interface NewPriceItemFormProps {
  newPriceItem: NewPriceItemFormData;
  setNewPriceItem: (item: NewPriceItemFormData) => void;
  isLoading: boolean;
  onAddNewPriceItem: () => void;
}

export const NewPriceItemForm = ({ 
  newPriceItem, 
  setNewPriceItem, 
  isLoading, 
  onAddNewPriceItem 
}: NewPriceItemFormProps) => {
  const [activeItemTab, setActiveItemTab] = useState("basic");

  return (
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
        onClick={onAddNewPriceItem}
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
  );
};
