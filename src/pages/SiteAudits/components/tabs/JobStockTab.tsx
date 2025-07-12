
import React from "react";
import type { Job } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JobStockTabProps {
  job: Job;
}

export function JobStockTab({ job }: JobStockTabProps) {
  const navigate = useNavigate();
  
  // Sample stock data
  const stockItems = [
    { id: 1, code: "PL-001", description: "PVC Pipe 20mm", quantity: 5, unit: "m", unitPrice: 8.50, totalPrice: 42.50 },
    { id: 2, code: "FT-002", description: "Elbow Joint 20mm", quantity: 3, unit: "pcs", unitPrice: 4.25, totalPrice: 12.75 },
  ];

  const handleOrderMaterials = () => {
    navigate(`/jobs/${job.id}/materials`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleOrderMaterials}
          className="flex items-center gap-1"
        >
          <Package className="h-4 w-4" />
          Order Materials
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Stock Items</h3>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="font-bold">$55.25</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          {stockItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No stock items found for this job</p>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Stock Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
