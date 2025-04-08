
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Package, Trash2, Plus, Send, PackagePlus, AlertTriangle } from "lucide-react";
import { ComboboxDemo } from "@/components/materials/SupplierCombobox";

interface MaterialOrderFormProps {
  jobId: string;
  jobNumber: string;
  jobAddress: string;
}

interface Material {
  id: string;
  description: string;
  quantity: number;
  unit: string;
}

export function MaterialOrderForm({ jobId, jobNumber, jobAddress }: MaterialOrderFormProps) {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [discrepancies, setDiscrepancies] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock function to add a new material row
  const addMaterial = () => {
    const newMaterial: Material = {
      id: `material-${Date.now()}`,
      description: '',
      quantity: 1,
      unit: 'pcs'
    };
    
    setMaterials([...materials, newMaterial]);
  };

  // Mock function to remove a material
  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  // Mock function to update a material
  const updateMaterial = (id: string, field: keyof Material, value: string | number) => {
    setMaterials(materials.map(material => 
      material.id === id ? { ...material, [field]: value } : material
    ));
  };

  // Mock function to send material order
  const sendOrder = async () => {
    if (!selectedSupplier) {
      toast({
        title: "Missing supplier",
        description: "Please select a supplier for this order",
        variant: "destructive"
      });
      return;
    }
    
    if (materials.length === 0) {
      toast({
        title: "No materials",
        description: "Please add at least one material to the order",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call 
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Order sent",
          description: `Your order has been sent to ${selectedSupplier} with reference to job ${jobNumber}`,
        });
      }, 2000);
    } catch (error) {
      console.error("Error sending order:", error);
      setIsLoading(false);
      toast({
        title: "Order failed",
        description: "Failed to send your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Mock check for material discrepancies (simulating the email monitoring system)
  useEffect(() => {
    // In a real implementation, this would be triggered by email monitoring
    if (materials.length > 0) {
      const mockDiscrepancies = [
        "Qty of 2x4 lumber is higher than estimated in job plan",
        "Price alert: Concrete mix price increased by 5% since last order"
      ];
      setDiscrepancies(mockDiscrepancies);
    } else {
      setDiscrepancies([]);
    }
  }, [materials]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Materials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Job Reference Details */}
        <div className="bg-slate-50 p-3 rounded-md border mb-4">
          <p className="font-medium">Job Reference:</p>
          <p className="text-sm">{jobNumber} - {jobAddress}</p>
        </div>
        
        {/* Discrepancy Alerts */}
        {discrepancies.length > 0 && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-600">
              <p className="font-medium">Material Alerts:</p>
              <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                {discrepancies.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Supplier Selection */}
        <div className="space-y-2">
          <Label htmlFor="supplier">Select Supplier</Label>
          <ComboboxDemo />
        </div>
        
        {/* Materials List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Materials</Label>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addMaterial} 
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Material
            </Button>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <PackagePlus className="h-10 w-10 text-gray-300" />
                        <p>No materials added yet</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={addMaterial} 
                          className="mt-2"
                        >
                          Add Material
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map(material => (
                    <TableRow key={material.id}>
                      <TableCell>
                        <Input 
                          value={material.description} 
                          onChange={e => updateMaterial(material.id, 'description', e.target.value)}
                          placeholder="Material description" 
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={material.quantity}
                          onChange={e => updateMaterial(material.id, 'quantity', parseInt(e.target.value))}
                          min={1} 
                        />
                      </TableCell>
                      <TableCell>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={material.unit}
                          onChange={e => updateMaterial(material.id, 'unit', e.target.value)}
                        >
                          <option value="pcs">Pieces</option>
                          <option value="m">Meters</option>
                          <option value="m²">Square Meters</option>
                          <option value="kg">Kilograms</option>
                          <option value="l">Liters</option>
                          <option value="bag">Bags</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeMaterial(material.id)}
                          className="text-red-500 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Order Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes for Supplier</Label>
          <Textarea 
            id="notes" 
            placeholder="Special instructions for this order" 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="h-24"
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={sendOrder} 
            disabled={isLoading || materials.length === 0} 
            className="flex items-center gap-1"
          >
            <Send className="h-4 w-4" />
            {isLoading ? "Sending Order..." : "Send Order"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
