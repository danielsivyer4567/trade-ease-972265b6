
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Info, X } from "lucide-react";

const mockLeads = [
  { id: 1, name: "Sarah Johnson", location: "New York, NY", service: "Kitchen Remodel", status: "active", date: "2023-08-15" },
  { id: 2, name: "Mike Anderson", location: "San Francisco, CA", service: "Bathroom Remodel", status: "active", date: "2023-08-14" },
  { id: 3, name: "Lisa Nguyen", location: "Austin, TX", service: "Home Addition", status: "contacted", date: "2023-08-13" },
  { id: 4, name: "David Wilson", location: "Seattle, WA", service: "Deck Construction", status: "pending", date: "2023-08-12" },
  { id: 5, name: "Emily Brown", location: "Chicago, IL", service: "Flooring Installation", status: "expired", date: "2023-07-28" },
  { id: 6, name: "Robert Chen", location: "Boston, MA", service: "Roof Repair", status: "contacted", date: "2023-08-10" },
  { id: 7, name: "Karen Williams", location: "Denver, CO", service: "Window Replacement", status: "pending", date: "2023-08-09" },
  { id: 8, name: "James Martinez", location: "Phoenix, AZ", service: "Painting", status: "expired", date: "2023-07-25" },
];

export function PurchasedLeadsTab() {
  const [leads, setLeads] = useState(mockLeads);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Contacted</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Expired</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Purchased Leads</CardTitle>
      </CardHeader>
      <CardContent>
        {leads.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.service}</TableCell>
                    <TableCell>{formatDate(lead.date)}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Info className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        {lead.status === 'pending' && (
                          <Button variant="outline" size="sm">
                            <Check className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        )}
                        {lead.status === 'expired' && (
                          <Button variant="destructive" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No purchased leads found</p>
            <Button className="mt-4">Browse Available Leads</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
