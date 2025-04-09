
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package2, Plus, Search, Truck } from "lucide-react";
import { toast } from "sonner";
import type { Job } from '@/types/job';

interface JobMaterialsTabProps {
  job: Job;
}

export function JobMaterialsTab({ job }: JobMaterialsTabProps) {
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderItems, setOrderItems] = useState<Array<{id: string, name: string, quantity: number, price: number}>>([]);
  
  // Dummy materials data - in a real app this would come from your API
  const materials = [
    { id: "m1", name: "Copper Pipe (1m)", category: "Plumbing", price: 8.50 },
    { id: "m2", name: "PVC Pipe (1m)", category: "Plumbing", price: 3.25 },
    { id: "m3", name: "Circuit Breaker", category: "Electrical", price: 12.99 },
    { id: "m4", name: "Electrical Wire (5m)", category: "Electrical", price: 7.49 },
    { id: "m5", name: "Wall Outlet", category: "Electrical", price: 4.99 },
    { id: "m6", name: "Paint - White (1L)", category: "Painting", price: 15.99 },
    { id: "m7", name: "Paint - Off-White (1L)", category: "Painting", price: 15.99 }
  ];
  
  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMaterialItem = materials.find(m => m.id === selectedMaterial);
  
  const handleAddToOrder = () => {
    if (!selectedMaterial || !selectedMaterialItem) {
      toast.error("Please select a material");
      return;
    }
    
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    
    // Check if the item is already in the order
    const existingItemIndex = orderItems.findIndex(item => item.id === selectedMaterial);
    
    if (existingItemIndex >= 0) {
      // Update the existing item quantity
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += quantityNum;
      setOrderItems(updatedItems);
    } else {
      // Add a new item to the order
      setOrderItems([
        ...orderItems,
        {
          id: selectedMaterialItem.id,
          name: selectedMaterialItem.name,
          quantity: quantityNum,
          price: selectedMaterialItem.price
        }
      ]);
    }
    
    toast.success(`Added ${quantity} x ${selectedMaterialItem.name} to order`);
    
    // Reset selection
    setSelectedMaterial("");
    setQuantity("1");
  };
  
  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
    toast.success("Item removed from order");
  };
  
  const handlePlaceOrder = () => {
    if (orderItems.length === 0) {
      toast.error("Your order is empty");
      return;
    }
    
    // In a real app, you would send this order to your backend
    console.log("Placing order for job", job.id, orderItems);
    
    toast.success("Order placed successfully!");
    
    // Clear the order after submission
    setOrderItems([]);
  };
  
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package2 className="w-5 h-5 mr-2" />
            Order Materials for Job: {job.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="material-search">Search Materials</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="material-search"
                  placeholder="Search by name or category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="material-select">Select Material</Label>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a material" />
                </SelectTrigger>
                <SelectContent>
                  {filteredMaterials.map(material => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name} - ${material.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex space-x-2">
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Button 
                  onClick={handleAddToOrder} 
                  disabled={!selectedMaterial}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium">Current Order</h3>
            
            {orderItems.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-7 px-2 text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="font-medium text-lg">
                    Total: ${calculateTotal().toFixed(2)}
                  </div>
                  <Button onClick={handlePlaceOrder}>
                    <Truck className="w-4 h-4 mr-2" />
                    Place Order
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Package2 className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>Your order is empty</p>
                <p className="text-sm mt-1">Select materials and click 'Add' to build your order</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
