
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, FileCheck } from "lucide-react";

export function RecentTrades() {
  const recentJobs = [
    { id: 1, name: 'Kitchen Remodel', customer: 'Sarah Johnson', location: 'New York, NY', status: 'Completed', date: '10:32 AM' },
    { id: 2, name: 'Bathroom Renovation', customer: 'Michael Chen', location: 'San Francisco, CA', status: 'In Progress', date: '11:15 AM' },
    { id: 3, name: 'Deck Construction', customer: 'David Wilson', location: 'Seattle, WA', status: 'Started', date: '01:45 PM' },
    { id: 4, name: 'Roof Repair', customer: 'Jessica Lee', location: 'Chicago, IL', status: 'Scheduled', date: '02:22 PM' },
    { id: 5, name: 'Flooring Installation', customer: 'Robert Smith', location: 'Austin, TX', status: 'Materials Ordered', date: '03:05 PM' },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Recent Job Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentJobs.map(job => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.name}</TableCell>
                <TableCell>{job.customer}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    {job.status === 'Completed' ? 
                      <FileCheck className="h-3 w-3 text-green-500" /> : 
                      <Wrench className="h-3 w-3 text-blue-500" />
                    }
                    {job.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">{job.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
