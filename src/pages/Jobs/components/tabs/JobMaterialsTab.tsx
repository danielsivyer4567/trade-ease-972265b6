
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package2, Search, ShoppingCart, Truck, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Job } from "@/types/job";

interface JobMaterialsTabProps {
  job: Job;
}

export function JobMaterialsTab({ job }: JobMaterialsTabProps) {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [materials, setMaterials] = useState([
    { id: 1, name: '', quantity: '', unit: 'pieces' }
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  
  // Add more material rows
  const handleAddMaterial = () => {
    setMaterials([...materials, { 
      id: materials.length + 1, 
      name: '', 
      quantity: '', 
      unit: 'pieces' 
    }]);
  };

  // Remove a material row
  const handleRemoveMaterial = (id: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(material => material.id !== id));
    }
  };

  // Update material values
  const handleMaterialChange = (id: number, field: string, value: string) => {
    setMaterials(materials.map(material => 
      material.id === id ? { ...material, [field]: value } : material
    ));
  };

  // Send order
  const handleSendOrder = () => {
    // Validation
    if (!supplier) {
      toast.error("Please select a supplier");
      return;
    }
    
    if (materials.some(m => !m.name || !m.quantity)) {
      toast.error("Please complete all material fields");
      return;
    }
    
    // Simulate sending order
    toast.success("Material order has been sent to the supplier");
    
    // Reset form
    setMaterials([{ id: 1, name: '', quantity: '', unit: 'pieces' }]);
    setSupplier('');
  };
  
  // View all orders
  const handleViewAllOrders = () => {
    navigate("/material-ordering");
  };
  
  return (
    <div className="p-3 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Materials</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewAllOrders}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            All Orders
          </Button>
        </div>
      </div>
      
      {/* Quick Order Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            Order Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier</label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abc_building">ABC Building Supplies</SelectItem>
                    <SelectItem value="smiths_timber">Smith's Timber & Hardware</SelectItem>
                    <SelectItem value="metro_electrical">Metro Electrical Wholesale</SelectItem>
                    <SelectItem value="coastal_plumbing">Coastal Plumbing Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Materials</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search materials catalog..."
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">Materials</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddMaterial}
                  className="text-xs h-8"
                >
                  Add Material
                </Button>
              </div>

              {materials.map((material, index) => (
                <div key={material.id} className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-5">
                    <Input 
                      value={material.name} 
                      onChange={(e) => handleMaterialChange(material.id, 'name', e.target.value)}
                      placeholder="Material name" 
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      value={material.quantity} 
                      onChange={(e) => handleMaterialChange(material.id, 'quantity', e.target.value)}
                      placeholder="Qty" 
                      type="number"
                      min="1"
                    />
                  </div>
                  <div className="col-span-3">
                    <Select 
                      value={material.unit} 
                      onValueChange={(value) => handleMaterialChange(material.id, 'unit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="meters">Meters</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="packs">Packs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {materials.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveMaterial(material.id)}
                        className="text-xs h-8"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleSendOrder} 
                disabled={!supplier || materials.some(m => !m.name || !m.quantity)}
                className="min-w-[150px]"
              >
                Send Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Material Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {/* Orders would be mapped here */}
              <p>Orders list...</p>
            </div>
          ) : (
            <div className="p-12 border-2 border-dashed rounded-lg flex justify-center">
              <p className="text-muted-foreground">No recent orders found for this job.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
