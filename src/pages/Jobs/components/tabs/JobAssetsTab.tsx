
import React from "react";
import type { Job } from "@/types/job";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface JobAssetsTabProps {
  job: Job;
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
}

export function JobAssetsTab({ job, tabNotes, setTabNotes }: JobAssetsTabProps) {
  // Sample customer assets data
  const customerAssets = [
    { id: 1, name: "Boiler", model: "Vaillant EcoTEC Plus", serialNumber: "BX123456", installDate: "12/05/2020", warranty: "5 Years" },
    { id: 2, name: "Water Heater", model: "Rheem Performance", serialNumber: "WH789012", installDate: "03/12/2021", warranty: "3 Years" }
  ];

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTabNotes({
      ...tabNotes,
      assets: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Customer Assets</h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Asset
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Install Date</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.model}</TableCell>
                    <TableCell>{asset.serialNumber}</TableCell>
                    <TableCell>{asset.installDate}</TableCell>
                    <TableCell>{asset.warranty}</TableCell>
                    <TableCell>
                      <select className="text-xs border rounded px-1 py-0.5">
                        <option>Options</option>
                        <option>View History</option>
                        <option>Edit</option>
                        <option>Delete</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-2">Asset Notes</h3>
          <textarea
            value={tabNotes.assets || ''}
            onChange={handleNotesChange}
            className="w-full min-h-[150px] border rounded-md p-2"
            placeholder="Add notes about customer assets here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
