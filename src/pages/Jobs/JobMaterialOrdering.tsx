
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Mail, Package2, Search, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function JobMaterialOrdering() {
  const navigate = useNavigate();
  const [jobId, setJobId] = useState('');
  const [supplier, setSupplier] = useState('');
  const [materials, setMaterials] = useState([
    { id: 1, name: '', quantity: '', unit: 'pieces' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate("/suppliers");
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { 
      id: materials.length + 1, 
      name: '', 
      quantity: '', 
      unit: 'pieces' 
    }]);
  };

  const handleRemoveMaterial = (id: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(material => material.id !== id));
    }
  };

  const handleMaterialChange = (id: number, field: string, value: string) => {
    setMaterials(materials.map(material => 
      material.id === id ? { ...material, [field]: value } : material
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Material order has been sent to the supplier');
      // Clear form or navigate away
      setMaterials([{ id: 1, name: '', quantity: '', unit: 'pieces' }]);
      setSupplier('');
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="container p-6 max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Job Material Ordering</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package2 className="h-5 w-5 text-blue-500" />
                Order Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Order materials for specific jobs and track delivery status.
              </p>
              <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-800">
                <p>Orders are reference-linked to jobs for easy financial tracking.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-green-500" />
                Email Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Orders are sent via email with job numbers automatically included.
              </p>
              <div className="bg-green-50 p-3 rounded-md text-xs text-green-800">
                <p>Email receipts are processed and stored automatically.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5 text-purple-500" />
                Delivery Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track deliveries and get notifications for delays or shortages.
              </p>
              <div className="bg-purple-50 p-3 rounded-md text-xs text-purple-800">
                <p>Material deliveries are verified against original orders.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Materials for Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="jobId" className="text-sm font-medium">
                    Job ID / Reference
                  </label>
                  <div className="relative">
                    <Input 
                      id="jobId"
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      placeholder="Enter job ID or search"
                      className="pl-9"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="supplier" className="text-sm font-medium">
                    Supplier
                  </label>
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
                  type="submit" 
                  disabled={isLoading || !supplier || materials.some(m => !m.name || !m.quantity)}
                  className="min-w-[150px]"
                >
                  {isLoading ? 'Sending...' : 'Send Order'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
