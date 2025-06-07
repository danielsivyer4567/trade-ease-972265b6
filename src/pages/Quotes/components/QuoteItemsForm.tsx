import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export interface QuoteItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

interface QuoteItemsFormProps {
  items: QuoteItem[];
  setItems: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
}

export const QuoteItemsForm = ({ items, setItems }: QuoteItemsFormProps) => {
  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, total: 0 }]);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    const currentItem = { ...newItems[index] };
    
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? Number(value) : currentItem.quantity;
      const rate = field === 'rate' ? Number(value) : currentItem.rate;
      newItems[index] = { ...currentItem, [field]: Number(value), total: quantity * rate };
    } else {
      newItems[index] = { ...currentItem, [field]: value };
    }
    setItems(newItems);
  };
  
  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Line Items</h3>
        <Button size="sm" variant="outline" onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr className="border-b dark:border-slate-600">
              <th className="text-left p-2 font-medium">Description</th>
              <th className="text-left p-2 font-medium w-20">Qty</th>
              <th className="text-left p-2 font-medium w-28">Rate</th>
              <th className="text-left p-2 font-medium w-28">Total</th>
              <th className="text-center p-2 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b dark:border-slate-600">
                <td className="p-1">
                  <Input 
                    placeholder="Item description" 
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                </td>
                <td className="p-1">
                  <Input 
                    type="number" 
                    min="1" 
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                  />
                </td>
                <td className="p-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      type="number" 
                      className="pl-7"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                    />
                  </div>
                </td>
                <td className="p-1">
                  <Input 
                    value={`$${item.total.toFixed(2)}`}
                    disabled
                    className="bg-gray-50 dark:bg-slate-600"
                  />
                </td>
                <td className="p-1 text-center">
                  {items.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-slate-700">
            <tr className="font-medium">
              <td colSpan={3} className="text-right p-2">Total:</td>
              <td className="p-2">${totalAmount.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
