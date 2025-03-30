
import React from "react";
import type { Job } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface JobStockTabProps {
  job: Job;
}

export function JobStockTab({ job }: JobStockTabProps) {
  // Sample stock data
  const stockItems = [
    { id: 1, code: "PL-001", description: "PVC Pipe 20mm", quantity: 5, unit: "m", unitPrice: 8.50, totalPrice: 42.50 },
    { id: 2, code: "FT-002", description: "Elbow Joint 20mm", quantity: 3, unit: "pcs", unitPrice: 4.25, totalPrice: 12.75 },
  ];

  return (
    <div className="space-y-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
