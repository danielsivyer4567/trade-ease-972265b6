
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ResourcesTable() {
  // Sample data - in a real app this would come from props or an API
  const resources = [
    {
      id: 1,
      name: "Harry Smith",
      date: "30/01/2017",
      startTime: "1:00pm",
      finishTime: "4:00pm",
      basePay: "3.00",
      total: "3.00",
      cost: "$0.00"
    }
  ];
  
  return (
    <div className="overflow-x-auto">
      <div className="mb-3">
        <h4 className="text-blue-600 font-medium flex items-center">
          <span className="transform rotate-90 inline-block mr-1">▶</span> Harry Smith
        </h4>
      </div>
      <Table>
        <TableHeader className="bg-blue-100">
          <TableRow>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Finish Time</TableHead>
            <TableHead>Base pay</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell>{resource.date}</TableCell>
              <TableCell>{resource.startTime}</TableCell>
              <TableCell>{resource.finishTime}</TableCell>
              <TableCell>{resource.basePay}</TableCell>
              <TableCell>{resource.total}</TableCell>
              <TableCell>{resource.cost}</TableCell>
              <TableCell>
                <select className="text-xs border rounded px-1 py-0.5">
                  <option>Options</option>
                  <option>Edit</option>
                  <option>Delete</option>
                </select>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-gray-50">
            <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
            <TableCell className="font-medium">3.00</TableCell>
            <TableCell className="font-medium">3.00</TableCell>
            <TableCell className="font-medium">$0.00</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
