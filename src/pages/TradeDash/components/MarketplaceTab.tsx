
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MarketplaceTab() {
  const opportunities = [
    { id: 1, jobType: 'Kitchen Remodel', budget: '$15,000-$25,000', location: 'New York, NY', completionTime: '4-6 weeks', recommendation: 'Good fit' },
    { id: 2, jobType: 'Bathroom Renovation', budget: '$8,000-$12,000', location: 'San Francisco, CA', completionTime: '2-3 weeks', recommendation: 'Excellent fit' },
    { id: 3, jobType: 'Deck Construction', budget: '$6,000-$10,000', location: 'Seattle, WA', completionTime: '1-2 weeks', recommendation: 'Consider' },
    { id: 4, jobType: 'Home Addition', budget: '$30,000-$50,000', location: 'Chicago, IL', completionTime: '8-12 weeks', recommendation: 'Good fit' },
    { id: 5, jobType: 'Flooring Installation', budget: '$5,000-$8,000', location: 'Austin, TX', completionTime: '1 week', recommendation: 'Consider' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Type</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Est. Completion</TableHead>
              <TableHead>Recommendation</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map(opportunity => (
              <TableRow key={opportunity.id}>
                <TableCell className="font-medium">{opportunity.jobType}</TableCell>
                <TableCell>{opportunity.budget}</TableCell>
                <TableCell>{opportunity.location}</TableCell>
                <TableCell>{opportunity.completionTime}</TableCell>
                <TableCell>{opportunity.recommendation}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm">Apply</Button>
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
